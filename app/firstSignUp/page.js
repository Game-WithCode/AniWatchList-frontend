"use client"
import React from 'react'
import Router from 'next/router'
import { useRouter } from "next/navigation";
const FirstSignUpPage = () => {
    const router = useRouter();
    
    return (
        <>
            <main className="grow flex items-center justify-center relative overflow-hidden bg-black/80 bg-[url('/Images/heroImage.jpg')] bg-blend-overlay bg-cover bg-center ">
                <div className="absolute inset-0 bg-linear-to-tr from-bgsecondary/10 via-transparent to-bgsecondary/5 pointer-events-none"></div>
                <div className="max-w-4xl mx-auto px-6 py-20 text-center relative z-10">
                    <div className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-bgsecondary/10 border border-bgsecondary/20 text-bgsecondary text-xs font-bold uppercase tracking-widest">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-bgsecondary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-bgsecondary"></span>
                        </span>
                        Join 50,000+ Anime Fans
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
                        Unlock Your Ultimate <br/> <span className="text-bgsecondary">Anime Journey</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Sign up now to track your progress, discover new favorites, and join our vibrant community of fans. Your watchlist, evolved.
                    </p>
                    <div className="flex flex-col items-center gap-6">
                        <button className="bg-bgsecondary hover:bg-opacity-90 text-background-dark font-bold text-lg px-10 py-4 rounded-full transition-all transform hover:scale-105 teal-glow" onClick={()=>router.push('/signup')}>
                            Get Started / Sign Up
                        </button>
                        <p className="text-slate-400">
                            Already have an account?
                            <a className="text-bgsecondary hover:underline font-semibold ml-1" onClick={()=>router.push('/login')} >Log In</a>
                        </p>
                    </div>
                    <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/10 pt-12">
                        <div>
                            <div className="text-3xl font-bold text-white">10k+</div>
                            <div className="text-slate-400 text-sm">Anime Series</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-white">5k+</div>
                            <div className="text-slate-400 text-sm">Manga Titles</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-white">100%</div>
                            <div className="text-slate-400 text-sm">Free Forever</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-white">24/7</div>
                            <div className="text-slate-400 text-sm">Updates</div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default FirstSignUpPage;
