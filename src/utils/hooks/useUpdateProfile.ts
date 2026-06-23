"use client";

import { useState } from "react";
import { useCustomToast } from "./useToast";

export function useUpdateProfile() {
    const { showToast } = useCustomToast();
    const [isLoading, setIsLoading] = useState(false);

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    };

    const updateProfile = async (input: any, file?: File) => {
        setIsLoading(true);
        try {
            const finalInput = { ...input };

            if (file) {
                const base64Image = await fileToBase64(file);
                finalInput.image = base64Image;
            }

            const response = await fetch("/api/graphql", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    operationName: "updateCustomerProfile",
                    variables: { input: finalInput }
                }),
            });

            const result = await response.json();

            if (result.success === false || result.error) {
                throw new Error(result.message || result.error?.message || "Failed to update profile");
            }

            showToast("Profile updated successfully", "success");
            return { success: true, data: result.data };
        } catch (error: any) {
            let message = error?.message || "An unexpected error occurred";

            if (message.includes('not defined by type') || message.includes('Variable "$input" got invalid value')) {
                message = "Something went wrong while updating your profile. Please try again later.";
            }

            showToast(message, "danger");
            return { success: false, message: message };
        } finally {
            setIsLoading(false);
        }
    };

    return {
        updateProfile,
        isLoading,
    };
}
