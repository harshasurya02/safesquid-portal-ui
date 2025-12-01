const WelcomeMessage = ({ mode }: { mode: "login" | "register" }) => {


    const loginMessage = <>
        Welcome back to <span className="text-primary">SafeSquid</span>
    </>

    const registerMessage = <>
        Welcome to <span className="text-primary">SafeSquid</span> Family
    </>

    return (
        <><div className="text-center">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold text-[#1D1D1D] mb-2 leading=[140%] self-stretch">
                {mode === "login" ? loginMessage : registerMessage}
            </h1>
        </div>

        </>

    )
};

export default WelcomeMessage;