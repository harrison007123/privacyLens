import React, { useState, useRef, useEffect } from 'react';
import FakeBankPage from './components/FakeBankPage';
import PrivacyDashboard from './components/PrivacyDashboard';

export default function App() {
    const [leftWidth, setLeftWidth] = useState(45);
    const isResizing = useRef(false);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isResizing.current) return;
            const newWidth = (e.clientX / window.innerWidth) * 100;
            if (newWidth > 20 && newWidth < 80) setLeftWidth(newWidth);
        };
        const handleMouseUp = () => {
            if (isResizing.current) {
                isResizing.current = false;
                document.body.style.cursor = 'default';
                document.body.style.userSelect = 'auto';
            }
        };
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    return (
        <div className="h-screen w-screen overflow-hidden bg-white text-slate-800 font-sans flex flex-row">
            <div style={{ width: `${leftWidth}%` }} className="h-full overflow-y-auto bg-stripe-bg relative">
                <FakeBankPage />
            </div>

            <div
                onMouseDown={() => {
                    isResizing.current = true;
                    document.body.style.cursor = 'col-resize';
                    document.body.style.userSelect = 'none';
                }}
                className="w-[2px] bg-slate-200 hover:bg-blue-400 hover:w-[4px] transition-all cursor-col-resize z-50 flex flex-col justify-center items-center relative"
            >
                <div className="absolute w-4 h-12 bg-white border border-slate-200 shadow-sm rounded-full flex flex-col items-center justify-center gap-[2px]">
                    <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                    <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                    <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                </div>
            </div>

            <div style={{ width: `${100 - leftWidth}%` }} className="h-full overflow-y-auto bg-[#0a0f1d] text-slate-100 shadow-2xl relative z-10 transition-none">
                <PrivacyDashboard />
            </div>
        </div>
    );
}
