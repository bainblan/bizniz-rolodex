"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AuthModal } from "@/app/components/authmodal";
import { Navbar } from "@/app/components/navbar";
import { BiznizCard } from "@/app/components/biznizcard";
import { supabase, isSupabaseConfigured } from "@/app/libs/supabase";

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
        stroke="black"
        strokeOpacity="0.25"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

interface BusinessCardData {
  user_id: string;
  company_name: string;
  tagline: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  website: string;
  secondary_color?: string | null;
  primary_color?: string | null;
  card_color?: string | null; // legacy fallback for older rows
  qr_code_url: string;
  image_url?: string | null;
}

interface RolodexCardData {
  rolodex_entry_id: number;
  scanned_user_id: string;
  card: BusinessCardData;
}

interface RolodexEntryRow {
  rolodex_entry_id: number;
  scanned_user_id: string;
}

type ScanNotice =
  | {
      kind: "success";
      message: string;
    }
  | {
      kind: "signin";
      message: string;
    };

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
      secondary_color: "#400068",
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
      secondary_color: "#1e3a8a",
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
      secondary_color: "#1f5f3a",
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
      secondary_color: "#7f1d1d",
      primary_color: "#ecc7c7",
      qr_code_url: "https://bizniz.example/rolodex?username=alexr",
    },
  },
];

