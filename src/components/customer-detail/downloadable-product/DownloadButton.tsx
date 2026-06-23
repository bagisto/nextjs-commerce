"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import clsx from "clsx";
import { useToast } from "@/providers/ToastProvider";

export default function DownloadButton({ 
    url, 
    fileName, 
    storefrontKey,
    children
}: { 
    url: string; 
    fileName: string; 
    storefrontKey: string;
    children: React.ReactNode;
}) {
    const [loading, setLoading] = useState(false);
    const { data: session } = useSession();
    const { addToast } = useToast();

    const handleDownload = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!url || loading) return;
        setLoading(true);
        
        try {
            const headers: Record<string, string> = {
                'X-STOREFRONT-KEY': storefrontKey,
            };

            if (session?.user?.accessToken) {
                headers['Authorization'] = `Bearer ${session.user.accessToken}`;
            }

            const response = await fetch(url, {
                method: 'GET',
                headers: headers,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                
                if (response.status === 429) {
                    const retryAfter = errorData.retry_after || 'some time';
                    addToast({ 
                        message: `Rate limit exceeded. Please try again after ${retryAfter} seconds.`, 
                        type: "danger" 
                    });
                } else if (response.status === 401) {
                    addToast({ 
                        message: "Unauthorized. Please log in again to download.", 
                        type: "danger" 
                    });
                } else {
                    addToast({ 
                        message: errorData.message || "Failed to download the file. Please try again.", 
                        type: "danger" 
                    });
                }
                return;
            }

            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = fileName || 'download';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
            
            addToast({ message: "Download started successfully!", type: "success" });
        } catch (error) {
            console.error('Error downloading file:', error);
            addToast({ message: "An unexpected error occurred. Please try again.", type: "danger" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div 
            onClick={handleDownload}
            className={clsx(
                "cursor-pointer transition-all relative",
                loading ? "opacity-50 pointer-events-none" : "hover:opacity-80"
            )}
            style={{ minWidth: '84px', minHeight: '22px' }}
        >
            <span className={loading ? "invisible" : ""}>{children}</span>
            {loading && (
                <span className="absolute inset-0 flex items-center justify-center font-outfit font-medium text-xs lg:text-base leading-[20px] lg:leading-[22px] text-primary dark:text-primary-soft animate-pulse whitespace-nowrap">
                    Downloading...
                </span>
            )}
        </div>
    );
}
