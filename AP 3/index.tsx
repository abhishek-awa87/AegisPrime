import { AppState, Strategy, Blueprint, StrategyPillarKey, FileAttachment } from './types';
import { generateStrategy, refineStrategyPillar, generateBlueprint } from './services/geminiService';

// Helper to get a union of all possible keys from a union of objects
type KeysOfUnion<T> = T extends T ? keyof T : never;

// --- SVG ICONS ---
const COPY_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a2.25 2.25 0 0 1-2.25 2.25h-1.5a2.25 2.25 0 0 1-2.25-2.25V4.5m-3 0A2.25 2.25 0 0 0 6.75 2.25H6.75A2.25 2.25 0 0 0 4.5 4.5v10.5a2.25 2.25 0 0 0 2.25 2.25h10.5a2.25 2.25 0 0 0 2.25-2.25V4.5a2.25 2.25 0 0 0-2.25-2.25h-2.25" /></svg>`;
const CHECK_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>`;
const SPEAKER_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M12 8.25a3 3 0 0 1 3 3v.75M12 8.25a3 3 0 0 0-3 3v.75m0 0H9m3 0a3 3 0 0 1-3-3v-.75m0 0a3 3 0 0 0 3-3m-3 0a3 3 0 0 0-3 3m12 0c0 3.112-2.688 5.64-6 5.64s-6-2.528-6-5.64" /></svg>`;


// --- CONSTANTS ---
const SESSION_KEY = 'aegisPrimeSession';
const TRANSIENT_STATES = [
    AppState.GENERATING_STRATEGY,
    AppState.REFINING_STRATEGY_PILLAR,
    AppState.GENERATING_BLUEPRINT,
    AppState.REFINING_BLUEPRINT,
];

// --- STATE MANAGEMENT ---
let currentState: AppState = AppState.AWAITING_OBJECTIVE;
let objective: string = '';
let strategy: Strategy | null = null;
let blueprint: Blueprint | null = null;
let errorMessage: string = '';
let attachedFile: FileAttachment | null = null;
let refiningPillar: StrategyPillarKey | null = null;
let refinementFeedback: string = '';
let activeSpeakerButton: HTMLButtonElement | null = null;

// --- DOM ELEMENT REFERENCES ---
const chatContainer = document.getElementById('chat-container')!;
const welcomeCard = document.querySelector('.welcome-card')!;
const startNewBtn = document.getElementById('start-new-btn') as HTMLButtonElement;
const userInput = document.getElementById('user-input') as HTMLTextAreaElement;
const submitBtn = document.getElementById('submit-btn') as HTMLButtonElement;
const copyInputBtn = document.getElementById('copy-input-btn') as HTMLButtonElement;
const fastTrackBtn = document.getElementById('fast-track-btn') as HTMLButtonElement;
const inputArea = document.querySelector('.input-area')!;
const attachmentBtn = document.getElementById('attachment-btn') as HTMLButtonElement;
const fileInput = document.getElementById('file-input') as HTMLInputElement;
const filePreviewContainer = document.getElementById('file-preview-container')!;


// --- STATE MACHINE LOGIC ---
const stateMachine = {
    [AppState.AWAITING_OBJECTIVE]: {
        SUBMIT_OBJECTIVE: AppState.GENERATING_STRATEGY,
    },
    [AppState.GENERATING_STRATEGY]: {
        STRATEGY_GENERATED_SUCCESS: AppState.STRATEGY_PROPOSAL,
        STRATEGY_GENERATION_FAILED: AppState.ERROR,
    },
    [AppState.STRATEGY_PROPOSAL]: {
        REQUEST_PILLAR_REFINEMENT: AppState.REFINING_STRATEGY_PILLAR,
        CONFIRM_STRATEGY: AppState.GENERATING_BLUEPRINT,
    },
    [AppState.REFINING_STRATEGY_PILLAR]: {
        PILLAR_REFINED_SUCCESS: AppState.STRATEGY_PROPOSAL,
        PILLAR_REFINEMENT_FAILED: AppState.ERROR,
    },
    [AppState.GENERATING_BLUEPRINT]: {
        BLUEPRINT_GENERATED_SUCCESS: AppState.BLUEPRINT_PROPOSAL,
        BLUEPRINT_GENERATION_FAILED: AppState.ERROR,
    },
    [AppState.BLUEPRINT_PROPOSAL]: {
        REQUEST_BLUEPRINT_REFINEMENT: AppState.REFINING_BLUEPRINT,
        FINALIZE_BLUEPRINT: AppState.FINALIZED,
    },
    [AppState.REFINING_BLUEPRINT]: {
        BLUEPRINT_REFINED_SUCCESS: AppState.BLUEPRINT_PROPOSAL,
        BLUEPRINT_REFINEMENT_FAILED: AppState.ERROR,
    },
    [AppState.FINALIZED]: {
        START_NEW_SESSION: AppState.AWAITING_OBJECTIVE,
    },
    [AppState.ERROR]: {
        START_NEW_SESSION: AppState.AWAITING_OBJECTIVE,
    },
};

