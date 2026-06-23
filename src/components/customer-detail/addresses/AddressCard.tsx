"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { deleteCustomerAddressAction, setDefaultAddressAction } from "@/utils/actions";
import { useToast } from "@/providers/ToastProvider";
import { 
    Modal, 
    ModalContent, 
    ModalHeader, 
    ModalBody, 
    ModalFooter, 
    Button, 
    useDisclosure 
} from "@heroui/react";

export default function AddressCard({ address }: { address: any }) {
    const router = useRouter();
    const { addToast } = useToast();
    const [showMenu, setShowMenu] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleDelete = async (onClose: () => void) => {
        setIsDeleting(true);
        const result = await deleteCustomerAddressAction(address._id || address.id);
        
        if (result.success) {
            addToast({
                message: "Address deleted successfully",
                type: "warning"
            });
            onClose();
            router.refresh();
        } else {
            addToast({
                message: result.message || "Failed to delete address",
                type: "danger"
            });
            onClose();
        }
        setIsDeleting(false);
    };

    const handleSetDefault = async () => {
        setIsDeleting(true); 
        const result = await setDefaultAddressAction(address);
        
        if (result.success) {
            addToast({
                message: "Default address updated",
                type: "success"
            });
            router.refresh();
        } else {
            addToast({
                message: result.message || "Failed to set default address",
                type: "danger"
            });
        }
        setIsDeleting(false);
        setShowMenu(false);
    };

    const handleEdit = () => {
        router.push(`/account/addresses/edit/${address._id || address.id}`);
        setShowMenu(false);
    };

    const fullAddress = [
        address.companyName,
        address.address1 || address.address,
        address.address2,
        address.city,
        address.state,
        address.country,
        address.postcode
    ].filter(Boolean).join(", ");

    return (
        <>
            <div className="bg-white dark:bg-neutral-900 border border-border dark:border-neutral-800 rounded-md p-6 relative transition-all w-full lg:max-w-[573px] lg:h-[137px] flex flex-col justify-center hover:shadow-md group">
                <div className="flex justify-between items-center w-full lg:max-w-[525px] h-[29px] mb-6">
                    <h3 className="font-outfit text-base font-medium text-black dark:text-white leading-none truncate pr-4">
                        {address.firstName} {address.lastName}
                    </h3>
                    
                    <div className="flex items-center gap-3 flex-shrink-0">
                        {address.defaultAddress && (
                            <span className="px-3 py-1.5 bg-accent text-white text-xs font-bold rounded-full font-outfit shadow-sm whitespace-nowrap leading-none flex items-center h-[29px]">
                                Default Address
                            </span>
                        )}

                        <div className="relative flex items-center h-[29px]" ref={menuRef}>
                            <button 
                                onClick={() => setShowMenu(!showMenu)}
                                className="w-6 h-6 flex items-center justify-center hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-md transition-colors cursor-pointer"
                            >
                                <svg width="4" height="16" viewBox="0 0 4 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="2" cy="2" r="2" fill="#7D7D7D"/>
                                    <circle cx="2" cy="8" r="2" fill="#7D7D7D"/>
                                    <circle cx="2" cy="14" r="2" fill="#7D7D7D"/>
                                </svg>
                            </button>

                            {showMenu && (
                                <div className="absolute right-0 top-[30px] w-[152px] bg-white dark:bg-neutral-900 shadow-[0px_10px_84px_0px_#0000001A] dark:shadow-none dark:border dark:border-neutral-800 rounded-[20px] z-20 py-4 flex flex-col gap-2 overflow-hidden animate-in fade-in slide-in-from-top-2">
                                    <button 
                                        onClick={handleEdit}
                                        className="w-full text-left px-5 py-2 font-outfit text-base font-normal text-black dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer leading-none"
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        onClick={() => {
                                            setShowMenu(false);
                                            onOpen();
                                        }}
                                        className="w-full text-left px-5 py-2 font-outfit text-base font-normal text-black dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer leading-none"
                                    >
                                        Delete
                                    </button>
                                    {!address.defaultAddress && (
                                        <button 
                                            onClick={handleSetDefault}
                                            className="w-full text-left px-5 py-2 font-outfit text-base font-normal text-black dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors whitespace-nowrap cursor-pointer leading-none"
                                        >
                                            Set as Default
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="font-outfit font-normal text-sm text-muted leading-tight line-clamp-2 w-full">
                    {fullAddress}
                </div>
            </div>

            <Modal 
                isOpen={isOpen} 
                onOpenChange={onOpenChange}
                placement="center"
                backdrop="blur"
                classNames={{
                    base: "bg-white dark:bg-neutral-900 rounded-3xl p-6 max-w-[400px]",
                    header: "font-outfit text-2xl font-bold text-black dark:text-white border-b-0",
                    body: "font-outfit text-lg text-selected-black dark:text-selected-white py-4",
                    footer: "border-t-0 pt-0",
                }}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>Delete Address</ModalHeader>
                            <ModalBody>
                                Are you sure you want to delete this address? This action cannot be undone.
                            </ModalBody>
                            <ModalFooter className="gap-4">
                                <Button 
                                    variant="light" 
                                    onPress={onClose}
                                    className="font-outfit font-bold text-base px-8 py-3 rounded-full h-auto text-selected-black cursor-pointer dark:text-selected-white "
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    color="danger" 
                                    onPress={() => handleDelete(onClose)}
                                    isLoading={isDeleting}
                                    className="font-outfit font-bold text-base px-10 py-3 rounded-full bg-red-500 text-white h-auto shadow-lg shadow-red-200 dark:shadow-none cursor-pointer"
                                >
                                    Delete
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
