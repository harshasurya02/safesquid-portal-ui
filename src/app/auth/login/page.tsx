"use client";

import { AuthForm } from "@/components/auth-form";

export default function LoginPage() {
  return <AuthForm mode="login" forgotPasswordLink="/auth/forgot-password" />;
}
