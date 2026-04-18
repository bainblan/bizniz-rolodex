"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase, isSupabaseConfigured } from "@/app/libs/supabase";

// --- Icons ---
function MenuIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 6h18M3 12h18M3 18h18"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
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
function BriefcaseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
      <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z" />
    </svg>
  );
}

export default function ProfileCreation() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialBusinessName = (searchParams.get("businessName") ?? "").trim();

  const [loading, setLoading] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoUrl(URL.createObjectURL(file));
    }
  };

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    companyName: initialBusinessName,
    tagline: "",
    phone: "",
    email: "",
    website: "",
    primaryColor: "#d9c7ec",
    secondaryColor: "#400068",
  });

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validateWebsite = (url: string) => {
    if (!url) return true;
    const pattern = /.+\.[a-z]{2,}$/i;
    return pattern.test(url.trim());
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    let formatted = value;
    if (value.length > 3 && value.length <= 6) {
      formatted = `(${value.slice(0, 3)}) ${value.slice(3)}`;
    } else if (value.length > 6) {
      formatted = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
    }
    setFormData({ ...formData, phone: formatted });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "phone") {
      handlePhoneChange(e);
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleGenerate = async () => {
    const { firstName, lastName, companyName, tagline, email, website, phone } = formData;

    if (firstName.length > 15 || lastName.length > 15 || companyName.length > 15) {
      return alert("Names and Business Name must be 15 characters or less.");
    }
    if (tagline.length > 20) {
      return alert("Tagline must be 20 characters or less.");
    }
    if (!validateEmail(email)) {
      return alert("Please enter a valid email address.");
    }
    if (phone.length < 14) {
      return alert("Please enter a full phone number: (XXX) XXX-XXXX");
    }
    if (website && !validateWebsite(website)) {
      return alert("Please enter a valid website URL.");
    }

    setLoading(true);

    if (!isSupabaseConfigured) {
      alert("Supabase is not configured yet. Add your .env.local credentials to save cards.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("business_cards").insert([
      {
        first_name: formData.firstName,
        last_name: formData.lastName,
        company_name: formData.companyName,
        tagline: formData.tagline,
        phone: formData.phone,
        email: formData.email,
        website: formData.website,
        card_color: formData.secondaryColor,
        qr_code_url: "/sample-qr.png",
      },
    ]);

    if (error) {
      alert("Error saving card: " + error.message);
    } else {
      alert("Card Generated Successfully!");
      router.push("/rolodex");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center gap-14 w-full min-h-screen bg-[#4a4a4a] pb-8">
      {/* Navbar */}
      <nav className="flex items-center justify-between w-full px-2.5">
        <Link href="/" className="flex items-center gap-3 px-1 py-1.5">
          <MenuIcon />
          <span className="text-2xl font-bold italic text-white">BIZNIZ</span>
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

      {/* Main Content: Card Preview (left) + Form (right) */}
      <div className="flex flex-1 w-full justify-center gap-10 px-8 items-center">
        {/* Left: Business Card Preview (Reactive) */}
        <div className="flex flex-col items-center justify-center">
          <div className="flex flex-col w-[360px] rounded-[28px] bg-white shadow-2xl overflow-hidden transition-colors duration-300">
            {/* Top accent area with QR + profile overlay */}
            <div
              className="relative flex items-center justify-center pt-16 pb-14"
              style={{ backgroundColor: formData.primaryColor }}
            >
              <div className="relative">
                <Image
                  src="/sample-qr.png"
                  alt="Sample QR Code"
                  width={280}
                  height={280}
                  className="rounded-xl bg-white p-2 shadow-md"
                />
                {logoUrl && (
                  <div
                    className="absolute inset-0 m-auto w-20 h-20 rounded-full border-4 border-white bg-white overflow-hidden flex items-center justify-center"
                    style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={logoUrl}
                      alt="Logo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Name + contact info */}
            <div className="flex flex-col items-center px-6 pt-6 pb-6">
              <p className="text-2xl font-bold text-gray-900 text-center break-words w-full leading-tight">
                {formData.companyName || "Business Name"}
              </p>
              <p className="mt-1 text-sm text-gray-500 text-center truncate w-full">
                {formData.firstName || "FirstName"} {formData.lastName || "LastName"}
              </p>

              <div className="mt-6 flex flex-col gap-3 w-full">
                <div className="flex items-center gap-3">
                  <span
                    className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: formData.secondaryColor }}
                  >
                    <BriefcaseIcon />
                  </span>
                  <span className="text-sm text-gray-700 truncate">
                    {formData.tagline || "Optional tagline"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: formData.secondaryColor }}
                  >
                    <PhoneIcon />
                  </span>
                  <span className="text-sm text-gray-700 truncate">
                    {formData.phone || "(555) 123-4567"}
                  </span>
                </div>
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: formData.secondaryColor }}
                  >
                    <EmailIcon />
                  </span>
                  <span className="text-sm text-gray-700 truncate">
                    {formData.email || "email@address.com"}
                  </span>
                </div>
              </div>

              {/* Links section — placeholder for future swipe-up bio/multi-link feature */}
              <div className="mt-5 w-full">
                <p className="text-xs font-bold text-gray-900 mb-3">Links</p>
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: formData.secondaryColor }}
                  >
                    <WebsiteIcon />
                  </span>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-semibold text-gray-900 truncate">
                      Website
                    </span>
                    <span className="text-xs text-gray-500 truncate">
                      {formData.website || "website.url"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Form Fields */}
        <div className="flex flex-col gap-4 w-full max-w-[400px] shrink-0">
          {/* Logo Picture Upload */}
          <div className="flex items-center justify-center mb-2">
            <label className="flex flex-col items-center gap-3.5 cursor-pointer">
              <div className="w-[100px] h-[100px] rounded-full bg-gray-300 overflow-hidden hover:opacity-80 transition-opacity">
                {logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={logoUrl}
                    alt="Logo preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                    Logo
                  </div>
                )}
              </div>
              <span className="text-sm font-semibold text-white">
                Edit Logo Picture
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="hidden"
              />
            </label>
          </div>

          <div className="flex gap-2.5 w-full">
            <input
              type="text"
              name="firstName"
              placeholder="FirstName"
              value={formData.firstName}
              onChange={handleChange}
              className="flex-1 min-w-0 rounded-lg bg-white px-2.5 py-3 text-lg text-black placeholder:text-black/25 outline-none"
            />
            <input
              type="text"
              name="lastName"
              placeholder="LastName"
              value={formData.lastName}
              onChange={handleChange}
              className="flex-1 min-w-0 rounded-lg bg-white px-2.5 py-3 text-lg text-black placeholder:text-black/25 outline-none"
            />
          </div>
          <input
            type="text"
            name="companyName"
            placeholder="Business Name"
            value={formData.companyName}
            onChange={handleChange}
            className="w-full rounded-lg bg-white px-2.5 py-3 text-lg text-black placeholder:text-black/25 outline-none"
          />
          <input
            type="text"
            name="tagline"
            placeholder="Tagline"
            value={formData.tagline}
            onChange={handleChange}
            className="w-full rounded-lg bg-white px-2.5 py-3 text-lg text-black placeholder:text-black/25 outline-none"
          />
          <input
            type="text"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full rounded-lg bg-white px-2.5 py-3 text-lg text-black placeholder:text-black/25 outline-none"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="w-full rounded-lg bg-white px-2.5 py-3 text-lg text-black placeholder:text-black/25 outline-none"
          />
          <input
            type="url"
            name="website"
            placeholder="Website URL"
            value={formData.website}
            onChange={handleChange}
            className="w-full rounded-lg bg-white px-2.5 py-3 text-lg text-black placeholder:text-black/25 outline-none"
          />

          {/* Color Pickers */}
          <div className="flex items-center justify-center gap-6">
            <label className="flex flex-col items-center gap-2 cursor-pointer">
              <div
                className="w-12 h-12 rounded-full border-2 border-white shadow-md"
                style={{ backgroundColor: formData.primaryColor }}
              />
              <span className="text-sm font-semibold text-white">
                Primary Color
              </span>
              <input
                type="color"
                name="primaryColor"
                value={formData.primaryColor}
                onChange={handleChange}
                className="hidden"
              />
            </label>
            <label className="flex flex-col items-center gap-2 cursor-pointer">
              <div
                className="w-12 h-12 rounded-full border-2 border-white shadow-md"
                style={{ backgroundColor: formData.secondaryColor }}
              />
              <span className="text-sm font-semibold text-white">
                Secondary Color
              </span>
              <input
                type="color"
                name="secondaryColor"
                value={formData.secondaryColor}
                onChange={handleChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full rounded-lg bg-[#b06bff] py-[18px] text-xl font-bold text-white hover:bg-[#9a50f0] transition-colors disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>
      </div>
    </div>
  );
}
