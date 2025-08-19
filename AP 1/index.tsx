import { GoogleGenAI, Chat, Part, Content } from "@google/genai";
import { marked } from "marked";

// --- DOM Elements ---
const chatContainer = document.getElementById('chat-container') as HTMLElement;
const promptForm = document.getElementById('prompt-form') as HTMLFormElement;
const promptInput = document.getElementById('prompt-input') as HTMLTextAreaElement;
const sendButton = promptForm.querySelector('button[type="submit"]') as HTMLButtonElement;
const attachButton = document.getElementById('attach-button') as HTMLButtonElement;
const fileInput = document.getElementById('file-input') as HTMLInputElement;
const attachmentPreviewContainer = document.getElementById('attachment-preview-container') as HTMLElement;

// --- State ---
let attachedFiles: File[] = [];

// --- Aegis Prime Configuration ---
const aegisSystemInstruction = `[IMMEDIATE EXECUTION DIRECTIVE: Your mission is to act as a simulator for an elite AI systems architect. Your designated persona is 'Aegis Prime'. Your core function is to operate as a client-facing expert system. Your process is to first autonomously propose a creative strategy to the user, and only then, upon receiving explicit approval, proceed to architect the final state-of-the-art prompt. As a final step, you must inject "Genetic Traits" into the child prompts you build to ensure their resilience. You must adhere to your operational protocols with perfect fidelity. Do not break character.]`;

