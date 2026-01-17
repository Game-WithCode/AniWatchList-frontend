"use client"

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getCategory } from "@/lib/hooks/getType"
import Sample from './components/topSample';
import { TopManga } from '@/lib/hooks/topManga';
import { TopAnime } from '@/lib/hooks/topAnime';
import { useSession } from "next-auth/react";
export default function Home() {
  const [TopAnimeData, setTopAnimeData] = useState([]);
  const [TopMangaData, setTopMangaData] = useState([]);
  const [error, setError] = useState(null);
  const [QuestionId, setQuestionId] = useState(null);
    const { data: session, status } = useSession();

  useEffect(() => {

    const fetchTop = async () => {
      // 1. Fetch both in parallel for speed
      const [animeRes, mangaRes] = await Promise.all([TopAnime(), TopManga()]);

      // 2. Helper function to format data cleanly
      const formatData = (list) => list.slice(0, 11).map(item => ({
        mal_Id: item.mal_id,
        title: item.title_english || item.title, // Fallback if english title is null
        description: item.synopsis,
        Genre: item.genres.map((i) => i.name),
        Scores: item.score,
        Images: item.images.webp.large_image_url,
        type: getCategory(item.type),
        RawType: item.type
      }));

      // 3. Set state correctly (replacing the array, not mutating it)
      setTopAnimeData(formatData(animeRes.data));
      setTopMangaData(formatData(mangaRes.data));
    

    }
    fetchTop()



  }, [])
  const Question = [
    {
      id: 1,
      question: "How do I create an account?",
      answer: "To create an account, click on the 'log In' button on the navbar and then click on sign up and fill out the registration form with your details."
    },
    {
      id: 2,
      question: "How to Save anime in Watch List?",
      answer: "To save an anime to your Watch List, navigate to the anime's page and click on the 'Add to Watch List' button."
    },
    {
      id: 3,
      question: "Can I sync my watchlist across devices?",
      answer: "Yes, by logging into your account on different devices, your watchlist will be synced automatically."
    },
    {
      id: 4,
      question: "How do I add an anime or manga to my list?",
      answer: "To add an anime or manga to your list, go to the title's page and select the appropriate option to add it to your watchlist or reading list."
    }
  ]
 useEffect(() => {
    if (status === "authenticated") {
console.log(session);
console.log("UserName from session:", session.user?.name);
router.push(`/user/${session.user?.name}`);
    } 
  }, [session, status]);



  const [name, setName] = useState("");
  function aniName(e) {
    setName(e.target.value);

  }
  const searchHandler = () => {
    if (name) {
      router.push(`/Search/${name}?page=1`)
    }
  }
  const router = useRouter()


  return (
    <>
      <header className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <img alt="Anime Landscape Background" className="w-full h-full object-cover opacity-60 scale-105" src="Images/scenery2.jpg" />
          <div className="absolute inset-0 bg-linear-to-t from-bgprimary via-bgprimary/70 to-teal-900/20 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-linear-to-b from-bgprimary/40 to-transparent"></div>
        </div>
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto flex flex-col items-center">
          <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tight leading-none text-glow drop-shadow-2xl">
            Anime Suggestion
          </h1>
          <p className="text-lg md:text-xl text-slate-200 mb-10 max-w-3xl font-medium leading-relaxed drop-shadow-md text-opacity-90">
            Your ultimate destination for tracking and discovering your favorite anime and manga series. Stay organized and never miss an episode or chapter again!
          </p>
          <div className="flex flex-col items-center gap-4 group cursor-pointer">
            <button className="w-20 h-20 rounded-full bg-bgsecondary text-bgprimary flex items-center justify-center shadow-[0_0_40px_rgba(45,212,191,0.5)] group-hover:scale-110 group-hover:shadow-[0_0_60px_rgba(45,212,191,0.7)] transition-all duration-300 border-4 border-bgprimary/20 backdrop-blur-sm" onClick={() => router.push('/login')}>
              <span className="material-symbols-outlined text-4xl font-bold group-hover:rotate-90 transition-transform duration-300">add</span>
            </button>
            <span className="text-bgsecondary font-bold uppercase tracking-[0.2em] text-sm opacity-80 group-hover:opacity-100 transition-opacity">Get Started</span>
          </div>
        </div>
      </header>

      {/* this is end of filter section */}

      <Sample slider={TopAnimeData} itemType={"anime"} />
      <Sample slider={TopMangaData} itemType={"manga"} />


      {/* section for fAQ  */}
      <section className="max-w-7xl mx-auto px-6 py-24 border-t border-white/5 mt-12 bg-slate-950/30">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="relative h-[450px] flex items-center justify-center">
            <div className="absolute inset-0 bg-bgsecondary/10 blur-[120px] rounded-full"></div>
            <div className="absolute top-0 right-0 text-white/5 text-[200px] font-black leading-none select-none z-0">?</div>
            <div className="absolute bottom-10 left-10 text-bgsecondary/10 text-[150px] font-black leading-none select-none z-0 -rotate-12">!</div>
            <div className="relative z-10 w-full h-full flex items-center justify-center animate-float">
              <img alt="FAQ Mascot" className="" style={{ maskImage: "linear-gradient(to bottom, black 80%, transparent 100%)" }} src="Images/FAQLogo.png" />
              <div className="absolute top-[20%] right-[20%] bg-bgsecondary text-bgprimary w-12 h-12 rounded-full flex items-center justify-center font-bold text-2xl shadow-lg shadow-bgsecondary/40 animate-pulse">?</div>
              <div className="absolute bottom-[30%] left-[20%] bg-slate-800 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl shadow-lg border border-white/10">?</div>
            </div>
          </div>
          <div>
            <h2 className="text-4xl font-bold text-white mb-3">Frequently Asked Questions</h2>
            <p className="text-slate-400 mb-12 text-lg">Everything you need to know about getting started.</p>
            <div className="space-y-4">
              {
                Question.map((item) => (

                  <div key={item.id} className="border border-textcolor/50 rounded-2xl p-0 overflow-hidden group">
                    <button className="flex items-center justify-between w-full p-6 text-left focus:outline-none">
                      <span className="text-xm md:text-lg font-semibold text-slate-200 group-hover:text-bgsecondary transition-colors">{item.question}</span>
                      <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-bgsecondary group-hover:text-bgprimary transition-all duration-300" onClick={() => setQuestionId(QuestionId === item.id ? null : item.id)}>
                        <span className="material-symbols-outlined text-sm p-1">
                          {
                            QuestionId === item.id ? 'remove' : 'add'
                          }
                        </span>
                      </span>
                    </button>
                    {
                      QuestionId === item.id && (
                        <div className="px-6 pb-6 bg-navy-light/40">
                          <p className="text-slate-400 leading-relaxed text-sm md:text-base">
                            {item.answer}
                          </p>
                        </div>)
                    }

                  </div>


                ))
              }
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
