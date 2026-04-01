"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/app/libs/supabase"; // Path to your client

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
//interface since ts
interface BusinessCardData {
  id: string;
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

const savedCards = [
  {
    id: 1,
    companyName: "TechNova AI",
    tagline: "Intelligent Solutions",
    firstName: "Sarah",
    lastName: "Chen",
    phone: "404-555-0192",
    email: "sarah@technova.ai",
    website: "technova.ai",
    cardColor: "#1a3a5c",
  },
  {
    id: 2,
    companyName: "GreenLeaf Co",
    tagline: "Sustainable by Design",
    firstName: "Marcus",
    lastName: "Rivera",
    phone: "678-555-0234",
    email: "marcus@greenleaf.co",
    website: "greenleaf.co",
    cardColor: "#2d5a27",
  },
  {
    id: 3,
    companyName: "Pixel Perfect",
    tagline: "Design Studio",
    firstName: "Aisha",
    lastName: "Patel",
    phone: "770-555-0876",
    email: "aisha@pixelperfect.io",
    website: "pixelperfect.io",
    cardColor: "#6b2174",
  },
  {
    id: 4,
    companyName: "CloudStack",
    tagline: "Infrastructure Made Simple",
    firstName: "James",
    lastName: "O'Brien",
    phone: "312-555-0411",
    email: "james@cloudstack.dev",
    website: "cloudstack.dev",
    cardColor: "#b34700",
  },
  {
    id: 5,
    companyName: "FinEdge",
    tagline: "Smarter Banking",
    firstName: "Priya",
    lastName: "Sharma",
    phone: "415-555-0639",
    email: "priya@finedge.com",
    website: "finedge.com",
    cardColor: "#1c1c3a",
  },
];

function BusinessCard({ card }: { card: BusinessCardData }) {
  return (
    <div
      className="flex items-center justify-between w-[365px] h-[209px] px-6 py-7 shrink-0 rounded-xl shadow-lg"
      style={{ backgroundColor: card.card_color }}
    >
      <div className="flex flex-col justify-between h-full w-[151px]">
        <div className="text-white">
          <p className="text-xl font-bold leading-tight">{card.company_name}</p>
          <p className="text-xs font-semibold opacity-80">{card.tagline}</p>
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex gap-1.5 text-xs font-semibold text-white">
            <span>{card.first_name}</span>
            <span>{card.last_name}</span>
          </div>
          <div className="text-white/90 text-[10px] space-y-1">
             <p>📞 {card.phone}</p>
             <p>✉️ {card.email}</p>
             <p>🌐 {card.website}</p>
          </div>
        </div>
      </div>
      {/* Use the qr_code_url from the database */}
      <div className="bg-white p-1 rounded-sm">
        <Image
          src={card.qr_code_url || "/sample-qr.png"} 
          alt="QR Code"
          width={120}
          height={120}
          className="object-cover"
        />
      </div>
    </div>
  );
}

export default function Rolodex() {
  const [cards, setCards] = useState<BusinessCardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCards() {
      const { data, error } = await supabase
        .from("business_cards")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching cards:", error);
      } else {
        setCards(data || []);
      }
      setLoading(false);
    }

    fetchCards();
  }, []);

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-[#4a4a4a] pb-8">
      {/* Navbar - Kept your original design */}
      <nav className="flex items-center justify-between w-full px-2.5 py-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="text-2xl font-bold italic text-white underline decoration-[#b06bff]">
            BIZNIZ
          </span>
        </Link>
        <div className="flex gap-2">
            <Link href="/rolodex" className="bg-[#b06bff] text-white px-4 py-1 rounded-md text-sm">Rolodex</Link>
        </div>
      </nav>

      <div className="flex flex-col items-center gap-2.5 w-full max-w-[393px] px-4 mt-8">
        <h1 className="text-[32px] font-bold text-white">
          Your <span className="italic text-[#b06bff]">Rolodex</span>
        </h1>
        <p className="text-base text-white/60">
          {loading ? "Loading..." : `${cards.length} cards collected`}
        </p>
      </div>

      <div className="flex flex-col items-center gap-6 mt-6 w-full px-4">
        {!loading && cards.map((card) => (
          <BusinessCard key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}
