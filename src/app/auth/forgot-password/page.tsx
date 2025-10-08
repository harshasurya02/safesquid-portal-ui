import { ForgotPasswordForm } from "@/components/forgot-password-form";
import { Suspense } from "react";

export default function ForgotPasswordPage() {
  return (
    <Suspense>
      <ForgotPasswordForm />;
    </Suspense>
  );
}
