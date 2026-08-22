import React, { useState, useEffect } from 'react';
import AgentPanel from './components/AgentPanel';
import ShopDemo from './components/ShopDemo';
import PrivacyDashboard from './components/PrivacyDashboard';
import { AnimatePresence, motion } from 'framer-motion';
import { Camera, Brain, MousePointerClick, ShieldCheck, CheckCircle2, Bot } from 'lucide-react';

export type DemoState = 'idle' |
    'moving_to_search' | 'typing_search' | 'clicking_search_btn' |
    'adding_to_cart' | 'clicking_add_cart' |
    'proceeding_to_checkout' | 'clicking_checkout' |
    'proceeding_to_payment' | 'clicking_payment' |
    'waiting_for_user_payment' |
    'privacy_lens' | 'authorized' | 'done';

export default function App() {
    const [demoState, setDemoState] = useState<DemoState>('idle');

    const startDemoSequence = async (prompt: string) => {
        if (demoState !== 'idle' && demoState !== 'done') return;

        setDemoState('moving_to_search');
        await delay(3000); // SLOWED DOWN

        setDemoState('typing_search');
        await delay(6000); // SLOWED DOWN

        setDemoState('clicking_search_btn');
        await delay(4000); // SLOWED DOWN

        setDemoState('adding_to_cart');
        await delay(4000); // SLOWED DOWN

        setDemoState('clicking_add_cart');
        await delay(3000); // SLOWED DOWN

        setDemoState('proceeding_to_checkout');
        await delay(4000); // SLOWED DOWN

        setDemoState('clicking_checkout');
        await delay(3000); // SLOWED DOWN

        setDemoState('proceeding_to_payment');
        await delay(4000); // SLOWED DOWN

        setDemoState('clicking_payment');
        await delay(3000); // SLOWED DOWN

        setDemoState('waiting_for_user_payment');
    };

    const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

    // Determine current agent action for the toast/pill
    let agentAction = "";
    let ActionIcon = Bot;

    if (['moving_to_search', 'adding_to_cart', 'proceeding_to_checkout', 'proceeding_to_payment'].includes(demoState)) {
        agentAction = "Taking visual screenshot & reasoning...";
        ActionIcon = Camera;
    } else if (demoState === 'typing_search') {
        agentAction = "Typing 'Black Laptop Bag'...";
        ActionIcon = MousePointerClick;
    } else if (['clicking_search_btn', 'clicking_add_cart', 'clicking_checkout', 'clicking_payment'].includes(demoState)) {
        agentAction = "Predicting bounding boxes & clicking target...";
        ActionIcon = Brain;
    } else if (demoState === 'waiting_for_user_payment') {
        agentAction = "Agent paused. Awaiting human payment entry.";
        ActionIcon = ShieldCheck;
    }

    return (
        <div className="flex h-screen w-full bg-[#EAEDED] text-black overflow-hidden font-sans relative">

            {/* FULL SCREEN FAKE BROWSER */}
            <div className="w-full h-full relative flex flex-col">
                <ShopDemo demoState={demoState} onTriggerPrivacyLens={() => setDemoState('privacy_lens')} />

                {/* PRIVACYLENS OVERLAY */}
                <AnimatePresence>
                    {(demoState === 'privacy_lens' || demoState === 'done') && (
                        <motion.div
                            initial={{ y: '100%', opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ type: "spring", damping: 30, stiffness: 100 }}
                            className="absolute top-0 left-0 w-full h-full shadow-[0_-20px_50px_rgba(0,0,0,0.5)] z-[100] flex flex-col bg-[#050510] overflow-hidden"
                        >
                            <PrivacyDashboard onComplete={() => setDemoState('authorized')} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* SLEEK COMMAND BAR (Agent Panel) */}
            <AgentPanel demoState={demoState} runDemo={startDemoSequence} />

            {/* AGENT "THINKING" FLOATING TOAST */}
            <AnimatePresence>
                {agentAction && demoState !== 'idle' && demoState !== 'privacy_lens' && demoState !== 'authorized' && demoState !== 'done' && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="absolute top-8 left-1/2 -translate-x-1/2 z-[80] bg-indigo-950/90 backdrop-blur border border-indigo-500/50 text-white px-6 py-3 rounded-full flex items-center gap-4 shadow-[0_10px_30px_rgba(79,70,229,0.3)]"
                    >
                        <ActionIcon className="w-5 h-5 text-indigo-400 animate-pulse" />
                        <span className="font-mono text-sm tracking-tight">{agentAction}</span>
                        {demoState !== 'waiting_for_user_payment' && (
                            <div className="flex gap-1 ml-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}
