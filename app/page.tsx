"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/app/components/navbar";
import { BiznizCard } from "@/app/components/biznizcard";
import { supabase, isSupabaseConfigured } from "@/app/libs/supabase";

function ArrowDownIcon() {
  return (
    <svg width="57" height="57" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 11l4 4 4-4M12 8v7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Home() {

  // create empty state variable to hold entered business name
  // create setter function to update businessName
  const [businessName, setBusinessName] = useState("");
  const [isAuthed, setIsAuthed] = useState(false);
  const [hasCard, setHasCard] = useState(false);
  const [authLoaded, setAuthLoaded] = useState(false);

  const whatIsRef = useRef<HTMLElement>(null);
  const [whatIsInView, setWhatIsInView] = useState(false);

  useEffect(() => {
    const el = whatIsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setWhatIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  //get Next.js router object
  const router = useRouter();

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setAuthLoaded(true);
      return;
    }

    async function loadAuthState(userId: string | undefined) {
      if (!userId) {
        setIsAuthed(false);
        setHasCard(false);
        setAuthLoaded(true);
        return;
      }

      setIsAuthed(true);
      const { data, error } = await supabase
        .from("business_cards")
        .select("user_id")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) {
        console.error("Error checking for existing business card:", error);
      }
      setHasCard(!!data);
      setAuthLoaded(true);
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      loadAuthState(session?.user?.id);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthLoaded(false);
      loadAuthState(session?.user?.id);
    });

    return () => subscription.unsubscribe();
  }, []);

    /* handle submit runs when user enters business name and clicks start now.
       It prevents the browser from refreshing or reloding the page and takes the
       business name entered, trims whitespace, and uses Next.js router to navegate
       the user to the /create page.
       If a business name was entered, it appends the value to the URL as a query
       parameter, and the create page reads it and fills in the company field
    */
    function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
      e.preventDefault(); // prevent default submission behavior

      // trim business name and store in trimmed
      const trimmed = businessName.trim();

      if (trimmed) { // check if trimmed is not empty
        router.push(`/create?businessName=${encodeURIComponent(trimmed)}`);
      } else { // if empty just run plain create url
        router.push("/create");
      }
    }

  return (
    <div className="flex flex-col items-center w-full bg-white">
      {/* Hero / Landing Section */}
      <section className="flex flex-col items-center justify-between w-full min-h-screen bg-[#4a4a4a] overflow-hidden">
        {/* Navbar */}
        <Navbar />

        {/* Hero Content */}
        <div className="flex flex-col items-center gap-2.5 w-full max-w-[373px] px-4">
          <h1 className="text-[32px] font-bold text-center text-white fade-in-up fade-in-up-1">
            Welcome to <span className="italic">BIZNIZ</span>
          </h1>
          <p className="text-2xl text-center text-white fade-in-up fade-in-up-2">
            Digital Business Cards
          </p>
            {authLoaded && isAuthed ? (
              <Link
                href="/create"
                className="w-full rounded-lg bg-[#b06bff] py-[18px] text-xl font-bold text-white hover:bg-[#9a50f0] transition-colors text-center fade-in-up fade-in-up-3"
              >
                {hasCard ? "View and Edit My Card" : "Create My Card"}
              </Link>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-2.5 w-full">
                <input
                  type="text"
                  placeholder="Enter Your Business Name"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full rounded-lg bg-white px-2.5 py-4 text-xl text-black placeholder:text-black/25 outline-none fade-in-up fade-in-up-3"
                />
                <button
                  type="submit"
                  className="w-full rounded-lg bg-[#b06bff] py-[18px] text-xl font-bold text-white hover:bg-[#9a50f0] transition-colors text-center fade-in-up fade-in-up-4"
                >
                  Start Now
                </button>
              </form>
            )}
        </div>

        {/* Scroll Down Arrow */}
        <div className="pb-4 fade-in-up fade-in-up-5">
          <ArrowDownIcon />
        </div>
      </section>

      {/* What Is BIZNIZ Section */}
      <section
        ref={whatIsRef}
        className={`flex flex-col items-center gap-10 sm:gap-12 w-full py-12 sm:py-20 bg-white overflow-hidden ${whatIsInView ? "in-view" : ""}`}
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-black text-center px-4 fade-on-scroll fade-in-up-1">
          WHAT IS BIZNIZ?
        </h2>

        {/* How It Works + Example Card Row */}
        <div className="flex flex-col md:flex-row items-center md:items-center justify-center gap-10 md:gap-12 w-full max-w-[800px] px-4">
          <div className="flex flex-col items-start gap-8 sm:gap-12 md:gap-16 w-full md:flex-1">
            <div className="flex items-center gap-4 fade-on-scroll fade-in-up-2">
              <div className="w-16 h-16 rounded-full bg-[#b06bff] flex items-center justify-center shrink-0">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1.003 1.003 0 000-1.42l-2.34-2.34a1.003 1.003 0 00-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z" />
                </svg>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-bold text-black">Create</h3>
                <p className="text-sm text-black/60">Design your digital business card in minutes</p>
              </div>
            </div>
            <div className="flex items-center gap-4 fade-on-scroll fade-in-up-3">
              <div className="w-16 h-16 rounded-full bg-[#b06bff] flex items-center justify-center shrink-0">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                  <path d="M3 3v8h8V3H3zm6 6H5V5h4v4zm-6 4v8h8v-8H3zm6 6H5v-4h4v4zm4-16v8h8V3h-8zm6 6h-4V5h4v4zm-6 4v8h8v-8h-8zm6 6h-4v-4h4v4z" />
                </svg>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-bold text-black">Share</h3>
                <p className="text-sm text-black/60">Let anyone scan your unique QR code</p>
              </div>
            </div>
            <div className="flex items-center gap-4 fade-on-scroll fade-in-up-4">
              <div className="w-16 h-16 rounded-full bg-[#b06bff] flex items-center justify-center shrink-0">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                </svg>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-bold text-black">Connect</h3>
                <p className="text-sm text-black/60">They save you straight to their digital rolodex</p>
              </div>
            </div>
          </div>

          {/* Example Business Card */}
          <div className="w-full max-w-[360px] fade-on-scroll fade-in-up-5">
            <BiznizCard
              card={{
                company_name: "CompanyName",
                tagline: "OptionalTagline",
                first_name: "FirstName",
                last_name: "LastName",
                phone: "pho-nen-umber",
                email: "email@address",
                website: "website.url",
                card_color: "#400068",
                primary_color: "#d9c7ec",
                qr_code_url: "https://bizniz.example",
              }}
            />
          </div>
        </div>

        {/* Description */}
        <p className="w-full max-w-[550px] text-lg font-medium text-black/60 text-center px-4 fade-on-scroll fade-in-up-6">
          Inspired by Linktree, Bizniz allows you to make your own digital
          business card that anyone can scan and have in their digital wallet.
          Go to a hackathon, a conference, or a networking event — instead of
          handing out paper cards that get tossed or resumes with nowhere to go,
          just let them scan your code. Your info lands right in their rolodex,
          ready when they need it.
        </p>

        <Link
          href="/rolodex"
          className="rounded-lg border border-white bg-[#b06bff] px-8 sm:px-10 py-4 text-base sm:text-lg font-semibold text-white hover:bg-[#9a50f0] transition-colors text-center fade-on-scroll fade-in-up-7"
        >
          View Your Rolodex
        </Link>
      </section>

      {/* Footer */}
      <footer className="flex flex-col sm:flex-row items-center justify-between gap-2 w-full px-4 sm:px-8 py-6 bg-[#4a4a4a] text-center sm:text-left">
        <span className="text-lg font-bold italic text-white">BIZNIZ</span>
        <span className="text-xs sm:text-sm text-white/60">&copy; 2026 Bizniz. All rights reserved.</span>
      </footer>
    </div>
  );
}
