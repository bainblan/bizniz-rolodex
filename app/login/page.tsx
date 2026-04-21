"use client" // runs this page in browser to handle form submits

import { useState } from "react"; // stores login form values
import { useRouter } from "next/navigation"; // lets page redirect after successful login
import { supabase, isSupabaseConfigured } from "@/app/libs/supabase"; // imports supabase auth client and config check
import { Navbar } from "@/app/components/navbar";

export default function Login() {
  const router = useRouter(); // access to router.push for redirecting after login

  const [email, setEmail] = useState(""); // stores email typed by user
  const [password, setPassword] = useState(""); // stores password typed by user
  const [errorMessage, setErrorMessage] = useState(""); // stores potential login errors
  const [loading, setLoading] = useState(false); // tracks if login request is currently running

  async function handleLogin(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault(); // prevents browser from refreshing page when the form submits
    setErrorMessage(""); // clear any error message

    if (!isSupabaseConfigured) { // check is supabase configured properly
      setErrorMessage("Supabase is not configured yet");
      return;
    }

    setLoading(true); // disables the button and shows loading label

    const { error } = await supabase.auth.signInWithPassword({
      email, // sends email to supabase auth
      password, // sends password to supabase auth
    });

    if (error) { // checks for potential auth errors
      setErrorMessage(error.message);
      setLoading(false);
      return;
    }

    router.push("/rolodex"); // reroutes user to rolodex page after successful auth
  }

  return (
    <div className="flex flex-col items-center min-h-screen w-full bg-[#4a4a4a]">
      {/* Navbar */}
      <Navbar />

      {/* Login Form */}
      <div className="flex flex-1 items-center justify-center w-full px-4">
        <form // I changed this to a form that can collect and submit user entered information
          onSubmit={handleLogin} // when user submits it sends handle login
          className="flex flex-col gap-2.5 items-center w-full max-w-[393px]">
          <h1 className="text-[32px] font-bold text-center text-white w-full">
            Login to <span className="italic">BIZNIZ</span>
          </h1>
          <input
            type="email" // uses browser email behavior
            placeholder="Email Address" // placeholder text
            value={email} // connect user input to react state
            onChange={(e) => setEmail(e.target.value)} // updates email state as user types
            className="w-full rounded-lg bg-white px-2.5 py-4 text-xl text-black placeholder:text-black/25 outline-none"
          />
          <input
            type="password" // uses browser password behavior
            placeholder="Password" // placeholder text
            value={password} // connect user input to react state
            onChange={(e) => setPassword(e.target.value)} // updates password state as user types
            className="w-full rounded-lg bg-white px-2.5 py-4 text-xl text-black placeholder:text-black/25 outline-none"
          />
          {errorMessage && (
              /* makes error message full width of parent, rounded borders, background is white with 10 percent transparency,
              adds 3 horizontal padding, adds 2 vertical padding, text is small, text is slightly bold, text is light red*/
              <p className="w-full rounded-lg bg-white/10 px-3 py-2 text-sm font-medium text-red-200">
                {errorMessage} </p> // displays error message to user
          )}
          <button
            type="submit" // makes this button submit the login form
            disabled={loading} // prevents user from clicking multiple times while auth is loading
            className="w-full rounded-lg bg-[#b06bff] py-[18px] text-xl font-bold text-white hover:bg-[#9a50f0] transition-colors">
            {loading ? "Logging in..." : "Login"} {/* ternery statement to display logging in while auth loads */}
          </button>
        </form>
      </div>
    </div>
  );
}
