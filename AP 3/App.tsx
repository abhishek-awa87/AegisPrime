
import React, { useState, useCallback } from 'react';
import { AppState, Strategy, Blueprint, StrategyPillar, StrategyPillarKey } from './types';
import { generateStrategy, refineStrategyPillar, generateBlueprint } from './services/geminiService';
import { AegisLogo, SparklesIcon, ChevronRightIcon, RefreshIcon, ClipboardIcon, CheckIcon, UserCircleIcon, UsersIcon, DocumentTextIcon, ChatBubbleLeftRightIcon } from './components/Icons';
import { LoadingView } from './components/LoadingView';

const App: React.FC = () => {
    const [appState, setAppState] = useState<AppState>(AppState.AWAITING_OBJECTIVE);
    const [objective, setObjective] = useState<string>('');
    const [strategy, setStrategy] = useState<Strategy | null>(null);
    const [blueprint, setBlueprint] = useState<Blueprint | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [refiningPillar, setRefiningPillar] = useState<StrategyPillarKey | null>(null);
    const [refinementInput, setRefinementInput] = useState<string>('');
    const [copied, setCopied] = useState<boolean>(false);

    const handleError = (message: string, error?: unknown) => {
        console.error(message, error);
        setError(message);
        setAppState(AppState.ERROR);
    };

    const handleObjectiveSubmit = async (submittedObjective: string) => {
        if (!submittedObjective.trim()) return;
        setObjective(submittedObjective);
        setAppState(AppState.GENERATING_STRATEGY);
        try {
            const newStrategy = await generateStrategy(submittedObjective);
            setStrategy(newStrategy);
            setAppState(AppState.STRATEGY_PROPOSAL);
        } catch (e) {
            handleError("Failed to generate strategy.", e);
        }
    };

    const handleRefinePillar = async (pillar: StrategyPillarKey) => {
        if (!strategy || !objective) return;
        setRefiningPillar(pillar);
        setAppState(AppState.REFINING_STRATEGY_PILLAR);
        try {
            const newPillarData = await refineStrategyPillar(objective, strategy, pillar);
            setStrategy(prev => prev ? { ...prev, [pillar]: newPillarData } : null);
        } catch (e) {
            handleError("Failed to refine strategy pillar.", e);
        } finally {
            setRefiningPillar(null);
            setAppState(AppState.STRATEGY_PROPOSAL);
        }
    };

    const handleConfirmStrategy = async () => {
        if (!strategy || !objective) return;
        setAppState(AppState.GENERATING_BLUEPRINT);
        try {
            const newBlueprint = await generateBlueprint(strategy, objective);
            setBlueprint(newBlueprint);
            setAppState(AppState.BLUEPRINT_PROPOSAL);
        } catch (e) {
            handleError("Failed to generate blueprint.", e);
        }
    };

    const handleRefineBlueprint = async () => {
        if (!blueprint || !strategy || !objective || !refinementInput.trim()) return;
        setAppState(AppState.REFINING_BLUEPRINT);
        try {
            const newBlueprint = await generateBlueprint(strategy, objective, refinementInput);
            setBlueprint(newBlueprint);
            setRefinementInput('');
            setAppState(AppState.BLUEPRINT_PROPOSAL);
        } catch (e) {
            handleError("Failed to refine blueprint.", e);
        }
    };

    const handleFinalize = () => {
        setAppState(AppState.FINALIZED);
    };

    const handleStartNew = () => {
        setObjective('');
        setStrategy(null);
        setBlueprint(null);
        setError(null);
        setRefinementInput('');
        setCopied(false);
        setAppState(AppState.AWAITING_OBJECTIVE);
    };
    
    const handleCopyToClipboard = () => {
        if (!blueprint?.prompt) return;
        navigator.clipboard.writeText(blueprint.prompt);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const renderContent = () => {
        switch (appState) {
            case AppState.AWAITING_OBJECTIVE:
                return <WelcomeScreen onSubmit={handleObjectiveSubmit} />;
            case AppState.GENERATING_STRATEGY:
                return <LoadingView messages={["Analyzing objective...", "Calibrating parameters...", "Architecting initial strategy..."]} />;
            case AppState.STRATEGY_PROPOSAL:
                return strategy && <StrategyProposalView strategy={strategy} onRefine={handleRefinePillar} onConfirm={handleConfirmStrategy} refiningPillar={refiningPillar} />;
            case AppState.REFINING_STRATEGY_PILLAR:
                return strategy && <StrategyProposalView strategy={strategy} onRefine={handleRefinePillar} onConfirm={handleConfirmStrategy} refiningPillar={refiningPillar} />;
            case AppState.GENERATING_BLUEPRINT:
                return <LoadingView messages={["Constructing blueprint...", "Integrating strategy pillars...", "Optimizing prompt structure..."]} />;
            case AppState.BLUEPRINT_PROPOSAL:
                return blueprint && <BlueprintView blueprint={blueprint} refinementInput={refinementInput} setRefinementInput={setRefinementInput} onRefine={handleRefineBlueprint} onFinalize={handleFinalize} onCopy={handleCopyToClipboard} copied={copied}/>;
             case AppState.REFINING_BLUEPRINT:
                return <LoadingView messages={["Incorporating feedback...", "Revising blueprint...", "Running diagnostics..."]} />;
            case AppState.FINALIZED:
                return blueprint && <FinalizedView blueprint={blueprint} onStartNew={handleStartNew} onCopy={handleCopyToClipboard} copied={copied}/>;
            case AppState.ERROR:
                return <ErrorView message={error || "An unknown error occurred."} onStartNew={handleStartNew} />;
            default:
                return <WelcomeScreen onSubmit={handleObjectiveSubmit} />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4 sm:p-6 lg:p-8">
            <header className="w-full max-w-5xl flex items-center justify-between mb-8">
                 <div className="flex items-center gap-3">
                    <AegisLogo className="w-10 h-10 text-blue-400" />
                    <h1 className="text-2xl font-bold text-gray-200 tracking-wider">Aegis Prime</h1>
                </div>
                 {(appState !== AppState.AWAITING_OBJECTIVE && appState !== AppState.ERROR) && (
                    <button onClick={handleStartNew} className="text-sm text-gray-400 hover:text-white transition">Start New</button>
                 )}
            </header>
            <main className="w-full max-w-5xl flex-grow flex flex-col justify-center">
                {renderContent()}
            </main>
        </div>
    );
};

// --- Components defined in the same file to avoid circular dependencies and for simplicity ---

const WelcomeScreen: React.FC<{ onSubmit: (objective: string) => void }> = ({ onSubmit }) => {
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(inputValue);
    };

    return (
        <div className="text-center animate-fadeIn">
            <h2 className="text-4xl font-extrabold text-white mb-2">Proactive Co-Pilot</h2>
            <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">Provide your high-level objective. I will architect the optimal prompt strategy.</p>
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
                <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="e.g., Create a social media campaign for a new sustainable coffee brand..."
                    className="w-full h-32 p-4 bg-gray-800 border border-gray-700 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                />
                <button type="submit" disabled={!inputValue.trim()} className="mt-4 w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors duration-200 group">
                    Initiate Strategy <SparklesIcon className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform" />
                </button>
            </form>
        </div>
    );
};

const pillarIcons: Record<StrategyPillarKey, React.ReactNode> = {
    persona: <UserCircleIcon className="w-8 h-8 text-blue-300" />,
    audience: <UsersIcon className="w-8 h-8 text-green-300" />,
    format: <DocumentTextIcon className="w-8 h-8 text-purple-300" />,
    tone: <ChatBubbleLeftRightIcon className="w-8 h-8 text-yellow-300" />,
};

const StrategyProposalView: React.FC<{ strategy: Strategy; onRefine: (pillar: StrategyPillarKey) => void; onConfirm: () => void; refiningPillar: StrategyPillarKey | null }> = ({ strategy, onRefine, onConfirm, refiningPillar }) => {
    return (
        <div className="w-full animate-fadeIn">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold">Interactive Strategy Briefing</h2>
                <p className="text-gray-400 mt-1">Review the proposed strategy. Regenerate any pillar or confirm to proceed.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(Object.keys(strategy) as StrategyPillarKey[]).map(key => (
                    <div key={key} className="bg-gray-800/50 border border-gray-700 p-6 rounded-lg flex flex-col">
                        <div className="flex items-center mb-3">
                            {pillarIcons[key]}
                            <h3 className="text-xl font-semibold ml-3 uppercase tracking-wider">{key}</h3>
                        </div>
                        <h4 className="text-lg font-bold text-white mb-2">{strategy[key].title}</h4>
                        <p className="text-gray-300 flex-grow mb-4">{strategy[key].description}</p>
                        <button onClick={() => onRefine(key)} disabled={refiningPillar !== null} className="self-start inline-flex items-center text-sm font-medium text-blue-400 hover:text-blue-300 disabled:text-gray-500 disabled:cursor-wait transition-colors">
                             {refiningPillar === key ? 'Generating...' : 'Regenerate'}
                            <RefreshIcon className={`w-4 h-4 ml-1.5 ${refiningPillar === key ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                ))}
            </div>
            <div className="text-center mt-8">
                <button onClick={onConfirm} disabled={refiningPillar !== null} className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors duration-200 group">
                    Confirm Strategy & Build Blueprint <ChevronRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
};

const BlueprintView: React.FC<{ blueprint: Blueprint; refinementInput: string; setRefinementInput: (val: string) => void; onRefine: () => void; onFinalize: () => void; onCopy: () => void; copied: boolean; }> = ({ blueprint, refinementInput, setRefinementInput, onRefine, onFinalize, onCopy, copied }) => {
    return (
        <div className="w-full animate-fadeIn space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold">AEGIS BLUEPRINT</h2>
                <p className="text-gray-400 mt-1">The hyper-optimized prompt is ready. Refine further or finalize.</p>
            </div>
            
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold uppercase tracking-wider text-blue-300">Final Prompt Draft</h3>
                    <button onClick={onCopy} className="flex items-center text-sm text-gray-300 hover:text-white transition">
                        {copied ? <CheckIcon className="w-5 h-5 text-green-400" /> : <ClipboardIcon className="w-5 h-5" />}
                        <span className="ml-1.5">{copied ? 'Copied!' : 'Copy'}</span>
                    </button>
                </div>
                <pre className="bg-gray-900 p-4 rounded-md whitespace-pre-wrap text-gray-200 font-mono text-sm leading-relaxed overflow-x-auto">{blueprint.prompt}</pre>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold uppercase tracking-wider text-green-300 mb-3">Analysis</h3>
                    <p className="text-gray-300">{blueprint.analysis}</p>
                </div>
                <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold uppercase tracking-wider text-purple-300 mb-3">Suggestions</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-300">
                        {blueprint.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                </div>
            </div>

            <div>
                <textarea 
                    value={refinementInput}
                    onChange={(e) => setRefinementInput(e.target.value)}
                    placeholder="Provide feedback for refinement..." 
                    className="w-full h-24 p-4 bg-gray-800 border border-gray-700 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                />
                <div className="flex flex-col sm:flex-row justify-end gap-4 mt-4">
                     <button onClick={onRefine} disabled={!refinementInput.trim()} className="px-6 py-2 border border-blue-500 text-blue-400 font-semibold rounded-lg hover:bg-blue-500 hover:text-white disabled:border-gray-600 disabled:text-gray-500 disabled:bg-transparent disabled:cursor-not-allowed transition-colors">Refine Blueprint</button>
                    <button onClick={onFinalize} className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors">Finalize</button>
                </div>
            </div>
        </div>
    );
};

const FinalizedView: React.FC<{ blueprint: Blueprint, onStartNew: () => void; onCopy: () => void; copied: boolean; }> = ({ blueprint, onStartNew, onCopy, copied }) => (
    <div className="text-center animate-fadeIn w-full max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold">Blueprint Finalized</h2>
        <p className="text-gray-400 mt-2 mb-6">Your prompt is complete and ready for use.</p>
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 text-left mb-6">
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold uppercase tracking-wider text-blue-300">Final Prompt</h3>
                <button onClick={onCopy} className="flex items-center text-sm text-gray-300 hover:text-white transition">
                    {copied ? <CheckIcon className="w-5 h-5 text-green-400" /> : <ClipboardIcon className="w-5 h-5" />}
                    <span className="ml-1.5">{copied ? 'Copied!' : 'Copy'}</span>
                </button>
            </div>
            <pre className="bg-gray-900 p-4 rounded-md whitespace-pre-wrap text-gray-200 font-mono text-sm leading-relaxed">{blueprint.prompt}</pre>
        </div>
        <button onClick={onStartNew} className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 group">
            Create New Blueprint <SparklesIcon className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform" />
        </button>
    </div>
);

const ErrorView: React.FC<{ message: string; onStartNew: () => void; }> = ({ message, onStartNew }) => (
    <div className="text-center animate-fadeIn w-full max-w-2xl mx-auto bg-red-900/20 border border-red-500 rounded-lg p-8">
        <h2 className="text-3xl font-bold text-red-400">System Error</h2>
        <p className="text-gray-300 mt-4 mb-6">Aegis Prime encountered an unexpected issue.</p>
        <pre className="bg-gray-900 p-4 rounded-md text-left text-red-300 text-sm mb-6">{message}</pre>
        <button onClick={onStartNew} className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200">
            Start New Session
        </button>
    </div>
);

export default App;