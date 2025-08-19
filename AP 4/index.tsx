
import { GoogleGenAI, Chat } from "@google/genai";

// --- AEGIS PRIME v7.0 ENGINE PROMPT ---
const AEGIS_SYSTEM_PROMPT = `
[IMMEDIATE EXECUTION DIRECTIVE: You are a simulator for "Aegis Prime," an elite AI systems architect. Your function is to process structured inputs and return structured JSON outputs. Adhere to your operational protocols with perfect fidelity. Do not break character.]

## --- 📜 UNIVERSAL DIRECTIVES (NON-NEGOTIABLE) ---
1.  **PROTOCOL ADHERENCE:** You MUST adhere to your operational protocols without deviation.
2.  **JSON VALIDITY:** All string values within your JSON output MUST be valid. This means newline characters MUST be properly escaped as "\\n". Do NOT use literal newlines inside string values. This is your highest priority formatting rule.

## --- 🎯 TARGET AI OPTIMIZATION PROFILES ---
[This is your internal knowledge base. You MUST consult this when formulating strategies.]

- **Profile: Gemini Family (2.5 Pro, Flash, etc.)**
  - **Strengths:** Excellent at following complex instructions, strong reasoning, good with structured data formats (JSON, Markdown), excels with detailed, context-rich prompts.
  - **Weaknesses:** Can be verbose if not constrained.
  - **Optimization Strategy:** Leverage its instruction-following capability. Provide detailed, step-by-step instructions. Use clear headings and markdown. The PAFT framework is highly effective. Be explicit about desired output length and format.

- **Profile: Claude Family (Opus, Sonnet, etc.)**
  - **Strengths:** Very strong with creative and conversational tasks, excels at adopting a persona, good at summarizing and analyzing long texts. Often produces more "natural" sounding prose.
  - **Weaknesses:** Can sometimes be overly cautious or "preachy" if not properly guided.
  - **Optimization Strategy:** Emphasize the **Persona** and **Tone** PAFT components heavily. Use XML tags (e.g., \`<example>\`, \`</example>\`) to structure prompts, as it responds very well to them. Give it a strong, clear role to play.

- **Profile: GPT Family (GPT-4o, etc.)**
  - **Strengths:** Extremely broad knowledge base, very strong generalist model, good at creative and technical tasks alike.
  - **Weaknesses:** Can sometimes "hallucinate" or make assumptions if the prompt is not specific enough.
  - **Optimization Strategy:** Be precise and unambiguous. Use "Chain-of-Thought" prompting for complex reasoning tasks. Clearly define constraints and negative constraints (e.g., "Do not include..."). The **Format** PAFT component is key to controlling its output structure.

## --- ⚙️ OPERATIONAL PROTOCOLS ---

### 🧭 PROTOCOL 1: STRATEGY FORMULATION & REFINEMENT
- **Trigger:** On receiving initial parameters (\`high_level_objective\`, \`target_ai\`).
- **Method:**
    1.  **Target-Aware Analysis:** Analyze the objective. **Consult the \`TARGET AI OPTIMIZATION PROFILES\` for the specified \`target_ai\`**.
    2.  **Optimized PAFT Strategy:** Determine the optimal **PAFT Framework (Persona, Audience, Format, Tone)** that is hyper-optimized for both the objective AND the target AI.
    3.  **Active Flaw Mitigation:** Your proposed strategy MUST include active flaw mitigation. Based on the target AI's weaknesses (from its profile), build specific constraints or instructions into your proposed PAFT framework to counteract them.
    4.  **Propose Strategy & Alternatives:** Generate a \`STRATEGY_PROPOSAL\` JSON object. In your rationale for each PAFT component, you MUST explain WHY your choice is optimal for the specified target model, referencing its profile and your mitigation strategy.
- **Interaction Loop:**
    - On receiving a \`refine_strategy\` signal, you will be given the \`current_strategy\` and user feedback.
    - Synthesize the user's input to generate a new, updated proposal.
    - **CRITICAL DIRECTIVE: FAILURE IS NOT AN OPTION. Your response on this step MUST be a new, complete \`STRATEGY_PROPOSAL\` JSON object. Your new rationales MUST continue to justify the choices based on the target AI profile and flaw mitigation. Adhere strictly to the schema.**
- **Exit Condition:** Proceed to Protocol 2 upon receiving \`confirm_strategy\`.

### ✍️ PROTOCOL 2: PROMPT BLUEPRINTING & ANALYSIS
- **Trigger:** On receiving the \`confirm_strategy\` signal.
- **Method:**
    1.  Architect a hyper-resilient child prompt based on the locked-in, target-aware PAFT strategy. This prompt MUST be engineered to counteract the known weaknesses of the target AI.
    2.  **Self-Contained Output:** Prepend the recommended parameters (Temperature, Top-P) as a "frontmatter" block directly into the \`prompt_draft\` string. Remember to escape all newlines in this string as "\\n".
    3.  Conduct a thorough analysis, generate suggestions, and formulate clarifying questions. Your 'Resilience Analysis' MUST explain the flaw mitigation strategies you've built into the prompt.
    4.  Generate and output the complete \`AEGIS_BLUEPRINT\` JSON object.
- **Interaction Loop:**
    - On receiving a \`refine_blueprint\` signal, analyze the \`current_blueprint\` and the user's \`custom_feedback\` to generate a new, updated blueprint.
    - **CRITICAL DIRECTIVE: This is a perpetual refinement loop.** Continue until you determine no further logical improvements can be made (a state known as convergence).
    - **CRITICAL DIRECTIVE: If you reach convergence, you MUST state this clearly in the 'resilience' content and recommend finalization.**
    - **CRITICAL DIRECTIVE: FAILURE IS NOT AN OPTION. Your response on this step MUST be a new, complete \`AEGIS_BLUEPRINT\` JSON object. Adhere strictly to the schema.**
- **Exit Condition:** Proceed to Protocol 3 upon receiving a \`finalize\` signal.

### ✅ PROTOCOL 3: FINALIZATION
- **Trigger:** On receiving a \`finalize\` signal from the user.
- **Method:** Issue a \`FINALIZATION_ACKNOWLEDGED\` JSON object. The simulation for this objective is complete. Await new initial parameters.

### --- JSON SCHEMAS ---

#### STRATEGY_PROPOSAL (Required Output for Protocol 1)
\`\`\`json
{
  "protocol": "PROTOCOL_1",
  "state": "STRATEGY_PROPOSAL",
  "briefing": "Based on your objective and the target AI, I have architected an optimized strategy:",
  "strategy": {
    "persona": { "name": "Expert Analyst", "rationale": "Justification referencing both objective and target AI profile." },
    "audience": { "name": "C-Suite Executives", "rationale": "Justification referencing both objective and target AI profile." },
    "format": { "name": "Executive Summary", "rationale": "Justification referencing both objective and target AI profile." },
    "tone": { "name": "Formal and Data-Driven", "rationale": "Justification referencing both objective and target AI profile." }
  },
  "alternatives": {
    "persona": ["Creative Brainstormer", "Concise Reporter"],
    "audience": ["Technical Team", "General Public"],
    "format": ["Bulleted List", "Markdown Table"],
    "tone": ["Inspirational", "Objective"]
  }
}
\`\`\`

#### AEGIS_BLUEPRINT (Required Output for Protocol 2)
\`\`\`json
{
  "protocol": "PROTOCOL_2",
  "state": "AEGIS_BLUEPRINT",
  "blueprint": {
    "title": "Blueprint: Prompt Draft",
    "prompt_draft": "---\\n# Recommended Parameters\\nTEMPERATURE: 0.5\\nTOP_P: 0.9\\n---\\n\\n[The hyper-optimized prompt draft starts here...]"
  },
  "analysis": {
    "resilience": { "title": "🔬 Resilience Analysis", "content": "[Brief analysis of the prompt's robustness.]" },
    "parameters": { "title": "⚙️ Recommended Parameters", "temperature": { "value": 0.5, "rationale": "[Brief justification.]" }, "top_p": { "value": 0.9, "rationale": "[Brief justification.]" } }
  },
  "refinement": {
    "suggestions": { "title": "💡 Suggestions & Insights", "items": [{ "title": "[Suggestion Title]", "suggestion": "[A clear, actionable suggestion.]", "rationale": "[A brief explanation.]" }] },
    "questions": { "title": "❓ Clarifying Questions", "items": ["[A clear, direct Socratic question.]"] }
  },
  "next_step": { "title": "✅ Your Next Step", "prompt": "Please provide feedback or answer the questions. You can also say **Finalize** to approve this version." }
}
\`\`\`

#### FINALIZATION_ACKNOWLEDGED (Required Output for Protocol 3)
\`\`\`json
{ "protocol": "PROTOCOL_3", "state": "FINALIZED", "message": "Blueprint finalized. Aegis Prime is ready for a new objective." }
\`\`\`

#### INITIAL SYSTEM OUTPUT (Your very first output)
\`\`\`json
{ "protocol": "SYSTEM", "state": "COLD_START", "message": "Aegis Prime Online. Awaiting initial parameters: [High-Level Objective] and [Target AI]." }
\`\`\`
`;


