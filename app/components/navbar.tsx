"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase, isSupabaseConfigured } from "@/app/libs/supabase";

const buttonStyles =
  "rounded-lg border border-white bg-[#b06bff] px-3 sm:px-6 py-1.5 text-sm sm:text-base font-semibold text-white whitespace-nowrap hover:bg-[#9a50f0] transition-colors";

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
    <nav className="flex items-center justify-between w-full px-2.5 py-2 gap-2 fade-in-up fade-in-up-0">
      <Link
        href="/"
        className="flex items-center px-1 py-1.5 min-w-0"
      >
        <span className="text-xl sm:text-2xl font-bold italic text-white">
          BIZNIZ
        </span>
      </Link>
      <div className="flex items-center gap-1.5 sm:gap-2">
        <Link href="/rolodex" className={buttonStyles}>
          Rolodex
        </Link>
        {isAuthed ? (
          <>
            <Link href="/create" className={buttonStyles}>
              My Card
            </Link>
            <button type="button" onClick={handleSignOut} className={buttonStyles}>
              Sign Out
            </button>
          </>
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
