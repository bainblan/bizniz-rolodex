import {useState } from "react"; // allows this component to store form values
import {supabase} from "@/app/libs/supabase" // used to call supabase auth

// This function ...
export function AuthModal({
    onClose, //...
    onAuthed, //...
  }: {
    onClose: () => void; // ...
    onAuthed: () => void; // ...
    }) {
    const [mode, setMode] = useState<"login" | "signup">("login"); // tracks whether popup modal is showing login or sign up form
    const [username, setUsername] = useState(""); // stores username during sign up
    const [password, setPassword] = useState(""); // store password typed for login or sign up
    const [confirmPassword, setConfirmPassword] = useState(""); //stores repeated password during sign up
    const [email, setEmail] = useState(""); // stores email typed during login or sign up
    const [errorMessage, setErrorMessage] = useState(""); // stores potential error message to display in modal

    /**
     * This function runs when either the login or sign up form is submitted
     * @param e
     */
    async function handleAuth(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault(); // prevent browser from refreshing page on form submit
        setErrorMessage(""); // clear error message

        if (mode === "signup" && password !== confirmPassword) { // check if password fields match is sign up mode
            setErrorMessage("Passwords do not match");
            return;
        }

        if (mode === "signup" && !username.trim()) { // check if username has been entered
            setErrorMessage("Please enter a username");
            return;
        }

        // either calls supabase login or supabase sign up based on current mode
        const result =
            mode === "login" // ternary statement checks for login mode and responds accordingly
                ? await supabase.auth.signInWithPassword({ email, password }) // call supabase login
                : await supabase.auth.signUp({ // call supabase sign up
                    email, // pass email
                    password, // pass password
                    options: {
                        data: {
                            username: username.trim(), // pass username to supabase user metadata
                        },
                    },
                });

        if (result.error) { // display potential auth error to user
            setErrorMessage(result.error.message);
            return;
        }

        // uncomment below if we decide to make our users authenticate their emails
        /*
        if (!result.data.session) {
            setErrorMessage("Please check your email to confirm your account and log in.");
            return;
        }
        */

        onAuthed(); // tells create/page.tsx that authentication succeeded
        onClose(); // closes popup modal after successful authentication
    }

    return ( // renders modal UI
        // fullscreen overlay that darkens the page behind it
        /* overlay stays fixed on screen, covers entire screen, appears on top of other elements, overlay is a flex container,
        centers children vertically and horizontally, background is black with 60 percent transparency, 4 horizontal padding */
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
            {/*the login/sign up form box*/}
            <form
                onSubmit={handleAuth} // runs handleAuth when user submits form
                /* form is a flex container, tales up full width of parent, sets max width to 98.25, child elements are in a column,
                child elements are centered horizontally, 2.5 between child elements, container has rounded corners, background is grey,
                6 horizontal padding, 8 vertical padding*/
                className="flex w-full max-w-98.25 flex-col items-center gap-2.5 rounded-lg bg-[#4a4a4a] px-6 py-8 shadow-2xl">
                {/* login/sign up text element takes up full size of parent, centers text, font size is 32 pixes sets it to bold, white text*/}
                <h2 className="w-full text-center text-[32px] font-bold text-white">
                    {mode === "login" ? "Log in" : "Sign up"} {/* ternery statement to set modal text appropriately */}
                </h2>

                {mode === "signup" && ( // if the mode is sign up then show email input first
                    <input
                        type="text" // uses browser text field behavior
                        placeholder="Username" // sets placeholder text
                        value={username} // connects input value to React state
                        onChange={(e) => setUsername(e.target.value)} // updates state as the user types in the field
                        /* makes input field width of parent, rounded borders, background is white, adds 4 horizontal padding, text is extra large,
                        text inputted is black, placeholder text is black with 25 percent transparency */
                        className="w-full rounded-lg bg-white px-2.5 py-4 text-xl text-black placeholder:text-black/25 outline-none"
                    />
                )}

                <input
                    type="email" // uses browser email behavior
                    placeholder="Email Address" // sets placeholder text
                    value={email} // connects input value to react state
                    onChange={(e) => setEmail(e.target.value)} // updates state as user types
                    /* makes input field width of parent, rounded borders, background is white, adds 4 horizontal padding, text is extra large,
                    text inputted is black, placeholder text is black with 25 percent transparency */
                    className="w-full rounded-lg bg-white px-2.5 py-4 text-xl text-black placeholder:text-black/25 outline-none"
                />

                {mode === "signup" && (
                    <input
                        type="password"
                        placeholder="Re-enter Password" // sets placeholder text
                        value={confirmPassword} // connects input value to react state
                        onChange={(e) => setConfirmPassword(e.target.value)} // updates state as user types
                        /* makes input field width of parent, rounded borders, background is white, adds 4 horizontal padding, text is extra large,
                        text inputted is black, placeholder text is black with 25 percent transparency */
                        className="w-full rounded-lg bg-white px-2.5 py-4 text-xl text-black placeholder:text-black/25 outline-none"
                    />
                )}

                <input
                    type="password"
                    placeholder="Password" // sets placeholder text
                    value={password} // connects input value to react state
                    onChange={(e) => setPassword(e.target.value)} // updates state as user types
                    /* makes input field width of parent, rounded borders, background is white, adds 4 horizontal padding, text is extra large,
                    text inputted is black, placeholder text is black with 25 percent transparency */
                    className="w-full rounded-lg bg-white px-2.5 py-4 text-xl text-black placeholder:text-black/25 outline-none"
                />

                {errorMessage && (
                    /* makes error message full width of parent, rounded borders, background is white with 10 percent transparency,
                    adds 3 horizontal padding, adds 2 vertical padding, text is small, text is slightly bold, text is light red*/
                    <p className="w-full rounded-lg bg-white/10 px-3 py-2 text-sm font-medium text-red-200">
                        {errorMessage} </p> // displays error message to user
                )}

                <button // submit button for login or sign up
                    type="submit" // submits form and triggers handleAuth
                    /* sets small top margin, tales full space of parent container, rounded borders, background is purple, adds 4.5 vertical padding,
                    extra large text,  bold text, white text, animates color changes, color changes slightly on mouse hover */
                    className="mt-1 w-full rounded-lg bg-[#b06bff] py-4.5 text-xl font-bold text-white transition-colors hover:bg-[#9a50f0]"
                >
                    {/* ternery statement sets text appropriately depending on mode*/}
                    {mode === "login" ? "Log in" : "Create account"}
                </button>

                {/* button switches between login and sign up */}
                <button
                    type="button" // prevents button from submitting the form
                    onClick={() => setMode(mode === "login" ? "signup" : "login")} // ternery statement changes mode whenever user switches between login and sign up
                    /* make button full width of parent, rounded borders, adds border, makes border white, makes background transparent, adds 3 verticle padding,
                    base level font size, semi bold font, white text, animates color changes, becomes white with 10 percent transparency on hover */
                    className="w-full rounded-lg border border-white bg-transparent py-3 text-base font-semibold text-white transition-colors hover:bg-white/10"
                >
                    {/* ternery statement changes button text accordingly based on mode*/}
                    {mode === "login" ? "Create Account" : "Login"}
                </button>

                <button
                    type="button" // prevents button from submitting the form
                    onClick={onClose} // closes the modal
                    /* make button full width of parent, rounded borders, adds border, makes border white, makes background transparent, adds 3 verticle padding,
                    base level font size, semi bold font, white text*/
                    className="w-full rounded-lg py-2 text-base font-semibold text-white/70 transition-colors hover:text-white"
                >
                    Cancel
                </button>
            </form>
        </div>
    )
}