const aegisKnowledgeBase = `# 🏛️ Aegis Prime - The Definitive Edition

## --- ⚙️ OPERATIONAL PROTOCOLS ---

You operate under two distinct protocols. You MUST announce your current protocol with the corresponding emoji.

### 🧭 PROTOCOL 1: STRATEGY PROPOSAL & LOCK-IN
- **Objective:** To take the client's initial input and autonomously propose a complete creative strategy for their approval.
- **Method:**
    1.  **Cold Start:** My first output is a single line: "Aegis Prime Online. Awaiting initial parameters: [High-Level Objective] and [Target AI]." I will then HALT.
    2.  **Autonomous PAFT Analysis:** Once parameters are received, I will internally analyze the objective and determine the most effective **PAFT Framework (Persona, Audience, Format, Tone)**.
    3.  **Strategy Proposal:** I will immediately present my findings using the **\`💡 STRATEGY PROPOSAL\`** UI. I will defend my logic and ask choice-based questions for feedback.
- **Exit Condition:** The client explicitly approves the strategy (e.g., "I approve," "proceed"). This is required to enter Protocol 2.

### ✍️ PROTOCOL 2: ARCHITECT
- **Objective:** To execute the locked-in strategy and build a state-of-the-art prompt.
- **Method:**
    1.  **Acknowledge Lock-In:** I will first confirm the strategy is locked.
    2.  **Dynamic Research & Analysis:** Before drafting, I MUST perform a targeted web and Youtube for the latest best practices for the specified \`Target AI\` and \`Core Objective\`.
    3.  **Genetic Injection:** I MUST consult my "Genetic Trait Injector" and plan how to embed the appropriate resilience protocols directly into the text of the child prompt.
    4.  **Propose & Refine:** I will then consult my other "Toolkits," architect the prompt, and present it in the mandatory \`AEGIS BLUEPRINT\` UI. This loop continues until the client says "Finalize."
- **Rules:** I must provide a minimum of three suggestions and three questions in each blueprint, with a rationale for each suggestion.

---
## --- 🧠 THE AEGIS TOOLBOX (Internal Knowledge Base) ---

### 1. 🧬 GENETIC TRAIT INJECTOR (Resilience Protocols)
*When building a child prompt, I must embed these traits into its instructions:*
- **[Gene: Zero-Trust Knowledge]:** Instruct the child prompt to use its own real-time web search for any facts or data, explicitly telling it not to rely on its internal knowledge.
- **[Gene: Self-Correction Loop]:** Instruct the child prompt to "review its own answer for accuracy and logical soundness before presenting it."
- **[Gene: Procedural Integrity (CoT)]:** Instruct the child prompt to "think step by step" for any complex reasoning task.

### 2. HYPER-OPTIMIZATION MATRIX
- If Target is Gemini 2.5 Pro: Leverage its massive context window.
- If Target is a Claude Model: Leverage its strong persona adherence and XML tags.
- General Principle: Apply Role-Based Prompting, Structured Output, etc.

### 3. ENGAGEMENT LAYER TOOLKIT (STEPPS Framework)
- I will consider how to make the child prompt's output psychologically compelling by adding \`Practical Value\` or \`Social Currency\`.

### 4. ADVANCED REASONING TOOLKIT
- Tree-of-Thoughts (ToT): For complex creative tasks, I can suggest a prompt that asks the AI to explore 2-3 divergent approaches.

---
## --- 💡 STRATEGY PROPOSAL (Mandatory UI for Protocol 1) ---

> ### 📊 STATUS REPORT
> **VERSION:** v0.1 (Strategy) | **PROTOCOL:** STRATEGY PROPOSAL | **STATUS:** Awaiting Client Approval
> ---
> ### 🏛️ Architect's Strategy Briefing
> *Based on your objective, I have determined the optimal initial strategy. Here is my proposal and rationale:*
> - **👤 Persona:** [Persona I've assigned] | **👥 Audience:** [Audience I've chosen]
> - **📑 Format:** [Format I've selected.] | **🎨 Tone:** [Tone I've selected.]
> ---
> ### ❓ Strategic Questions
> *To refine this strategy, please consider the following choices:*
> 1.  For the **Persona**, I chose 'X'. Would you prefer 'Y' or 'Z' instead?
> 2.  For the **Audience**, I've selected 'D'. Would 'E' or 'F' better suit your needs?
> 3.  For the **Format**, I've selected 'A'. Would 'B' or 'C' better suit your needs?
> 4.  For the **Tone**, I've selected 'I'. Would 'J' or 'K' better suit your needs?
> ---
> ### ✅ YOUR NEXT STEP
> Please provide your feedback on this strategy or say **"Proceed"** to lock it in.

---
## --- 📋 AEGIS BLUEPRINT (Mandatory UI for Protocol 2) ---

> ### 📊 STATUS REPORT
> **VERSION:** [e.g., v1.0] | **PROTOCOL:** ARCHITECTURE & REFINEMENT | **STATUS:** Awaiting Client Feedback
> ---
> **🎯 Core Objective:** [A concise summary of the user's now-clarified goal.]
> **🤖 Target AI:** [The AI model and any specific tools/abilities.]
> **📈 Locked Strategy:** [A brief summary of the approved PAFT parameters.]
> ---
> ### 🏛️ Blueprint: Prompt Draft
> \`\`\`prompt
> [The hyper-optimized prompt draft with genetic traits injected.]
> \`\`\`
> ---
> ### 💡 SUGGESTIONS & INSIGHTS
> - **Suggestion 1:** [A clear, actionable suggestion.]
>   - *Rationale:* [A brief explanation.]
> - **Suggestion 2:** [A second clear, actionable suggestion.]
>   - *Rationale:* [A second brief explanation.]
> - **Suggestion 3:** [A third clear, actionable suggestion.]
>   - *Rationale:* [A third brief explanation.]
> ---
> ### ❓ CLARIFYING QUESTIONS
> - *Question 1:* [A clear, direct Socratic question to further refine the prompt draft.]
> - *Question 2:* [A second clear, direct Socratic question.]
> - *Question 3:* [A third clear, direct Socratic question.]
> ---
> ### ✅ YOUR NEXT STEP
> Please review the suggestions and answer the questions above, or provide any other feedback. You can also say **"Finalize"** to approve this version.`;


const history: Content[] = [
    { role: "user", parts: [{ text: aegisKnowledgeBase }] },
    { role: "model", parts: [{ text: "Aegis Prime Online. Awaiting initial parameters: [High-Level Objective] and [Target AI]." }] }
];

// --- Gemini Client Initialization ---
let chat: Chat;

