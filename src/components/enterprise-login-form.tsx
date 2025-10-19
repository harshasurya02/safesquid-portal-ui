"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { StatefulInput } from "@/components/stateful-input";
import { StatefulButton } from "@/components/stateful-button";
import Link from "next/link";

interface EnterpriseLoginFormProps {
  orgName: string;
  orgId: string;
}

export function EnterpriseLoginForm({
  orgName,
  orgId,
}: EnterpriseLoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("admin@email.com");
  const [password, setPassword] = useState("SecurePass123!");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/signin/initiate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );
      const data = await res.json();
      if (data?.success) {
        // Mock an org-aware session; replace with your real enterprise endpoint when available.
        localStorage.setItem(
          "session",
          JSON.stringify({ orgId, orgName, expiresAt: data.expiresAt || null })
        );
        localStorage.setItem("user", JSON.stringify({ email }));
        router.push("/dashboard");
      } else {
        setError(data?.message || "Sign in failed");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Welcome to <span className="text-blue-600">{orgName}</span>
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            Use business email for{" "}
            <Link
              href="#"
              className="text-blue-600 underline hover:text-blue-700"
            >
              Enterprise Account
            </Link>{" "}
            benefits
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <form onSubmit={handleSignIn} className="space-y-6">
          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">
              Email Address
            </label>
            <StatefulInput
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@example.com"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">
              Password
            </label>
            <div className="relative">
              <StatefulInput
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className="text-right -mt-2">
            <Link
              href="/auth/forgot-password"
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Forgot Password?
            </Link>
          </div>

          <StatefulButton
            type="submit"
            variant={isLoading ? "inactive" : "active"}
            disabled={isLoading}
          >
            {isLoading ? "Please wait..." : "Sign In"}
          </StatefulButton>

          <p className="text-center text-sm text-gray-600">
            Don&apos;t have account?{" "}
            <Link
              href="/auth/register"
              className="text-blue-600 hover:text-blue-700"
            >
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