export default function Rolodex() {
  const [cards, setCards] = useState<RolodexCardData[]>([]);
  const [remainingCards, setRemainingCards] = useState<RolodexCardData[]>([]);
  const [scannedCardEntry, setScannedCardEntry] = useState<RolodexCardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);
  const [isScanMode, setIsScanMode] = useState(false);
  const [showRemainingRolodex, setShowRemainingRolodex] = useState(false);
  const [collectedCount, setCollectedCount] = useState(0);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [scanNotice, setScanNotice] = useState<ScanNotice | null>(null);
  const [isNoticeVisible, setIsNoticeVisible] = useState(false);
  const [pendingScannedUserId, setPendingScannedUserId] = useState<string | null>(null);
  const hideNoticeTimeoutRef = useRef<number | null>(null);

  const clearNoticeTimeout = useCallback(() => {
    if (hideNoticeTimeoutRef.current !== null) {
      window.clearTimeout(hideNoticeTimeoutRef.current);
      hideNoticeTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      clearNoticeTimeout();
    };
  }, [clearNoticeTimeout]);

  const showScanNotice = useCallback(
    (notice: ScanNotice, autoHide: boolean) => {
      clearNoticeTimeout();
      setScanNotice(notice);
      setIsNoticeVisible(true);

      if (!autoHide) {
        return;
      }

      hideNoticeTimeoutRef.current = window.setTimeout(() => {
        setIsNoticeVisible(false);
        hideNoticeTimeoutRef.current = null;
      }, 2500);
    },
    [clearNoticeTimeout]
  );

  const showCardAddedNotice = useCallback(() => {
    showScanNotice(
      {
        kind: "success",
        message: "Card added to Rolodex",
      },
      true
    );
  }, [showScanNotice]);

  const fetchOwnerRolodexCards = useCallback(async (ownerUserId: string) => {
    const { data: entries, error: entryError } = await supabase
      .from("rolodex_entries")
      .select("rolodex_entry_id, scanned_user_id")
      .eq("owner_user_id", ownerUserId)
      .order("created_at", { ascending: false });

    if (entryError) {
      console.error("Error fetching rolodex entries:", entryError);
      return null;
    }

    const scannedUserIds = entries?.map((entry) => entry.scanned_user_id) ?? [];

    if (scannedUserIds.length === 0) {
      return [];
    }

    const { data: businessCards, error: cardsError } = await supabase
      .from("business_cards")
      .select("*")
      .in("user_id", scannedUserIds);

    if (cardsError) {
      console.error("Error fetching business cards:", cardsError);
      return null;
    }

    const cardsByUserId = new Map(
      (businessCards ?? []).map((card) => [card.user_id, card as BusinessCardData])
    );

    return (entries ?? [])
      .map((entry: RolodexEntryRow) => {
        const card = cardsByUserId.get(entry.scanned_user_id);

        if (!card) {
          return null;
        }

        return {
          rolodex_entry_id: entry.rolodex_entry_id,
          scanned_user_id: entry.scanned_user_id,
          card,
        };
      })
      .filter((entry): entry is RolodexCardData => entry !== null);
  }, []);

  const applyStandardRolodexView = useCallback(
    (ownerCards: RolodexCardData[]) => {
      clearNoticeTimeout();
      setCards(ownerCards);
      setRemainingCards([]);
      setScannedCardEntry(null);
      setPendingScannedUserId(null);
      setScanNotice(null);
      setIsNoticeVisible(false);
      setIsDemo(false);
      setIsScanMode(false);
      setShowRemainingRolodex(false);
      setCollectedCount(ownerCards.length);
    },
    [clearNoticeTimeout]
  );

  const applyScannedRolodexView = useCallback(
    (currentScannedCard: RolodexCardData, ownerCards: RolodexCardData[] = []) => {
      const currentCard =
        ownerCards.find((entry) => entry.scanned_user_id === currentScannedCard.scanned_user_id) ??
        currentScannedCard;
      const otherCards = ownerCards.filter(
        (entry) => entry.scanned_user_id !== currentScannedCard.scanned_user_id
      );

      setCards([currentCard]);
      setRemainingCards(otherCards);
      setScannedCardEntry(currentCard);
      setPendingScannedUserId(currentCard.scanned_user_id);
      setIsDemo(false);
      setIsScanMode(true);
      setShowRemainingRolodex(false);
      setCollectedCount(ownerCards.length > 0 ? ownerCards.length : 1);
    },
    []
  );

  const saveScannedCard = useCallback(
    async (currentUserId: string, scannedUserId: string) => {
      const existingEntryResult = await supabase
        .from("rolodex_entries")
        .select("rolodex_entry_id")
        .eq("owner_user_id", currentUserId)
        .eq("scanned_user_id", scannedUserId)
        .limit(1);

      if (existingEntryResult.error) {
        console.error("Error checking rolodex entry:", existingEntryResult.error);
        return false;
      }

      if ((existingEntryResult.data ?? []).length === 0) {
        const insertResult = await supabase.from("rolodex_entries").insert({
          owner_user_id: currentUserId,
          scanned_user_id: scannedUserId,
        });

        if (insertResult.error) {
          console.error("Error saving scanned card:", insertResult.error);
          return false;
        }
      }

      showCardAddedNotice();
      return true;
    },
    [showCardAddedNotice]
  );

  const handleAuthSuccess = useCallback(async () => {
    setAuthModalOpen(false);

    if (!pendingScannedUserId || !scannedCardEntry) {
      return;
    }

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      console.error("Error loading authenticated user:", error);
      return;
    }

    const savedSuccessfully = await saveScannedCard(user.id, pendingScannedUserId);
    if (!savedSuccessfully) {
      return;
    }

    const ownerCards = await fetchOwnerRolodexCards(user.id);
    if (ownerCards === null) {
      applyScannedRolodexView(scannedCardEntry);
      return;
    }

    applyScannedRolodexView(scannedCardEntry, ownerCards);
  }, [
    applyScannedRolodexView,
    fetchOwnerRolodexCards,
    pendingScannedUserId,
    saveScannedCard,
    scannedCardEntry,
  ]);

  useEffect(() => {
    async function fetchCards() {
      const scannedUsername = new URLSearchParams(window.location.search).get("username");

      if (!scannedUsername) {
        clearNoticeTimeout();
        setIsNoticeVisible(false);
        setScanNotice(null);
        setPendingScannedUserId(null);
        setRemainingCards([]);
        setScannedCardEntry(null);
        setShowRemainingRolodex(false);
        setIsScanMode(false);

        if (!isSupabaseConfigured) {
          setCards(DEMO_CARDS);
          setCollectedCount(DEMO_CARDS.length);
          setIsDemo(true);
          setLoading(false);
          return;
        }

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          setCards(DEMO_CARDS);
          setCollectedCount(DEMO_CARDS.length);
          setIsDemo(true);
          setLoading(false);
          return;
        }

        const ownerCards = await fetchOwnerRolodexCards(session.user.id);
        if (ownerCards === null) {
          setLoading(false);
          return;
        }

        applyStandardRolodexView(ownerCards);
        setLoading(false);
        return;
      }

      setIsDemo(false);
      setIsScanMode(true);
      setShowRemainingRolodex(false);
      setRemainingCards([]);

      if (!isSupabaseConfigured) {
        setLoading(false);
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

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

      const scannedUserId = profileResult.data.user_id;
      const cardResult = await supabase
        .from("business_cards")
        .select("*")
        .eq("user_id", scannedUserId)
        .single();

      if (cardResult.error) {
        console.error("Error fetching scanned business card:", cardResult.error);
        setCards([]);
        setLoading(false);
        return;
      }

      const scannedEntry = {
        rolodex_entry_id: 0,
        scanned_user_id: scannedUserId,
        card: cardResult.data as BusinessCardData,
      };

      setScannedCardEntry(scannedEntry);
      setPendingScannedUserId(scannedUserId);

      if (session?.user) {
        const savedSuccessfully = await saveScannedCard(session.user.id, scannedUserId);

        if (savedSuccessfully) {
          const ownerCards = await fetchOwnerRolodexCards(session.user.id);

          if (ownerCards !== null) {
            applyScannedRolodexView(scannedEntry, ownerCards);
            setLoading(false);
            return;
          }
        }

        applyScannedRolodexView(scannedEntry);
        setLoading(false);
        return;
      }

      applyScannedRolodexView(scannedEntry);
      showScanNotice(
        {
          kind: "signin",
          message: "Would you like to sign in and save this card",
        },
        false
      );
      setLoading(false);
    }

    fetchCards();
  }, [
    applyScannedRolodexView,
    applyStandardRolodexView,
    clearNoticeTimeout,
    fetchOwnerRolodexCards,
    saveScannedCard,
    showScanNotice,
  ]);

  const countLabel = `${collectedCount} card${collectedCount === 1 ? "" : "s"} collected`;
  const showRemainingButton = isScanMode && remainingCards.length > 0 && !showRemainingRolodex;
  const displayedRemainingCards = isScanMode && showRemainingRolodex ? remainingCards : [];
  const shouldRenderNotice = isScanMode && scanNotice !== null;

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-[#4a4a4a] pb-8">
      <Navbar />

      <div className="flex flex-col items-center gap-2.5 w-full max-w-[393px] px-4 mt-8">
        <h1 className="text-[32px] font-bold text-center text-white fade-in-up fade-in-up-1">
          {isDemo ? <span className="italic">Rolodex</span> : <>Your <span className="italic">Rolodex</span></>}
        </h1>
        <p className="text-base text-center text-white/60 fade-in-up fade-in-up-2">
          {loading
            ? "Loading..."
            : isDemo
              ? "Build a searchable Rolodex of business cards, contacts, and opportunities."
              : countLabel}
        </p>

        <div className="flex items-center w-full rounded-lg bg-white px-2.5 py-3 gap-2 fade-in-up fade-in-up-3">
          <SearchIcon />
          <input
            type="text"
            placeholder="Search cards..."
            className="flex-1 text-lg text-black placeholder:text-black/25 outline-none bg-transparent"
          />
        </div>
      </div>

      <div
        className={`w-full px-4 flex justify-center overflow-hidden transition-[max-height,opacity,margin-top] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          shouldRenderNotice
            ? isNoticeVisible
              ? "mt-6 max-h-48 opacity-100"
              : "mt-0 max-h-0 opacity-0"
            : "mt-0 max-h-0 opacity-0"
        } ${isNoticeVisible ? "pointer-events-auto" : "pointer-events-none"}`}
      >
        {scanNotice && (
          <div
            className={`w-full max-w-[360px] rounded-[24px] bg-[#6f6f6f] px-5 py-4 shadow-lg transition-[opacity,transform] duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] ${
              isNoticeVisible ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
            }`}
          >
            <p className="text-center text-sm font-medium text-white">
              {scanNotice.message}
            </p>
            {scanNotice.kind === "signin" && (
              <button
                type="button"
                onClick={() => setAuthModalOpen(true)}
                className="mt-3 w-full rounded-lg bg-white py-3 text-base font-semibold text-[#4a4a4a] transition-colors hover:bg-white/90"
              >
                sign in and save
              </button>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col items-center gap-4 mt-6 w-full px-4">
        {!loading &&
          cards.map((entry, index) => (
            <div
              key={`${entry.rolodex_entry_id}-${entry.scanned_user_id}`}
              className="fade-in-up w-full flex justify-center"
              style={{ animationDelay: `${0.4 + index * 0.1}s` }}
            >
              <BiznizCard card={entry.card} />
            </div>
          ))}

        {!loading && showRemainingButton && (
          <div className="w-full max-w-[360px] flex justify-center">
            <button
              type="button"
              onClick={() => setShowRemainingRolodex(true)}
              className="w-full rounded-lg bg-white py-3 text-base font-semibold text-[#4a4a4a] transition-colors hover:bg-white/90"
            >
              View Remaining Rolodex
            </button>
          </div>
        )}

        {!loading &&
          displayedRemainingCards.map((entry, index) => (
            <div
              key={`${entry.rolodex_entry_id}-${entry.scanned_user_id}`}
              className="fade-in-up w-full flex justify-center"
              style={{ animationDelay: `${0.1 + index * 0.1}s` }}
            >
              <BiznizCard card={entry.card} />
            </div>
          ))}
      </div>

      {authModalOpen && (
        <AuthModal
          onClose={() => setAuthModalOpen(false)}
          onAuthed={() => {
            void handleAuthSuccess();
          }}
        />
      )}
    </div>
  );
}