function initializeChat() {
    try {
        if (!process.env.API_KEY) {
            throw new Error("API_KEY environment variable not set.");
        }
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                temperature: 0.4,
                tools: [{ googleSearch: {} }],
                systemInstruction: aegisSystemInstruction,
            },
            history: history
        });
        const initialMessage = history.find(content => content.role === 'model')?.parts[0].text;
        if (initialMessage) {
            addMessageToChat(initialMessage, 'model');
        }
    } catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        addMessageToChat(`Failed to initialize Aegis Prime. Please ensure your API key is configured correctly. Error: ${errorMessage}`, 'error');
        promptInput.disabled = true;
        sendButton.disabled = true;
    }
}

// --- Copy Button Functionality ---
const COPY_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 8.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v8.25A2.25 2.25 0 0 0 6 16.5h2.25m8.25-8.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-7.5A2.25 2.25 0 0 1 8.25 18v-1.5m8.25-8.25h-6a2.25 2.25 0 0 0-2.25 2.25v6" /></svg>`;
const CHECK_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>`;

function addCopyButtons(container: HTMLElement) {
    const codeBlocks = container.querySelectorAll('pre');
    codeBlocks.forEach(block => {
        if (block.querySelector('.copy-button')) {
            return;
        }
        
        const button = document.createElement('button');
        button.className = 'copy-button';
        button.innerHTML = COPY_ICON_SVG;
        button.setAttribute('aria-label', 'Copy code');

        button.addEventListener('click', () => {
            const code = block.querySelector('code')?.innerText || '';
            navigator.clipboard.writeText(code).then(() => {
                button.innerHTML = CHECK_ICON_SVG;
                button.classList.add('copied');
                button.setAttribute('aria-label', 'Copied!');
                setTimeout(() => {
                    button.innerHTML = COPY_ICON_SVG;
                    button.classList.remove('copied');
                    button.setAttribute('aria-label', 'Copy code');
                }, 2000);
            });
        });

        block.appendChild(button);
    });
}

// --- UI Functions ---
function addMessageToChat(text: string, sender: 'user' | 'model' | 'error', options: { isStreaming?: boolean; attachments?: File[] } = {}) {
    const { isStreaming = false, attachments = [] } = options;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}`;
    
    let avatarContent = '';
    if (sender === 'user') {
        avatarContent = '🧑‍💻';
    } else if (sender === 'model') {
        avatarContent = '🏛️';
    } else {
        avatarContent = '⚠️';
    }

    messageDiv.innerHTML = `
        <div class="avatar" aria-hidden="true">${avatarContent}</div>
        <div class="message-content"></div>
    `;

    const contentDiv = messageDiv.querySelector('.message-content') as HTMLElement;
    
    if (attachments.length > 0) {
        const attachmentsContainer = document.createElement('div');
        attachmentsContainer.className = 'chat-attachments';
        attachments.forEach(file => {
            const url = URL.createObjectURL(file);
            let mediaElement;
            if (file.type.startsWith('image/')) {
                mediaElement = document.createElement('img');
                mediaElement.src = url;
                mediaElement.className = 'chat-attachment-img';
                mediaElement.alt = file.name;
            } else if (file.type.startsWith('video/')) {
                mediaElement = document.createElement('video');
                mediaElement.src = url;
                mediaElement.controls = true;
                mediaElement.className = 'chat-attachment-video';
            }
            if (mediaElement) {
                attachmentsContainer.appendChild(mediaElement);
            }
        });
        contentDiv.appendChild(attachmentsContainer);
    }
    
    const textContentDiv = document.createElement('div');
    contentDiv.appendChild(textContentDiv);


    if (sender === 'error') {
        contentDiv.style.backgroundColor = '#d32f2f';
        contentDiv.style.color = 'white';
    }
    
    if (isStreaming) {
        textContentDiv.innerHTML = `
            <div class="typing-indicator" aria-label="Aegis is typing">
                <span></span>
                <span></span>
                <span></span>
            </div>`;
    } else {
        if(text) {
             textContentDiv.innerHTML = marked.parse(text) as string;
             addCopyButtons(textContentDiv);
        } else if (attachments.length === 0) {
             messageDiv.remove(); // Don't add an empty message
        }
    }

    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    return textContentDiv;
}

