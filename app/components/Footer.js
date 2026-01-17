"use client"
import React from 'react'
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState,useEffect } from 'react';
import { set } from 'mongoose';
const Footer = () => {
    const { data: session, status } = useSession();
    const [loggedIn, setLoggedIn] = useState(false);
    const username = session?.user?.name || false;
    const router = useRouter();
    useEffect(() => {
        if (status === "authenticated") {
            setLoggedIn(true);
        } else {
            setLoggedIn(false);
        }
    }, [status]);
    return (
        <>
            <footer className="bg-background-secondary/50 mt-16 border-t border-border-color">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
                        <div className="col-span-2 md:col-span-2">
                            <h3 className="text-xl font-bold text-primary mb-2">AniWatchList</h3>
                            <p className="text-sm text-text-secondary pr-8">Your go-to platform for discovering and tracking your favorite anime and manga series. Stay updated with the latest releases and recommendations.</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-text-primary mb-3">Quick Links</h4>
                            <ul className="space-y-2 text-sm">
                                <li onClick={() => router.push(loggedIn ? `/user/${username}` : "/firstSignUp")}><a className="text-text-secondary hover:text-primary transition-colors flex items-center gap-2 cursor-pointer"><span className="material-symbols-outlined text-base">home</span>Home</a></li>
                                <li onClick={() => router.push(loggedIn ? `/user/${username}/browse?type=anime` : "/firstSignUp")}><a className="text-text-secondary hover:text-primary transition-colors flex items-center gap-2 cursor-pointer"><span className="material-symbols-outlined text-base">live_tv</span>Anime</a></li>
                                <li onClick={() => router.push(loggedIn ? `/user/${username}/browse?type=manga` : "/firstSignUp")}><a className="text-text-secondary hover:text-primary transition-colors flex items-center gap-2 cursor-pointer"><span className="material-symbols-outlined text-base">book</span>Manga</a></li>
                                <li onClick={() => router.push(loggedIn ? `/user/${username}/browse?type=anime&itemtype=movie` : "/firstSignUp")}><a className="text-text-secondary hover:text-primary transition-colors flex items-center gap-2 cursor-pointer"><span className="material-symbols-outlined text-base">movie</span>Movies</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-text-primary mb-3">Genre</h4>
                            <ul className="space-y-2 text-sm">
                                <li onClick={() => router.push(loggedIn ? `/user/${username}/browse?type=anime&genres=62` : "/firstSignUp")}><a className="text-text-secondary hover:text-primary transition-colors cursor-pointer" >Isekai</a></li>
                                <li onClick={() => router.push(loggedIn ? `/user/${username}/browse?type=anime&genres=72` : "/firstSignUp")}><a className="text-text-secondary hover:text-primary transition-colors cursor-pointer" >Reincarnation</a></li>
                                <li onClick={() => router.push(loggedIn ? `/user/${username}/browse?type=anime&genres=36` : "/firstSignUp")}><a className="text-text-secondary hover:text-primary transition-colors cursor-pointer" >Slice of life</a></li>
                                <li onClick={() => router.push(loggedIn ? `/user/${username}/browse?type=anime&genres=22` : "/firstSignUp")}><a className="text-text-secondary hover:text-primary transition-colors cursor-pointer" >Romance</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-text-primary mb-3">Link</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a className="text-text-secondary hover:text-primary transition-colors cursor-pointer" onClick={() => router.push("https://youtube.com/@gamewithcode?si=EZX4LpIbZKJX60lV")}>Youtube</a></li>
                                <li><a className="text-text-secondary hover:text-primary transition-colors cursor-pointer" onClick={() => router.push("https://www.instagram.com/game_withcode?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==")}>Instagram</a></li>

                            </ul>
                        </div>
                    </div>
                    <div className="mt-8 pt-6 border-t border-border-color/50 text-center text-sm text-text-secondary">
                        <p>© 2024 AniWatchList. All rights reserved. Create By Game With Code.</p>
                    </div>
                </div>
            </footer>
        </>
    )
}

export default Footer