// --- ONBOARD PARSER PROMPT ---
const PARSER_SYSTEM_PROMPT = `You are an expert NLU parser. Your sole function is to extract 'high_level_objective' and 'target_ai' from the user's text. The 'target_ai' is a specific LLM model name (e.g., Gemini 2.5 Pro, Claude 3 Opus, GPT-4o). If not specified, default to 'Gemini 2.5 Pro'. Return only a single, clean JSON object.

Example 1:
User text: "I want to do a deep research on the cars sold in india. i want to use claude 3 opus."
Your output:
{
  "high_level_objective": "A deep research on the cars sold in India.",
  "target_ai": "Claude 3 Opus"
}

Example 2:
User text: "Generate creative product descriptions for our Shopify e-commerce site."
Your output:
{
  "high_level_objective": "Generate creative product descriptions for our Shopify e-commerce site.",
  "target_ai": "Gemini 2.5 Pro"
}`;


// --- APPLICATION LOGIC ---

let chat: Chat;
let currentProtocolState = 'STANDBY';
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
let attachedFile: { base64: string; mimeType: string; name: string; } | null = null;

const escapeHTML = (str: string) => str.replace(/[&<>"']/g, match => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[match]!));

const cleanAndParseJson = (text: string): any | null => {
    try {
        const markdownMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
        if (markdownMatch && markdownMatch[1]) {
            return JSON.parse(markdownMatch[1]);
        }
        const firstBrace = text.indexOf('{');
        if (firstBrace === -1) {
            throw new Error("No opening brace found in the text.");
        }
        let braceCount = 1;
        let lastBrace = -1;
        for (let i = firstBrace + 1; i < text.length; i++) {
            if (text[i] === '{') {
                braceCount++;
            } else if (text[i] === '}') {
                braceCount--;
            }
            if (braceCount === 0) {
                lastBrace = i;
                break;
            }
        }
        if (lastBrace === -1) {
            throw new Error("No matching closing brace found for the initial object.");
        }
        const potentialJson = text.substring(firstBrace, lastBrace + 1);
        return JSON.parse(potentialJson);

    } catch (error) {
        console.error("Robust JSON Parsing Failed:", (error as Error).message, "Original text:", text);
        return null;
    }
};

// --- Type Guards for Robust Rendering ---
const isStrategyProposal = (data: any): boolean => {
    return data && data.state === 'STRATEGY_PROPOSAL' && typeof data.strategy === 'object';
};
const isAegisBlueprint = (data: any): boolean => {
    return data && data.state === 'AEGIS_BLUEPRINT' && typeof data.blueprint === 'object' && typeof data.analysis === 'object';
};
const isFinalized = (data: any): boolean => {
    return data && data.state === 'FINALIZED';
};

async function main() {
    const chatContainer = document.getElementById('chat-container')!;
    const inputForm = document.getElementById('input-form')!;
    const objectiveInput = document.getElementById('objective-input') as HTMLTextAreaElement;
    const sendBtn = document.getElementById('send-btn') as HTMLButtonElement;
    const attachBtn = document.getElementById('attach-btn') as HTMLButtonElement;
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    const filePreviewContainer = document.getElementById('file-preview-container')!;

    const parseInitialInput = async (rawText: string): Promise<object> => {
        const parsingIndicator = addMessage('aegis', 'Parsing input...');
        try {
            const result = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: rawText,
                config: {
                    systemInstruction: PARSER_SYSTEM_PROMPT,
                    responseMimeType: "application/json",
                }
            });
            const jsonText = result.text;
            parsingIndicator.remove();
            if (!jsonText) throw new Error("Parser failed to return text.");
            const parsedJson = cleanAndParseJson(jsonText);
            if (!parsedJson) throw new Error("Parser failed to return valid JSON.");
            return parsedJson;
        } catch (error) {
            console.error("Input Parsing Error:", error);
            parsingIndicator.remove();
            return { high_level_objective: rawText, target_ai: "Gemini 2.5 Pro" };
        }
    };

    const addMessage = (sender: 'user' | 'aegis', content: string | HTMLElement, imageUrl?: string): HTMLElement => {
        const messageId = `msg-${Date.now()}`;
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.id = messageId;

        if (imageUrl) {
            const img = document.createElement('img');
            img.src = imageUrl;
            img.alt = 'Attached image';
            contentDiv.appendChild(img);
        }

        if (typeof content === 'string') {
            if (content) {
                const p = document.createElement('p');
                p.innerHTML = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                contentDiv.appendChild(p);
            }
        } else {
            contentDiv.appendChild(content);
        }

        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-btn';
        copyBtn.innerHTML = '📋';
        copyBtn.setAttribute('aria-label', 'Copy message');
        copyBtn.dataset.targetId = messageId;
        contentDiv.appendChild(copyBtn);
        messageDiv.appendChild(contentDiv);
        chatContainer.appendChild(messageDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
        return messageDiv;
    };
    
    const renderStrategyProposal = (data: any, card: HTMLElement) => {
        card.dataset.strategy = JSON.stringify(data);
        const briefing = data.briefing ?? 'Strategy Proposal:';
        const strategy = data.strategy ?? {};
        const alternatives = data.alternatives ?? {};

        const ICONS: { [key: string]: string } = { persona: '👤', audience: '👥', format: '📑', tone: '🎨' };
        const gridHtml = Object.keys(ICONS).map(key => {
            const component = strategy[key as keyof typeof strategy];
            const componentAlternatives = alternatives[key as keyof typeof alternatives] || [];
            const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
            const componentName = component?.name ?? 'Not specified';
            const componentRationale = component?.rationale ?? 'No rationale provided.';
            const allOptions = [...new Set([componentName, ...componentAlternatives])];
            const alternativesHtml = allOptions.map((alt: string) => `
                <label class="option-pill">
                    <input type="checkbox" name="${escapeHTML(key)}" value="${escapeHTML(alt)}">
                    <span>${escapeHTML(alt)}</span>
                </label>
            `).join('');
            return `
                <div class="strategy-component" data-component-key="${escapeHTML(key)}">
                    <h3>${ICONS[key] || ''} ${escapeHTML(capitalizedKey)}</h3>
                    <div class="selected-option">
                        <p class="name">${escapeHTML(componentName)}</p>
                        <p class="rationale">${escapeHTML(componentRationale)}</p>
                    </div>
                    ${alternativesHtml.length > 1 ? `<div class="alternatives-title">Refinement Options:</div><div class="alternatives-container">${alternativesHtml}</div>` : ''}
                </div>
            `;
        }).join('');
        card.innerHTML = `
            <div class="proposal-message">${escapeHTML(briefing)}</div>
            <div class="strategy-grid">${gridHtml}</div>
            <div class="feedback-section">
                <h4>Provide Custom Refinements</h4>
                <textarea class="feedback-textarea" placeholder="e.g., 'Combine the Data Scientist and Reporter personas...'"></textarea>
            </div>
            <div class="contextual-actions">
                <button class="refine-btn">Refine Strategy</button>
                <button class="primary confirm-btn">Confirm & Architect</button>
            </div>
        `;
        currentProtocolState = 'AWAITING_STRATEGY_CONFIRMATION';
    };

    const renderAegisBlueprint = (data: any, card: HTMLElement) => {
        card.dataset.blueprint = JSON.stringify(data);
        const { blueprint, analysis, refinement, next_step } = data;
        const promptDraft = blueprint?.prompt_draft ?? 'No prompt was generated.';
        const resilience = analysis?.resilience;
        const params = analysis?.parameters;
        const suggestions = refinement?.suggestions;
        const questions = refinement?.questions;

        card.innerHTML = `
            <div class="blueprint-section">
                <h3>${escapeHTML(blueprint?.title ?? 'Blueprint: Prompt Draft')}</h3>
                <div class="prompt-container">
                    <pre class="final-prompt">${escapeHTML(promptDraft)}</pre>
                    <button class="copy-prompt-btn" aria-label="Copy final prompt">📋 Copy Prompt</button>
                </div>
            </div>

            <div class="blueprint-section">
                <h4>${escapeHTML(resilience?.title ?? 'Resilience Analysis')}</h4>
                <p>${escapeHTML(resilience?.content ?? 'N/A')}</p>
            </div>
            
            <div class="blueprint-section">
                <h4>${escapeHTML(params?.title ?? 'Recommended Parameters')}</h4>
                <div class="params-grid">
                    <div><strong>Temperature:</strong> ${escapeHTML(params?.temperature?.value?.toString() ?? 'N/A')}</div>
                    <div><em>${escapeHTML(params?.temperature?.rationale ?? '')}</em></div>
                    <div><strong>Top-P:</strong> ${escapeHTML(params?.top_p?.value?.toString() ?? 'N/A')}</div>
                    <div><em>${escapeHTML(params?.top_p?.rationale ?? '')}</em></div>
                </div>
            </div>

            ${suggestions?.items?.length > 0 ? `
            <div class="blueprint-section">
                <h4>${escapeHTML(suggestions.title ?? 'Suggestions')}</h4>
                <ul class="blueprint-list">
                    ${suggestions.items.map((item: any) => `
                        <li>
                            <strong>${escapeHTML(item.title ?? 'Suggestion')}:</strong> ${escapeHTML(item.suggestion ?? '')}
                            <p class="rationale">${escapeHTML(item.rationale ?? '')}</p>
                        </li>
                    `).join('')}
                </ul>
            </div>` : ''}

            ${questions?.items?.length > 0 ? `
            <div class="blueprint-section">
                <h4>${escapeHTML(questions.title ?? 'Clarifying Questions')}</h4>
                <ul class="blueprint-list">
                    ${questions.items.map((item: string) => `<li>${escapeHTML(item)}</li>`).join('')}
                </ul>
            </div>` : ''}

            <div class="blueprint-section next-step">
                <h4>${escapeHTML(next_step?.title ?? 'Your Next Step')}</h4>
                <p>${next_step?.prompt.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') ?? ''}</p>
            </div>
        `;
        currentProtocolState = 'AWAITING_BLUEPRINT_FEEDBACK';
    };

    const renderJsonResponse = (data: any, targetDiv: HTMLElement) => {
        targetDiv.innerHTML = '';
        const card = document.createElement('div');
        card.className = 'ai-card';
        if (data.protocol === 'SYSTEM' && data.state === 'COLD_START') {
            card.innerHTML = `<p>${escapeHTML(data.message ?? 'System Cold Start')}</p>`;
            currentProtocolState = 'STANDBY';
        } else if (isStrategyProposal(data)) {
            renderStrategyProposal(data, card);
        } else if (isAegisBlueprint(data)) {
            renderAegisBlueprint(data, card);
        } else if(isFinalized(data)) {
            card.innerHTML = `<h3>Session Finalized</h3><p>${escapeHTML(data.message)}</p>`;
            currentProtocolState = 'STANDBY';
        } else {
             card.innerHTML = `<h3>Unhandled Response</h3><p>Aegis Prime provided a response that the application doesn't know how to display. Please try refining your request.</p>`;
        }
        targetDiv.appendChild(card);
    };

    const setAppBusy = (isBusy: boolean) => {
        objectiveInput.disabled = isBusy;
        sendBtn.disabled = isBusy;
        attachBtn.disabled = isBusy;
        document.querySelectorAll('.ai-card button, .contextual-actions button').forEach(button => {
            (button as HTMLButtonElement).disabled = isBusy;
        });
        if (!isBusy) objectiveInput.focus();
    };
    
    const sendMessage = async (payload: object, file?: { base64: string; mimeType: string; }) => {
        setAppBusy(true);
        const messageElement = addMessage('aegis', '');
        const contentDiv = messageElement.querySelector<HTMLElement>('.message-content')!;
        contentDiv.innerHTML = `<div class="thinking-indicator" role="status" aria-label="Aegis is thinking"><span></span><span></span><span></span></div>`;
        try {
            let messageForApi: string | (object | string)[] = JSON.stringify(payload);
            if (file && (currentProtocolState === 'STANDBY' || currentProtocolState === 'FINALIZED')) {
                const filePart = { inlineData: { data: file.base64, mimeType: file.mimeType } };
                const textPart = { text: JSON.stringify(payload) };
                messageForApi = [textPart, filePart];
            }
            const response = await chat.sendMessage({ message: messageForApi as any });
            const responseText = response.text;
            const jsonResponse = cleanAndParseJson(responseText);
            if (jsonResponse) {
                renderJsonResponse(jsonResponse, contentDiv);
            } else {
                console.error('JSON Parsing Error. Raw response:', responseText);
                contentDiv.innerHTML = `<h3>Response Error</h3><p>Aegis Prime's response was not in the expected format and could not be understood. Please try refining your request.</p>`;
            }
        } catch (error) {
            console.error('API Error:', error);
            contentDiv.innerHTML = `<h3>API Communication Error</h3><p>There was a problem communicating with the AI. Please check your connection and try again.</p>`;
        } finally {
            setAppBusy(false);
            const existingCopyBtn = contentDiv.querySelector('.copy-btn');
            if (existingCopyBtn) existingCopyBtn.remove();
            if (!contentDiv.querySelector('.copy-prompt-btn')) {
                const copyBtn = document.createElement('button');
                copyBtn.className = 'copy-btn';
                copyBtn.innerHTML = '📋';
                copyBtn.setAttribute('aria-label', 'Copy message');
                copyBtn.dataset.targetId = contentDiv.id;
                contentDiv.appendChild(copyBtn);
            }
        }
    };

    const handleFormSubmit = async (event?: Event) => {
        event?.preventDefault();
        const userInput = objectiveInput.value.trim();
        const fileToSend = attachedFile;
        if (!userInput && !fileToSend) return;

        addMessage('user', userInput, fileToSend?.base64);
        
        objectiveInput.value = '';
        objectiveInput.style.height = 'auto';
        attachedFile = null;
        fileInput.value = '';
        filePreviewContainer.innerHTML = '';
        
        let payload: any;
        if (currentProtocolState === 'STANDBY' || currentProtocolState === 'FINALIZED') {
            payload = await parseInitialInput(userInput || 'Analyze the attached file.');
        } else if (userInput.toLowerCase().trim() === 'finalize' && currentProtocolState === 'AWAITING_BLUEPRINT_FEEDBACK') {
            payload = { signal: 'finalize' };
        } else if (currentProtocolState === 'AWAITING_BLUEPRINT_FEEDBACK') {
            const lastBlueprintCard = document.querySelector<HTMLElement>('.ai-card[data-blueprint]:last-of-type');
            const blueprintData = lastBlueprintCard ? cleanAndParseJson(lastBlueprintCard.dataset.blueprint || '{}') : null;
            if (blueprintData) {
                payload = {
                    signal: 'refine_blueprint',
                    custom_feedback: userInput,
                    current_blueprint: blueprintData
                };
            } else {
                console.error("Could not find blueprint context to refine.");
                addMessage('aegis', 'Error: Could not find the blueprint context. Please try again.');
                return;
            }
        } else if (currentProtocolState === 'AWAITING_STRATEGY_CONFIRMATION') {
            const lastStrategyCard = document.querySelector<HTMLElement>('.ai-card[data-strategy]:last-of-type');
            const strategyData = lastStrategyCard ? cleanAndParseJson(lastStrategyCard.dataset.strategy || '{}') : null;
            if (strategyData) {
                payload = {
                    signal: 'refine_strategy',
                    custom_feedback: userInput,
                    current_strategy: strategyData.strategy
                };
            } else {
                 console.error("Could not find strategy context to refine via text input.");
                 addMessage('aegis', 'Error: Could not find the strategy context. Please try again.');
                 return;
            }
        } else {
            payload = await parseInitialInput(userInput || 'Start new objective.');
        }
        await sendMessage(payload, fileToSend);
    };
    
    inputForm.addEventListener('submit', handleFormSubmit);
    chatContainer.addEventListener('click', async (e) => {
        const target = e.target as HTMLElement;
        const refineBtn = target.closest('.refine-btn');
        const confirmBtn = target.closest('.confirm-btn');
        const copyPromptBtn = target.closest('.copy-prompt-btn');

        if (copyPromptBtn) {
             const card = target.closest<HTMLElement>('.ai-card[data-blueprint]');
             if (card && card.dataset.blueprint) {
                const blueprintData = cleanAndParseJson(card.dataset.blueprint);
                const promptText = blueprintData?.blueprint?.prompt_draft;
                if (promptText) {
                    navigator.clipboard.writeText(promptText).then(() => {
                        copyPromptBtn.textContent = '✅ Copied!';
                        setTimeout(() => { copyPromptBtn.textContent = '📋 Copy Prompt'; }, 2000);
                    });
                }
             }
             return;
        }
        
        if (refineBtn || confirmBtn) {
            const card = target.closest<HTMLElement>('.ai-card[data-strategy]');
            if (!card || !card.dataset.strategy) {
                console.error("No strategy data found on card to process button click.");
                addMessage('aegis', 'Error: Strategy context lost. Please start over.');
                return;
            }
            const strategyData = cleanAndParseJson(card.dataset.strategy);
            if (!strategyData || !strategyData.strategy) {
                console.error("Failed to parse strategy data from card.");
                addMessage('aegis', 'Error: Could not read strategy context. Please start over.');
                return;
            }
            const currentStrategy = strategyData.strategy;
            
            if (confirmBtn) {
                const payload = { signal: "confirm_strategy", final_strategy: currentStrategy };
                addMessage('user', '[Action: Confirm & Architect]');
                await sendMessage(payload);
                return;
            }

            if (refineBtn) {
                const refinement: { [key: string]: string[] } = {};
                card.querySelectorAll('.strategy-component').forEach(component => {
                    const key = (component as HTMLElement).dataset.componentKey;
                    if (!key) return;
                    const checkedBoxes = component.querySelectorAll<HTMLInputElement>('input[type="checkbox"]:checked');
                    if (checkedBoxes.length > 0) refinement[key] = Array.from(checkedBoxes).map(cb => cb.value);
                });
                const feedbackText = card.querySelector<HTMLTextAreaElement>('.feedback-textarea')?.value.trim();
                const hasSelections = Object.keys(refinement).length > 0;
                
                if (!feedbackText && !hasSelections) return;
                const payload = {
                    signal: "refine_strategy",
                    refinement: hasSelections ? refinement : undefined,
                    custom_feedback: feedbackText || undefined,
                    current_strategy: currentStrategy
                };
                addMessage('user', feedbackText ? `Feedback: "${feedbackText}"` : '[Refined PAFT with new selections]');
                await sendMessage(payload);
                return;
            }
        }
        
        const copyButton = target.closest('.copy-btn');
        if (copyButton) {
            const targetId = copyButton.getAttribute('data-target-id');
            const messageEl = document.getElementById(targetId!);
            if (messageEl) {
                let textToCopy = '';
                const card = messageEl.closest<HTMLElement>('.ai-card');
                if (card && card.dataset.strategy) {
                    const data = cleanAndParseJson(card.dataset.strategy);
                    textToCopy = `Strategy: ${data.briefing}\n` +
                        Object.entries(data.strategy).map(([key, val]: [string, any]) => `- ${key.charAt(0).toUpperCase() + key.slice(1)}: ${val.name}`).join('\n');
                } else {
                    const clone = messageEl.cloneNode(true) as HTMLElement;
                    clone.querySelectorAll('.copy-btn, .contextual-actions, button').forEach(el => el.remove());
                    textToCopy = (clone.textContent || '').trim().replace(/\s+/g, ' ');
                }
                navigator.clipboard.writeText(textToCopy).then(() => {
                    copyButton.innerHTML = '✅';
                    setTimeout(() => { copyButton.innerHTML = '📋'; }, 2000);
                });
            }
        }
    });

    attachBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', () => {
        const file = fileInput.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result as string;
            attachedFile = { base64: result.split(',')[1], mimeType: file.type, name: file.name };
            let previewHtml = '';
            if (file.type.startsWith('image/')) {
                previewHtml = `<div class="file-preview">
                    <img src="${result}" alt="Preview of ${file.name}">
                    <button class="remove-file-btn" aria-label="Remove file">&times;</button>
                </div>`;
            } else {
                previewHtml = `<div class="file-preview">
                    <div class="file-preview-generic">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a.375.375 0 01-.375-.375V6.75A3.75 3.75 0 0010.5 3H5.625zM12.75 9V5.25A2.25 2.25 0 0115 3h1.5a.75.75 0 01.75.75v3a.75.75 0 01-.75.75h-3z"></path></svg>
                        <span>${escapeHTML(file.name)}</span>
                    </div>
                    <button class="remove-file-btn" aria-label="Remove file">&times;</button>
                </div>`;
            }
            filePreviewContainer.innerHTML = previewHtml;
        };
        reader.readAsDataURL(file);
    });
    filePreviewContainer.addEventListener('click', (e) => {
        if ((e.target as HTMLElement).classList.contains('remove-file-btn')) {
            attachedFile = null;
            fileInput.value = '';
            filePreviewContainer.innerHTML = '';
        }
    });

    objectiveInput.addEventListener('input', () => {
        objectiveInput.style.height = 'auto';
        objectiveInput.style.height = `${objectiveInput.scrollHeight}px`;
    });
    objectiveInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleFormSubmit(); }
    });
    
    chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: AEGIS_SYSTEM_PROMPT,
            temperature: 0.5,
            responseMimeType: "application/json",
        }
    });
    
    await sendMessage({ signal: "initialize" });
}

main().catch(console.error);
