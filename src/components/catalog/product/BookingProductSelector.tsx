"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useLazyQuery } from "@apollo/client/react";
import { GET_BOOKING_SLOTS, GET_RENTAL_BOOKING_SLOTS } from "@/graphql/catalog/queries/BookingSpecificQueries";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Price } from "@components/theme/ui/Price";
import { BookingProduct, BookingSelectionData, BookingSlotItem, BookingSlotGroup, BookingSlotsQueryData, RentalBookingSlotsQueryData } from "@/types/category/type";
import { CustomDatePicker } from "@components/ui/CustomDatePicker";
import { CustomSlotSelect } from "@components/ui/CustomSlotSelect";


interface BookingProductSelectorProps {
    bookingProduct: BookingProduct;
    onSelectionChange: (bookingData: BookingSelectionData | null) => void;
    currencyCode?: string;
}


function formatDateValue(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}



const AppointmentBookingSelector: React.FC<BookingProductSelectorProps> = ({
    bookingProduct,
    onSelectionChange,
}) => {
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [selectedSlot, setSelectedSlot] = useState<string>("");
    const [getSlots, { data, loading }] = useLazyQuery(GET_BOOKING_SLOTS);

    const slotsFromApi = (data as BookingSlotsQueryData | undefined)?.bookingSlots || [];

    const notifyParent = useCallback(() => {
        if (selectedDate && selectedSlot) {
            onSelectionChange({
                type: "appointment",
                date: selectedDate,
                slot: selectedSlot,
            });
        } else {
            onSelectionChange(null);
        }
    }, [selectedDate, selectedSlot, onSelectionChange]);

    useEffect(() => {
        notifyParent();
    }, [notifyParent]);

    const handleDateChange = (date: string) => {
        setSelectedDate(date);
        setSelectedSlot("");
        if (date) {
            getSlots({
                variables: {
                    id: parseInt(bookingProduct._id),
                    date: date,
                }
            });
        }
    };

    const slotOptions = slotsFromApi.map((s: BookingSlotItem) => ({
        label: `${s.from} - ${s.to}`,
        value: `${s.from} - ${s.to}`,
    }));

    return (
        <div className="flex flex-col gap-3 my-6 w-full">
            <h3 className="font-outfit font-normal text-15 leading-[20px] text-black dark:text-white">
                Book an Appointment
            </h3>

            <div className="flex flex-col sm:flex-row w-full max-w-[605px]" style={{ gap: '8px' }}>
                <div className="flex-1 w-full">
                    <CustomDatePicker
                        value={selectedDate}
                        onChange={handleDateChange}
                        placeholder="Select Date"
                        minDate={formatDateValue(new Date())}
                    />
                </div>

                <div className="flex-1 w-full">
                    <CustomSlotSelect
                        value={selectedSlot}
                        onChange={setSelectedSlot}
                        options={slotOptions}
                        placeholder="Select Slot"
                        disabled={!selectedDate}
                        loading={loading}
                    />
                </div>
            </div>
        </div>
    );
};