type StateMachineEvent = KeysOfUnion<(typeof stateMachine)[keyof typeof stateMachine]>;

function transition(event: StateMachineEvent) {
    const nextState = stateMachine[currentState]?.[event as any];
    if (nextState !== undefined) {
        currentState = nextState;
        renderState();
    } else {
        console.error(`Invalid transition from ${AppState[currentState]} on event ${event}`);
    }
}

// --- SESSION PERSISTENCE ---
function saveSession() {
    if (TRANSIENT_STATES.includes(currentState)) return;
    
    const sessionData = {
        currentState,
        objective,
        strategy,
        blueprint,
        attachedFile,
        chatHTML: chatContainer.innerHTML,
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
}

function loadSession() {
    const savedSession = localStorage.getItem(SESSION_KEY);
    if (!savedSession) return;

    try {
        const sessionData = JSON.parse(savedSession);
        
        if (TRANSIENT_STATES.includes(sessionData.currentState)) {
            handleStartNewSession();
            return;
        }

        currentState = sessionData.currentState;
        objective = sessionData.objective;
        strategy = sessionData.strategy;
        blueprint = sessionData.blueprint;
        attachedFile = sessionData.attachedFile;
        
        if (currentState === AppState.AWAITING_OBJECTIVE) {
            renderWelcomeView();
        } else {
            chatContainer.innerHTML = sessionData.chatHTML;
            welcomeCard.classList.add('hidden');
            startNewBtn.classList.remove('hidden');
            inputArea.classList.add('hidden');
        }
        renderFilePreview();
        
    } catch (e) {
        console.error("Failed to load session:", e);
        localStorage.removeItem(SESSION_KEY);
    }
}


// --- HELPERS ---
function isValidUrl(string: string): boolean {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

function handleCopy(button: HTMLButtonElement, textToCopy: string) {
    if (!textToCopy.trim() || !navigator.clipboard) return;
    const originalIcon = button.innerHTML;
    navigator.clipboard.writeText(textToCopy).then(() => {
        button.innerHTML = CHECK_ICON_SVG;
        button.classList.add('copied');
        button.disabled = true;
        setTimeout(() => {
            button.innerHTML = originalIcon;
            button.classList.remove('copied');
            button.disabled = false;
        }, 2000);
    }).catch(err => console.error('Failed to copy text:', err));
}

function handleSpeak(button: HTMLButtonElement) {
    if (!('speechSynthesis' in window)) {
        alert("Sorry, your browser doesn't support text-to-speech.");
        return;
    }

    const parentMessage = button.closest('.system-message');
    if (!parentMessage) return;

    // If this button is already active, stop speaking
    if (activeSpeakerButton === button && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel(); // This will trigger the 'end' event
        return;
    }

    // Stop any other currently speaking utterance
    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
    }
    
    // Find text and speak
    const title = parentMessage.querySelector('h2')?.textContent || '';
    const body = parentMessage.querySelector('p')?.textContent || '';
    const textToSpeak = `${title}. ${body}`;
    
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    
    utterance.onstart = () => {
        if (activeSpeakerButton) {
            activeSpeakerButton.classList.remove('speaking');
        }
        button.classList.add('speaking');
        activeSpeakerButton = button;
    };

    utterance.onend = () => {
        button.classList.remove('speaking');
        activeSpeakerButton = null;
    };

    utterance.onerror = () => {
        console.error("Speech synthesis error");
        button.classList.remove('speaking');
        activeSpeakerButton = null;
    };
    
    window.speechSynthesis.speak(utterance);
}


// --- RENDERING LOGIC ---

function renderState() {
    startNewBtn.classList.add('hidden');
    inputArea.classList.add('hidden');

    switch (currentState) {
        case AppState.AWAITING_OBJECTIVE:
            renderWelcomeView();
            break;
        case AppState.GENERATING_STRATEGY:
            handleGenerateStrategy();
            break;
        case AppState.STRATEGY_PROPOSAL:
            chatContainer.innerHTML = '';
            renderUserMessage(objective);
            startNewBtn.classList.remove('hidden');
            if (strategy) renderStrategyProposalView(strategy);
            break;
        case AppState.REFINING_STRATEGY_PILLAR:
            chatContainer.innerHTML = '';
            renderUserMessage(objective);
            startNewBtn.classList.remove('hidden');
            if (strategy) renderStrategyProposalView(strategy);
            handleRefinePillarApiCall();
            break;
        case AppState.GENERATING_BLUEPRINT:
            chatContainer.innerHTML = '';
            renderUserMessage(objective);
            startNewBtn.classList.remove('hidden');
            renderLoadingView("Constructing blueprint from strategy...");
            handleGenerateBlueprint();
            break;
        case AppState.BLUEPRINT_PROPOSAL:
            chatContainer.innerHTML = '';
            renderUserMessage(objective);
            startNewBtn.classList.remove('hidden');
            if (blueprint) renderBlueprintProposalView(blueprint);
            break;
        case AppState.REFINING_BLUEPRINT:
            chatContainer.innerHTML = '';
            renderUserMessage(objective);
            startNewBtn.classList.remove('hidden');
            if (blueprint) renderBlueprintHistoryView(blueprint, refinementFeedback);
            renderLoadingView("Incorporating feedback and refining blueprint...");
            handleRefineBlueprint();
            break;
        case AppState.FINALIZED:
            chatContainer.innerHTML = '';
            renderUserMessage(objective);
            startNewBtn.classList.remove('hidden');
            if (blueprint) renderFinalizedView(blueprint);
            break;
        case AppState.ERROR:
            chatContainer.innerHTML = '';
            startNewBtn.classList.remove('hidden');
            renderErrorView(errorMessage);
            break;
    }
    saveSession();
}

function renderWelcomeView() {
    chatContainer.innerHTML = '';
    welcomeCard.classList.add('animate-fadeIn');
    chatContainer.appendChild(welcomeCard);
    welcomeCard.classList.remove('hidden');
    inputArea.classList.remove('hidden');
    userInput.placeholder = "Provide your objective or paste a URL to analyze...";
    submitBtn.textContent = 'Initiate Strategy';
}

function renderUserMessage(message: string, isFeedback: boolean = false) {
    const userMessage = document.createElement('div');
    userMessage.className = 'message user-message animate-fadeIn';
    const label = isFeedback ? '<strong>Refinement Feedback:</strong><br>' : '';
    userMessage.innerHTML = `<p>${label}${message}</p>`;
    chatContainer.appendChild(userMessage);
}

function renderLoadingView(message: string) {
    const loadingElement = document.createElement('div');
    loadingElement.className = 'message system-message loading animate-fadeIn';
    loadingElement.innerHTML = `<div class="spinner"></div><p>${message}</p>`;
    chatContainer.appendChild(loadingElement);
}

function renderStrategyProposalView(currentStrategy: Strategy) {
    const isRefining = refiningPillar !== null;
    const strategyContainer = document.createElement('div');
    strategyContainer.className = 'strategy-container animate-fadeIn';
    strategyContainer.innerHTML = `
        <div class="message system-message">
            <button data-action="speak" class="btn-speak-icon" title="Read aloud">${SPEAKER_ICON_SVG}</button>
            <h2>Interactive Strategy Briefing</h2>
            <p>Review the proposed strategy. Regenerate any pillar or confirm to proceed.</p>
        </div>
    `;
    const pillarsGrid = document.createElement('div');
    pillarsGrid.className = 'pillars-grid';
    (Object.keys(currentStrategy) as StrategyPillarKey[]).forEach(key => {
        const pillar = currentStrategy[key];
        const pillarCard = document.createElement('div');
        const isCurrentlyLoading = isRefining && refiningPillar === key;
        pillarCard.className = `pillar-card ${isCurrentlyLoading ? 'loading' : ''}`;
        let cardHTML = `
            <h3>${key.toUpperCase()}</h3>
            <h4>${pillar.title}</h4>
            <p>${pillar.description}</p>
            <button class="btn btn-secondary" data-pillar="${key}" ${isRefining ? 'disabled' : ''}>
                ${isCurrentlyLoading ? 'Generating...' : 'Regenerate'}
            </button>
        `;
        if (isCurrentlyLoading) {
            cardHTML += `<div class="card-spinner"></div>`;
        }
        pillarCard.innerHTML = cardHTML;
        pillarsGrid.appendChild(pillarCard);
    });
    strategyContainer.appendChild(pillarsGrid);
    const confirmBtn = document.createElement('button');
    confirmBtn.id = 'confirm-strategy-btn';
    confirmBtn.className = 'btn btn-primary';
    confirmBtn.textContent = 'Confirm Strategy & Build Blueprint';
    confirmBtn.disabled = isRefining;
    strategyContainer.appendChild(confirmBtn);
    chatContainer.appendChild(strategyContainer);
}

function renderBlueprintProposalView(currentBlueprint: Blueprint) {
    const blueprintContainer = document.createElement('div');
    blueprintContainer.id = 'blueprint-proposal-view';
    blueprintContainer.className = 'blueprint-container animate-fadeIn';
    blueprintContainer.innerHTML = `
        <div class="message system-message">
            <button data-action="speak" class="btn-speak-icon" title="Read aloud">${SPEAKER_ICON_SVG}</button>
            <h2>AEGIS BLUEPRINT</h2>
            <p>The hyper-optimized prompt is ready. Refine further or finalize.</p>
        </div>
        <div class="blueprint-section">
            <button data-action="copy-blueprint" class="btn-copy-icon" title="Copy prompt">${COPY_ICON_SVG}</button>
            <div class="blueprint-header">
                <h3>Final Prompt Draft</h3>
            </div>
            <pre>${currentBlueprint.prompt}</pre>
        </div>
        <div class="blueprint-section">
            <h3>Analysis</h3>
            <p>${currentBlueprint.analysis}</p>
        </div>
        <div class="blueprint-section">
            <h3>Suggestions</h3>
            <ul>
                ${currentBlueprint.suggestions.map(s => `<li>${s}</li>`).join('')}
            </ul>
        </div>
        <div class="input-area refinement-controls">
            <div class="input-wrapper">
                <textarea id="refinement-input" placeholder="Provide feedback for refinement..."></textarea>
                <button data-action="refine-blueprint" class="btn btn-secondary">Refine</button>
            </div>
        </div>
        <div style="text-align: right; margin-top: 1rem;">
             <button data-action="finalize-blueprint" class="btn btn-primary">Finalize Blueprint</button>
        </div>
    `;
    chatContainer.appendChild(blueprintContainer);
}

function renderBlueprintHistoryView(prevBlueprint: Blueprint, feedback: string) {
    const historyContainer = document.createElement('div');
    historyContainer.className = 'blueprint-container animate-fadeIn';
    historyContainer.innerHTML = `
        <div class="blueprint-section">
            <div class="blueprint-header">
                <h3>Previous Blueprint</h3>
            </div>
            <pre>${prevBlueprint.prompt}</pre>
        </div>
    `;
    chatContainer.appendChild(historyContainer);
    renderUserMessage(feedback, true);
}

function renderFinalizedView(finalBlueprint: Blueprint) {
    const finalView = document.createElement('div');
    finalView.className = 'finalized-view animate-fadeIn';
    finalView.innerHTML = `
        <div class="message system-message">
            <button data-action="speak" class="btn-speak-icon" title="Read aloud">${SPEAKER_ICON_SVG}</button>
            <h2>Blueprint Finalized</h2>
            <p>Your prompt is complete and ready for use.</p>
        </div>
        <div class="blueprint-section">
            <button data-action="copy-final" class="btn-copy-icon" title="Copy final prompt">${COPY_ICON_SVG}</button>
            <div class="blueprint-header">
                <h3>Final Prompt</h3>
            </div>
            <pre>${finalBlueprint.prompt}</pre>
        </div>
    `;
    const newSessionBtn = document.createElement('button');
    newSessionBtn.className = 'btn btn-primary';
    newSessionBtn.textContent = 'Create New Blueprint';
    newSessionBtn.onclick = handleStartNewSession;
    finalView.appendChild(newSessionBtn);
    chatContainer.appendChild(finalView);
}

function renderErrorView(message: string) {
    const errorView = document.createElement('div');
    errorView.className = 'message error-message animate-fadeIn';
    errorView.innerHTML = `
        <h2>System Error</h2>
        <p>Aegis Prime encountered an unexpected issue.</p>
        <pre>${message}</pre>
    `;
    const newSessionBtn = document.createElement('button');
    newSessionBtn.className = 'btn btn-primary';
    newSessionBtn.textContent = 'Start New Session';
    newSessionBtn.onclick = handleStartNewSession;
    errorView.appendChild(newSessionBtn);
    chatContainer.appendChild(errorView);
}

function renderFilePreview() {
    if (!attachedFile) {
        filePreviewContainer.innerHTML = '';
        return;
    }
    const previewEl = document.createElement('div');
    previewEl.className = 'file-preview';
    previewEl.innerHTML = `
        <span>${attachedFile.name}</span>
        <button class="remove-file-btn">&times;</button>
    `;
    previewEl.querySelector('.remove-file-btn')!.addEventListener('click', handleRemoveFile);
    filePreviewContainer.innerHTML = '';
    filePreviewContainer.appendChild(previewEl);
}

// --- API CALLS ---

async function handleGenerateStrategy() {
    try {
        const newStrategy = await generateStrategy(objective, attachedFile);
        strategy = newStrategy;
        transition('STRATEGY_GENERATED_SUCCESS');
    } catch (e) {
        errorMessage = (e as Error).message;
        transition('STRATEGY_GENERATION_FAILED');
    }
}

async function handleRefinePillarApiCall() {
    if (!strategy || !refiningPillar) return;
    const pillarToUpdate = refiningPillar;
    try {
        const newPillar = await refineStrategyPillar(objective, strategy, pillarToUpdate, attachedFile);
        if (strategy) strategy[pillarToUpdate] = newPillar;
        refiningPillar = null;
        transition('PILLAR_REFINED_SUCCESS');
    } catch (e) {
        errorMessage = (e as Error).message;
        refiningPillar = null;
        transition('PILLAR_REFINEMENT_FAILED');
    }
}

async function handleGenerateBlueprint() {
    if (!strategy) return;
    try {
        const newBlueprint = await generateBlueprint(strategy, objective, undefined, attachedFile);
        blueprint = newBlueprint;
        transition('BLUEPRINT_GENERATED_SUCCESS');
    } catch (e) {
        errorMessage = (e as Error).message;
        transition('BLUEPRINT_GENERATION_FAILED');
    }
}

async function handleRefineBlueprint() {
    if (!strategy || !refinementFeedback) return;
    try {
        const newBlueprint = await generateBlueprint(strategy, objective, refinementFeedback, attachedFile);
        blueprint = newBlueprint;
        refinementFeedback = ''; // Clear feedback after use
        transition('BLUEPRINT_REFINED_SUCCESS');
    } catch (e) {
        errorMessage = (e as Error).message;
        transition('BLUEPRINT_REFINEMENT_FAILED');
    }
}

// --- EVENT HANDLERS ---
function handleSubmit() {
    const objectiveText = userInput.value.trim();
    if (!objectiveText) return;

    let processedObjective = objectiveText;
    let loadingMessage = "Architecting initial strategy...";

    if (isValidUrl(objectiveText)) {
        processedObjective = `The user has provided a URL. Please analyze the content of this webpage and then generate a prompt strategy based on it. URL: ${objectiveText}`;
        loadingMessage = "Reading content from URL...";
    }

    objective = processedObjective;
    welcomeCard.classList.add('hidden');
    chatContainer.innerHTML = '';
    renderUserMessage(objectiveText); // Show the original input to the user
    renderLoadingView(loadingMessage);
    userInput.value = '';
    transition('SUBMIT_OBJECTIVE');
}

async function handleFastTrack() {
    const objectiveText = userInput.value.trim();
    if (!objectiveText) return;

    let processedObjective = objectiveText;
    let loadingMessage = "Fast-tracking to blueprint...";

    if (isValidUrl(objectiveText)) {
        processedObjective = `The user has provided a URL. Please analyze the content of this webpage and then generate a prompt strategy based on it. URL: ${objectiveText}`;
        loadingMessage = "Reading URL and fast-tracking to blueprint...";
    }
    
    objective = processedObjective;

    // UI updates for loading state
    welcomeCard.classList.add('hidden');
    inputArea.classList.add('hidden');
    chatContainer.innerHTML = '';
    renderUserMessage(objectiveText); // Show original input
    renderLoadingView(loadingMessage);
    userInput.value = '';

    try {
        const tempStrategy = await generateStrategy(objective, attachedFile);
        strategy = tempStrategy;
        const newBlueprint = await generateBlueprint(strategy, objective, undefined, attachedFile);
        blueprint = newBlueprint;
        
        currentState = AppState.BLUEPRINT_PROPOSAL;
        renderState();

    } catch (e) {
        errorMessage = (e as Error).message;
        currentState = AppState.ERROR;
        renderState();
    }
}


function handleStartNewSession() {
    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
    }
    localStorage.removeItem(SESSION_KEY);
    objective = '';
    strategy = null;
    blueprint = null;
    errorMessage = '';
    refiningPillar = null;
    refinementFeedback = '';
    handleRemoveFile();
    currentState = AppState.AWAITING_OBJECTIVE;
    renderState();
}

function handleFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        const result = e.target?.result as string;
        const [mimePart, dataPart] = result.split(';base64,');
        const mimeType = mimePart.split(':')[1];
        attachedFile = { name: file.name, mimeType, data: dataPart };
        renderFilePreview();
    };
    reader.readAsDataURL(file);
}

function handleRemoveFile() {
    attachedFile = null;
    fileInput.value = '';
    renderFilePreview();
}

// --- DELEGATED EVENT LISTENER ---

chatContainer.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    
    // Universal Actions
    const speakBtn = target.closest<HTMLButtonElement>('[data-action="speak"]');
    if (speakBtn) {
        handleSpeak(speakBtn);
        return;
    }

    // State-Specific Actions
    if (currentState === AppState.STRATEGY_PROPOSAL) {
        const pillarBtn = target.closest<HTMLButtonElement>('[data-pillar]');
        if (pillarBtn) {
            refiningPillar = pillarBtn.dataset.pillar as StrategyPillarKey;
            transition('REQUEST_PILLAR_REFINEMENT');
            return;
        }
        const confirmBtn = target.closest<HTMLButtonElement>('#confirm-strategy-btn');
        if (confirmBtn) {
            transition('CONFIRM_STRATEGY');
            return;
        }
    }

    if (currentState === AppState.BLUEPRINT_PROPOSAL) {
        const actionBtn = target.closest<HTMLButtonElement>('[data-action]');
        if (!actionBtn) return;
        const action = actionBtn.dataset.action;
        if (action === 'refine-blueprint') {
            const input = document.getElementById('refinement-input') as HTMLTextAreaElement;
            const feedback = input.value.trim();
            if (feedback) {
                refinementFeedback = feedback;
                transition('REQUEST_BLUEPRINT_REFINEMENT');
            }
            return;
        }
        if (action === 'finalize-blueprint') {
            transition('FINALIZE_BLUEPRINT');
            return;
        }
        if (action === 'copy-blueprint' && blueprint) {
            handleCopy(actionBtn, blueprint.prompt);
            return;
        }
    }
    
    if (currentState === AppState.FINALIZED) {
         const copyBtn = target.closest<HTMLButtonElement>('[data-action="copy-final"]');
         if (copyBtn && blueprint) {
             handleCopy(copyBtn, blueprint.prompt);
             return;
         }
    }
});


// --- INITIALIZATION ---

copyInputBtn.innerHTML = COPY_ICON_SVG;
copyInputBtn.classList.remove('btn', 'btn-secondary');
copyInputBtn.classList.add('btn-copy-icon');
copyInputBtn.title = 'Copy objective';

submitBtn.addEventListener('click', handleSubmit);
fastTrackBtn.addEventListener('click', handleFastTrack);
startNewBtn.addEventListener('click', handleStartNewSession);
copyInputBtn.addEventListener('click', () => handleCopy(copyInputBtn, userInput.value));
attachmentBtn.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', handleFileSelect);

userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
    }
});

loadSession();
if (currentState === AppState.AWAITING_OBJECTIVE) {
    renderState();
}
