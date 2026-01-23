
// import type React from "react";


import { useState } from "react";
import LoginForm from "./auth/login/login-form";
import RegisterForm, { RegisterStep } from "./auth/register/register-form";
import AuthModeSwitcher from "./auth/auth-mode-switcher";
import WelcomeMessage from "./auth/welcome-message";


interface AuthFormProps {
  mode: "login" | "register";
  forgotPasswordLink?: string;
}


export function AuthForm({ mode }: AuthFormProps) {
  const [hideWelcome, setHideWelcome] = useState(false);

  const handleStepChange = (step: RegisterStep) => {
    setHideWelcome(step === "organization" || step === "invite");
  };

  return (
    <div className="bg-gray-50 flex items-center justify-center my-auto">
      <div className="w-full space-y-6 sm:space-y-6 md:space-y-8 lg:space-y-[2.625rem] sm:bg-white sm:rounded-xl sm:shadow-[0_4px_30px_0_rgba(255,106,41,0.10)] sm:p-8 md:p-10 lg:p-15">
        {/* Welcome Message */}
        {!hideWelcome && <WelcomeMessage mode={mode} />}

        {/* Mode Toggle */}
        {!hideWelcome && <AuthModeSwitcher mode={mode} />}

        {mode === "login" ? (
          <LoginForm forgotPasswordLink={"/auth/forgot-password"} />
        ) : (
          <RegisterForm onStepChange={handleStepChange} />
        )}
      </div>
    </div>
  );
}
