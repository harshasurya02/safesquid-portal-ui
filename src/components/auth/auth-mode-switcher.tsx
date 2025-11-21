import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const AuthModeSwitcher = ({ mode }: { mode: "login" | "register" }) => {

    const router = useRouter();

    const handleModeSwitch = (newMode: "login" | "register") => {
        // Reset all states
        // setShowOtpStep(false);
        // setRegisterStep("email");
        // setOtp("");
        // setError(defaultErrorState);
        // setAcceptTerms(false);
        router.push(`/auth/${newMode}`);
    };

    return (
        <div className="flex bg-neutral-100 rounded-lg space-x-0 p-1">
            <button
                onClick={() => handleModeSwitch("register")}
                // disabled={
                //     showOtpStep || (mode === "register" && registerStep !== "email")
                // }
                className={
                    `flex-1 p-[10px] h-[55px] text-sm md:text-lg font-normal  rounded-sm transition-all duration-200
                    ${mode === "register"
                        ? "bg-white text-accent shadow-sm"
                        : "text-accent-foreground"}`
                }
            >
                Register
            </button>
            <button
                onClick={() => handleModeSwitch("login")}
                // disabled={
                //     showOtpStep || (mode === "register" && registerStep !== "email")
                // }
                className={
                    `flex-1 p-[10px] h-[55px] text-sm md:text-lg font-normal  rounded-sm transition-all duration-200
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


{/* <div className="flex bg-neutral-100 rounded-lg space-x-0 p-1">
            <button
                onClick={() => handleModeSwitch("register")}
                disabled={
                    showOtpStep || (mode === "register" && registerStep !== "email")
                }
                className={cn(
                    "flex-1 p-[10px] h-[55px] text-sm md:text-lg font-normal  rounded-sm transition-all duration-200",
                    mode === "register"
                        ? "bg-white text-accent shadow-sm"
                        : "text-accent-foreground",
                    (showOtpStep ||
                        (mode === "register" && registerStep !== "email")) &&
                    "opacity-50 cursor-not-allowed"
                )}
            >
                Register
            </button>
            <button
                onClick={() => handleModeSwitch("login")}
                disabled={
                    showOtpStep || (mode === "register" && registerStep !== "email")
                }
                className={cn(
                    "flex-1 p-[10px] h-[55px] text-sm md:text-lg font-normal  rounded-sm transition-all duration-200",
                    mode === "login"
                        ? "bg-white text-accent shadow-sm"
                        : "text-accent-foreground",
                    (showOtpStep ||
                        (mode === "register" && registerStep !== "email")) &&
                    "opacity-50 cursor-not-allowed"
                )}
            >
                Login
            </button>
        </div> */}