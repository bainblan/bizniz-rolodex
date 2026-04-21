"use client";

import { useState } from "react"; // stores signup form values and feedback messages
import { useRouter } from "next/navigation"; // redirects the user after signup succeeds
import { supabase, isSupabaseConfigured } from "@/app/libs/supabase"; // calls Supabase Auth and checks env setup
import { Navbar } from "@/app/components/navbar";

export default function Signup() {
  const router = useRouter(); // access to router.push for navigating user after signup

  const [username, setUsername] = useState(""); // stores username given by the user
  const [password, setPassword] = useState(""); // stores password given by the user
  const [confirmPassword, setConfirmPassword] = useState(""); // stores repeated password
  const [email, setEmail] = useState(""); // stores email address given by the user
  const [errorMessage, setErrorMessage] = useState(""); // stores potential signup errors
  // const [successMessage, setSuccessMessage] = useState(""); // stores confirmation instructions after signup
  const [loading, setLoading] = useState(false); // prevents duplicate submits while signup is running

  async function handleSignup(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault(); // prevents browser from refreshing page on submit
    setErrorMessage(""); // clears any errors
    // setSuccessMessage(""); // clears any success messages

    if (!isSupabaseConfigured) { // stops signup if Supabase env vars are missing
      setErrorMessage("Supabase is not configured yet.");
      return;
    }

    if (!username.trim()) { // requires username before creating the account
      setErrorMessage("Please enter a username.");
      return;
    }

    if (!email.trim()) { // requires email before attemtping Supabase Auth
      setErrorMessage("Please enter an email address.");
      return;
    }

    if (password !== confirmPassword) { // makes sure both password fields match
      setErrorMessage("Passwords do not match.");
      return;
    }

    setLoading(true); // disables submit button while Supabase handles signup

    const result = await supabase.auth.signUp({
      email, // sends email to Supabase Auth
      password, // sends password to Supabase Auth
    });

    setLoading(false); // re enables form after Supabase responds

    if (result.error) { // shows potential Supabase Auth error to the user
      setErrorMessage(result.error.message);
      return;
    }

    /*
    if (!data.session) { // uncomment once email confirmation is enabled in Supabase
      setSuccessMessage("Account created. Check your email to confirm your account.");
      return;
    }
     */

    if (!result.data.user) {
      setErrorMessage("User data failed to return oin account creation");
      return;
    }

    const { error } = await supabase.from("profiles").insert({
      user_id: result.data.user.id,
      username: username.trim(),
    });

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    router.push("/rolodex"); // sends logged in users to rolodex after signup
  }
  return (
    <div className="flex flex-col items-center min-h-screen w-full bg-[#4a4a4a]">
      {/* Navbar */}
      <Navbar />

      {/* Signup Form */}
      <div className="flex flex-1 items-center justify-center w-full px-4">
        <form
            onSubmit={handleSignup} // runs signup when the user submits the form
            className="flex flex-col gap-2.5 items-center w-full max-w-[393px]"
        >
          <h1 className="text-[32px] font-bold text-center text-white w-full">
            Start with <span className="italic">BIZNIZ</span>
          </h1>
          <input
            type="text"
            placeholder="Username"
            value={username} // connects username input to React state
            onChange={(e) => setUsername(e.target.value)} // updates username as user types
            className="w-full rounded-lg bg-white px-2.5 py-4 text-xl text-black placeholder:text-black/25 outline-none"
          />
          <input
              type="email"
              placeholder="Email Address"
              value={email} // connects email input to React state
              onChange={(e) => setEmail(e.target.value)} // updates email as the user types
              className="w-full rounded-lg bg-white px-2.5 py-4 text-xl text-black placeholder:text-black/25 outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={password} // connects password input to React state
            onChange={(e) => setPassword(e.target.value)} // updates password as user types
            className="w-full rounded-lg bg-white px-2.5 py-4 text-xl text-black placeholder:text-black/25 outline-none"
          />
          <input
            type="password"
            placeholder="Re-enter Password"
            value={confirmPassword} // connects repeated password input to React state
            onChange={(e) => setConfirmPassword(e.target.value)} // updates repeated password as the user types
            className="w-full rounded-lg bg-white px-2.5 py-4 text-xl text-black placeholder:text-black/25 outline-none"
          />
          {errorMessage && (
              <p className="w-full rounded-lg bg-white/10 px-3 py-2 text-sm font-medium text-red-200">
                {errorMessage}
              </p>
          )}
          {/* uncomment once we enable email confirmation
          {successMessage && (
              <p className="w-full rounded-lg bg-white/10 px-3 py-2 text-sm font-medium text-green-200">
                {successMessage}
              </p>
          )}
          */}
          <button
              type="submit" // submits form and triggers handleSignup
              disabled={loading} // prevents multiple signup requests one time
              className="w-full rounded-lg bg-[#b06bff] py-[18px] text-xl font-bold text-white hover:bg-[#9a50f0] transition-colors disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
