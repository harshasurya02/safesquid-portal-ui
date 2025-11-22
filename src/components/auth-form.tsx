
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
      <div className="w-full space-y-6 md:bg-white md:rounded-xl md:shadow-[0_4px_30px_0_rgba(255,106,41,0.10)] md:p-15 md:space-y-[2.625rem]">
        {/* Welcome Message */}
        <WelcomeMessage mode={mode} />

        {/* Mode Toggle */}
        <AuthModeSwitcher mode={mode} />

        {/* Error Message */}
        {/* {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-6">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )} */}

        {/* Form Content */}
        {mode === "login" ? <LoginForm forgotPasswordLink={"/auth/forgot-password"} /> : <RegisterForm />}
      </div>
    </div>
  );
}
