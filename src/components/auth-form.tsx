
// import type React from "react";


import LoginForm from "./auth/login/login-form";
import RegisterForm from "./auth/register/register-form";
import AuthModeSwitcher from "./auth/auth-mode-switcher";
import WelcomeMessage from "./auth/welcome-message";


interface AuthFormProps {
  mode: "login" | "register";
  forgotPasswordLink?: string;
}


export function AuthForm({ mode }: AuthFormProps) {



  return (
    <div className="bg-gray-50 flex items-center justify-center my-auto">
      <div className="w-full space-y-6 sm:bg-white sm:rounded-xl sm:shadow-[0_4px_30px_0_rgba(255,106,41,0.10)] sm:p-15 sm:space-y-[2.625rem]">
        {/* Welcome Message */}
        <WelcomeMessage mode={mode} />

        {/* Mode Toggle */}
        <AuthModeSwitcher mode={mode} />

        {mode === "login" ? <LoginForm forgotPasswordLink={"/auth/forgot-password"} /> : <RegisterForm />}
      </div>
    </div>
  );
}
