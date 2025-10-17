"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Edit2,
  ChevronDown,
  Repeat2,
  CreditCard,
  ChevronLeft,
  MoveLeft,
} from "lucide-react";
import { StatefulInput } from "@/components/stateful-input";
import { StatefulButton } from "@/components/stateful-button";
import { OtpInput } from "@/components/otp-input";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { InfoTooltip } from "./info-tooltip";

interface AuthFormProps {
  mode: "login" | "register";
  forgotPasswordLink?: string;
}

type RegisterStep = "email" | "otp" | "password" | "details";

export function AuthForm({ mode, forgotPasswordLink }: AuthFormProps) {
  const router = useRouter();

  // Common states
  const [email, setEmail] = useState("admin@email.com");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Login states
  const [password, setPassword] = useState("SecurePass123!");
  const [showPassword, setShowPassword] = useState(false);
  const [showOtpStep, setShowOtpStep] = useState(false);
  const [otp, setOtp] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [otpExpiresAt, setOtpExpiresAt] = useState<string | null>(null);

  // Registration states
  const [registerStep, setRegisterStep] = useState<RegisterStep>("email");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleModeSwitch = (newMode: "login" | "register") => {
    // Reset all states
    setShowOtpStep(false);
    setRegisterStep("email");
    setOtp("");
    setError("");
    setAcceptTerms(false);
    router.push(`/auth/${newMode}`);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/signin/initiate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (data.success) {
        console.log("[v0] OTP sent successfully:", data);
        setOtpExpiresAt(data.expiresAt);
        setShowOtpStep(true);
      } else {
        setError(data.message || "Failed to send OTP");
      }
    } catch (err) {
      console.error("[v0] API Error:", err);
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginOtpComplete = async (otpValue: string) => {
    setOtp(otpValue);
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/signin/verify-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, otp: otpValue }),
        }
      );

      const data = await response.json();

      if (data.success) {
        console.log("[v0] Signed in successfully:", data);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("session", JSON.stringify(data.session));
        router.push("/dashboard");
      } else {
        setError(data.message || "Invalid OTP");
        setOtp("");
      }
    } catch (err) {
      console.error("[v0] OTP Verification Error:", err);
      setError("Network error. Please try again.");
      setOtp("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptTerms) {
      setError("Please accept the Terms & Conditions");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/signup/initiate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (data.success) {
        console.log("[v0] OTP sent successfully:", data);
        setOtpExpiresAt(data.expiresAt);
        setRegisterStep("otp");
      } else {
        setError(data.message || "Failed to send verification email");
      }
    } catch (err) {
      console.error("[v0] API Error:", err);
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterOtpComplete = async (otpValue: string) => {
    setOtp(otpValue);
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/signup/verify-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, otp: otpValue }),
        }
      );

      const data = await response.json();

      if (data.success) {
        console.log("[v0] Email verified successfully:", data);
        if (data.nextStep === "password") {
          setRegisterStep("password");
        }
      } else {
        setError(data.message || "Invalid OTP");
        setOtp("");
      }
    } catch (err) {
      console.error("[v0] OTP Verification Error:", err);
      setError("Network error. Please try again.");
      setOtp("");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (registerPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (registerPassword.length < 12) {
      setError("Password must be at least 12 characters long");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/signup/set-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password: registerPassword,
            confirmPassword,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        console.log("[v0] Password set successfully:", data);
        if (data.nextStep === "details") {
          setRegisterStep("details");
        }
      } else {
        setError(data.message || "Failed to set password");
      }
    } catch (err) {
      console.error("[v0] Set Password Error:", err);
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/signup/complete`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            name,
            designation,
            phone: `${countryCode}${phoneNumber}`,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        console.log("[v0] Signup completed successfully:", data);
        // Store user data temporarily or redirect to login
        localStorage.setItem("signupComplete", "true");
        localStorage.setItem("signupEmail", email);
        // Redirect to login page with success message
        router.push("/auth/login?signup=success");
      } else {
        setError(data.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("[v0] Signup Complete Error:", err);
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;

    setResendCooldown(30);
    const timer = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    try {
      if (mode === "login") {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/signin/initiate`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          }
        );

        const data = await response.json();

        if (data.success) {
          console.log("[v0] OTP resent successfully");
          setOtpExpiresAt(data.expiresAt);
          setError("");
        } else {
          setError(data.message || "Failed to resend OTP");
        }
      } else {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/signup/initiate`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
          }
        );

        const data = await response.json();

        if (data.success) {
          console.log("[v0] OTP resent successfully");
          setOtpExpiresAt(data.expiresAt);
          setError("");
        } else {
          setError(data.message || "Failed to resend OTP");
        }
      }
    } catch (err) {
      console.error("[v0] Resend OTP Error:", err);
      setError("Failed to resend OTP");
    }
  };

  const handleEditEmail = () => {
    if (mode === "login") {
      setShowOtpStep(false);
    } else {
      setRegisterStep("email");
    }
    setOtp("");
    setError("");
  };

  const handleBackStep = () => {
    setError("");
    if (registerStep === "otp") {
      setRegisterStep("email");
    } else if (registerStep === "password") {
      setRegisterStep("otp");
    } else if (registerStep === "details") {
      setRegisterStep("password");
    }
  };

  const getWelcomeMessage = () => {
    if (mode === "login") {
      return (
        <>
          Welcome back to <span className="text-primary">SafeSquid</span>
        </>
      );
    } else {
      return (
        <>
          Welcome to <span className="text-primary">SafeSquid</span> Family
        </>
      );
    }
  };

  const renderLoginForm = () => (
    <form onSubmit={handleLoginSubmit} className="space-y-8">
      <div className="">
        <label className="text-sm font-medium text-foreground">Email</label>
        <div className="relative">
          <StatefulInput
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@example.com"
            disabled={showOtpStep}
            className={showOtpStep ? "bg-gray-50" : ""}
            required
          />
          {showOtpStep && (
            <button
              type="button"
              onClick={handleEditEmail}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors "
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {!showOtpStep && (
        <div className="space-y-1">
          {/* <label className="text-sm font-medium text-foreground">
            Password
          </label> */}

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">
              Password
            </label>
            <Link
              href={forgotPasswordLink || ""}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="relative">
            <StatefulInput
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="pr-10"
              required
            />
            <div
              // type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? (
                <InfoTooltip content={"Hide Password"}>
                  <EyeOff className="w-4 h-4" />
                </InfoTooltip>
              ) : (
                <InfoTooltip content={"Show Password"}>
                  <Eye className="w-4 h-4" />
                </InfoTooltip>
              )}
            </div>
          </div>
          {/* <div className="text-sm text-gray-600 mt-2">
            <Link
              href={forgotPasswordLink || ""}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Forgot Password?
            </Link>
          </div> */}
        </div>
      )}

      {showOtpStep && (
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">OTP</label>
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resendCooldown > 0}
              className="text-sm text-primary hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              {resendCooldown > 0
                ? `Resend OTP (${resendCooldown}s)`
                : "Resend OTP"}
            </button>
          </div>
          <OtpInput onComplete={handleLoginOtpComplete} value={otp} />
        </div>
      )}

      <StatefulButton
        type="submit"
        variant={isLoading ? "inactive" : "active"}
        disabled={isLoading}
      >
        {isLoading ? "Please wait..." : "Access the dashboard"}
      </StatefulButton>
    </form>
  );

  const renderRegisterEmailStep = () => (
    <form onSubmit={handleRegisterEmailSubmit} className="space-y-8">
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Use business email for{" "}
          <Link
            href="/auth/enterprise/MTech"
            className="text-blue-600 hover:text-blue-700 underline"
          >
            Enterprise Account
          </Link>{" "}
          benefits
        </p>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-foreground">Email</label>
        <StatefulInput
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="mukunds735@safesquid.net"
          required
        />
      </div>

      <div className="flex items-center-safe space-x-2 ">
        <input
          type="checkbox"
          id="terms"
          checked={acceptTerms}
          onChange={(e) => setAcceptTerms(e.target.checked)}
          className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="terms" className="text-sm text-gray-600">
          I agree to the{" "}
          <Link
            href="#"
            className="text-blue-600 hover:text-blue-700 underline"
          >
            Terms & Conditions
          </Link>
        </label>
      </div>
      <div className="space-y-[4.5]">
        <StatefulButton
          type="submit"
          variant={isLoading ? "inactive" : "active"}
          disabled={isLoading}
          // className="mb-[18px]"
        >
          {isLoading ? "Please wait..." : "Verify email"}
        </StatefulButton>

        <div className="text-center text-sm text-gray-500 space-y-1">
          <div className="flex items-center justify-center space-x-4">
            <span className="flex items-center space-x-1">
              <CreditCard className="pt-1" />
              <span>No Credit Card required</span>
            </span>
            <span className="flex items-center space-x-1">
              <Repeat2 className="pt-1" />
              <span>Free Forever</span>
            </span>
          </div>
        </div>
      </div>
    </form>
  );

  const renderRegisterOtpStep = () => (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
      <div className="text-center">
        <p className="text-sm text-gray-600">
          We business email for{" "}
          <Link
            href="/auth/enterprise/MTech"
            className="text-blue-600 hover:text-blue-700 underline"
          >
            Enterprise Account
          </Link>{" "}
          benefits
        </p>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-foreground">Email</label>
        <div className="relative">
          <StatefulInput
            type="email"
            value={email}
            disabled
            className="bg-gray-50"
          />
          <button
            type="button"
            onClick={handleEditEmail}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors h-[24px] w-[24px]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="20"
              height="20"
              color="oklch(70.7% 0.022 261.325)"
              fill="none"
            >
              <path
                d="M14.0737 3.88545C14.8189 3.07808 15.1915 2.6744 15.5874 2.43893C16.5427 1.87076 17.7191 1.85309 18.6904 2.39232C19.0929 2.6158 19.4769 3.00812 20.245 3.79276C21.0131 4.5774 21.3972 4.96972 21.6159 5.38093C22.1438 6.37312 22.1265 7.57479 21.5703 8.5507C21.3398 8.95516 20.9446 9.33578 20.1543 10.097L10.7506 19.1543C9.25288 20.5969 8.504 21.3182 7.56806 21.6837C6.63212 22.0493 5.6032 22.0224 3.54536 21.9686L3.26538 21.9613C2.63891 21.9449 2.32567 21.9367 2.14359 21.73C1.9615 21.5234 1.98636 21.2043 2.03608 20.5662L2.06308 20.2197C2.20301 18.4235 2.27297 17.5255 2.62371 16.7182C2.97444 15.9109 3.57944 15.2555 4.78943 13.9445L14.0737 3.88545Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <path
                d="M13 4L20 11"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <path
                d="M14 22L22 22"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">OTP</label>
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={resendCooldown > 0}
            className="text-sm text-blue-600 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            {resendCooldown > 0
              ? `Resend OTP (${resendCooldown}s)`
              : "Resend OTP"}
          </button>
        </div>
        <OtpInput onComplete={handleRegisterOtpComplete} value={otp} />
      </div>

      <StatefulButton
        type="submit"
        variant={isLoading ? "inactive" : "active"}
        disabled={isLoading}
      >
        {isLoading ? "Please wait..." : "Verify now"}
      </StatefulButton>
    </form>
  );

  const renderPasswordStep = () => (
    <form onSubmit={handlePasswordSubmit} className="space-y-8 ">
      <div className="space-y-1">
        <label className="text-sm font-medium text-foreground">Email</label>
        <div className="relative">
          <StatefulInput
            type="email"
            value={email}
            disabled
            className="bg-gray-50"
          />
          <button
            type="button"
            onClick={handleEditEmail}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-foreground">Password</label>
        <div className="relative">
          <StatefulInput
            type={showRegisterPassword ? "text" : "password"}
            value={registerPassword}
            onChange={(e) => setRegisterPassword(e.target.value)}
            placeholder="••••••••••••"
            className="pr-10"
            required
          />
          <div
            // type="button"
            onClick={() => setShowRegisterPassword(!showRegisterPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            {showRegisterPassword ? (
              <InfoTooltip content={"Hide Password"}>
                <EyeOff className="w-4 h-4" />
              </InfoTooltip>
            ) : (
              <InfoTooltip content={"Show Password"}>
                <Eye className="w-4 h-4" />
              </InfoTooltip>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-foreground">
          Re-enter password
        </label>
        <div className="relative">
          <StatefulInput
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            // className="pr-10"
            required
          />
          <div
            // type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            {showConfirmPassword ? (
              <InfoTooltip content={"Hide Password"}>
                <EyeOff className="w-4 h-4" />
              </InfoTooltip>
            ) : (
              <InfoTooltip content={"Show Password"}>
                <Eye className="w-4 h-4" />
              </InfoTooltip>
            )}
          </div>
        </div>
      </div>

      <div className="text-sm text-gray-600">
        <p className="font-medium mb-1">For a strong password:</p>
        <p>
          We recommend minimum{" "}
          <span className="font-medium">12 characters</span> with atleast{" "}
          <span className="text-blue-600">one upper case</span>,{" "}
          <span className="text-blue-600">lower case</span>,{" "}
          <span className="text-blue-600">number</span> and{" "}
          <span className="text-blue-600">symbol</span>
        </p>
      </div>

      <div className="flex space-x-5">
        <StatefulButton
          type="button"
          variant="inactive"
          onClick={handleBackStep}
          className="flex-[0.3]"
        >
          <div className="flex justify-center gap-2">
            <MoveLeft className="pt-1" />
            <span>Back</span>
          </div>
        </StatefulButton>
        <StatefulButton type="submit" variant="active" className="flex-[0.7]">
          Configure authentication
        </StatefulButton>
      </div>
    </form>
  );

  const renderDetailsStep = () => (
    <form onSubmit={handleDetailsSubmit} className="space-y-6">
      <div className="space-y-1">
        <label className="text-sm font-medium text-foreground">Name</label>
        <StatefulInput
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Mukund Sharma"
          required
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-foreground">Email</label>
        <div className="relative">
          <StatefulInput
            type="email"
            value={email}
            disabled
            className="bg-gray-50"
          />
          <button
            type="button"
            onClick={handleEditEmail}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              color="#000000"
              fill="none"
            >
              <path
                d="M14.0737 3.88545C14.8189 3.07808 15.1915 2.6744 15.5874 2.43893C16.5427 1.87076 17.7191 1.85309 18.6904 2.39232C19.0929 2.6158 19.4769 3.00812 20.245 3.79276C21.0131 4.5774 21.3972 4.96972 21.6159 5.38093C22.1438 6.37312 22.1265 7.57479 21.5703 8.5507C21.3398 8.95516 20.9446 9.33578 20.1543 10.097L10.7506 19.1543C9.25288 20.5969 8.504 21.3182 7.56806 21.6837C6.63212 22.0493 5.6032 22.0224 3.54536 21.9686L3.26538 21.9613C2.63891 21.9449 2.32567 21.9367 2.14359 21.73C1.9615 21.5234 1.98636 21.2043 2.03608 20.5662L2.06308 20.2197C2.20301 18.4235 2.27297 17.5255 2.62371 16.7182C2.97444 15.9109 3.57944 15.2555 4.78943 13.9445L14.0737 3.88545Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              ></path>
              <path
                d="M13 4L20 11"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linejoin="round"
              ></path>
              <path
                d="M14 22L22 22"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-foreground">Role</label>
        <StatefulInput
          type="text"
          value={designation}
          onChange={(e) => setDesignation(e.target.value)}
          placeholder="CIO"
          required
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-foreground">
          Phone Number
        </label>
        <div className="flex space-x-2">
          <div className="relative">
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="+91">🇮🇳 +91</option>
              <option value="+1">🇺🇸 +1</option>
              <option value="+44">🇬🇧 +44</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          <StatefulInput
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="98765 43219"
            className="flex-1"
            required
          />
        </div>
      </div>

      <div className="flex space-x-3">
        <StatefulButton
          type="button"
          variant="outline"
          onClick={handleBackStep}
          className="flex-1"
        >
          Back
        </StatefulButton>
        <StatefulButton
          type="submit"
          variant={isLoading ? "inactive" : "active"}
          disabled={isLoading}
          className="flex-1"
        >
          {isLoading ? "Please wait..." : "Setup first SafeSquid"}
        </StatefulButton>
      </div>

      <div className="text-center text-sm text-gray-500">
        Invitation from SafeSquid Labs
      </div>
    </form>
  );

  const renderRegisterForm = () => {
    switch (registerStep) {
      case "email":
        return renderRegisterEmailStep();
      case "otp":
        return renderRegisterOtpStep();
      case "password":
        return renderPasswordStep();
      case "details":
        return renderDetailsStep();
      default:
        return renderRegisterEmailStep();
    }
  };

  return (
    <div className=" bg-gray-50 flex items-center justify-center ">
      <div className="w-full bg-white rounded-xl shadow-[0_4px_30px_0_rgba(255,106,41,0.10)] p-[60px] space-y-[42px]">
        {/* Welcome Message */}
        <div className="text-center">
          <h1 className="text-[30px] font-semibold text-[#1D1D1D] mb-2 leading=[140%] self-stretch">
            {getWelcomeMessage()}
          </h1>
        </div>

        {/* Mode Toggle */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => handleModeSwitch("register")}
            disabled={
              showOtpStep || (mode === "register" && registerStep !== "email")
            }
            className={cn(
              "flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200",
              mode === "register"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900",
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
              "flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200",
              mode === "login"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900",
              (showOtpStep ||
                (mode === "register" && registerStep !== "email")) &&
                "opacity-50 cursor-not-allowed"
            )}
          >
            Login
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-6">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Form Content */}
        {mode === "login" ? renderLoginForm() : renderRegisterForm()}
      </div>
    </div>
  );
}
