"use client";

import { useState, useEffect, useMemo, useRef } from 'react';
import { Checkbox, CheckboxGroup, Link } from "@heroui/react";
import { ProductDownloadableLinkEdge, ProductDownloadableSampleEdge } from "@/types/category/type";

interface Props {
    downloadableLinks: {
        edges: ProductDownloadableLinkEdge[];
    } | null | undefined;
    downloadableSamples: {
        edges: ProductDownloadableSampleEdge[];
    } | null | undefined;
    onSelectionChange: (selectedLinks: string[]) => void;
}

export function DownloadableProductSelector({
    downloadableLinks,
    downloadableSamples,
    onSelectionChange
}: Props) {
    const [selectedLinks, setSelectedLinks] = useState<string[]>([]);
    const lastSentRef = useRef<string>("");

    const getTitle = (node: { translation?: { title?: string } | Array<{ title?: string }> }) => {
        if (!node.translation) return "Sample";
        if (Array.isArray(node.translation)) {
            return node.translation[0]?.title || "Sample";
        }
        return node.translation.title || "Sample";
    };

    useEffect(() => {
        const currentData = JSON.stringify(selectedLinks);
        if (currentData !== lastSentRef.current) {
            onSelectionChange(selectedLinks);
            lastSentRef.current = currentData;
        }
    }, [selectedLinks, onSelectionChange]);

    const links = useMemo(() => downloadableLinks?.edges || [], [downloadableLinks]);
    const samples = useMemo(() => downloadableSamples?.edges || [], [downloadableSamples]);

    if (links.length === 0 && samples.length === 0) return null;

    return (
        <div className="flex flex-col gap-4 my-6">
            {links.length > 0 && (
                <div className="flex flex-col gap-4">
                    <h3 className="font-outfit text-15 font-normal leading-5 text-black dark:text-zinc-300">Links</h3>
                    <CheckboxGroup
                        value={selectedLinks}
                        onValueChange={setSelectedLinks}
                        className="gap-4 w-full"
                    >
                        {links.map(({ node }) => {
                            const sampleUrl = node.sampleFileUrl || node.sampleUrl;
                            const title = getTitle(node);

                            return (
                                <div key={node._id} className="flex items-center justify-between gap-4">
                                    <Checkbox
                                        value={String(node._id)}
                                        radius="sm"
                                        color="primary"
                                        classNames={{
                                            base: "max-w-full",
                                            label: "font-outfit text-base font-normal leading-5 text-selected-black dark:text-zinc-300 cursor-pointer ml-2",
                                            wrapper: "group-data-[selected=true]:bg-blue-600 group-data-[selected=true]:border-blue-600 dark:group-data-[selected=true]:!bg-primary-soft dark:group-data-[selected=true]:!border-primary-soft"
                                        }}
                                    >
                                        <span className="font-outfit text-base font-normal leading-5 text-selected-black dark:text-zinc-300">
                                            {title}
                                            {Number(node.price) > 0 && (
                                                <span className="ml-1 text-selected-black dark:text-zinc-400">
                                                    + {node.formattedPrice}
                                                </span>
                                            )}
                                        </span>
                                    </Checkbox>

                                    {sampleUrl && (
                                        <Link
                                            href={sampleUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="font-outfit text-15 font-normal leading-5 text-primary dark:text-blue-400 hover:underline p-0"
                                        >
                                            Sample
                                        </Link>
                                    )}
                                </div>
                            );
                        })}
                    </CheckboxGroup>
                </div>
            )}
        </div>
    );
}
