import { useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { RegisterDetailsStep } from "./register-details-step";
import { RegisterEmailStep } from "./register-email-step";
import { RegisterInviteTeamStep } from "./register-invite-step";
import { RegisterOtpStep } from "./register-otp-step";
import { RegisterOrganizationStep } from "./register-organization-step";
import { RegisterPasswordStep } from "./register-password-step";

export type RegisterStep =
    | "email"
    | "otp"
    | "password"
    | "details"
    | "organization"
    | "invite";

interface RegisterFormProps {
    onStepChange?: (step: RegisterStep) => void;
}

const RegisterForm = ({ onStepChange }: RegisterFormProps) => {
    const [registerStep, setRegisterStep] = useState<RegisterStep>("invite");
    const [email, setEmail] = useState("admin@email.com");
    const [orgId, setOrgId] = useState<string | null>(null);


    const updateStep = (step: RegisterStep) => {
        setRegisterStep(step);
        if (onStepChange) onStepChange(step);
    };

    const handleEmailSuccess = (email: string) => {
        setEmail(email);
        updateStep("otp");
    };

    const handleOtpSuccess = () => {
        updateStep("password");
    };

    const handlePasswordSuccess = () => {
        updateStep("details");
    };

    const handleDetailsSuccess = () => {
        updateStep("organization");
    };

    const handleOrganizationNext = (orgId: string) => {
        setOrgId(orgId);
        updateStep("invite");
    };

    const handleEditEmail = () => {
        updateStep("email");
    };

    const handleBackStep = () => {
        updateStep("email");
    };

    const renderRegisterForm = () => {
        switch (registerStep) {
            case "email":
                return (
                    <RegisterEmailStep
                        defaultEmail={email}
                        onSuccess={handleEmailSuccess}
                    />
                );
            case "otp":
                return (
                    <RegisterOtpStep
                        email={email}
                        onSuccess={handleOtpSuccess}
                        onEditEmail={handleEditEmail}
                    />
                );
            case "password":
                return (
                    <RegisterPasswordStep
                        email={email}
                        onSuccess={handlePasswordSuccess}
                        onEditEmail={handleEditEmail}
                    />
                );
            case "details":
                return (
                    <RegisterDetailsStep
                        email={email}
                        onEditEmail={handleEditEmail}
                        onBack={handleBackStep}
                        onSuccess={handleDetailsSuccess}
                    />
                );
            case "organization":
                return (
                    <RegisterOrganizationStep
                        email={email}

                        onNext={handleOrganizationNext}
                    />
                );
            case "invite":
                return <RegisterInviteTeamStep orgId={orgId} />;
            default:
                return null;
        }
    };

    return <>{renderRegisterForm()}</>;
};

export default RegisterForm;