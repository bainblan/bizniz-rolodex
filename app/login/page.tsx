import Link from "next/link";

function MenuIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
      <path d="M3 6h18M3 12h18M3 18h18" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function Login() {
  return (
    <div className="flex flex-col items-center min-h-screen w-full bg-[#4a4a4a]">
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

      {/* Login Form */}
      <div className="flex flex-1 items-center justify-center w-full px-4">
        <div className="flex flex-col gap-2.5 items-center w-full max-w-[393px]">
          <h1 className="text-[32px] font-bold text-center text-white w-full">
            Login to <span className="italic">BIZNIZ</span>
          </h1>
          <input
            type="text"
            placeholder="Username"
            className="w-full rounded-lg bg-white px-2.5 py-4 text-xl text-black placeholder:text-black/25 outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-lg bg-white px-2.5 py-4 text-xl text-black placeholder:text-black/25 outline-none"
          />
          <button className="w-full rounded-lg bg-[#b06bff] py-[18px] text-xl font-bold text-white hover:bg-[#9a50f0] transition-colors">
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
