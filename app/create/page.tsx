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

function ColorPickerIcon() {
  return (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
      <path
        d="M20.71 5.63l-2.34-2.34a1 1 0 00-1.41 0l-3.12 3.12-1.93-1.91-1.41 1.41 1.42 1.42L3 16.25V21h4.75l8.92-8.92 1.42 1.42 1.41-1.41-1.92-1.92 3.12-3.12a1 1 0 000-1.42zM6.92 19L5 17.08l8.06-8.06 1.92 1.92L6.92 19z"
        fill="white"
      />
    </svg>
  );
}

export default function ProfileCreation() {
  return (
    <div className="flex flex-col items-center gap-14 w-full min-h-screen bg-[#4a4a4a] pb-8">
      {/* Navbar */}
      <nav className="flex items-center justify-between w-full px-2.5">
        <Link href="/" className="flex items-center gap-3 px-1 py-1.5">
          <MenuIcon />
          <span className="text-2xl font-bold italic text-white">
            BIZNIZ
          </span>
        </Link>
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

      {/* Profile & Logo Picture Upload */}
      <div className="flex items-center justify-center gap-7">
        <div className="flex flex-col items-center gap-3.5">
          <div className="w-[149px] h-[149px] rounded-full bg-gray-300 overflow-hidden">
            <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
              Profile
            </div>
          </div>
          <span className="text-base font-semibold text-white">
            Edit Profile Picture
          </span>
        </div>
        <div className="flex flex-col items-center gap-3.5">
          <div className="w-[149px] h-[149px] rounded-full bg-gray-300 overflow-hidden">
            <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
              Logo
            </div>
          </div>
          <span className="text-base font-semibold text-white">
            Edit Logo Picture
          </span>
        </div>
      </div>

      {/* Form Fields */}
      <div className="flex flex-col gap-2.5 items-center w-full max-w-[393px] px-4">
        <div className="flex gap-2.5 w-full">
          <input
            type="text"
            placeholder="FirstName"
            className="flex-1 min-w-0 rounded-lg bg-white px-2.5 py-4 text-xl text-black placeholder:text-black/25 outline-none"
          />
          <input
            type="text"
            placeholder="LastName"
            className="flex-1 min-w-0 rounded-lg bg-white px-2.5 py-4 text-xl text-black placeholder:text-black/25 outline-none"
          />
        </div>
        <input
          type="text"
          placeholder="Business Name"
          className="w-full rounded-lg bg-white px-2.5 py-4 text-xl text-black placeholder:text-black/25 outline-none"
        />
        <input
          type="text"
          placeholder="Tagline"
          className="w-full rounded-lg bg-white px-2.5 py-4 text-xl text-black placeholder:text-black/25 outline-none"
        />
        <input
          type="tel"
          placeholder="Phone Number"
          className="w-full rounded-lg bg-white px-2.5 py-4 text-xl text-black placeholder:text-black/25 outline-none"
        />
        <input
          type="url"
          placeholder="Website URL"
          className="w-full rounded-lg bg-white px-2.5 py-4 text-xl text-black placeholder:text-black/25 outline-none"
        />

        {/* Color Picker Row */}
        <div className="flex items-center justify-center gap-2.5">
          <ColorPickerIcon />
          <span className="text-xl font-bold text-white">
            Color Picker - or - Upload img
          </span>
        </div>

        {/* Generate Button */}
        <button className="w-full rounded-lg bg-[#b06bff] py-[18px] text-xl font-bold text-white hover:bg-[#9a50f0] transition-colors">
          Generate
        </button>
      </div>

      {/* Business Card Preview */}
      <div className="flex items-center justify-between w-[365px] h-[209px] bg-[#400068] px-6 py-7">
        <div className="flex flex-col justify-between h-full w-[151px]">
          <div className="text-white">
            <p className="text-xl font-bold leading-normal">CompanyName</p>
            <p className="text-xs font-semibold leading-normal">OptionalTagline</p>
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex gap-2.5 text-xs font-semibold text-white">
              <span>FirstName</span>
              <span>LastName</span>
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2.5">
                <PhoneIcon />
                <span className="text-xs text-white">pho-nen-umber</span>
              </div>
              <div className="flex items-center gap-2.5">
                <EmailIcon />
                <span className="text-xs text-white">email@address</span>
              </div>
              <div className="flex items-center gap-2.5">
                <WebsiteIcon />
                <span className="text-xs text-white">website.url</span>
              </div>
            </div>
          </div>
        </div>
        <Image
          src="/sample-qr.png"
          alt="Sample QR Code"
          width={153}
          height={153}
          className="object-cover"
        />
      </div>
    </div>
  );
}
