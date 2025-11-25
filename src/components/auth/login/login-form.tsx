import { useState } from "react";
import { Edit } from "../../icons/edit";
import { StatefulButton } from "../../stateful-button";
import { StatefulInput } from "../../stateful-input";
import Link from "next/link";
import { InfoTooltip } from "../../info-tooltip";
import { Eye, EyeOff } from "lucide-react";
import { OtpInput } from "../../otp-input";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, otpSchema, LoginFormData, OtpFormData } from "./login-schema";

const LoginForm = ({ forgotPasswordLink }: { forgotPasswordLink: string }) => {
  const router = useRouter();
  const [showOtpStep, setShowOtpStep] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [otpExpiresAt, setOtpExpiresAt] = useState<Date | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    control: loginControl,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
    getValues: getLoginValues,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "admin@email.com",
      password: "SecurePass123!",
    },
  });

  const {
    control: otpControl,
    handleSubmit: handleOtpSubmit,
    formState: { errors: otpErrors },
    reset: resetOtpForm,
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const onLoginSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setApiError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/signin/initiate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const responseData = await response.json();

      if (responseData.success) {
        console.log("[v0] OTP sent successfully:", responseData);
        setOtpExpiresAt(responseData.expiresAt);
        setShowOtpStep(true);
      } else {
        setApiError("Failed to send OTP");
      }
    } catch (err) {
      console.error("[v0] API Error:", err);
      setApiError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const onOtpSubmit = async (data: OtpFormData) => {
    setIsLoading(true);
    setApiError(null);
    const { email } = getLoginValues();

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/signin/verify-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, otp: data.otp }),
        }
      );

      const responseData = await response.json();

      if (responseData.success) {
        console.log("[v0] Signed in successfully:", responseData);
        localStorage.setItem("user", JSON.stringify(responseData.user));
        localStorage.setItem("session", JSON.stringify(responseData.session));
        router.push("/dashboard");
      } else {
        setApiError("Invalid OTP");
        resetOtpForm();
      }
    } catch (err) {
      console.error("[v0] OTP Verification Error:", err);
      setApiError("Network error. Please try again.");
      resetOtpForm();
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditEmail = () => {
    setShowOtpStep(false);
    setApiError(null);
    resetOtpForm();
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

    const { email, password } = getLoginValues();

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/signin/resend-otp`,
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
        setApiError(null);
      } else {
        setApiError("Failed to resend OTP");
      }
    } catch (err) {
      console.error("[v0] Resend OTP Error:", err);
      setApiError("Failed to resend OTP");
    }
  };

  return (
    <div className="space-y-7 md:space-y-8">
      {!showOtpStep ? (
        <form onSubmit={handleLoginSubmit(onLoginSubmit)} className="space-y-7 md:space-y-8" noValidate>
          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">Email</label>
            <div className="relative">
              <Controller
                name="email"
                control={loginControl}
                render={({ field }) => (
                  <StatefulInput
                    {...field}
                    type="email"
                    placeholder="example@example.com"
                    error={loginErrors.email?.message}
                    required
                  />
                )}
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">
                Password
              </label>
              <Link
                href={forgotPasswordLink || ""}
                className="text-sm text-primary font-medium"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <Controller
                name="password"
                control={loginControl}
                render={({ field }) => (
                  <StatefulInput
                    {...field}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••••"
                    error={loginErrors.password?.message}
                    showClearButton={false}
                    rightElement={
                      <div
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center w-8 h-8 cursor-pointer"
                      >
                        {showPassword ? (
                          <InfoTooltip content={"Hide Password"}>
                            <EyeOff className="w-6 h-6" />
                          </InfoTooltip>
                        ) : (
                          <InfoTooltip content={"Show Password"}>
                            <Eye className="w-6 h-6" />
                          </InfoTooltip>
                        )}
                      </div>
                    }
                    required
                  />
                )}
              />
            </div>
          </div>

          {apiError && <p className="text-red-500 text-sm">{apiError}</p>}

          <StatefulButton
            type="submit"
            variant={isLoading ? "inactive" : "active"}
            disabled={isLoading}
          >
            {isLoading ? "Please wait..." : "Access the dashboard"}
          </StatefulButton>
        </form>
      ) : (
        <form onSubmit={handleOtpSubmit(onOtpSubmit)} className="space-y-7 md:space-y-8" noValidate>
          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">Email</label>
            <div className="relative">
              <StatefulInput
                type="email"
                value={getLoginValues("email")}
                disabled={true}
                className="bg-gray-50"
                rightElement={
                  <button
                    type="button"
                    onClick={handleEditEmail}
                    className=" text-gray-400 hover:text-gray-600 transition-colors "
                  >
                    <Edit />
                  </button>
                }
                required
              />

            </div>
          </div>

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
            <Controller
              name="otp"
              control={otpControl}
              render={({ field: { onChange, value } }) => (
                <OtpInput
                  value={value}
                  onChange={onChange}
                  onComplete={(val) => {
                    onChange(val);
                    handleOtpSubmit(onOtpSubmit)();
                  }}
                  error={otpErrors.otp?.message}
                />
              )}
            />
          </div>

          {apiError && <p className="text-red-500 text-sm">{apiError}</p>}

          <StatefulButton
            type="submit"
            variant={isLoading ? "inactive" : "active"}
            disabled={isLoading}
          >
            {isLoading ? "Please wait..." : "Access the dashboard"}
          </StatefulButton>
        </form>
      )}
    </div>
  );
};

export default LoginForm;
