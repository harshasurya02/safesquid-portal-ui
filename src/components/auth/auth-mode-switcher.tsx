import { useRouter } from "next/navigation";

const AuthModeSwitcher = ({ mode }: { mode: "login" | "register" }) => {

    const router = useRouter();

    const handleModeSwitch = (newMode: "login" | "register") => {
        router.push(`/auth/${newMode}`);
    };

    return (
        <div className="flex bg-neutral-100 rounded-lg space-x-0 p-1">
            <button
                onClick={() => handleModeSwitch("register")}
                className={
                    `flex-1 p-3 h-12 md:h-14 lg:h-15 text-sm md:text-base lg:text-lg font-normal  rounded-sm transition-all duration-200
            ${mode === "register"
                        ? "bg-white text-accent shadow-sm"
                        : "text-accent-foreground"}`
                }
            >
                Register
            </button>
            <button
                onClick={() => handleModeSwitch("login")}
                className={
                    `flex-1 p-3 h-12 md:h-14 lg:h-15 text-sm md:text-base lg:text-lg font-normal  rounded-sm transition-all duration-200
            ${mode === "login"
                        ? "bg-white text-accent shadow-sm"
                        : "text-accent-foreground"}`
                }
            >
                Login
            </button>
        </div >
    );
};

export default AuthModeSwitcher;
