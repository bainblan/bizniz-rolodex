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
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [email, setEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    async function handleAuth(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        setErrorMessage("");

        if (mode === "signup" && password !== confirmPassword) {
            setErrorMessage("Passwords do not match");
            return;
        }

        if (mode === "signup" && !username.trim()) {
            setErrorMessage("Please enter a username");
            return;
        }
        const result =
            mode === "login"
                ? await supabase.auth.signInWithPassword({ email, password })
                : await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            username: username.trim(),
                        },
                    },
                });

        if (result.error) {
            setErrorMessage(result.error.message);
            return;
        }

        if (!result.data.session) {
            setErrorMessage("Please check your email to confirm your account and log in.");
            return;
        }

        onAuthed();
        onClose();
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
            <form
                onSubmit={handleAuth}
                className="flex w-full max-w-98.25 flex-col items-center gap-2.5 rounded-lg bg-[#4a4a4a] px-6 py-8 shadow-2xl">
                <h2 className="w-full text-center text-[32px] font-bold text-white">
                    {mode === "login" ? "Log in" : "Sign up"}
                </h2>

                {mode === "signup" && (
                    <input
                        type="text"
                        placeholder="Username"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-lg bg-white px-2.5 py-4 text-xl text-black placeholder:text-black/25 outline-none"
                    />
                )}

                <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg bg-white px-2.5 py-4 text-xl text-black placeholder:text-black/25 outline-none"
                />

                {mode === "signup" && (
                    <input
                        type="password"
                        placeholder="Re-enter Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full rounded-lg bg-white px-2.5 py-4 text-xl text-black placeholder:text-black/25 outline-none"
                    />
                )}

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg bg-white px-2.5 py-4 text-xl text-black placeholder:text-black/25 outline-none"
                />

                {errorMessage && (
                    <p className="w-full rounded-lg bg-white/10 px-3 py-2 text-sm font-medium text-red-200"> {errorMessage} </p>
                )}

                <button
                    type="submit"
                    className="mt-1 w-full rounded-lg bg-[#b06bff] py-4.5 text-xl font-bold text-white transition-colors hover:bg-[#9a50f0]"
                >
                    {mode === "login" ? "Log in" : "Create account"}
                </button>

                <button
                    type="button"
                    onClick={() => setMode(mode === "login" ? "signup" : "login")}
                    className="w-full rounded-lg border border-white bg-transparent py-3 text-base font-semibold text-white transition-colors hover:bg-white/10"
                >
                    {mode === "login" ? "Create Account" : "Login"}
                </button>

                <button
                    type="button"
                    onClick={onClose}
                    className="w-full rounded-lg py-2 text-base font-semibold text-white/70 transition-colors hover:text-white"
                >
                    Cancel
                </button>
            </form>
        </div>
    )
}