const EventBookingSelector: React.FC<BookingProductSelectorProps> = ({
    bookingProduct,
    onSelectionChange,
    currencyCode = "USD",
}) => {
    const [selectedTickets, setSelectedTickets] = useState<Record<string, boolean>>(() => {
        const initial: Record<string, boolean> = {};
        bookingProduct.eventTickets?.edges?.forEach(({ node: ticket }, index) => {
            if (index === 0) initial[ticket._id] = true;
        });
        return initial;
    });

    const [ticketQuantities, setTicketQuantities] = useState<Record<string, number>>(() => {
        const initialQtys: Record<string, number> = {};
        bookingProduct.eventTickets?.edges?.forEach(({ node: ticket }) => {
            initialQtys[ticket._id] = 1;
        });
        return initialQtys;
    });

    const handleTicketToggle = (ticketId: string) => {
        setSelectedTickets(prev => ({
            ...prev,
            [ticketId]: !prev[ticketId]
        }));
    };

    const setTicketQuantity = (ticketId: string, value: number) => {
        setTicketQuantities(prev => ({
            ...prev,
            [ticketId]: Math.min(100, Math.max(1, Math.floor(value || 1))),
        }));
    };

    const handleQuantityChange = (ticketId: string, delta: number) => {
        setTicketQuantities(prev => {
            const currentQty = prev[ticketId] || 0;
            const newQty = Math.min(100, Math.max(1, currentQty + delta));
            return { ...prev, [ticketId]: newQty };
        });
    };

    const notifyParent = useCallback(() => {
        const filteredQtys: Record<string, number> = {};
        Object.entries(selectedTickets).forEach(([id, isSelected]) => {
            if (isSelected) {
                filteredQtys[id] = ticketQuantities[id] || 1;
            }
        });
        onSelectionChange({ qty: filteredQtys });
    }, [selectedTickets, ticketQuantities, onSelectionChange]);

    useEffect(() => {
        notifyParent();
    }, [notifyParent]);

    return (
        <div className="flex flex-col gap-6 my-6 w-full">
            <h3 className="font-outfit font-normal text-15 leading-[20px] text-black dark:text-white">
                Book Tickets
            </h3>

            <div className="flex flex-col gap-6">
                {bookingProduct.eventTickets?.edges.map(({ node: ticket }) => {
                    const isSelected = !!selectedTickets[ticket._id];
                    return (
                        <div key={ticket.id} className="flex items-start justify-between gap-4">
                            <div className="flex-1 flex items-start gap-3">
                                <label className="relative flex items-center cursor-pointer mt-[5px] shrink-0">
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => handleTicketToggle(ticket._id)}
                                        className="sr-only"
                                    />
                                        <div className={`w-5 h-5 rounded border transition-all flex items-center justify-center ${isSelected
                                            ? 'bg-primary border-primary dark:bg-primary-soft dark:border-primary-soft'
                                            : 'bg-white border-gray-300 dark:bg-zinc-900 dark:border-zinc-700'
                                        }`}>
                                        {isSelected && (
                                            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </div>
                                </label>
                                <div className="flex flex-col">
                                    <span className="font-outfit font-normal text-base text-selected-black dark:text-white leading-tight">{ticket.translation.name}</span>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Price
                                            amount={String(ticket.specialPrice && parseFloat(ticket.specialPrice) > 0 ? ticket.specialPrice : ticket.price)}
                                            currencyCode={currencyCode}
                                            className="font-outfit font-normal text-sm text-black/60 dark:text-selected-white"
                                        />
                                    </div>
                                    {ticket.translation.description && (
                                        <p className="text-sm text-gray-500 dark:text-selected-white mt-2 leading-relaxed">
                                            {ticket.translation.description}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div
                                className="flex items-center rounded-full border-2 border-primary dark:border-primary-soft bg-gray-50/50 dark:bg-zinc-900/50 shrink-0"
                                style={{
                                    width: '145px',
                                    height: '55px',
                                    minWidth: '145px',
                                    paddingLeft: '26px',
                                    paddingRight: '26px',
                                    paddingTop: '16px',
                                    paddingBottom: '16px',
                                    gap: '12px'
                                }}
                            >
                                <button
                                    type="button"
                                    onClick={() => handleQuantityChange(ticket._id, -1)}
                                    disabled={!isSelected}
                                    className="flex items-center justify-center text-black dark:text-white hover:opacity-70 transition-opacity disabled:opacity-30"
                                >
                                    <MinusIcon className="h-4 w-4 stroke-[2.5]" />
                                </button>
                                <input
                                    type="number"
                                    min={1}
                                    max={100}
                                    inputMode="numeric"
                                    aria-label="Ticket quantity"
                                    disabled={!isSelected}
                                    value={ticketQuantities[ticket._id] || 0}
                                    onChange={(e) => setTicketQuantity(ticket._id, Number(e.target.value))}
                                    className="flex-1 w-full min-w-0 bg-transparent text-center outline-none appearance-none font-outfit font-normal text-base text-black dark:text-white disabled:opacity-30 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleQuantityChange(ticket._id, 1)}
                                    disabled={!isSelected}
                                    className="flex items-center justify-center text-black dark:text-white hover:opacity-70 transition-opacity disabled:opacity-30"
                                >
                                    <PlusIcon className="h-4 w-4 stroke-[2.5]" />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};


const TableBookingSelector: React.FC<BookingProductSelectorProps> = ({
    bookingProduct,
    onSelectionChange,
}) => {
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [selectedSlot, setSelectedSlot] = useState<string>("");
    const [getSlots, { data, loading }] = useLazyQuery(GET_BOOKING_SLOTS);

    const notifyParent = useCallback(() => {
        if (selectedDate && selectedSlot) {
            onSelectionChange({
                type: "table",
                date: selectedDate,
                slot: selectedSlot,
            });
        } else {
            onSelectionChange(null);
        }
    }, [selectedDate, selectedSlot, onSelectionChange]);

    useEffect(() => {
        notifyParent();
    }, [notifyParent]);

    const handleDateChange = (date: string) => {
        setSelectedDate(date);
        setSelectedSlot("");
        if (date) {
            getSlots({
                variables: {
                    id: parseInt(bookingProduct._id),
                    date: date,
                }
            });
        }
    };

    const slotsFromApi = (data as BookingSlotsQueryData | undefined)?.bookingSlots || [];
    const slotOptions = slotsFromApi.map((s: BookingSlotItem) => ({
        label: `${s.from} - ${s.to}`,
        value: `${s.from} - ${s.to}`,
    }));

    return (
        <div className="flex flex-col gap-3 my-6 w-full">
            <h3 className="font-outfit font-normal text-15 leading-[20px] text-black dark:text-white">
                Book a Table
            </h3>

            <div className="flex flex-col sm:flex-row w-full max-w-[605px]" style={{ gap: '8px' }}>
                <div className="flex-1 w-full">
                    <CustomDatePicker
                        value={selectedDate}
                        onChange={handleDateChange}
                        placeholder="Select Date"
                        minDate={formatDateValue(new Date())}
                    />
                </div>

                <div className="flex-1 w-full">
                    <CustomSlotSelect
                        value={selectedSlot}
                        onChange={setSelectedSlot}
                        options={slotOptions}
                        placeholder="Select Slot"
                        disabled={!selectedDate}
                        loading={loading}
                    />
                </div>
            </div>

            {!selectedSlot && selectedDate && !loading && (
                <p className="text-11 italic text-red-500 font-medium ml-1">
                    {slotsFromApi.length === 0 ? "No slots available for this date" : "The Slot field is required"}
                </p>
            )}
        </div>
    );
};


const RentalBookingSelector: React.FC<BookingProductSelectorProps> = ({
    bookingProduct,
    onSelectionChange,
}) => {
    const slot = bookingProduct.rentalSlot;

    const isDailyAvailable = slot?.rentingType?.includes('daily');
    const isHourlyAvailable = slot?.rentingType?.includes('hourly');

    const [rentingType, setRentingType] = useState<'daily' | 'hourly'>(isDailyAvailable ? 'daily' : 'hourly');
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [selectedRentTime, setSelectedRentTime] = useState<string>("");
    const [dateFrom, setDateFrom] = useState<string>("");
    const [dateTo, setDateTo] = useState<string>("");
    const [getSlots, { data, loading }] = useLazyQuery(GET_RENTAL_BOOKING_SLOTS);

    const slotsFromApi = (data as RentalBookingSlotsQueryData | undefined)?.bookingSlots || [];

    const notifyParent = useCallback(() => {
        if (rentingType === 'daily') {
            if (dateFrom && dateTo && new Date(dateTo) >= new Date(dateFrom)) {
                onSelectionChange({
                    type: "rental",
                    renting_type: "daily",
                    date_from: dateFrom,
                    date_to: dateTo,
                });
            } else {
                onSelectionChange(null);
            }
        } else {
            if (selectedDate && selectedRentTime) {
                onSelectionChange({
                    type: "rental",
                    renting_type: "hourly",
                    date: selectedDate,
                    slot: selectedRentTime,
                });
            } else {
                onSelectionChange(null);
            }
        }
    }, [rentingType, dateFrom, dateTo, selectedDate, selectedRentTime, onSelectionChange]);

    useEffect(() => {
        notifyParent();
    }, [notifyParent]);

    const handleDateChange = (date: string) => {
        setSelectedDate(date);
        setSelectedRentTime("");
        if (date) {
            getSlots({
                variables: {
                    id: parseInt(bookingProduct._id),
                    date: date,
                }
            });
        }
    };

    const allHourlyRentTimes = useMemo(() => {
        return slotsFromApi.flatMap((group: BookingSlotGroup) => {
            if (!group.slots) return [];
            return group.slots.map((s: BookingSlotItem | string) => {
                if (typeof s === 'string') return s;
                return `${s.from} - ${s.to}`;
            });
        });
    }, [slotsFromApi]);

    const hourlyTimeOptions = allHourlyRentTimes.map((time: string) => ({
        label: time,
        value: time,
    }));

    return (
        <div className="flex flex-col gap-6 my-6 w-full animate-in fade-in duration-500">
            <div className="flex flex-col gap-3">
                <p className="font-outfit font-normal text-15 leading-[20px] text-black dark:text-white">Rent an Item</p>
                <div className="flex gap-4">
                    {isDailyAvailable && (
                        <label className="cursor-pointer">
                            <input
                                type="radio"
                                name="rentingType"
                                value="daily"
                                checked={rentingType === 'daily'}
                                onChange={() => setRentingType('daily')}
                                className="sr-only"
                            />
                            <div
                                style={{
                                    borderWidth: '1.5px',
                                    borderStyle: 'solid',
                                    borderRadius: '8px',
                                    paddingTop: '10px',
                                    paddingRight: '14px',
                                    paddingBottom: '10px',
                                    paddingLeft: '14px',
                                }}
                                    className={`font-outfit font-normal text-15 leading-[20px] transition-all flex items-center justify-center h-10 ${rentingType === 'daily'
                                    ? 'border-blue-600 dark:border-primary-soft bg-blue-50/50 dark:bg-primary-soft/10 text-blue-600 dark:text-primary-soft'
                                    : 'border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white bg-gray-50 dark:bg-zinc-900 hover:bg-gray-100 dark:hover:bg-zinc-800'
                                    }`}>
                                Daily Basis
                            </div>
                        </label>
                    )}
                    {isHourlyAvailable && (
                        <label className="cursor-pointer">
                            <input
                                type="radio"
                                name="rentingType"
                                value="hourly"
                                checked={rentingType === 'hourly'}
                                onChange={() => setRentingType('hourly')}
                                className="sr-only"
                            />
                            <div
                                style={{
                                    borderWidth: '1.5px',
                                    borderStyle: 'solid',
                                    borderRadius: '8px',
                                    paddingTop: '10px',
                                    paddingRight: '14px',
                                    paddingBottom: '10px',
                                    paddingLeft: '14px',
                                }}
                                    className={`font-outfit font-normal text-15 leading-[20px] transition-all flex items-center justify-center h-10 ${rentingType === 'hourly'
                                    ? 'border-blue-600 dark:border-primary-soft bg-blue-50/50 dark:bg-primary-soft/10 text-blue-600 dark:text-primary-soft'
                                    : 'border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white bg-gray-50 dark:bg-zinc-900 hover:bg-gray-100 dark:hover:bg-zinc-800'
                                    }`}>
                                Hourly
                            </div>
                        </label>
                    )}
                </div>
            </div>

            {rentingType === 'daily' && (
                <div className="flex flex-col gap-3 animate-in slide-in-from-top-2 duration-300">
                    <p className="font-outfit font-normal text-15 leading-[20px] text-black dark:text-white">Select Date</p>
                    <div className="flex flex-col sm:flex-row w-full max-w-[605px]" style={{ gap: '8px' }}>
                        <div className="flex-1 w-full">
                            <CustomDatePicker
                                value={dateFrom}
                                onChange={setDateFrom}
                                placeholder="From"
                                minDate={formatDateValue(new Date())}
                            />
                        </div>
                        <div className="flex-1 w-full">
                            <CustomDatePicker
                                value={dateTo}
                                onChange={setDateTo}
                                placeholder="To"
                                minDate={dateFrom || formatDateValue(new Date())}
                            />
                        </div>
                    </div>
                </div>
            )}

            {rentingType === 'hourly' && (
                <div className="flex flex-col sm:flex-row w-full max-w-[605px] animate-in slide-in-from-top-2 duration-300" style={{ gap: '8px' }}>
                    <div className="flex-1 w-full flex flex-col gap-3">
                        <p className="font-outfit font-normal text-15 leading-[20px] text-black dark:text-white">Select Date</p>
                        <CustomDatePicker
                            value={selectedDate}
                            onChange={handleDateChange}
                            placeholder="Select Date"
                            minDate={formatDateValue(new Date())}
                        />
                    </div>
                    <div className="flex-1 w-full flex flex-col gap-3">
                        <p className="font-outfit font-normal text-15 leading-[20px] text-black dark:text-white">Select Time</p>
                        <CustomSlotSelect
                            value={selectedRentTime}
                            onChange={setSelectedRentTime}
                            options={hourlyTimeOptions}
                            placeholder="Select Time"
                            disabled={!selectedDate || allHourlyRentTimes.length === 0}
                            loading={loading}
                            showClockIcon={true}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};


const DefaultBookingSelector: React.FC<BookingProductSelectorProps> = ({
    bookingProduct,
    onSelectionChange,
}) => {
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [selectedSlot, setSelectedSlot] = useState<string>("");
    const [getSlots, { data, loading }] = useLazyQuery(GET_BOOKING_SLOTS);

    const notifyParent = useCallback(() => {
        if (selectedDate && selectedSlot) {
            onSelectionChange({
                type: "default",
                date: selectedDate,
                slot: selectedSlot,
            });
        } else {
            onSelectionChange(null);
        }
    }, [selectedDate, selectedSlot, onSelectionChange]);

    useEffect(() => {
        notifyParent();
    }, [notifyParent]);

    const handleDateChange = (date: string) => {
        setSelectedDate(date);
        setSelectedSlot("");
        if (date) {
            getSlots({
                variables: {
                    id: parseInt(bookingProduct._id),
                    date: date,
                }
            });
        }
    };

    const slotsFromApi = (data as BookingSlotsQueryData | undefined)?.bookingSlots || [];
    const slotOptions = slotsFromApi.map((s: BookingSlotItem) => ({
        label: `${s.from} - ${s.to}`,
        value: `${s.from} - ${s.to}`,
    }));

    return (
        <div className="flex flex-col gap-3 my-6 w-full animate-in fade-in duration-500">
            <h3 className="font-outfit font-normal text-15 leading-[20px] text-black dark:text-white">
                Book an Appointment
            </h3>

            <div className="flex flex-col sm:flex-row w-full max-w-[605px]" style={{ gap: '8px' }}>
                <div className="flex-1 w-full">
                    <CustomDatePicker
                        value={selectedDate}
                        onChange={handleDateChange}
                        placeholder="Select Date"
                        minDate={formatDateValue(new Date())}
                    />
                </div>

                <div className="flex-1 w-full">
                    <CustomSlotSelect
                        value={selectedSlot}
                        onChange={setSelectedSlot}
                        options={slotOptions}
                        placeholder="Select Slot"
                        disabled={!selectedDate}
                        loading={loading}
                    />
                </div>
            </div>
            {!selectedSlot && selectedDate && !loading && (
                <p className="text-11 italic text-red-500 font-medium ml-1">
                    {slotsFromApi.length === 0 ? "No slots available for this date" : "The Slot field is required"}
                </p>
            )}
        </div>
    );
};


export const BookingProductSelector: React.FC<BookingProductSelectorProps> = (props) => {
    const { bookingProduct } = props;

    if (!bookingProduct) return null;

    if (bookingProduct.type === "appointment") {
        return <AppointmentBookingSelector {...props} />;
    }

    if (bookingProduct.type === "event") {
        return <EventBookingSelector {...props} />;
    }

    if (bookingProduct.type === "table") {
        return <TableBookingSelector {...props} />;
    }

    if (bookingProduct.type === "rental") {
        return <RentalBookingSelector {...props} />;
    }

    if (bookingProduct.type === "default") {
        return <DefaultBookingSelector {...props} />;
    }

    return null;
};
