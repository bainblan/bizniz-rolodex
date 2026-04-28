"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/app/components/navbar";
import { BiznizCard } from "@/app/components/biznizcard";
import { supabase, isSupabaseConfigured } from "@/app/libs/supabase";

// --- Icons ---

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
  primary_color?: string; // top-panel color for the two-tone demo card layout
  qr_code_url: string;
}

interface RolodexCardData {
  rolodex_entry_id: number; // int8 id of rolodex_entry row
  scanned_user_id: string;  // the user_id of the card owner whose card will be displayed
  card: BusinessCardData;   // the actual business card to be displayed
}

// Shown on the rolodex page to signed-out visitors so the page has content.
const DEMO_CARDS: RolodexCardData[] = [
  {
    rolodex_entry_id: -1,
    scanned_user_id: "demo-acme",
    card: {
      user_id: "demo-acme",
      company_name: "Acme Design Co",
      tagline: "Brand & product design",
      first_name: "Jane",
      last_name: "Doe",
      phone: "(555) 123-4567",
      email: "jane@acmedesign.co",
      website: "acmedesign.co",
      card_color: "#400068",
      primary_color: "#d9c7ec",
      qr_code_url: "https://bizniz.example/rolodex?username=janedoe",
    },
  },
  {
    rolodex_entry_id: -2,
    scanned_user_id: "demo-pixel",
    card: {
      user_id: "demo-pixel",
      company_name: "Pixel Forge",
      tagline: "Indie game studio",
      first_name: "Mike",
      last_name: "Chen",
      phone: "(555) 246-8013",
      email: "mike@pixelforge.io",
      website: "pixelforge.io",
      card_color: "#1e3a8a",
      primary_color: "#c7d4ec",
      qr_code_url: "https://bizniz.example/rolodex?username=mikechen",
    },
  },
  {
    rolodex_entry_id: -3,
    scanned_user_id: "demo-greenbean",
    card: {
      user_id: "demo-greenbean",
      company_name: "GreenBean Coffee",
      tagline: "Small-batch roasters",
      first_name: "Sarah",
      last_name: "Johnson",
      phone: "(555) 369-2580",
      email: "sarah@greenbean.co",
      website: "greenbean.co",
      card_color: "#1f5f3a",
      primary_color: "#c7ecd4",
      qr_code_url: "https://bizniz.example/rolodex?username=sarahj",
    },
  },
  {
    rolodex_entry_id: -4,
    scanned_user_id: "demo-quantum",
    card: {
      user_id: "demo-quantum",
      company_name: "Quantum Labs",
      tagline: "AI research consultancy",
      first_name: "Alex",
      last_name: "Rivera",
      phone: "(555) 482-7391",
      email: "alex@quantumlabs.ai",
      website: "quantumlabs.ai",
      card_color: "#7f1d1d",
      primary_color: "#ecc7c7",
      qr_code_url: "https://bizniz.example/rolodex?username=alexr",
    },
  },
];

// --- Components ---

export default function Rolodex() {
  const [cards, setCards] = useState<RolodexCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    async function fetchCards() {
      const scannedUsername = new URLSearchParams(window.location.search).get("username");

      // Signed-out visitors (no scanned-card link) see demo cards instead of an empty page.
      if (!scannedUsername) {
        if (!isSupabaseConfigured) {
          setCards(DEMO_CARDS);
          setIsDemo(true);
          setLoading(false);
          return;
        }

        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setCards(DEMO_CARDS);
          setIsDemo(true);
          setLoading(false);
          return;
        }
      }

      if (!isSupabaseConfigured) {
        setLoading(false);
        return;
      }

      if (scannedUsername) {
        const profileResult = await supabase
            .from("profiles")
            .select("user_id")
            .eq("username", scannedUsername)
            .single();

        if (profileResult.error) {
          console.error("Error fetching scanned profile:", profileResult.error);
          setCards([]);
          setLoading(false);
          return;
        }

        const cardResult = await supabase
            .from("business_cards")
            .select("*")
            .eq("user_id", profileResult.data.user_id)
            .single();

        if (cardResult.error) {
          console.error("Error fetching scanned business card:", cardResult.error);
          setCards([]);
          setLoading(false);
          return;
        }

        setCards([
          {
            rolodex_entry_id: 0,
            scanned_user_id: profileResult.data.user_id,
            card: cardResult.data,
          },
        ]);

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

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-[#4a4a4a] pb-8">
      {/* Navbar */}
      <Navbar />

      {/* Page Header - Restored Centering and Spacing */}
      <div className="flex flex-col items-center gap-2.5 w-full max-w-[393px] px-4 mt-8">
        <h1 className="text-[32px] font-bold text-center text-white fade-in-up fade-in-up-1">
          {isDemo ? <span className="italic">Rolodex</span> : <>Your <span className="italic">Rolodex</span></>}
        </h1>
        <p className="text-base text-center text-white/60 fade-in-up fade-in-up-2">
          {loading
            ? "Loading..."
            : isDemo
              ? "Build a searchable Rolodex of business cards, contacts, and opportunities."
              : `${cards.length} cards collected`}
        </p>

        {/* Search Bar - Restored Original Style */}
        <div className="flex items-center w-full rounded-lg bg-white px-2.5 py-3 gap-2 fade-in-up fade-in-up-3">
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
        {!loading && cards.map((entry, index) => (
          <div
            key={entry.rolodex_entry_id}
            className="fade-in-up w-full flex justify-center"
            style={{ animationDelay: `${0.4 + index * 0.1}s` }}
          >
            <BiznizCard card={entry.card} />
          </div>
        ))}
      </div>
    </div>
  );
}