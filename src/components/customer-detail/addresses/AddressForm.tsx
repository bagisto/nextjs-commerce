"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Input, Button, Checkbox } from "@heroui/react";
import { createCustomerAddressAction } from "@/utils/actions";
import { useToast } from "@/providers/ToastProvider";

export default function AddressForm({ initialData }: { initialData?: any }) {
    const router = useRouter();
    const { addToast } = useToast();
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            addressId: initialData?._id || initialData?.id || undefined,
            firstName: initialData?.firstName || "",
            lastName: initialData?.lastName || "",
            address1: initialData?.address1 || initialData?.address || "",
            country: initialData?.country || "",
            state: initialData?.state || "",
            city: initialData?.city || "",
            postcode: initialData?.postcode || "",
            phone: initialData?.phone || "",
            defaultAddress: initialData?.defaultAddress || false,
        },
    });

    const onSubmit = async (data: any) => {
        setLoading(true);
        
        const input = {
            ...data,
            addressId: data.addressId ? parseInt(data.addressId) : undefined,
            useForShipping: true,
        };

        const result = await createCustomerAddressAction(input);

        if (result.success) {
            setLoading(false);
            addToast({
                message: initialData ? "Address updated successfully" : "Address added successfully",
                type: "success"
            });
            router.refresh();
            router.push("/account/addresses");
        } else {
            addToast({
                message: result.message || "Failed to save address",
                type: "danger"
            });
            setLoading(false);
        }
    };

    const inputClassNames = {
        label: "font-outfit text-sm font-medium !text-black dark:!text-white mb-2.5",
        inputWrapper: [
            "h-11",
            "border-border",
            "dark:border-neutral-800",
            "bg-white",
            "dark:bg-neutral-900",
            "rounded-xl",
            "border",
            "px-5",
            "shadow-none",
            "group-data-[hover=true]:bg-white",
            "dark:group-data-[hover=true]:bg-neutral-900",
            "group-data-[focus=true]:bg-white",
            "dark:group-data-[focus=true]:bg-neutral-900",
            "group-data-[invalid=true]:!border-border",
            "dark:group-data-[invalid=true]:!border-neutral-800",
        ],
        input: "font-outfit text-base font-medium !text-black dark:!text-white placeholder:text-muted dark:placeholder:text-selected-black",
        mainWrapper: "w-full",
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full max-w-[910px]">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-[15px] mb-7_5">
                <Input
                    {...register("firstName", { required: "First name is mandatory" })}
                    label="First Name"
                    labelPlacement="outside"
                    placeholder="First name"
                    variant="bordered"
                    isInvalid={!!errors.firstName}
                    errorMessage={errors.firstName?.message as string}
                    classNames={inputClassNames}
                />
                <Input
                    {...register("lastName", { required: "Last name is mandatory" })}
                    label="Last Name"
                    labelPlacement="outside"
                    placeholder="Last Name"
                    variant="bordered"
                    isInvalid={!!errors.lastName}
                    errorMessage={errors.lastName?.message as string}
                    classNames={inputClassNames}
                />
            </div>


            <div className="mb-7_5">
                <Input
                    {...register("address1", { required: "Street address is mandatory" })}
                    label="Street Address"
                    labelPlacement="outside"
                    placeholder="Street Address"
                    variant="bordered"
                    isInvalid={!!errors.address1}
                    errorMessage={errors.address1?.message as string}
                    classNames={inputClassNames}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-[15px] mb-7_5">
                <Input
                    {...register("country", { required: "Country is mandatory" })}
                    label="Country"
                    labelPlacement="outside"
                    placeholder="Country"
                    variant="bordered"
                    isInvalid={!!errors.country}
                    errorMessage={errors.country?.message as string}
                    classNames={inputClassNames}
                />
                <Input
                    {...register("state", { required: "State is mandatory" })}
                    label="State"
                    labelPlacement="outside"
                    placeholder="State"
                    variant="bordered"
                    isInvalid={!!errors.state}
                    errorMessage={errors.state?.message as string}
                    classNames={inputClassNames}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-[15px] mb-7_5">
                <Input
                    {...register("city", { required: "City is mandatory" })}
                    label="City"
                    labelPlacement="outside"
                    placeholder="City"
                    variant="bordered"
                    isInvalid={!!errors.city}
                    errorMessage={errors.city?.message as string}
                    classNames={inputClassNames}
                />
                <Input
                    {...register("postcode", { required: "Postal code is mandatory" })}
                    label="Postal Code"
                    labelPlacement="outside"
                    placeholder="Postal Code"
                    variant="bordered"
                    isInvalid={!!errors.postcode}
                    errorMessage={errors.postcode?.message as string}
                    classNames={inputClassNames}
                />
            </div>

            <div className="mb-[15px]">
                <Input
                    {...register("phone", { 
                        required: "Mobile number is mandatory",
                        pattern: {
                            value: /^[0-9+\-\s()]*$/,
                            message: "Please enter a valid phone number"
                        }
                    })}
                    label="Mobile Number"
                    labelPlacement="outside"
                    placeholder="Mobile Number"
                    variant="bordered"
                    isInvalid={!!errors.phone}
                    errorMessage={errors.phone?.message as string}
                    classNames={inputClassNames}
                />
            </div>

            <div className="mb-7_5">
                         <Checkbox
                    {...register("defaultAddress")}
                         classNames={{
                        label: "font-outfit text-sm leading-[100%] text-muted dark:text-white font-normal",
                        wrapper: "before:border-border after:bg-primary",
                    }}
                    size="lg"
                    >
                    Set as Default Address
                     </Checkbox>
            </div>

            <div>
                <Button
                    type="submit"
                    isLoading={loading}
                    className="w-[160px] h-12 lg:w-[196px] lg:h-13 lg:px-20 lg:py-4 bg-primary text-white font-outfit font-semibold text-base leading-[100%] rounded-full shadow-none hover:bg-primary/90 transition-all cursor-pointer"
                >
                    {initialData ? "Update" : "Save"}
                </Button>
            </div>
        </form>
    );
}