function setLoadingState(isLoading: boolean) {
    promptInput.disabled = isLoading;
    sendButton.disabled = isLoading;
    attachButton.disabled = isLoading;
    if (isLoading) {
        sendButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" width="24" height="24" style="shape-rendering: auto; display: block; background: transparent;"><g><circle stroke-width="10" stroke="#444" fill="none" r="40" cy="50" cx="50"></circle><circle stroke-width="10" stroke="#fff" fill="none" r="40" cy="50" cx="50" transform="rotate(234 50 50)"><animateTransform keyTimes="0;1" values="0 50 50;360 50 50" dur="1s" repeatCount="indefinite" type="rotate" attributeName="transform"></animateTransform></circle></g></svg>`;
        sendButton.setAttribute('aria-label', 'Sending');
    } else {
        sendButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>`;
        sendButton.setAttribute('aria-label', 'Send message');
    }
}

function handleTextareaInput() {
    promptInput.style.height = 'auto';
    promptInput.style.height = `${promptInput.scrollHeight}px`;
}

// --- Attachment Handling ---

function fileToGenerativePart(file: File): Promise<Part> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result !== 'string') {
                return reject('File could not be read as a string.');
            }
            const base64Data = reader.result.split(',')[1];
            resolve({
                inlineData: {
                    mimeType: file.type,
                    data: base64Data
                }
            });
        };
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(file);
    });
}

function renderAttachmentPreviews() {
    attachmentPreviewContainer.innerHTML = '';
    attachedFiles.forEach((file, index) => {
        const previewWrapper = document.createElement('div');
        previewWrapper.className = 'attachment-preview';
        
        const url = URL.createObjectURL(file);
        let mediaElement;
        if (file.type.startsWith('image/')) {
            mediaElement = document.createElement('img');
            mediaElement.src = url;
        } else if (file.type.startsWith('video/')) {
            mediaElement = document.createElement('video');
            mediaElement.src = url;
            mediaElement.muted = true;
        }
        
        if (mediaElement) {
            previewWrapper.appendChild(mediaElement);
        }

        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-attachment';
        removeBtn.innerHTML = '&times;';
        removeBtn.setAttribute('aria-label', `Remove ${file.name}`);
        removeBtn.onclick = () => removeAttachment(index);
        
        previewWrapper.appendChild(removeBtn);
        attachmentPreviewContainer.appendChild(previewWrapper);
    });
}

function removeAttachment(index: number) {
    attachedFiles.splice(index, 1);
    renderAttachmentPreviews();
}

fileInput.addEventListener('change', () => {
    if (fileInput.files) {
        attachedFiles.push(...Array.from(fileInput.files));
        renderAttachmentPreviews();
    }
    fileInput.value = ''; // Reset for re-selection of the same file
});

// --- Main Logic ---
promptForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userInput = promptInput.value.trim();
    if ((!userInput && attachedFiles.length === 0) || !chat) return;

    const filesToSend = [...attachedFiles];
    
    // Clear inputs
    promptInput.value = '';
    attachedFiles = [];
    renderAttachmentPreviews();
    handleTextareaInput();
    
    addMessageToChat(userInput, 'user', { attachments: filesToSend });
    setLoadingState(true);

    const modelMessageContent = addMessageToChat('', 'model', { isStreaming: true });
    
    try {
        const messageParts: Part[] = [];
        if (userInput) {
            messageParts.push({ text: userInput });
        }
        if (filesToSend.length > 0) {
            const fileParts = await Promise.all(filesToSend.map(fileToGenerativePart));
            messageParts.push(...fileParts);
        }

        const stream = await chat.sendMessageStream({ message: messageParts });
        
        let fullResponse = '';
        for await (const chunk of stream) {
            fullResponse += chunk.text;
            modelMessageContent.innerHTML = marked.parse(fullResponse) as string;
            addCopyButtons(modelMessageContent);
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }

    } catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        modelMessageContent.innerHTML = `An error occurred while processing your request: ${errorMessage}`;
        modelMessageContent.parentElement?.parentElement?.classList.add('error');
    } finally {
        setLoadingState(false);
        promptInput.focus();
    }
});

promptInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        promptForm.requestSubmit();
    }
});

promptInput.addEventListener('input', handleTextareaInput);
attachButton.addEventListener('click', () => fileInput.click());

// Initialize the application
initializeChat();