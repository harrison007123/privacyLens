import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { DemoState } from '../App';

interface AgentPanelProps {
    demoState: DemoState;
    runDemo: (prop: string) => void;
}

export default function AgentPanel({ demoState, runDemo }: AgentPanelProps) {
    const [prompt, setPrompt] = useState("");

    const handleLaunch = (e: React.FormEvent) => {
        e.preventDefault();
        if (prompt.trim() === '') return;
        runDemo(prompt);
    };

    return (
        <AnimatePresence>
            {demoState === 'idle' && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ type: "spring", damping: 25, stiffness: 250 }}
                    className="absolute bottom-[10%] left-1/2 -translate-x-1/2 z-[100] w-[640px]"
                >
                    <div className="bg-[#24242A] rounded-[24px] shadow-[0_20px_60px_rgba(0,0,0,0.5)] p-2">
                        <form onSubmit={handleLaunch} className="w-full flex items-center gap-4 px-2 py-1 h-[56px]">

                            {/* Left Icon (Rounded Square, purple hue) */}
                            <div className="w-12 h-12 bg-[#31314B] rounded-[14px] flex items-center justify-center border border-[#4B4B75] shrink-0 shadow-inner">
                                <Sparkles className="w-6 h-6 text-[#A0A0FF]" />
                            </div>

                            <input
                                autoFocus
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Ask the agent to buy something..."
                                className="flex-grow bg-transparent border-none outline-none text-[#E5E5E5] text-[20px] placeholder-[#6E6E77] font-medium tracking-tight"
                            />

                            <button
                                type="submit"
                                disabled={prompt.trim() === ''}
                                className="bg-[#313136] hover:bg-[#3D3D45] disabled:bg-[#313136] disabled:text-[#555] text-[#D1D1D4] px-5 h-[40px] rounded-[12px] transition-colors font-medium flex items-center gap-2"
                            >
                                Run <ArrowRight className="w-4 h-4" />
                            </button>
                        </form>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
