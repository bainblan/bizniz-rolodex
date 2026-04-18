"use client";

import {useState } from "react";
import {supabase} from "@/app/libs/supabase"

export function AuthModal({
    onClose,
    onAuthed,
  }: {
    onClose: () => void;
    onAuthed: () => void;
    }) {
    const [mode, setMode] = useState<"login" | "signup">("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    async function handleAuth(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        setErrorMessage("");

        const result =
            mode === "login"
                ? await supabase.auth.signInWithPassword({ email, password })
                : await supabase.auth.signUp({ email, password })

        if (result.error) {
            setErrorMessage(result.error.message);
            return;
        }

        if (!result.data.session) {
            setErrorMessage("Please check your email to confirm your account and log in.");
        }

        onAuthed();
        onClose();
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <form onSubmit={handleAuth} className="w-full max-w-sm rounded-lg bg-white p-6">
                <h2 className="text-xl font-bold text-black">
                    {mode === "login" ? "Log in" : "Sign up"}
                </h2>

                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
                <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" />

                {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

                <button type="submit">
                    {mode === "login" ? "Log in" : "Create account"}
                </button>

                <button type="button" onClick={onClose}>
                    Cancel
                </button>
            </form>
        </div>
    )
}