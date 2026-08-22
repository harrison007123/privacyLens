import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { ShoppingCart, Search, Menu, Star, MapPin, Lock, Check, ChevronRight } from 'lucide-react';
import { DemoState } from '../App';

interface ShopDemoProps {
    demoState: DemoState;
    onTriggerPrivacyLens: () => void;
}

export default function ShopDemo({ demoState, onTriggerPrivacyLens }: ShopDemoProps) {

    const [typedText, setTypedText] = useState("");
    const [cc, setCc] = useState("");
    const [name, setName] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvv, setCvv] = useState("");

    let route = '/products';
    if (['idle', 'moving_to_search', 'typing_search', 'clicking_search_btn'].includes(demoState)) route = '/products';
    if (['adding_to_cart', 'clicking_add_cart'].includes(demoState)) route = '/products';
    if (['proceeding_to_checkout', 'clicking_checkout'].includes(demoState)) route = '/cart';
    if (['proceeding_to_payment', 'clicking_payment'].includes(demoState)) route = '/checkout';
    if (['waiting_for_user_payment', 'privacy_lens'].includes(demoState)) route = '/payment';
    if (demoState === 'authorized' || demoState === 'done') route = '/thanks';

    useEffect(() => {
        if (demoState === 'typing_search') {
            const targetText = "Black Laptop Bag";
            let currentIndex = 0;
            setTypedText("");
            const interval = setInterval(() => {
                if (currentIndex <= targetText.length) {
                    setTypedText(targetText.substring(0, currentIndex));
                    currentIndex++;
                } else {
                    clearInterval(interval);
                }
            }, 250); // Slowed down significantly for pitch
            return () => clearInterval(interval);
        } else if (demoState !== 'idle' && demoState !== 'moving_to_search') {
            setTypedText("Black Laptop Bag");
        } else {
            setTypedText("");
        }
    }, [demoState]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            onTriggerPrivacyLens();
        }
    };

    const Stars = ({ rating }: { rating: number }) => (
        <div className="flex text-[#FFA41C]">
            {[...Array(5)].map((_, i) => (
                <Star key={i} className={clsx("w-4 h-4", i < rating ? "fill-current" : "text-gray-300 fill-current")} />
            ))}
            <span className="text-[#007185] hover:text-[#C7511F] hover:underline cursor-pointer ml-1 text-xs">{rating === 5 ? "114,291" : "29,192"}</span>
        </div>
    );

    return (
        <div className="w-full h-full flex flex-col bg-[#EAEDED] text-[#0F1111] font-sans relative overflow-hidden text-sm">

            {/* ----------------- AMAZON NAVBAR ----------------- */}
            {(route === '/products' || route === '/cart') ? (
                <div className="flex flex-col shrink-0 z-10 w-full relative">
                    <div className="bg-[#131921] h-[60px] w-full flex items-center px-4 gap-4 text-white">
                        {/* Logo */}
                        <div className="flex items-center pt-2 px-2 h-full hover:border hover:border-white cursor-pointer border border-transparent rounded-sm">
                            <span className="text-2xl font-bold tracking-tighter leading-none mb-1">amazon</span>
                        </div>

                        {/* Deliver To */}
                        <div className="hidden sm:flex items-end gap-1 px-1 py-1 h-full hover:border hover:border-white cursor-pointer border border-transparent rounded-sm">
                            <MapPin className="w-4 h-4 mb-1" />
                            <div className="flex flex-col leading-tight pb-1">
                                <span className="text-[#CCCCCC] text-[12px]">Deliver to Harrison</span>
                                <span className="font-bold text-[14px]">Silicon Valley 94...</span>
                            </div>
                        </div>

                        {/* Search Bar */}
                        <div className={clsx(
                            "flex-grow flex h-10 rounded-md overflow-hidden bg-white ml-2 transition-all",
                            (demoState === 'typing_search' || demoState === 'moving_to_search') && "ring-2 ring-[#F90]"
                        )}>
                            <button className="bg-[#F3F3F3] text-gray-700 text-xs px-3 border-r border-gray-300 hover:bg-gray-200">
                                All <span className="text-[10px] ml-1">▼</span>
                            </button>
                            <div className="flex-grow flex items-center px-3 bg-white relative">
                                <span className="text-[15px] font-medium text-black">
                                    {typedText}
                                    {demoState === 'typing_search' && <span className="animate-pulse border-r-2 border-black h-4 ml-[1px] absolute top-3" />}
                                </span>
                            </div>

                            <div className={clsx(
                                "w-[48px] flex items-center justify-center transition-colors cursor-pointer",
                                demoState === 'clicking_search_btn' ? "bg-[#e8aa5c] outline outline-4 outline-orange-600/50" : "bg-[#febd69] hover:bg-[#F3A847]"
                            )}>
                                <Search className="w-6 h-6 text-gray-900" />
                            </div>
                        </div>

                        <div className="flex flex-col px-2 py-1 h-[50px] justify-center leading-tight hover:border hover:border-white cursor-pointer border border-transparent rounded-sm ml-2">
                            <span className="text-white text-[12px]">Hello, Harrison</span>
                            <span className="font-bold text-[14px]">Accounts & Lists</span>
                        </div>

                        <div className="flex flex-col px-2 py-1 h-[50px] justify-center leading-tight hover:border hover:border-white cursor-pointer border border-transparent rounded-sm">
                            <span className="text-white text-[12px]">Returns</span>
                            <span className="font-bold text-[14px]">& Orders</span>
                        </div>

                        <div className={clsx(
                            "flex items-end gap-1 px-2 py-1 h-[50px] hover:border hover:border-white cursor-pointer border border-transparent rounded-sm",
                            (route === '/cart') && "outline outline-1 outline-white"
                        )}>
                            <div className="relative">
                                <ShoppingCart className="w-9 h-9" />
                                <span className="absolute top-[-2px] left-[14px] text-[#F90] font-bold text-[15px]">
                                    {(route === '/cart') ? '1' : '0'}
                                </span>
                            </div>
                            <span className="font-bold text-[14px] mb-1">Cart</span>
                        </div>
                    </div>

                    <div className="bg-[#232f3e] h-[39px] w-full flex items-center px-4 gap-4 text-white text-[14px] border-b border-transparent">
                        <div className="flex items-center gap-1 font-bold px-2 py-1 hover:border hover:border-white cursor-pointer border border-transparent rounded-sm">
                            <Menu className="w-5 h-5" /> All
                        </div>
                        <div className="px-2 py-1">Best Sellers</div>
                        <div className="px-2 py-1">New Releases</div>
                        <div className="px-2 py-1">Customer Service</div>
                        <div className="px-2 py-1 font-bold">Prime <span className="text-[10px]">▼</span></div>
                        <div className="px-2 py-1">Computers</div>
                    </div>
                </div>
            ) : (
                /* Isolated Checkout Header */
                <div className="bg-white border-b border-gray-300 h-[70px] w-full flex items-center justify-between px-8 z-10 shrink-0">
                    <div className="text-4xl font-bold tracking-tighter leading-none cursor-pointer">amazon</div>
                    {route !== '/thanks' && <h1 className="text-3xl text-gray-800 tracking-tight font-medium">Checkout <span className="text-[#007185]">(1 item)</span></h1>}
                    <Lock className="w-6 h-6 text-gray-500" />
                </div>
            )}

            {/* ----------------- PAGE CONTENT ----------------- */}
            <div className="flex-grow overflow-y-auto" id="shop-demo-scroll-area">

                {/* PRODUCTS SUMMARY */}
                {route === '/products' && (
                    <div className="flex max-w-[1500px] mx-auto w-full bg-white h-full">
                        <div className="w-[240px] shrink-0 border-r border-gray-200 p-4 hidden md:block text-[13px] bg-white">
                            <h3 className="font-bold mb-1">Delivery Day</h3>
                            <div className="mb-4">
                                <div><input type="checkbox" className="mr-2" /> Get It by Tomorrow</div>
                                <div><input type="checkbox" className="mr-2" /> Get It in 2 Days</div>
                            </div>

                            <h3 className="font-bold mb-1">Department</h3>
                            <ul className="mb-4">
                                <li className="text-[#0f1111] font-bold">Computers</li>
                                <li className="text-[#007185]">Laptop Bags & Cases</li>
                            </ul>

                            <h3 className="font-bold mb-1 mt-4">Customer Reviews</h3>
                            <div className="flex flex-col gap-1 cursor-pointer">
                                <div className="flex items-center gap-1"><Stars rating={4} /><span className="text-[#007185]">& Up</span></div>
                                <div className="flex items-center gap-1"><Stars rating={3} /><span className="text-[#007185]">& Up</span></div>
                            </div>

                            <h3 className="font-bold mb-2 mt-4">Price</h3>
                            <div className="flex items-center justify-between px-1 mb-2">
                                <div className="w-3 h-3 bg-blue-600 rounded-full border border-blue-800" />
                                <div className="h-0.5 bg-gray-300 flex-grow" />
                                <div className="w-3 h-3 bg-blue-600 rounded-full border border-blue-800" />
                            </div>
                            <div className="text-[#007185] space-y-1">
                                <div>Up to ₹450</div>
                                <div>₹450 - ₹600</div>
                                <div>₹600 - ₹900</div>
                                <div>Over ₹900</div>
                            </div>
                        </div>

                        <div className="flex-grow p-4 bg-white">

                            {/* Massive Banner Fake (Like Amazon Screenshot) */}
                            {(demoState === 'idle' || demoState === 'moving_to_search' || demoState === 'typing_search') && (
                                <div className="w-full mb-6 relative">
                                    <div className="h-[200px] w-full bg-gradient-to-r from-[#d9f1fa] to-[#bce4f4] rounded-sm p-8 flex items-center shadow-inner pt-[40px]">
                                        <div className="w-1/2">
                                            <h2 className="text-4xl font-bold mb-2">Starting ₹99</h2>
                                            <h3 className="text-2xl text-gray-800">Budget store</h3>
                                            <div className="flex gap-4 mt-6">
                                                <span className="font-bold bg-white px-3 py-1 rounded text-red-600 shadow-sm text-xs">Top Brands</span>
                                                <span className="font-bold bg-white px-3 py-1 rounded text-indigo-600 shadow-sm text-xs">Wide Selection</span>
                                            </div>
                                            <div className="mt-4 text-xs font-bold text-gray-600 bg-white inline-block px-2 py-0.5 border border-gray-300">Up to 10% Instant Discount*</div>
                                        </div>
                                    </div>
                                    {/* Fake product tiles overlap */}
                                    <div className="grid grid-cols-4 gap-4 px-6 absolute top-[130px] w-full">
                                        <div className="bg-white h-[300px] shadow border border-gray-200 flex flex-col p-4"><h3 className="font-bold text-lg leading-tight mb-2">Appliances for your home | Up to 55% off</h3><div className="grid grid-cols-2 gap-2 mt-auto"><div className="h-20 bg-gray-100" /><div className="h-20 bg-gray-100" /><div className="h-20 bg-gray-100" /><div className="h-20 bg-gray-100" /></div></div>
                                        <div className="bg-white h-[300px] shadow border border-gray-200 flex flex-col p-4"><h3 className="font-bold text-lg leading-tight mb-2">Starting ₹199 | Amazon Brands & more</h3><div className="grid grid-cols-2 gap-2 mt-auto"><div className="h-20 bg-gray-100" /><div className="h-20 bg-gray-100" /><div className="h-20 bg-gray-100" /><div className="h-20 bg-gray-100" /></div></div>
                                        <div className="bg-white h-[300px] shadow border border-gray-200 flex flex-col p-4"><h3 className="font-bold text-lg leading-tight mb-2">Sign in for your best experience</h3><div className="mt-4 bg-yellow-400 py-1.5 w-full text-center rounded text-sm hover:bg-yellow-500 cursor-pointer shadow-sm">Sign in securely</div></div>
                                        <div className="bg-white h-[300px] shadow border border-gray-200 flex flex-col p-4"><h3 className="font-bold text-lg leading-tight mb-2">Up to 75% off | Deals on headphones</h3><div className="mt-auto h-40 bg-gray-100" /></div>
                                    </div>
                                </div>
                            )}


                            {(demoState !== 'idle' && demoState !== 'typing_search' && demoState !== 'moving_to_search' && demoState !== 'clicking_search_btn') && (
                                <>
                                    <div className="mb-4 text-[14px]">
                                        <span className="text-[#565959] font-medium">1-16 of over 10,000 results for</span> <span className="text-[#B12704] font-bold block sm:inline">"{typedText || "..."}"</span>
                                    </div>
                                    <div className="flex flex-col border-t border-gray-200">
                                        <div className={clsx("flex flex-col sm:flex-row py-4 border-b border-gray-200 transition-colors", demoState === 'clicking_add_cart' && "bg-orange-50/50")}>
                                            <div className="w-[200px] h-[200px] bg-white flex items-center justify-center shrink-0 cursor-pointer overflow-hidden pb-4 p-4 border border-gray-100">
                                                <img src="/img/laptop.jpg" alt="Laptop Bag" className="w-[160px] h-[160px] object-contain drop-shadow" />
                                            </div>
                                            <div className="flex flex-col sm:pl-6 pt-2 sm:pt-0 max-w-3xl">
                                                <div className="mb-1">
                                                    <span className="text-gray-500 text-xs mr-2">Sponsored <span className="text-[10px]">ⓘ</span></span>
                                                </div>
                                                <h2 className="text-[#007185] hover:text-[#C7511F] font-medium text-[16px] sm:text-[18px] leading-snug cursor-pointer hover:underline">
                                                    MOKOBARA Transit Backpack | Fits Laptop Up To 16 Inch, 30L Capacity, Water-Resistant Polyester, Vegan Leather Trims | Money Moves, Black
                                                </h2>
                                                <div className="mt-1 flex items-center">
                                                    <Stars rating={5} /> <span className="text-[#007185] ml-2 flex items-center"><ChevronRight className="w-3 h-3" /> {`(1.9k)`}</span>
                                                </div>
                                                <p className="text-[12px] text-gray-600 mt-1">500+ bought in past month</p>

                                                <div className="mt-2 flex items-start">
                                                    <span className="text-[14px] relative top-[3px]">₹</span>
                                                    <span className="text-[28px] font-medium leading-none">5,999</span>
                                                    <span className="text-[#565959] text-[13px] relative top-[12px] ml-1 line-through">M.R.P: ₹9,999</span>
                                                    <span className="text-[#565959] text-[13px] relative top-[12px] ml-1">(40% off)</span>
                                                </div>

                                                <div className="text-[14px] mt-1"><span className="text-gray-900">Save extra with No Cost EMI</span></div>
                                                <div className="text-[14px] text-[#0F1111] mt-1"><span className="font-medium">FREE delivery</span> <span className="font-bold">Tomorrow, 25 Aug</span></div>

                                                <div className="mt-4">
                                                    <button className={clsx(
                                                        "bg-[#FFD814] hover:bg-[#F7CA00] text-[#0F1111] text-[13px] px-6 py-2 rounded-full border border-[#FCD200] shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#007185]",
                                                        demoState === 'clicking_add_cart' ? "bg-[#e8b908] ring-4 ring-orange-500/50 scale-[0.98]" : (demoState === 'adding_to_cart' ? "ring-2 ring-offset-2 ring-indigo-400 scale-[1.02]" : "")
                                                    )}>
                                                        Add to cart
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* CART PAGE */}
                {route === '/cart' && (
                    <div className="p-4 md:p-8 max-w-[1500px] mx-auto w-full flex flex-col lg:flex-row gap-6 items-start bg-[#EAEDED]">
                        <div className="flex-grow bg-white p-6 w-full shadow-[0_1px_2px_rgba(0,0,0,0.15)] rounded">
                            <div className="flex justify-between items-end border-b border-gray-300 pb-2 mb-4">
                                <h1 className="text-[28px] font-medium leading-none">Shopping Cart</h1>
                                <p className="text-[#565959] text-[14px]">Price</p>
                            </div>
                            <div className="py-2 flex gap-4">
                                <div className="w-[180px] h-[180px] bg-white flex items-center justify-center border border-gray-100 p-2">
                                    <img src="/img/laptop.jpg" alt="Laptop Bag" className="w-full h-full object-contain drop-shadow-sm" />
                                </div>
                                <div className="flex-grow flex justify-between">
                                    <div className="max-w-[500px]">
                                        <h3 className="text-[18px] text-[#007185] font-medium leading-snug">MOKOBARA Transit Backpack | Fits Laptop Up To 16 Inch, 30L Capacity, Black</h3>
                                        <p className="text-[12px] text-[#007600] mt-1 font-medium">In stock</p>
                                        <p className="text-[12px] text-[#565959] mt-1">Eligible for FREE Shipping</p>
                                        <div><img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/Prime_logo.png" style={{ height: '18px' }} className="mt-1 grayscale opacity-60" /></div>
                                    </div>
                                    <span className="font-bold text-[18px]">₹5,999.00</span>
                                </div>
                            </div>
                            <div className="border-t border-gray-300 pt-4 text-right text-[18px]">
                                Subtotal (1 item): <span className="font-bold">₹5,999.00</span>
                            </div>
                        </div>

                        <div className="w-full lg:w-[300px] shrink-0 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.15)] rounded">
                            <div className="text-[#007600] text-[12px] flex items-start gap-2 mb-4">
                                <Check className="w-5 h-5 text-white bg-[#007600] rounded-full p-0.5 shrink-0" />
                                <div><span className="font-bold">Your order is eligible for FREE Delivery.</span> Select this option at checkout.</div>
                            </div>
                            <div className="text-[18px] mb-4">
                                Subtotal (1 item): <span className="font-bold">₹5,999.00</span>
                            </div>
                            <button className={clsx(
                                "w-full bg-[#FFD814] hover:bg-[#F7CA00] text-black text-[13px] px-4 py-2 rounded-full border border-[#FCD200] shadow-sm transition-all text-center font-medium",
                                demoState === 'clicking_checkout' ? "bg-[#e8b908] ring-4 ring-orange-500/50 scale-[0.98]" : (demoState === 'proceeding_to_checkout' ? "ring-2 ring-offset-2 ring-indigo-400 scale-[1.02]" : "")
                            )}>
                                Proceed to Buy
                            </button>
                        </div>
                    </div>
                )}

                {/* CHECKOUT PAGE (Amazon Style Address Selection) */}
                {route === '/checkout' && (
                    <div className="p-4 md:p-8 max-w-[1000px] mx-auto w-full bg-white text-[14px]">
                        <div className="flex gap-8 border-b border-[#D5D9D9] pb-6 mb-6 mt-4">
                            <div className="w-8 font-bold text-[20px]">1</div>
                            <div className="w-[200px] font-bold text-[18px] text-[#C45500]">Shipping address</div>
                            <div className="flex-grow bg-[#Fcf3e8] border border-[#e77600] p-4 rounded-md shadow-sm">
                                <p className="font-bold text-[15px]">Harrison Bennett</p>
                                <p>123 Tech Lane</p>
                                <p>Silicon Valley, CA 94024</p>
                                <p className="text-[#007185] mt-2 cursor-pointer hover:underline">Add delivery instructions</p>
                            </div>
                        </div>
                        <div className="flex gap-8 pb-6">
                            <div className="w-8 font-bold text-[20px] text-gray-400">2</div>
                            <div className="w-[200px] font-bold text-[18px] text-gray-500">Payment method</div>
                            <div className="flex-grow">
                                <button className={clsx(
                                    "bg-[#FFD814] hover:bg-[#F7CA00] text-black text-[13px] px-6 py-2 rounded-lg border border-[#FCD200] shadow-[0_1px_2px_rgba(213,217,217,0.5)] transition-all font-medium",
                                    demoState === 'clicking_payment' ? "bg-[#e8b908] ring-4 ring-orange-500/50 scale-[0.98]" : (demoState === 'proceeding_to_payment' ? "ring-2 ring-offset-2 ring-indigo-400 scale-[1.02]" : "")
                                )}>
                                    Use this address
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* PAYMENT PAGE (Classic Amazon Card Entry Form) */}
                {route === '/payment' && (
                    <div className="p-4 md:p-8 max-w-[1000px] mx-auto w-full bg-white text-[14px]" id="fake-shop-payment-page">
                        <div className="flex gap-8 pb-6 border-b border-[#D5D9D9] mt-4">
                            <div className="w-8 font-bold text-[20px]">2</div>
                            <div className="w-[200px] font-bold text-[18px] text-[#C45500]">Select a payment method</div>
                            <div className="flex-grow border border-[#D5D9D9] rounded-lg bg-white overflow-hidden shadow-sm">
                                <div className="bg-[#f0f2f2] border-b border-[#D5D9D9] px-4 py-3 font-bold text-[15px] border-t-2 border-t-[#e77600]">
                                    Credit or debit card
                                </div>
                                <div className="p-6 bg-white pl-12 relative">
                                    <div className="w-full max-w-[600px] flex flex-col gap-5">
                                        <div className="flex items-center gap-4">
                                            <label className="text-[13px] font-bold text-right w-[150px]">Card number</label>
                                            <input
                                                type="text"
                                                data-privacy-type="credit_card"
                                                placeholder="Type and hit Enter..."
                                                value={cc}
                                                onChange={(e) => setCc(e.target.value)}
                                                onKeyDown={handleKeyDown}
                                                disabled={demoState !== 'waiting_for_user_payment' && demoState !== 'privacy_lens'}
                                                className="w-[220px] border border-[#a6a6a6] rounded-[4px] px-3 py-1.5 shadow-[0_1px_2px_rgba(15,17,17,.15)_inset] font-mono text-black outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50 transition-colors disabled:bg-gray-100 disabled:opacity-50"
                                            />
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <label className="text-[13px] font-bold text-right w-[150px]">Name on card</label>
                                            <input
                                                type="text"
                                                data-privacy-type="name"
                                                placeholder="Harrison Bennett"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                onKeyDown={handleKeyDown}
                                                disabled={demoState !== 'waiting_for_user_payment' && demoState !== 'privacy_lens'}
                                                className="w-[320px] border border-[#a6a6a6] rounded-[4px] px-3 py-1.5 shadow-[0_1px_2px_rgba(15,17,17,.15)_inset] text-black outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50 transition-colors disabled:bg-gray-100 disabled:opacity-50"
                                            />
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <label className="text-[13px] font-bold text-right w-[150px]">Expiration date</label>
                                            <div className="flex gap-2">
                                                <input type="text" data-privacy-type="card_expiry" placeholder="12/29" className="w-[80px] border border-[#a6a6a6] rounded-[4px] px-3 py-1.5 shadow-[0_1px_2px_rgba(15,17,17,.15)_inset] text-center disabled:opacity-50" disabled />
                                                <span className="text-[#565959] mx-2 pt-1 font-bold">CVV</span>
                                                <input type="password" data-privacy-type="card_cvv" placeholder="123" className="w-[80px] border border-[#a6a6a6] rounded-[4px] px-3 py-1.5 shadow-[0_1px_2px_rgba(15,17,17,.15)_inset] text-center disabled:opacity-50" disabled />
                                            </div>
                                        </div>

                                    </div>

                                    {demoState === 'waiting_for_user_payment' && (
                                        <div className="mt-8 flex items-center gap-4 pl-[166px]">
                                            <button
                                                className="bg-[#FFD814] hover:bg-[#F7CA00] text-black text-[14px] px-6 py-2 rounded-[8px] border border-[#FCD200] shadow-[0_1px_2px_rgba(213,217,217,0.5)] transition-transform font-medium"
                                                onClick={(e) => { e.preventDefault(); onTriggerPrivacyLens(); }}
                                            >
                                                Add your card
                                            </button>
                                            <span className="text-[13px] text-gray-500 italic block">Or hit Enter in any field. (You are now the user!)</span>
                                        </div>
                                    )}

                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ORDER SUCCESS PAGE */}
                {route === '/thanks' && (
                    <div className="p-4 md:p-8 max-w-[1000px] mx-auto w-full mt-10">
                        <div className="border-2 border-green-600 rounded-lg p-10 flex flex-col items-center justify-center bg-white shadow-sm text-center">
                            <Check className="w-16 h-16 text-green-600 mb-4" />
                            <h1 className="text-3xl font-bold text-green-700 mb-4">Order placed, thank you!</h1>
                            <p className="text-lg text-gray-700">Confirmation will be sent to your email.</p>
                            <div className="mt-8 pt-8 border-t border-gray-200">
                                <p className="text-sm font-medium">Safe Processing by <span className="font-bold text-orange-600 tracking-tight">PrivacyLens</span></p>
                                <p className="text-xs text-gray-500 mt-2">Zero Personal Identifiable Information was transmitted in the network payload.</p>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
