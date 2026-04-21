"use client";

import { StyledQR } from "@/app/components/styledqr";

export interface BiznizCardData {
  company_name: string;
  tagline: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  website: string;
  card_color: string;        // secondary color: icon-circle fill
  primary_color?: string;    // top-panel fill; defaults to a light lavender
  qr_code_url: string;
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

function BriefcaseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
      <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z" />
    </svg>
  );
}

export function BiznizCard({ card }: { card: BiznizCardData }) {
  const primary = card.primary_color ?? "#d9c7ec";
  const secondary = card.card_color;

  return (
    <div className="flex flex-col w-[360px] rounded-[28px] bg-white shadow-2xl overflow-hidden">
      <div
        className="flex items-center justify-center pt-12 pb-10"
        style={{ backgroundColor: primary }}
      >
        <div className="rounded-xl bg-white p-2 shadow-md">
          <StyledQR url={card.qr_code_url} />
        </div>
      </div>

      <div className="flex flex-col items-center px-6 pt-6 pb-6">
        <p className="text-2xl font-bold text-gray-900 text-center break-words w-full leading-tight">
          {card.company_name}
        </p>
        <p className="mt-1 text-sm text-gray-500 text-center truncate w-full">
          {card.first_name} {card.last_name}
        </p>

        <div className="mt-6 flex flex-col gap-3 w-full">
          <div className="flex items-center gap-3">
            <span
              className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center"
              style={{ backgroundColor: secondary }}
            >
              <BriefcaseIcon />
            </span>
            <span className="text-sm text-gray-700 truncate">{card.tagline}</span>
          </div>
          <div className="flex items-center gap-3">
            <span
              className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center"
              style={{ backgroundColor: secondary }}
            >
              <PhoneIcon />
            </span>
            <span className="text-sm text-gray-700 truncate">{card.phone}</span>
          </div>
          <div className="flex items-center gap-3 min-w-0">
            <span
              className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center"
              style={{ backgroundColor: secondary }}
            >
              <EmailIcon />
            </span>
            <span className="text-sm text-gray-700 truncate">{card.email}</span>
          </div>
        </div>

        <div className="mt-5 w-full">
          <p className="text-xs font-bold text-gray-900 mb-3">Links</p>
          <div className="flex items-center gap-3 min-w-0">
            <span
              className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center"
              style={{ backgroundColor: secondary }}
            >
              <WebsiteIcon />
            </span>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold text-gray-900 truncate">Website</span>
              <span className="text-xs text-gray-500 truncate">{card.website}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
