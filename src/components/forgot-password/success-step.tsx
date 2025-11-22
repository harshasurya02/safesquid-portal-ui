import { CircleCheckBig } from "lucide-react";
import { useRouter } from "next/navigation";
import { StatefulButton } from "@/components/stateful-button";

export function SuccessStep() {
    const router = useRouter();

    return (
        <div className="min-h-[85vh] flex items-center justify-center">
            <div className="w-full max-w-sm bg-white rounded-xl shadow-md pt-[1.25rem] px-4 pb-4 text-center">
                <div className="w-full flex justify-center mb-4">
                    <div
                        className="flex items-center justify-center w-12 h-12 rounded-full"
                        style={{ backgroundColor: "#ECFDF3" }}
                    >
                        <div
                            className="flex items-center justify-center w-6 h-6 rounded-full"
                            style={{ backgroundColor: "#D1FADF" }}
                        >
                            <CircleCheckBig
                                size={80}
                                strokeWidth={1.75}
                                className="text-green-600"
                            />
                        </div>
                    </div>
                </div>
                <h2 className="font-semibold text-gray-900 text-lg mb-2">
                    Password Updated
                </h2>
                <p className="text-sm text-gray-600 mb-6">
                    Use your new password to login.
                </p>
                <div className="mt-4">
                    <StatefulButton
                        variant="active"
                        onClick={() => router.push("/auth/login")}
                    >
                        Login
                    </StatefulButton>
                </div>
            </div>
        </div>
    );
}
