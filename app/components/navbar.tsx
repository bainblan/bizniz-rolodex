"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase, isSupabaseConfigured } from "@/app/libs/supabase";

function MenuIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
      <path d="M3 6h18M3 12h18M3 18h18" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

const buttonStyles =
  "rounded-lg border border-white bg-[#b06bff] px-6 py-1.5 text-base font-semibold text-white hover:bg-[#9a50f0] transition-colors";

export function Navbar() {
  const router = useRouter();
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthed(!!session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthed(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <nav className="flex items-center justify-between w-full px-2.5">
      <Link href="/" className="flex items-center gap-3 px-1 py-1.5">
        <MenuIcon />
        <span className="text-2xl font-bold italic text-white">BIZNIZ</span>
      </Link>
      <div className="flex items-center gap-2">
        <Link href="/rolodex" className={buttonStyles}>
          Rolodex
        </Link>
        {isAuthed ? (
          <button type="button" onClick={handleSignOut} className={buttonStyles}>
            Sign Out
          </button>
        ) : (
          <>
            <Link href="/signup" className={buttonStyles}>
              Signup
            </Link>
            <Link href="/login" className={buttonStyles}>
              Login
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
