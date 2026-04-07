import Image from "next/image";
import Link from "next/link";

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

function ArrowDownIcon() {
  return (
    <svg width="57" height="57" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 11l4 4 4-4M12 8v7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col items-center w-full bg-white">
      {/* Hero / Landing Section */}
      <section className="flex flex-col items-center justify-between w-full min-h-screen bg-[#4a4a4a] overflow-hidden">
        {/* Navbar */}
        <nav className="flex items-center justify-between w-full px-2.5">
          <div className="flex items-center gap-3 px-1 py-1.5">
            <MenuIcon />
            <span className="text-2xl font-bold italic text-white">
              BIZNIZ
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/rolodex"
              className="rounded-lg border border-white bg-[#b06bff] px-6 py-1.5 text-base font-semibold text-white hover:bg-[#9a50f0] transition-colors"
            >
              Rolodex
            </Link>
            <Link
              href="/signup"
              className="rounded-lg border border-white bg-[#b06bff] px-6 py-1.5 text-base font-semibold text-white hover:bg-[#9a50f0] transition-colors"
            >
              Signup
            </Link>
            <Link
              href="/login"
              className="rounded-lg border border-white bg-[#b06bff] px-6 py-1.5 text-base font-semibold text-white hover:bg-[#9a50f0] transition-colors"
            >
              Login
            </Link>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="flex flex-col items-center gap-2.5 w-full max-w-[373px] px-4">
          <h1 className="text-[32px] font-bold text-center text-white">
            Welcome to <span className="italic">BIZNIZ</span>
          </h1>
          <p className="text-2xl text-center text-white">
            Digital Business Cards
          </p>
          <input
            type="text"
            placeholder="Enter Your Business Name"
            className="w-full rounded-lg bg-white px-2.5 py-4 text-xl text-black placeholder:text-black/25 outline-none"
          />
          <Link
            href="/create"
            className="w-full rounded-lg bg-[#b06bff] py-[18px] text-xl font-bold text-white hover:bg-[#9a50f0] transition-colors text-center"
          >
            Start Now
          </Link>
        </div>

        {/* Scroll Down Arrow */}
        <div className="pb-4">
          <ArrowDownIcon />
        </div>
      </section>

      {/* What Is BIZNIZ Section */}
      <section className="flex flex-col items-center gap-12 w-full py-20 bg-white overflow-hidden">
        <h2 className="text-4xl font-bold text-black">
          WHAT IS BIZNIZ?
        </h2>

        {/* How It Works Row */}
        <div className="flex items-start justify-center gap-16 w-full max-w-[700px] px-4">
          <div className="flex flex-col items-center gap-3 flex-1">
            <div className="w-16 h-16 rounded-full bg-[#b06bff] flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1.003 1.003 0 000-1.42l-2.34-2.34a1.003 1.003 0 00-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-black">Create</h3>
            <p className="text-sm text-black/60 text-center">Design your digital business card in minutes</p>
          </div>
          <div className="flex flex-col items-center gap-3 flex-1">
            <div className="w-16 h-16 rounded-full bg-[#b06bff] flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                <path d="M3 3v8h8V3H3zm6 6H5V5h4v4zm-6 4v8h8v-8H3zm6 6H5v-4h4v4zm4-16v8h8V3h-8zm6 6h-4V5h4v4zm-6 4v8h8v-8h-8zm6 6h-4v-4h4v4z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-black">Share</h3>
            <p className="text-sm text-black/60 text-center">Let anyone scan your unique QR code</p>
          </div>
          <div className="flex flex-col items-center gap-3 flex-1">
            <div className="w-16 h-16 rounded-full bg-[#b06bff] flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-black">Connect</h3>
            <p className="text-sm text-black/60 text-center">They save you straight to their digital rolodex</p>
          </div>
        </div>

        {/* Example Business Card */}
        <div className="flex items-center justify-between w-[500px] h-[285px] bg-[#400068] px-8 py-8 rounded-xl shadow-xl">
          <div className="flex flex-col justify-between h-full w-[200px]">
            <div className="text-white">
              <p className="text-2xl font-bold leading-normal">CompanyName</p>
              <p className="text-sm font-semibold leading-normal">OptionalTagline</p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2.5 text-sm font-semibold text-white">
                <span>FirstName</span>
                <span>LastName</span>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2.5">
                  <PhoneIcon />
                  <span className="text-sm text-white">pho-nen-umber</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <EmailIcon />
                  <span className="text-sm text-white">email@address</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <WebsiteIcon />
                  <span className="text-sm text-white">website.url</span>
                </div>
              </div>
            </div>
          </div>
          <Image
            src="/sample-qr.png"
            alt="Sample QR Code"
            width={180}
            height={180}
            className="object-cover"
          />
        </div>

        {/* Description */}
        <p className="w-full max-w-[550px] text-lg font-medium text-black/60 text-center px-4">
          Inspired by Linktree, Bizniz allows you to make your own digital
          business card that anyone can scan and have in their digital wallet.
          Go to a hackathon, a conference, or a networking event — instead of
          handing out paper cards that get tossed or resumes with nowhere to go,
          just let them scan your code. Your info lands right in their rolodex,
          ready when they need it.
        </p>

        <Link
          href="/rolodex"
          className="rounded-lg border border-white bg-[#b06bff] px-10 py-4 text-lg font-semibold text-white hover:bg-[#9a50f0] transition-colors"
        >
          View Your Rolodex
        </Link>
      </section>

      {/* Footer */}
      <footer className="flex items-center justify-between w-full px-8 py-6 bg-[#4a4a4a]">
        <span className="text-lg font-bold italic text-white">BIZNIZ</span>
        <span className="text-sm text-white/60">&copy; 2026 Bizniz. All rights reserved.</span>
      </footer>
    </div>
  );
}
