"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase, isSupabaseConfigured } from "@/app/libs/supabase";

// --- Icons ---

function MenuIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
      <path d="M3 6h18M3 12h18M3 18h18" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
      <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1.003 1.003 0 011.01-.24c1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.1.31.03.66-.25 1.02l-2.2 2.2z" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
    </svg>
  );
}

function WebsiteIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-.61.08-1.21.21-1.78L8.99 15v1c0 1.1.9 2 2 2v1.93C7.06 19.43 4 16.07 4 12zm13.89 5.4c-.26-.81-1-1.4-1.9-1.4h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41C18.92 5.98 20 8.82 20 12c0 2.08-.67 4-1.81 5.56l-.3-.16z" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" stroke="black" strokeOpacity="0.25" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// --- Types ---

interface BusinessCardData {
  user_id: string; // user_is of the card owner from auth.users.id
  company_name: string;
  tagline: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  website: string;
  card_color: string;
  qr_code_url: string;
}

interface RolodexCardData {
  rolodex_entry_id: number; // int8 id of rolodex_entry row
  scanned_user_id: string;  // the user_id of the card owner whose card will be displayed
  card: BusinessCardData;   // the actual business card to be displayed
}

// --- Components ---

function BusinessCard({ card }: { card: BusinessCardData }) {
  return (
    <div
      className="flex items-center justify-between w-[365px] h-[209px] px-6 py-7 shrink-0"
      style={{ backgroundColor: card.card_color }}
    >
      <div className="flex flex-col justify-between h-full w-[151px]">
        <div className="text-white">
          <p className="text-xl font-bold leading-normal">{card.company_name}</p>
          <p className="text-xs font-semibold leading-normal">{card.tagline}</p>
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex gap-2.5 text-xs font-semibold text-white">
            <span>{card.first_name}</span>
            <span>{card.last_name}</span>
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2.5">
              <PhoneIcon />
              <span className="text-xs text-white">{card.phone}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <EmailIcon />
              <span className="text-xs text-white">{card.email}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <WebsiteIcon />
              <span className="text-xs text-white">{card.website}</span>
            </div>
          </div>
        </div>
      </div>
      <Image
        src={card.qr_code_url || "/sample-qr.png"}
        alt="QR Code"
        width={153}
        height={153}
        className="object-cover"
      />
    </div>
  );
}

export default function Rolodex() {
  const [cards, setCards] = useState<RolodexCardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCards() {
      if (!isSupabaseConfigured) {
        setLoading(false);
        return;
      }

      const { data : entries, error : entryError } = await supabase
        .from("rolodex_entries") // pull rolodex entry data from rolodex_entries
        .select("rolodex_entry_id, scanned_user_id, created_at") // grab relevant columns
        .order("created_at", { ascending: false }); // order by creation time

      if (entryError) { // stop and return is supabase can't fetch the user's rolodex entries
        console.error("Error fetching rolodex entries:", entryError);
        setLoading(false); // stop loading because theres nothing else to fetch
        return;
      }

      // build array of user ids mapped from rolodex_entries data
      const scannedUserIds = entries?.map((entry) => entry.scanned_user_id) ?? [];

      if (scannedUserIds.length === 0) { // if there array returns empty
        setCards([]);                    // set cards to empty
        setLoading(false);         // stop loading because theres nothing else to fetch
        return;
      }

      // get business cards that belong to the scanned users
      const { data : cards, error: cardsError } = await supabase
        .from("business_cards")          // from the business cards table
        .select("*")                    // get all collumns for each matching row
        .in("user_id", scannedUserIds);  // only gets cards whose user id is in scannedUserIds

      if (cardsError) { // if there's an error retreaving the cards, display error to user and stop.
        console.error("Error fetching business cards:", cardsError);
        setLoading(false); // stop loading because theres nothing else to fetch
        return;
      }

      // create map so each scanned_user_id can find its matching business card
      const cardsByUserId = new Map((cards ?? []).map((card) => [card.user_id, card]));

      // pair each business card with the entry associated with its scanned_user_id.
      const mappedCards =
          entries
              // find the nusiness card that is associated with the rolodex entry's scanned user
              ?.map((entry) => {
                const card = cardsByUserId.get(entry.scanned_user_id);

                return { // return rolodex entry data plus card data
                  rolodex_entry_id: entry.rolodex_entry_id,
                  scanned_user_id: entry.scanned_user_id,
                  card,
                };
              })

      setCards(mappedCards); // store mapped cards in React state
      setLoading(false); // set loading false one data is done loading
    }

    fetchCards();
  }, []);

  const buttonStyles = "rounded-lg border border-white bg-[#b06bff] px-6 py-1.5 text-base font-semibold text-white hover:bg-[#9a50f0] transition-colors";

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-[#4a4a4a] pb-8">
      {/* Navbar - Restored Original Styling */}
      <nav className="flex items-center justify-between w-full px-2.5">
        <Link href="/" className="flex items-center gap-3 px-1 py-1.5">
          <MenuIcon />
          <span className="text-2xl font-bold italic text-white">
            BIZNIZ
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/rolodex" className={buttonStyles}>
            Rolodex
          </Link>
          <Link href="/signup" className={buttonStyles}>
            Signup
          </Link>
          <Link href="/login" className={buttonStyles}>
            Login
          </Link>
        </div>
      </nav>

      {/* Page Header - Restored Centering and Spacing */}
      <div className="flex flex-col items-center gap-2.5 w-full max-w-[393px] px-4 mt-8">
        <h1 className="text-[32px] font-bold text-center text-white">
          Your <span className="italic">Rolodex</span>
        </h1>
        <p className="text-base text-center text-white/60">
          {loading ? "Loading..." : `${cards.length} cards collected`}
        </p>

        {/* Search Bar - Restored Original Style */}
        <div className="flex items-center w-full rounded-lg bg-white px-2.5 py-3 gap-2">
          <SearchIcon />
          <input
            type="text"
            placeholder="Search cards..."
            className="flex-1 text-lg text-black placeholder:text-black/25 outline-none bg-transparent"
          />
        </div>
      </div>

      {/* Cards List */}
      <div className="flex flex-col items-center gap-4 mt-6 w-full px-4">
        {!loading && cards.map((entry) => ( // once loading is finished loop through the entries array
          <BusinessCard key={entry.rolodex_entry_id} card={entry.card} /> // create a business card component with rolodex_entry_id as the key
        ))}
      </div>
    </div>
  );
}