import React, { useState } from "react";
import { RegisterDetailsStep } from "./register-details-step";
import { RegisterEmailStep } from "./register-email-step";
import { RegisterOtpStep } from "./register-otp-step";
import { RegisterPasswordStep } from "./register-password-step";

type RegisterStep = "email" | "otp" | "password" | "details";

const RegisterForm = () => {
    const [registerStep, setRegisterStep] = useState<RegisterStep>("email");
    const [email, setEmail] = useState("admin@email.com");

    const handleEmailSuccess = (email: string) => {
        setEmail(email);
        setRegisterStep("otp");
    };

    const handleOtpSuccess = () => {
        setRegisterStep("password");
    };

    const handlePasswordSuccess = () => {
        setRegisterStep("details");
    };

    const handleEditEmail = () => {
        setRegisterStep("email");
    };

    const handleBackStep = () => {
        if (registerStep === "otp") {
            setRegisterStep("email");
        } else if (registerStep === "password") {
            setRegisterStep("otp");
        } else if (registerStep === "details") {
            setRegisterStep("password");
        }
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
                    />
                );
            default:
                return null;
        }
    };

    return <>{renderRegisterForm()}</>;
};

export default RegisterForm;