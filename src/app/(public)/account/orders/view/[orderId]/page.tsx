import { getCustomerOrder } from "@/utils/bagisto";
import { notFound } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";
import PrintButton from "@/components/customer-detail/orders/PrintButton";
import AccountBreadcrumbs from "@/components/layout/AccountBreadcrumbs";
import MobileNavHeader from "@/components/layout/navbar/MobileNavHeader";
import { HideMainNavOnMobile } from "@/components/common/HideMainNavOnMobile";

export default async function OrderViewPage({
    params,
    searchParams
}: {
    params: Promise<{ orderId: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const { orderId } = await params;
    const resolvedSearchParams = await searchParams;
    const activeTab = (resolvedSearchParams?.tab as string) || "info";

    const order = await getCustomerOrder(orderId);

    if (!order) {
        notFound();
    }

    const billingAddress = order.addresses?.edges?.find((edge: any) => edge.node.addressType === "order_billing")?.node;
    const shippingAddress = order.addresses?.edges?.find((edge: any) => edge.node.addressType === "order_shipping")?.node || billingAddress;
    const formatDate = (dateStr: string) => {
        if (!dateStr) return "N/A";
        return new Date(dateStr).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <>
            <style dangerouslySetInnerHTML={{
                __html: `
                .invoice-hidden { display: none; }

                .custom-scrollbar::-webkit-scrollbar {
                    width: 9px;
                    height: 9px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #E9E9E9;
                    border-radius: 23px;
                }

                @media print {
                    @page {
                        margin: 0;
                        size: auto;
                    }

                    html, body {
                        height: auto !important;
                        min-height: 0 !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        overflow: visible !important;
                    }

                    body {
                        visibility: hidden;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                        background: white !important;
                    }

                    #invoice-print-pane,
                    #invoice-print-pane * {
                        visibility: visible;
                    }

                    #invoice-print-pane {
                        display: block !important;
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        margin: 0;
                        padding: 40px !important;
                        background: white !important;
                        color: black !important;
                        min-height: 0 !important;
                    }

                    .no-print,
                    header, 
                    footer, 
                    nav,
                    aside,
                    .sticky { 
                        display: none !important; 
                        height: 0 !important;
                        margin: 0 !important;
                        padding: 0 !important;
                    }

                    .invoice-hidden * {
                        color: #000 !important;
                        background: transparent !important;
                        border-color: #000 !important;
                        box-shadow: none !important;
                    }

                    #invoice-print-pane table {
                        width: 100%;
                        border-collapse: collapse;
                        font-size: 13px;
                        overflow: visible !important;
                    }
                    #invoice-print-pane thead tr {
                        background: #f5f5f5 !important;
                    }
                    #invoice-print-pane th,
                    #invoice-print-pane td {
                        padding: 10px 14px;
                        border: 1px solid #e5e5e5 !important;
                        text-align: left;
                    }
                    #invoice-print-pane th {
                        font-weight: 700;
                        font-size: 12px;
                        text-transform: uppercase;
                        letter-spacing: 0.05em;
                    }

                    .print-totals { margin-top: 16px; display: flex; flex-direction: column; align-items: flex-end; gap: 6px; }
                    .print-totals .row { display: flex; justify-content: space-between; width: 320px; font-size: 14px; }
                    .print-totals .grand { font-weight: 800; font-size: 16px; border-top: 2px solid #000 !important; padding-top: 8px; margin-top: 4px; }

                    .print-addr-grid { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 24px; margin-top: 24px; padding-top: 20px; border-top: 1px solid #e5e5e5 !important; font-size: 13px; }
                    .print-addr-grid h3 { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #555 !important; margin-bottom: 8px; }
                    .print-addr-grid p { line-height: 1.7; }
                }
            ` }} />

            <div id="invoice-print-pane" className="invoice-hidden">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, borderBottom: '2px solid #000', paddingBottom: 16 }}>
                    <div>
                        <div style={{ fontSize: 24, fontWeight: 800 }}>Invoice #{order.incrementId}</div>
                        <div style={{ fontSize: 14, color: 'var(--color-muted)', marginTop: 4 }}>Date: {formatDate(order.createdAt)}</div>
                    </div>
                    <div style={{ textAlign: 'right', fontSize: 13, color: 'var(--color-muted-strong)', lineHeight: 1.6 }}>
                        <div style={{ fontWeight: 700 }}>{order.channelName || 'Store'}</div>
                        <div>Status: <strong>{order.status}</strong></div>
                        <div>Currency: {order.orderCurrencyCode}</div>
                    </div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>SKU</th>
                            <th>Name</th>
                            <th style={{ textAlign: 'right' }}>Price</th>
                            <th style={{ textAlign: 'center' }}>Qty</th>
                            <th style={{ textAlign: 'right' }}>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.items?.edges?.map((edge: any) => {
                            const item = edge.node;
                            return (
                                <tr key={item.id}>
                                    <td>{item.sku}</td>
                                    <td>{item.name}</td>
                                    <td style={{ textAlign: 'right' }}>{order.orderCurrencyCode} {parseFloat(item.price).toFixed(2)}</td>
                                    <td style={{ textAlign: 'center' }}>{item.qtyOrdered}</td>
                                    <td style={{ textAlign: 'right' }}>{order.orderCurrencyCode} {parseFloat(item.total).toFixed(2)}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                <div className="print-totals">
                    <div className="row"><span>Subtotal</span><span>{order.orderCurrencyCode} {parseFloat(order.subTotal).toFixed(2)}</span></div>
                    <div className="row"><span>Shipping & Handling</span><span>{order.orderCurrencyCode} {parseFloat(order.shippingAmount).toFixed(2)}</span></div>
                    {parseFloat(order.discountAmount) > 0 && (
                        <div className="row"><span>Discount</span><span>-{order.orderCurrencyCode} {parseFloat(order.discountAmount).toFixed(2)}</span></div>
                    )}
                    <div className="row"><span>Tax</span><span>{order.orderCurrencyCode} {parseFloat(order.taxAmount).toFixed(2)}</span></div>
                    <div className="row grand"><span>Grand Total</span><span>{order.orderCurrencyCode} {parseFloat(order.grandTotal).toFixed(2)}</span></div>
                </div>

                <div className="print-addr-grid">
                    <div>
                        <h3>Billing Address</h3>
                        <p><strong>{billingAddress?.firstName} {billingAddress?.lastName}</strong></p>
                        <p>{billingAddress?.address}</p>
                        <p>{billingAddress?.city}, {billingAddress?.state} {billingAddress?.postcode}</p>
                        <p>{billingAddress?.country}</p>
                        <p>Contact: {billingAddress?.phone}</p>
                    </div>
                    <div>
                        <h3>Shipping Address</h3>
                        <p><strong>{shippingAddress?.firstName} {shippingAddress?.lastName}</strong></p>
                        <p>{shippingAddress?.address}</p>
                        <p>{shippingAddress?.city}, {shippingAddress?.state} {shippingAddress?.postcode}</p>
                        <p>{shippingAddress?.country}</p>
                        <p>Contact: {shippingAddress?.phone}</p>
                    </div>
                    <div>
                        <h3>Shipping Method</h3>
                        <p><strong>{order.shippingTitle || 'N/A'}</strong></p>
                    </div>
                    <div>
                        <h3>Payment Method</h3>
                        <p><strong>{order.paymentTitle || 'Money Transfer'}</strong></p>
                    </div>
                </div>
            </div>

            <div className="w-full no-print">
                <HideMainNavOnMobile />
                <div className="sticky top-0 z-[60] block lg:hidden w-[calc(100%+32px)] -mx-4 -mt-[78px] bg-white dark:bg-black">
                    <MobileNavHeader backUrl="/account/orders" />
                </div>

                <div className="hidden lg:block">
                    <AccountBreadcrumbs />
                </div>

                <div className="flex items-center justify-between mt-5 lg:mt-2.5 mb-6 lg:mb-7_5 pb-2.5 lg:border-none lg:pb-0 gap-6">
                    <h1 className="font-outfit font-semibold text-2xl leading-[24px] lg:font-medium lg:text-26 lg:leading-[40px] text-black dark:text-white text-left">
                        {activeTab === "invoice" ? "Invoice #" + order.incrementId : "Order #" + order.incrementId}
                    </h1>

                    {activeTab === "invoice" && (
                        <div className="shrink-0">
                            <PrintButton orderId={order.incrementId} />
                        </div>
                    )}
                </div>

                <div className="flex gap-3 mb-10 overflow-x-auto pb-2 scrollbar-hide">
                    <Link
                        href={`/account/orders/view/${orderId}?tab=info`}
                        className={clsx(
                            "font-outfit font-medium text-base lg:text-lg lg:leading-[40px] h-14 px-7_5 flex items-center justify-center gap-2.5 rounded-md transition-all whitespace-nowrap min-w-[156px]",
                            activeTab === "info"
                                ? "border border-primary dark:border-primary-soft bg-overlay-subtle text-primary dark:text-primary-soft"
                                : "text-black dark:text-selected-white hover:bg-overlay-subtle"
                        )}
                    >
                        Information
                    </Link>
                    <Link
                        href={`/account/orders/view/${orderId}?tab=invoice`}
                        className={clsx(
                            "font-outfit font-medium text-base lg:text-lg lg:leading-[40px] h-14 px-7_5 flex items-center justify-center gap-2.5 rounded-md transition-all whitespace-nowrap min-w-[156px]",
                            activeTab === "invoice"
                                ? "border border-primary dark:border-primary-soft bg-overlay-subtle text-primary dark:text-primary-soft"
                                : "text-black dark:text-selected-white hover:bg-overlay-subtle"
                        )}
                    >
                        Invoice
                    </Link>
                </div>

                <div 
                    className="max-w-[1030px] w-full flex items-center border-b border-border dark:border-neutral-800 mb-4 py-4"
                >
                    <p className="font-outfit font-medium text-xs lg:text-sm  leading-[22px] text-black dark:text-white">
                        Place On: <span className="ml-8">{formatDate(order.createdAt)}</span>
                    </p>
                </div>

                <div className="hidden lg:block max-w-[1030px] w-full bg-white dark:bg-neutral-900 border border-border-muted dark:border-neutral-800 rounded-md mb-4 overflow-hidden">
                    <div className="overflow-x-auto w-full max-w-full custom-scrollbar">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="h-[70px] bg-overlay-subtle dark:bg-neutral-800 border-b border-border-muted dark:border-neutral-700">
                                    <th className="px-6 py-4 text-left font-outfit font-medium text-sm lg:text-base leading-[22px] text-black dark:text-white">SKU</th>
                                    <th className="px-6 py-4 text-left font-outfit font-medium text-sm lg:text-base leading-[22px] text-black dark:text-white">Name</th>
                                    <th className="px-6 py-4 text-left font-outfit font-medium text-sm lg:text-base leading-[22px] text-black dark:text-white">Price</th>
                                    <th className="px-6 py-4 text-left font-outfit font-medium text-sm lg:text-base leading-[22px] text-black dark:text-white">
                                        {activeTab === "invoice" ? "Qty" : "Item Status"}
                                    </th>
                                    <th className="px-6 py-4 text-left font-outfit font-medium text-sm lg:text-base leading-[22px] text-black dark:text-white">Subtotal</th>
                                </tr>
                            </thead>
                                <tbody className="divide-y divide-border-muted dark:divide-neutral-800">
                                    {order.items?.edges?.map((edge: any, index: number) => {
                                        const item = edge.node;
                                        const isLast = index === (order.items?.edges?.length - 1);
                                        return (
                                            <tr key={item.id} className={clsx(
                                                "h-[87px] bg-white dark:bg-neutral-900 transition-colors hover:bg-overlay-subtle",
                                                !isLast && "border-b border-border-muted dark:border-neutral-700"
                                            )}>
                                                <td className="px-6 py-4 font-outfit font-medium text-base leading-[22px] text-black dark:text-white align-middle">{item.sku}</td>
                                                <td className="px-6 py-4 font-outfit font-medium text-base leading-[22px] text-black dark:text-white align-middle max-w-[300px] truncate">
                                                    {item.name}
                                                </td>
                                                <td className="px-6 py-4 font-outfit font-medium text-base leading-[22px] text-black dark:text-white align-middle whitespace-nowrap">
                                                    {order.orderCurrencyCode} {parseFloat(item.price).toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 font-outfit font-medium text-base leading-[22px] text-black dark:text-white align-middle whitespace-nowrap text-left">
                                                    {activeTab === "invoice" ? (
                                                        <span className="font-outfit font-medium text-base leading-[22px] text-black dark:text-white">{item.qtyOrdered}</span>
                                                    ) : (
                                                        <>Ordered ({item.qtyOrdered}) Invoiced ({item.qtyInvoiced})</>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 font-outfit font-medium text-base leading-[22px] text-black dark:text-white align-middle whitespace-nowrap text-left">
                                                    {order.orderCurrencyCode} {parseFloat(item.total).toFixed(2)}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                        </table>
                    </div>
                </div>

                <div className="block lg:hidden w-full pb-8">
                    {order.items?.edges?.map((edge: any) => {
                        const item = edge.node;
                        return (
                            <div
                                key={item.id}
                                className="mb-4 rounded-md border border-border-muted dark:border-dark-grey bg-white dark:bg-transparent p-3"
                            >
                                <div className="flex flex-col gap-3">
                                    <div className="font-outfit font-medium text-sm leading-[22px] text-black/80 dark:text-white/80">
                                        SKU: <span className="text-black dark:text-white">{item.sku}</span>
                                    </div>
                                    <div className="font-outfit font-medium text-sm leading-[22px] text-black/80 dark:text-white/80">
                                        Name: <span className="text-black dark:text-white">{item.name}</span>
                                    </div>
                                    <div className="font-outfit font-medium text-sm leading-[22px] text-black/80 dark:text-white/80">
                                        Price: <span className="text-black dark:text-white">{order.orderCurrencyCode} {parseFloat(item.price).toFixed(2)}</span>
                                    </div>
                                    <div className="font-outfit font-medium text-sm leading-[22px] text-black/80 dark:text-white/80">
                                        {activeTab === "invoice" ? (
                                            <>Qty: <span className="text-black dark:text-white">{item.qtyOrdered}</span></>
                                        ) : (
                                            <>Status: <span className="text-black dark:text-white">Ordered ({item.qtyOrdered}) Invoiced ({item.qtyInvoiced})</span></>
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-outfit font-medium text-sm leading-[22px] text-black/80 dark:text-white/80">Subtotal</span>
                                        <span className="font-outfit font-medium text-sm leading-[22px] text-black dark:text-white">
                                            {order.orderCurrencyCode} {parseFloat(item.total).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="max-w-[1030px] w-full flex flex-col items-end gap-2 mb-10 px-4 lg:px-0">
                    <div className="w-full sm:w-[257px] flex items-center font-outfit font-normal text-sm lg:text-base leading-[22px] text-black dark:text-selected-white">
                        <span className="flex-1 sm:w-[145px] text-left">Subtotal</span>
                        <span className="w-5 text-center">-</span>
                        <span className="w-[100px] sm:w-[92px] text-right">{order.orderCurrencyCode} {parseFloat(order.subTotal).toFixed(2)}</span>
                    </div>
                    <div className="w-full sm:w-[257px] flex items-center font-outfit font-normal text-sm lg:text-base leading-[22px] text-black dark:text-selected-white">
                        <span className="flex-1 sm:w-[145px] text-left">Shipping & Handling</span>
                        <span className="w-5 text-center">-</span>
                        <span className="w-[100px] sm:w-[92px] text-right">{order.orderCurrencyCode} {parseFloat(order.shippingAmount).toFixed(2)}</span>
                    </div>
                    {parseFloat(order.discountAmount) > 0 && (
                        <div className="w-full sm:w-[257px] flex items-center font-outfit font-normal text-sm lg:text-base leading-[22px] text-black dark:text-selected-white">
                            <span className="flex-1 sm:w-[145px] text-left">Discount</span>
                            <span className="w-5 text-center">-</span>
                            <span className="w-[100px] sm:w-[92px] text-right">-{order.orderCurrencyCode} {parseFloat(order.discountAmount).toFixed(2)}</span>
                        </div>
                    )}
                    <div className="w-full sm:w-[257px] flex items-center font-outfit font-normal text-sm lg:text-base leading-[22px] text-black dark:text-selected-white">
                        <span className="flex-1 sm:w-[145px] text-left">Tax</span>
                        <span className="w-5 text-center">-</span>
                        <span className="w-[100px] sm:w-[92px] text-right">{order.orderCurrencyCode} {parseFloat(order.taxAmount).toFixed(2)}</span>
                    </div>
                    <div className="w-full sm:w-[257px] flex items-center font-outfit font-normal text-sm lg:text-base leading-[22px] text-black dark:text-selected-white">
                        <span className="flex-1 sm:w-[145px] text-left">Grand Total</span>
                        <span className="w-5 text-center">-</span>
                        <span className="w-[100px] sm:w-[92px] text-right">{order.orderCurrencyCode} {parseFloat(order.grandTotal).toFixed(2)}</span>
                    </div>
                    <div className="w-full sm:w-[257px] flex items-center font-outfit font-normal text-sm lg:text-base leading-[22px] text-black dark:text-selected-white">
                        <span className="flex-1 sm:w-[145px] text-left">Total Paid</span>
                        <span className="w-5 text-center">-</span>
                        <span className="w-[100px] sm:w-[92px] text-right">{order.orderCurrencyCode} {(parseFloat(order.grandTotalInvoiced) || 0).toFixed(2)}</span>
                    </div>
                    <div className="w-full sm:w-[257px] flex items-center font-outfit font-normal text-sm lg:text-base leading-[22px] text-black dark:text-selected-white">
                        <span className="flex-1 sm:w-[145px] text-left">Total Refunded</span>
                        <span className="w-5 text-center">-</span>
                        <span className="w-[100px] sm:w-[92px] text-right">{order.orderCurrencyCode} {(parseFloat(order.grandTotalRefunded) || 0).toFixed(2)}</span>
                    </div>
                    <div className="w-full sm:w-[257px] flex items-center font-outfit font-normal text-sm lg:text-base leading-[22px] text-black dark:text-white">
                        <span className="flex-1 sm:w-[145px] text-left">Total Due</span>
                        <span className="w-5 text-center">-</span>
                        <span className="w-[100px] sm:w-[92px] text-right">{order.orderCurrencyCode} {Math.max(0, (parseFloat(order.grandTotal) || 0) - (parseFloat(order.grandTotalInvoiced) || 0)).toFixed(2)}</span>
                    </div>
                </div>

                <div className="max-w-[1030px] w-full flex flex-col sm:flex-row flex-wrap lg:flex-nowrap justify-between gap-10 pt-[26px] pb-[26px] px-4 lg:px-[25px] border-t border-border dark:border-neutral-800 ">
                    <div className="w-full sm:w-[163px] flex flex-col gap-2.5">
                        <h3 className="font-outfit font-normal text-base lg:text-lg leading-[100%] text-muted dark:text-selected-white text-left">
                            Billing Address
                        </h3>
                        <div className="font-outfit font-normal text-sm lg:text-base leading-[26px] text-black dark:text-selected-white flex flex-col gap-0.5">
                            <p className="font-medium">{billingAddress?.firstName} {billingAddress?.lastName}</p>
                            <p>{billingAddress?.address}</p>
                            <p>{billingAddress?.city}, {billingAddress?.state} {billingAddress?.postcode}</p>
                            <p>{billingAddress?.country}</p>
                            <p className="mt-3">Contact: {billingAddress?.phone}</p>
                        </div>
                    </div>
                    <div className="w-full sm:w-[163px] flex flex-col gap-2.5">
                        <h3 className="font-outfit font-normal text-base lg:text-lg leading-[100%] text-muted dark:text-selected-white text-left">
                            Shipping Address
                        </h3>
                        <div className="font-outfit font-normal text-sm lg:text-base leading-[26px] text-black dark:text-selected-white flex flex-col gap-0.5">
                            <p className="font-medium">{shippingAddress?.firstName} {shippingAddress?.lastName}</p>
                            <p>{shippingAddress?.address}</p>
                            <p>{shippingAddress?.city}, {shippingAddress?.state} {shippingAddress?.postcode}</p>
                            <p>{shippingAddress?.country}</p>
                            <p className="mt-3">Contact: {shippingAddress?.phone}</p>
                        </div>
                    </div>
                    <div className="w-full sm:w-[163px] flex flex-col gap-2.5">
                        <h3 className="font-outfit font-normal text-base lg:text-lg leading-[100%] text-muted dark:text-selected-white text-left">
                            Shipping Method
                        </h3>
                        <p className="font-outfit font-normal text-sm lg:text-base leading-[26px] text-black dark:text-selected-white">
                            {order.shippingTitle || "N/A"}
                        </p>
                    </div>
                    <div className="w-full sm:w-[163px] flex flex-col gap-2.5">
                        <h3 className="font-outfit font-normal text-base lg:text-lg leading-[100%] text-muted dark:text-selected-white text-left">
                            Payment Method
                        </h3>
                        <p className="font-outfit font-normal text-sm lg:text-base leading-[26px] text-black dark:text-selected-white">
                            {order.paymentTitle || "Money Transfer"}
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
