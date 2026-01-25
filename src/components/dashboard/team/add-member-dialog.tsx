"use client";

import { useState } from "react";
import { AlertTriangle, Loader2, ChevronDown } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Role } from "@/lib/team-data";
import { apiPost } from "@/services/api.service";

interface AddMemberDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    roles: Role[];
    orgId: string;
    onSuccess: () => void;
}

export function AddMemberDialog({
    open,
    onOpenChange,
    roles,
    orgId,
    onSuccess,
}: AddMemberDialogProps) {
    const [email, setEmail] = useState("");
    const [roleId, setRoleId] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!email.trim()) {
            setError("Email is required");
            return;
        }

        if (!roleId) {
            setError("Please select a role");
            return;
        }

        setIsSubmitting(true);

        try {
            await apiPost("/api/organization/invites", {
                organizationId: orgId,
                invites: [{ email: email.trim(), roleId }]
            });

            // Reset form and close dialog
            setEmail("");
            setRoleId("");
            onOpenChange(false);
            onSuccess();
        } catch (err: any) {
            setError(err.message || "Failed to add member");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        setEmail("");
        setRoleId("");
        setError(null);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md" showCloseButton={false}>
                <DialogHeader className="items-center text-center">
                    <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-amber-50">
                        <AlertTriangle className="h-6 w-6 text-amber-500" />
                    </div>
                    <DialogTitle className="text-xl font-semibold">
                        Add New Member
                    </DialogTitle>
                    <DialogDescription className="text-gray-500">
                        Invite a new member to the organization
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    {error && (
                        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label
                            htmlFor="email"
                            className="text-sm font-medium text-gray-700"
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="example@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="role"
                            className="text-sm font-medium text-gray-700"
                        >
                            Select your role or leave the organization
                        </label>
                        <Select
                            value={roleId}
                            onValueChange={setRoleId}
                            disabled={isSubmitting}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                                {roles.map((role) => (
                                    <SelectItem key={role.id} value={role.id}>
                                        {role.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter className="mt-6 gap-3 sm:gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancel}
                            disabled={isSubmitting}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 bg-[#515def] hover:bg-[#434dbd]"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Save"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
