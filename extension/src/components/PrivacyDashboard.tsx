import React, { useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { motion, AnimatePresence } from 'framer-motion';
import JSZip from 'jszip';
import { runLocalVision, VisionResult, loadVisionModel } from '../lib/vision';
import { detectLocalPII, sanitizePII, evaluatePrivacyGate, PIIDetection } from '../lib/privacy';
import { CheckCircle2, ShieldAlert, Cpu, Eye, Lock, Cloud, Sparkles, Image as ImageIcon, CopyCheck, ArrowRight, ShieldCheck } from 'lucide-react';
import clsx from 'clsx';

type StepStatus = 'waiting' | 'processing' | 'success' | 'blocked';
type StageKey = 'capture' | 'vision' | 'detect' | 'sanitize' | 'gate' | 'cloud' | 'ai';

interface PrivacyDashboardProps {
    onComplete: () => void;
}

export default function PrivacyDashboard({ onComplete }: PrivacyDashboardProps) {
    const [stages, setStages] = useState<Record<StageKey, StepStatus>>({
        capture: 'waiting', vision: 'waiting', detect: 'waiting', sanitize: 'waiting', gate: 'waiting', cloud: 'waiting', ai: 'waiting',
    });

    const [screenshotSrc, setScreenshotSrc] = useState<string | null>(null);
    const [visionRes, setVisionRes] = useState<VisionResult | null>(null);
    const [piiItems, setPiiItems] = useState<PIIDetection[]>([]);
    const [gateRes, setGateRes] = useState<{ safe: boolean; rawPiiFound: number } | null>(null);
    const [payloadStr, setPayloadStr] = useState<string>('');
    const [aiResponse, setAiResponse] = useState('');

    useEffect(() => {
        runPipeline();
        // eslint-disable-next-line
    }, []);

    const runPipeline = async () => {
        await loadVisionModel();

        setStages(s => ({ ...s, capture: 'processing' }));
        await new Promise(r => setTimeout(r, 4000)); // Extremly slow for presentation

        const targetPage = document.getElementById('fake-shop-payment-page');
        if (!targetPage) return;

        const canvas = await html2canvas(targetPage, { scale: 1 });
        setScreenshotSrc(canvas.toDataURL('image/png'));
        setStages(s => ({ ...s, capture: 'success' }));

        setStages(s => ({ ...s, vision: 'processing' }));
        await new Promise(r => setTimeout(r, 4500)); // Extremely slow for presentation
        try {
            const vResult = await runLocalVision(canvas);
            setVisionRes(vResult);
            setStages(s => ({ ...s, vision: 'success' }));
        } catch (e) {
            console.error(e);
            setStages(s => ({ ...s, vision: 'blocked' }));
            return;
        }

        setStages(s => ({ ...s, detect: 'processing' }));
        await new Promise(r => setTimeout(r, 4000)); // Extremely slow for presentation
        const pii = detectLocalPII(targetPage);
        setPiiItems(pii);
        setStages(s => ({ ...s, detect: 'success' }));

        setStages(s => ({ ...s, sanitize: 'processing' }));
        await new Promise(r => setTimeout(r, 4500)); // Extremely slow for presentation
        sanitizePII(pii);
        setStages(s => ({ ...s, sanitize: 'success' }));

        setStages(s => ({ ...s, gate: 'processing' }));
        await new Promise(r => setTimeout(r, 4000)); // Extremely slow for presentation
        const payload = {
            pageType: "Payment Route Payload",
            fields: pii.map(p => ({ type: p.type, value: p.type.toUpperCase() + "_TOKEN_X89A" }))
        };
        const payloadJson = JSON.stringify(payload, null, 2);
        setPayloadStr(payloadJson);

        const gateValidation = evaluatePrivacyGate(payloadJson, pii);
        setGateRes(gateValidation);

        if (gateValidation.safe) {
            setStages(s => ({ ...s, gate: 'success', cloud: 'processing' }));
        } else {
            setStages(s => ({ ...s, gate: 'blocked' }));
            return;
        }

        await new Promise(r => setTimeout(r, 3500)); // Extremely slow for presentation
        setStages(s => ({ ...s, cloud: 'success', ai: 'processing' }));

        await new Promise(r => setTimeout(r, 3000)); // Extremely slow for presentation
        setAiResponse("Payment form context securely processed. Proceeding to safe transaction state.");
        setStages(s => ({ ...s, ai: 'success' }));
    };

    const StepBox = ({ title, status, icon: Icon, children }: any) => {
        const isWaiting = status === 'waiting';
        const isProcessing = status === 'processing';
        const isSuccess = status === 'success';
        const isBlocked = status === 'blocked';

        return (
            <div className={clsx(
                "flex flex-col w-full h-full min-h-[320px] p-8 rounded-[24px] border relative transition-all duration-700 bg-[#1E1E24] shadow-sm overflow-hidden",
                isWaiting ? "border-[#2A2A35] opacity-40 shadow-none" : "border-[#333344]",
                isProcessing ? "border-[#7C3AED] shadow-[0_0_30px_rgba(124,58,237,0.1)] ring-1 ring-[#7C3AED]/30" :
                    isSuccess ? "border-[#2A2A35]" :
                        isBlocked ? "border-red-900 bg-red-950/20" : ""
            )}
            >
                {isProcessing && <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#5B21B6] via-[#A78BFA] to-[#5B21B6] animate-pulse" />}

                <div className="flex items-center gap-4 mb-6 border-b border-[#2A2A35] pb-5">
                    {isProcessing ? (
                        <div className="w-10 h-10 rounded-full border-[3px] border-[#2A2A35] border-t-[#8B5CF6] animate-spin shrink-0 flex items-center justify-center" />
                    ) : isSuccess ? (
                        <CheckCircle2 className="w-10 h-10 text-[#10B981] shrink-0" />
                    ) : isBlocked ? (
                        <ShieldAlert className="w-10 h-10 text-red-500 shrink-0" />
                    ) : (
                        <div className="w-10 h-10 rounded-full border-2 border-[#333344] flex items-center justify-center shrink-0" />
                    )}
                    <h3 className={clsx("font-semibold text-xl transition-colors duration-300 font-sans tracking-tight",
                        isProcessing ? "text-white" : isSuccess ? "text-[#E5E7EB]" : "text-[#9CA3AF]"
                    )}>{title}</h3>
                </div>

                <div className="flex-grow flex flex-col justify-center text-[#D1D5DB] font-sans relative z-10 w-full">
                    <AnimatePresence mode="wait">
                        {!isWaiting && (
                            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="w-full h-full">
                                {children}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        );
    };

    return (
        <div className="h-full flex flex-col w-full bg-[#121214] text-[#E5E7EB] font-sans selection:bg-[#7C3AED] selection:text-white">

            {/* PREMIUM DARK HEADER */}
            <div className="px-12 py-8 flex justify-between items-center border-b border-[#1E1E24] bg-[#121214] shadow-sm shrink-0 relative z-20">
                <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-[#1E1E24] border border-[#333344] flex flex-col items-center justify-center rounded-[16px] shadow-inner">
                        <ShieldCheck className="w-7 h-7 text-[#A78BFA]" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                            PrivacyLens
                            <span className="px-3 py-1 bg-[#1E1E24] text-[#9CA3AF] border border-[#2A2A35] text-xs font-semibold rounded-full flex items-center gap-2 tracking-wide uppercase">
                                Local Compliance Layer
                            </span>
                        </h2>
                        <p className="text-[#9CA3AF] text-sm mt-1.5 font-medium">Monitoring & Sanitization Pipeline (On-Device)</p>
                    </div>
                </div>

                {stages.ai === 'success' && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                        onClick={onComplete}
                        className="flex items-center gap-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white px-8 py-4 rounded-[14px] text-sm font-bold transition-all shadow-[0_4px_15px_rgba(124,58,237,0.3)]"
                    >
                        AUTHORIZE SECURE PAYLOAD <ArrowRight className="w-5 h-5 ml-1" />
                    </motion.button>
                )}
            </div>

            {/* SLEEK MATTE DARK GRID LAYOUT */}
            <div className="flex-grow overflow-y-auto custom-scroll w-full p-8 lg:p-12">
                <div className="max-w-[1700px] mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

                    <StepBox title="1. Screen Abstraction" status={stages.capture}>
                        <div className="h-full flex flex-col">
                            <p className="text-[#9CA3AF] text-[15px] mb-5 leading-relaxed font-medium">
                                Capturing current browser view state directly to an off-screen buffer. All processing remains on-device without network exposure.
                            </p>
                            {screenshotSrc && (
                                <div className="border border-[#2A2A35] rounded-[12px] overflow-hidden bg-[#18181A] mt-auto p-2 shadow-sm">
                                    <img src={screenshotSrc} alt="Raw screen" className="w-full h-auto max-h-[160px] object-cover object-top rounded-lg opacity-90" />
                                </div>
                            )}
                        </div>
                    </StepBox>

                    <StepBox title="2. Edge Verification Model" status={stages.vision}>
                        {visionRes ? (
                            <div className="grid grid-cols-2 gap-5 p-6 bg-[#18181A] border border-[#2A2A35] rounded-[16px] h-full items-center shadow-inner">
                                <div className="flex flex-col"><span className="text-[#6B7280] text-[11px] font-bold uppercase tracking-wider mb-1.5">Engine</span> <span className="text-lg font-medium text-white">WebGPU / CoreML</span></div>
                                <div className="flex flex-col"><span className="text-[#6B7280] text-[11px] font-bold uppercase tracking-wider mb-1.5">Runtime</span> <span className="text-lg font-medium text-white">{visionRes.model}</span></div>
                                <div className="flex flex-col"><span className="text-[#6B7280] text-[11px] font-bold uppercase tracking-wider mb-1.5">Inference Speed</span> <span className="text-2xl text-[#A78BFA] font-bold">{visionRes.latencyMs.toFixed(1)}ms</span></div>
                                <div className="flex flex-col"><span className="text-[#6B7280] text-[11px] font-bold uppercase tracking-wider mb-1.5">Memory Allocation</span> <span className="text-lg font-medium text-white">Local Only</span></div>
                            </div>
                        ) : (<div className="w-full h-full flex items-center justify-center text-[#6B7280] font-medium text-lg">Initializing inference environment...</div>)}
                    </StepBox>

                    <StepBox title="3. Compliance Detection" status={stages.detect}>
                        {stages.detect === 'success' && piiItems.length > 0 && (
                            <div className="h-full flex flex-col justify-center gap-5 p-4 text-center">
                                <p className="text-[#6B7280] text-sm font-bold uppercase tracking-wider">Identified Protected Classes</p>
                                <div className="flex flex-wrap justify-center gap-3 mt-4">
                                    {piiItems.map((p, i) => (
                                        <span key={i} className="px-5 py-2.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-[10px] text-sm font-bold tracking-wide uppercase">
                                            {p.type}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </StepBox>

                    <StepBox title="4. Tokenization & Masking" status={stages.sanitize}>
                        <div className="flex flex-col h-full gap-5">
                            <p className="text-[#6B7280] text-[11px] font-bold uppercase tracking-wider">Secure In-Memory Data Substitution</p>
                            {piiItems.length > 0 && stages.sanitize === 'success' && (
                                <div className="flex flex-col gap-3 overflow-y-auto max-h-[220px] pr-2 custom-scroll w-full">
                                    {piiItems.map((p, i) => (
                                        <div key={i} className="flex flex-col text-[14px] bg-[#18181A] p-4.5 border border-[#2A2A35] rounded-[12px] gap-2.5 w-full">
                                            <div className="flex items-center gap-4 overflow-hidden">
                                                <span className="text-[#6B7280] font-bold text-[10px] w-12 shrink-0">RAW STATE</span>
                                                <span className="text-red-400/80 line-through truncate w-full block">{p.originalValue}</span>
                                            </div>
                                            <div className="flex items-center gap-4 overflow-hidden">
                                                <span className="text-[#6B7280] font-bold text-[10px] w-12 shrink-0">SANITIZED</span>
                                                <span className="text-[#10B981] font-semibold bg-[#10B981]/10 px-2 py-0.5 rounded-[6px] truncate w-full block">{p.type.toUpperCase()}_TOKEN_X89A</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </StepBox>

                    <StepBox title="5. Transmission Firewall" status={stages.gate}>
                        {gateRes && (
                            <div className="space-y-5 h-full flex flex-col justify-center">
                                <div className="border border-[#2A2A35] rounded-[14px] bg-[#18181A] overflow-hidden text-[15px] shadow-sm">
                                    {piiItems.map((p, i) => (
                                        <div key={i} className="flex justify-between p-4.5 border-b border-[#2A2A35] last:border-b-0">
                                            <span className="text-[#E5E7EB] font-bold tracking-wide uppercase">{p.type}</span>
                                            <span className="text-[#10B981] font-bold flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /> VERIFIED</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="bg-[#10B981]/10 border border-[#10B981]/20 p-5 rounded-[12px] flex justify-center items-center">
                                    <p className="text-[#10B981] font-bold text-sm uppercase tracking-wide flex items-center gap-2">
                                        <CopyCheck className="w-5 h-5" /> PAYLOAD CLEARED FOR EXPORT
                                    </p>
                                </div>
                            </div>
                        )}
                    </StepBox>

                    <div className="xl:col-span-2">
                        <StepBox title="6. Formatted Secure Payload" status={stages.cloud}>
                            <div className="bg-[#09090B] p-7 rounded-[14px] border border-[#2A2A35] shadow-inner h-full min-h-[220px] overflow-y-auto custom-scroll relative font-mono text-[13px]">
                                <div className="absolute top-5 right-5 bg-[#1E1E24] text-[#9CA3AF] text-[10px] px-2.5 py-1 rounded-[6px] font-bold uppercase tracking-wider border border-[#333344]">Object Inspect</div>
                                <pre className="text-[#A78BFA] whitespace-pre-wrap break-words leading-relaxed">
                                    {payloadStr}
                                </pre>
                            </div>
                        </StepBox>
                    </div>

                    <div className="xl:col-span-1">
                        <StepBox title="7. Cloud Processing State" status={stages.ai}>
                            <div className="bg-[#8B5CF6]/5 border border-[#8B5CF6]/10 text-[#E5E7EB] rounded-[16px] p-8 h-full flex flex-col justify-center items-center text-center shadow-inner">
                                {aiResponse ? (
                                    <>
                                        <Cloud className="w-12 h-12 text-[#A78BFA] mb-5" />
                                        <p className="text-[#E5E7EB] text-[16px] font-medium leading-relaxed tracking-tight">
                                            {aiResponse}
                                        </p>
                                    </>
                                ) : (
                                    <p className="text-[#8B5CF6] font-medium text-[16px]">Establishing secure connection...</p>
                                )}
                            </div>
                        </StepBox>
                    </div>

                </div>
            </div>

            <style>{`
                .custom-scroll::-webkit-scrollbar { width: 8px; height: 8px; }
                .custom-scroll::-webkit-scrollbar-track { background: transparent; }
                .custom-scroll::-webkit-scrollbar-thumb { background: #333344; border-radius: 4px; border: 2px solid transparent; background-clip: content-box; }
                .custom-scroll::-webkit-scrollbar-thumb:hover { background-color: #4B4B75; }
            `}</style>
        </div>
    );
}
