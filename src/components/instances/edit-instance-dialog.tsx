"use client";

import React, { useState } from "react";
import { X, Pencil } from "lucide-react";
import { StatefulInput } from "@/components/stateful-input";
import { StatefulButton } from "@/components/stateful-button";
import { updateInstance, InstanceDetails } from "@/services/instance.service";

interface EditInstanceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  instanceDetails: InstanceDetails;
  onSuccess: () => void;
}

export function EditInstanceDialog({ isOpen, onClose, instanceDetails, onSuccess }: EditInstanceDialogProps) {
  const [name, setName] = useState(instanceDetails.instanceName);
  const [location, setLocation] = useState(instanceDetails.location);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await updateInstance(instanceDetails.id, { instanceName: name, location });
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      setError("Failed to update instance. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-[500px] bg-white rounded-lg shadow-xl animate-in fade-in zoom-in duration-200 p-8 space-y-6">
          <div className="flex flex-col items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500">
                  <Pencil className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Editing Instance</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
              <StatefulInput
                  label="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter instance name"
                  disabled={isLoading}
              />

              <StatefulInput
                  label="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter location"
                  disabled={isLoading}
              />

              {error && (
                  <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-100">
                      {error}
                  </div>
              )}

              <div className="flex gap-4 pt-2">
                  <button
                      type="button"
                      onClick={onClose}
                      className="w-full px-4 py-3 rounded-[4px] font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                      disabled={isLoading}
                  >
                      Cancel
                  </button>
                  <StatefulButton
                      type="submit"
                      variant="active"
                      disabled={isLoading}
                  >
                      {isLoading ? "Updating..." : "Update"}
                  </StatefulButton>
              </div>
          </form>
      </div>
    </div>
  );
}
