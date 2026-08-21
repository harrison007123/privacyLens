import React, { forwardRef } from 'react';
import { User, Mail, Phone, Lock, CreditCard, ShieldCheck } from 'lucide-react';

const FakeBankPage = forwardRef<HTMLDivElement>((props, ref) => {
    return (
        <div ref={ref} id="fake-bank-page" className="flex flex-col min-h-full font-sans pb-16">

            {/* Header */}
            <header className="bg-white px-8 py-5 flex items-center justify-between border-b border-slate-200/60 sticky top-0 z-10">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-stripe-accent flex items-center justify-center shadow-md shadow-indigo-500/20">
                        <ShieldCheck className="text-white w-5 h-5" />
                    </div>
                    <h1 className="text-lg font-bold text-stripe-text tracking-tight">VaultTech</h1>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-slate-500">Harrison</span>
                    <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
                        <User className="w-4 h-4 text-slate-400" />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="px-8 mt-10 max-w-2xl mx-auto w-full">

                <div className="mb-8">
                    <h2 className="text-2xl font-extrabold text-stripe-text tracking-tight">Security & Privacy</h2>
                    <p className="text-slate-500 text-sm mt-2">Manage your sensitive personal information and connected devices.</p>
                </div>

                <div className="bg-stripe-card rounded-2xl shadow-[0_2px_40px_-12px_rgba(0,0,0,0.1)] border border-slate-100 p-8">

                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Legal Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <User className="h-4 w-4 text-slate-300" />
                                    </div>
                                    <input
                                        type="text"
                                        data-privacy-type="name"
                                        defaultValue="Harrison Bennett"
                                        spellCheck="false"
                                        className="block w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-stripe-accent/10 focus:border-stripe-accent sm:text-sm bg-slate-50 text-stripe-text font-medium transition-all shadow-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Phone</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <Phone className="h-4 w-4 text-slate-300" />
                                    </div>
                                    <input
                                        type="tel"
                                        data-privacy-type="phone"
                                        defaultValue="9876543210"
                                        className="block w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-stripe-accent/10 focus:border-stripe-accent sm:text-sm bg-slate-50 text-stripe-text font-medium transition-all shadow-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Primary Email</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <Mail className="h-4 w-4 text-slate-300" />
                                </div>
                                <input
                                    type="email"
                                    data-privacy-type="email"
                                    defaultValue="harrison@gmail.com"
                                    spellCheck="false"
                                    className="block w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-stripe-accent/10 focus:border-stripe-accent sm:text-sm bg-slate-50 text-stripe-text font-medium transition-all shadow-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Master Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <Lock className="h-4 w-4 text-slate-300" />
                                </div>
                                <input
                                    type="password"
                                    data-privacy-type="password"
                                    defaultValue="MySecret123"
                                    className="block w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-stripe-accent/10 focus:border-stripe-accent sm:text-sm bg-slate-50 text-stripe-text font-bold transition-all shadow-sm"
                                />
                            </div>
                        </div>

                        <hr className="border-slate-100 my-4" />

                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Billing Method</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <CreditCard className="h-4 w-4 text-slate-300" />
                                </div>
                                <input
                                    type="text"
                                    data-privacy-type="creditcard"
                                    defaultValue="4111 1111 1111 1111"
                                    className="block w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-stripe-accent/10 focus:border-stripe-accent sm:text-sm bg-slate-50 text-stripe-text font-mono font-bold tracking-wide transition-all shadow-sm"
                                />
                            </div>
                        </div>

                        <div className="pt-6 flex justify-end">
                            <button type="button" className="bg-stripe-text hover:bg-slate-800 text-white font-semibold py-3 px-8 rounded-xl shadow-md transition-colors">
                                Update Security Profile
                            </button>
                        </div>

                    </div>
                </div>

                <div className="flex justify-center items-center mt-12 gap-2 text-slate-400">
                    <ShieldCheck className="w-5 h-5 opacity-50" />
                    <p className="text-xs font-medium uppercase tracking-widest text-[#a8b8d0]">Demo Environment &bull; Local Data</p>
                </div>
            </main>
        </div>
    );
});

FakeBankPage.displayName = 'FakeBankPage';

export default FakeBankPage;
