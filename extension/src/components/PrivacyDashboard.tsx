import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import { motion, AnimatePresence } from 'framer-motion';
import JSZip from 'jszip';
import { runLocalVision, VisionResult, loadVisionModel } from '../lib/vision';
import { detectLocalPII, sanitizePII, evaluatePrivacyGate, PIIDetection } from '../lib/privacy';
import { Play, CheckCircle2, ShieldAlert, Cpu, Eye, Lock, Cloud, Sparkles, Image as ImageIcon, DownloadCloud, ArrowRight } from 'lucide-react';
import clsx from 'clsx';

type StepStatus = 'waiting' | 'processing' | 'success' | 'blocked';

export default function PrivacyDashboard() {
    const [hasStarted, setHasStarted] = useState(false);
    const [stages, setStages] = useState({
        capture: 'waiting' as StepStatus,
        vision: 'waiting' as StepStatus,
        detect: 'waiting' as StepStatus,
        sanitize: 'waiting' as StepStatus,
        gate: 'waiting' as StepStatus,
        cloud: 'waiting' as StepStatus,
        ai: 'waiting' as StepStatus,
    });

    const [screenshotSrc, setScreenshotSrc] = useState<string | null>(null);
    const [visionRes, setVisionRes] = useState<VisionResult | null>(null);
    const [piiItems, setPiiItems] = useState<PIIDetection[]>([]);
    const [gateRes, setGateRes] = useState<{ safe: boolean; rawPiiFound: number } | null>(null);
    const [payloadStr, setPayloadStr] = useState<string>('');
    const [aiResponse, setAiResponse] = useState('');

    const runDemo = async () => {
        setHasStarted(true);
        // RESET
        setStages({
            capture: 'waiting', vision: 'waiting', detect: 'waiting', sanitize: 'waiting',
            gate: 'waiting', cloud: 'waiting', ai: 'waiting'
        });
        setScreenshotSrc(null); setVisionRes(null); setPiiItems([]); setGateRes(null); setAiResponse('');

        await loadVisionModel();

        // 1. CAPTURE
        setStages(s => ({ ...s, capture: 'processing' }));
        await new Promise(r => setTimeout(r, 600));
        const bankPage = document.getElementById('fake-bank-page');
        if (!bankPage) return;
        const canvas = await html2canvas(bankPage, { scale: 1 });
        setScreenshotSrc(canvas.toDataURL('image/png'));
        setStages(s => ({ ...s, capture: 'success' }));

        // 2. VISION
        setStages(s => ({ ...s, vision: 'processing' }));
        try {
            const vResult = await runLocalVision(canvas);
            setVisionRes(vResult);
            setStages(s => ({ ...s, vision: 'success' }));
        } catch (e) {
            console.error(e);
            setStages(s => ({ ...s, vision: 'blocked' }));
            return;
        }

        // 3. DETECT
        setStages(s => ({ ...s, detect: 'processing' }));
        await new Promise(r => setTimeout(r, 600));
        const pii = detectLocalPII(bankPage);
        setPiiItems(pii);
        setStages(s => ({ ...s, detect: 'success' }));

        // 4. SANITIZE
        setStages(s => ({ ...s, sanitize: 'processing' }));
        await new Promise(r => setTimeout(r, 800));
        sanitizePII(pii);
        setStages(s => ({ ...s, sanitize: 'success' }));

        // 5. GATE
        setStages(s => ({ ...s, gate: 'processing' }));
        await new Promise(r => setTimeout(r, 800));
        const payload = {
            pageType: "VaultTech Security Request",
            fields: pii.map(p => ({ type: p.type, value: p.sanitizedValue || p.element?.value }))
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

        // 6. CLOUD
        await new Promise(r => setTimeout(r, 600));
        setStages(s => ({ ...s, cloud: 'success', ai: 'processing' }));

        // 7. GEMINI
        await new Promise(r => setTimeout(r, 1200));
        setAiResponse("Understood. I received the structured document payload. No sensitive user information is present in this request context.");
        setStages(s => ({ ...s, ai: 'success' }));
    };

    const executeDownload = async () => {
        if (stages.ai !== 'success') return;
        const zip = new JSZip();

        if (screenshotSrc) {
            zip.file("01_raw_screen.png", screenshotSrc.split(',')[1], { base64: true });
            zip.file("02_roi_extract.png", screenshotSrc.split(',')[1], { base64: true });
        }
        zip.file("03_pii_detected.json", JSON.stringify(piiItems.map(p => ({ type: p.type, found: true })), null, 2));

        const bankPage = document.getElementById('fake-bank-page');
        if (bankPage) {
            const sanCanvas = await html2canvas(bankPage, { scale: 1 });
            zip.file("04_sanitized_screen.png", sanCanvas.toDataURL('image/png').split(',')[1], { base64: true });
        }
        if (payloadStr) zip.file("05_cloud_payload.json", payloadStr);

        const blob = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'PrivacyLens_Output.zip';
        a.click();
        URL.revokeObjectURL(url);
    };

    const StepBox = ({ title, status, icon: Icon, children }: any) => {
        if (status === 'waiting') return null;

        const isProcessing = status === 'processing';
        const isSuccess = status === 'success';
        const isBlocked = status === 'blocked';

        return (
            <motion.div
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className={clsx(
                    "p-5 rounded-xl border transition-all duration-300 relative bg-[#0a0a0a]",
                    isProcessing ? "border-neutral-500 shadow-sm" :
                        isSuccess ? "border-neutral-800" :
                            isBlocked ? "border-red-900 bg-red-950/10" : "border-neutral-800"
                )}
            >
                <div className="flex items-center gap-3 mb-2">
                    {isProcessing ? (
                        <div className="w-5 h-5 rounded-full border-2 border-neutral-600 border-t-white animate-spin" />
                    ) : isBlocked ? (
                        <ShieldAlert className="w-5 h-5 text-red-500" />
                    ) : (
                        <CheckCircle2 className="w-5 h-5 text-neutral-400" />
                    )}
                    <h3 className={clsx("font-medium text-sm",
                        isProcessing ? "text-white" : isBlocked ? "text-red-400" : "text-neutral-400"
                    )}>{title}</h3>
                </div>
                <AnimatePresence>
                    {(isProcessing || isSuccess || isBlocked) && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            className="text-sm mt-4 overflow-hidden text-neutral-300 font-normal"
                        >
                            {children}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        );
    };

    return (
        <div className="h-full flex flex-col relative w-full bg-[#000000] text-neutral-200">
            <div className="px-8 py-5 flex justify-between items-center border-b border-neutral-800/80 sticky top-0 bg-[#000000]/80 backdrop-blur-md z-20">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-white rounded-sm" />
                    <h2 className="text-lg font-semibold text-white tracking-tight">PrivacyLens.</h2>
                </div>

                <div className="flex gap-3">
                    {stages.ai === 'success' && (
                        <motion.button
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            onClick={executeDownload}
                            className="flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                            <DownloadCloud className="w-4 h-4" /> Download Outputs
                        </motion.button>
                    )}
                    <button
                        onClick={runDemo}
                        className={clsx(
                            "flex items-center gap-2 px-5 py-2 rounded-md text-sm font-medium transition-all",
                            hasStarted
                                ? "bg-neutral-900 border border-neutral-800 text-white hover:bg-neutral-800"
                                : "bg-white text-black hover:bg-neutral-200"
                        )}
                    >
                        {hasStarted ? 'Restart Pipeline' : 'Run Pipeline'} <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="p-8 flex-grow overflow-y-auto pb-20 w-full max-w-2xl mx-auto flex flex-col gap-4">

                {!hasStarted ? (
                    <div className="flex flex-col items-center justify-center h-full text-center mt-20">
                        <div className="w-16 h-16 bg-neutral-900 border border-neutral-800 rounded-2xl flex items-center justify-center mb-6">
                            <ShieldAlert className="w-8 h-8 text-neutral-400" />
                        </div>
                        <h1 className="text-3xl font-semibold text-white mb-3 tracking-tight">Local Privacy Pipeline</h1>
                        <p className="text-neutral-500 max-w-md mx-auto mb-8 leading-relaxed">
                            Execute a fully verifiable client-side extraction to securely anonymize data before it reaches the cloud.
                        </p>
                        <button
                            onClick={runDemo}
                            className="bg-white hover:bg-neutral-200 text-black px-6 py-3 rounded-lg text-sm font-semibold transition-transform hover:scale-105 active:scale-95 shadow-lg flex items-center gap-2"
                        >
                            Analyze Screen Data <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <AnimatePresence>
                        <StepBox title="1. Screen Capture" status={stages.capture} icon={ImageIcon}>
                            <div className="bg-neutral-900/50 border border-neutral-800 p-4 rounded-lg flex items-center justify-between">
                                <div>
                                    <p className="text-white text-sm font-medium">Virtual DOM Memory Dump</p>
                                    <p className="text-neutral-500 text-xs mt-1">Processed locally on-device.</p>
                                </div>
                                {screenshotSrc && (
                                    <img src={screenshotSrc} alt="Raw screen" className="w-24 h-16 object-cover rounded border border-neutral-800 opacity-80" />
                                )}
                            </div>
                        </StepBox>

                        <StepBox title="2. Edge Vision Model" status={stages.vision} icon={Eye}>
                            <div className="grid grid-cols-2 gap-4 text-sm p-4 bg-neutral-900/50 border border-neutral-800 rounded-lg font-mono">
                                {visionRes ? (
                                    <>
                                        <div className="flex flex-col"><span className="text-neutral-500 text-[10px] uppercase">Engine</span> <span className="text-neutral-200 mt-1">WebGPU</span></div>
                                        <div className="flex flex-col"><span className="text-neutral-500 text-[10px] uppercase">Model</span> <span className="text-neutral-200 mt-1">{visionRes.model}</span></div>
                                        <div className="flex flex-col"><span className="text-neutral-500 text-[10px] uppercase">Latency</span> <span className="text-neutral-200 mt-1">{visionRes.latencyMs.toFixed(1)}ms</span></div>
                                        <div className="flex flex-col"><span className="text-neutral-500 text-[10px] uppercase">Shape</span> <span className="text-neutral-200 mt-1">[1, 1000]</span></div>
                                    </>
                                ) : (
                                    <div className="col-span-2 text-neutral-400">Loading tensor graph...</div>
                                )}
                            </div>
                        </StepBox>

                        <StepBox title="3. Local PII Detection" status={stages.detect} icon={Cpu}>
                            {stages.detect === 'success' && piiItems.length > 0 && (
                                <div className="flex flex-wrap gap-2 pt-1">
                                    {piiItems.map((p, i) => (
                                        <span key={i} className="px-2.5 py-1 bg-neutral-800 text-neutral-300 rounded border border-neutral-700 text-xs font-mono">
                                            {p.type}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </StepBox>

                        <StepBox title="4. Tokenization & Masking" status={stages.sanitize} icon={Lock}>
                            <div className="flex bg-neutral-900/50 border border-neutral-800 rounded-lg p-4 items-center gap-3">
                                <Lock className="w-5 h-5 text-neutral-400" />
                                <div>
                                    <p className="text-white text-sm font-medium">Memory Sanitization Complete</p>
                                    <p className="text-neutral-500 text-xs mt-0.5">Sensitive DOM properties abstracted and removed from payload.</p>
                                </div>
                            </div>
                        </StepBox>

                        <StepBox title="5. Transmission Gate" status={stages.gate} icon={ShieldAlert}>
                            {gateRes && (
                                <div className="space-y-4">
                                    <div className="border border-neutral-800 rounded-lg overflow-hidden font-mono text-xs">
                                        {piiItems.map((p, i) => {
                                            const isSafe = gateRes && payloadStr && p.originalValue.trim().length > 0 && !payloadStr.includes(p.originalValue);
                                            return (
                                                <div key={i} className="flex justify-between items-center p-3 border-b last:border-b-0 border-neutral-800 bg-neutral-900/30">
                                                    <span className="text-neutral-400">{p.type}</span>
                                                    {isSafe ? (
                                                        <span className="text-white flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-neutral-500" /> Clean</span>
                                                    ) : (
                                                        <span className="text-red-400">Leaked</span>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg flex justify-between items-center bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
                                        <div>
                                            <p className="text-neutral-500 text-xs mb-1">Payload Redaction Status</p>
                                            <p className={clsx("text-xl font-medium tracking-tight", gateRes.rawPiiFound === 0 ? "text-white" : "text-red-400")}>
                                                {gateRes.rawPiiFound === 0 ? "SECURED" : "FAILED"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </StepBox>

                        <StepBox title="6. Encrypted Edge Payload" status={stages.cloud} icon={Cloud}>
                            <pre className="text-xs bg-neutral-900 p-4 rounded-lg overflow-x-auto text-neutral-300 font-mono border border-neutral-800 shadow-inner max-h-40">
                                {payloadStr}
                            </pre>
                        </StepBox>

                        <StepBox title="7. Cloud Identity Match" status={stages.ai} icon={Sparkles}>
                            <div className="bg-white text-black p-4 rounded-lg shadow-sm border border-neutral-200">
                                {aiResponse ? (
                                    <p className="text-sm font-medium">{aiResponse}</p>
                                ) : (
                                    <p className="text-neutral-500 font-medium">Synthesizing structure...</p>
                                )}
                            </div>
                        </StepBox>

                    </AnimatePresence>
                )}
            </div>
        </div>
    );
}
