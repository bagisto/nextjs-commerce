"use client";

import React, { useTransition, useState, useEffect, useRef } from "react";
import { Loader2, Heart } from "lucide-react";
import { toggleCompareAction, toggleWishlistAction, getWishlistProductIdsAction, getCompareProductIdsAction } from "@/utils/actions";
import {
  isIdInCache,
  addIdToCache,
  removeIdFromCache,
  ensureIdsLoaded,
  clearCache as clearWishlistCache,
} from "@/utils/wishlist-cache";
import {
  isIdInCache as isIdInCompareCache,
  addIdToCache as addIdToCompareCache,
  removeIdFromCache as removeIdFromCompareCache,
  getSyncCachedValue as getCompareSyncCachedValue,
  ensureIdsLoaded as ensureCompareIdsLoaded,
  clearCache as clearCompareCache,
} from "@/utils/compare-cache";
import { useCustomToast } from "@/utils/hooks/useToast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ShoppingCartIcon from "@components/common/icons/ShoppingCartIcon";
import { useAddProduct } from "@utils/hooks/useAddToCart";
import { useAppSelector } from "@/store/hooks";
import { clsx } from "clsx";
import { IMAGES } from "@/utils/constants";

export default function ProductCardActions({
  productType,
  productId,
  productUrlKey,
  isSaleable,
  backUrl,
}: {
  productType: string;
  productId: string;
  productUrlKey: string;
  isSaleable?: string;
  backUrl?: string;
}) {
  const [isComparePending, startCompareTransition] = useTransition();
  const [isWishlistPending, startWishlistTransition] = useTransition();
  const { isCartLoading, onAddToCart } = useAddProduct();
  const { user } = useAppSelector((state) => state.user);
  const { showToast } = useCustomToast();
  const { data: session, status } = useSession();
  const router = useRouter();
  const fetchInitiated = useRef(false);
  const prevStatusRef = useRef(status);
  const compareFetchInitiated = useRef(false);
  const comparePrevStatusRef = useRef(status);


  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(true);
  const [isCompared, setIsCompared] = useState<boolean>(false);
  const [isCompareChecking, setIsCompareChecking] = useState<boolean>(true);


  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(() => {
      if (cancelled) return;
      try {
        const stored = localStorage.getItem("wishlist_ids");
        if (stored) {
          const parsed: string[] = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            const ids = new Set(parsed);
            const numericId = productId.match(/\d+$/)?.[0] || productId;
            setIsWishlisted(ids.has(numericId));
          }
        }
      } catch {
      } finally {
        if (!cancelled) setIsChecking(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const prevStatus = prevStatusRef.current;
    prevStatusRef.current = status;


    if (prevStatus === "authenticated" && status !== "authenticated") {
      if (fetchInitiated.current) return;
      fetchInitiated.current = true;

      Promise.resolve()
        .then(() => {
          clearWishlistCache();
          setIsWishlisted(false);
        })
        .catch(() => {
        })
        .finally(() => {
          setIsChecking(false);
          fetchInitiated.current = false;
        });
      return;
    }


    if (status !== "authenticated") {
      return;
    }

    if (fetchInitiated.current) return;
    fetchInitiated.current = true;

    ensureIdsLoaded(getWishlistProductIdsAction)
      .then(() => {
        setIsWishlisted(isIdInCache(productId));
      })
      .catch(() => {
      })
      .finally(() => {
        setIsChecking(false);
        fetchInitiated.current = false;
      });
  }, [status]);

  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(() => {
      if (cancelled) return;
      try {
        const cached = getCompareSyncCachedValue(productId);
        if (cached !== undefined) {
          setIsCompared(cached);
        }
      } catch {
      } finally {
        if (!cancelled) setIsCompareChecking(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const prevStatus = comparePrevStatusRef.current;
    comparePrevStatusRef.current = status;

    if (prevStatus === "authenticated" && status !== "authenticated") {
      if (compareFetchInitiated.current) return;
      compareFetchInitiated.current = true;

      Promise.resolve()
        .then(() => {
          clearCompareCache();
          setIsCompared(false);
        })
        .catch(() => {
        })
        .finally(() => {
          setIsCompareChecking(false);
          compareFetchInitiated.current = false;
        });
      return;
    }

    if (status !== "authenticated") {
      return;
    }

    if (compareFetchInitiated.current) return;
    compareFetchInitiated.current = true;

    ensureCompareIdsLoaded(getCompareProductIdsAction)
      .then(() => {
        setIsCompared(isIdInCompareCache(productId));
      })
      .catch(() => {
      })
      .finally(() => {
        setIsCompareChecking(false);
        compareFetchInitiated.current = false;
      });
  }, [status]);

  const handleCompare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!session) {
      showToast("Please login to manage your comparison list", "warning");
      router.push("/customer/login");
      return;
    }

    startCompareTransition(async () => {
      const previousState = isCompared;
      setIsCompared(!previousState);

      const result = await toggleCompareAction(productId, previousState);
      if (result.success) {
        const removed = "removed" in result && result.removed === true;

        if (removed) {
          removeIdFromCompareCache(productId);
          setIsCompared(false);
          showToast("Removed from comparison list successfully!", "warning");
        } else {
          addIdToCompareCache(productId);
          setIsCompared(true);
          showToast("Added to comparison list successfully!", "success");
        }
      } else {
        setIsCompared(previousState);
        showToast(result.message || "Failed to update comparison list", "danger");
      }
    });
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!session) {
      showToast("Please login to manage your wishlist", "warning");
      router.push("/customer/login");
      return;
    }

    startWishlistTransition(async () => {
      const previousState = isWishlisted;
      setIsWishlisted(!previousState);

      const result = await toggleWishlistAction(productId);
      if (result.success) {
        const removed = !result.data || !result.data.wishlist;

        if (removed) {
          removeIdFromCache(productId);
          setIsWishlisted(false);
          showToast("Removed from wishlist successfully!", "warning");
        } else {
          addIdToCache(productId);
          setIsWishlisted(true);
          showToast("Added to wishlist successfully!", "success");
        }
      } else {
        setIsWishlisted(previousState);
        showToast(result.message || "Failed to update wishlist", "danger");
      }
    });
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isSaleable || isSaleable === "") {
      showToast("This product is out of stock", "warning");
      return;
    }

    if (productType !== "simple") {
      const targetUrl = backUrl ? `/product/${productUrlKey}?backUrl=${encodeURIComponent(backUrl)}` : `/product/${productUrlKey}`;
      router.push(targetUrl);
      return;
    }

    onAddToCart({
      productId: productId.split("/").pop() || "",
      quantity: 1,
      token: user?.token ?? undefined,
      productType: productType || "simple",
    });
  };

  return (
    <div className="flex items-center justify-between w-full h-full gap-2.5 lg:gap-5">
      <button
        onClick={handleAddToCart}
        disabled={isCartLoading}
        className="flex items-center justify-center cursor-pointer hover:opacity-70 transition-opacity size-5 lg:size-6 shrink-0"
        aria-label="Add to cart"
      >
        {isCartLoading ? (
          <Loader2 className="animate-spin size-4 lg:size-5 text-black" />
        ) : (
          <ShoppingCartIcon className="size-5 lg:size-6 -rotate-6 stroke-black stroke-[1.5]" />
        )}
      </button>

      <button
        onClick={handleCompare}
        disabled={isComparePending || isCompareChecking}
        className="flex items-center justify-center cursor-pointer hover:opacity-70 transition-opacity size-5 lg:size-6 shrink-0"
        aria-label="Compare"
      >
        {isComparePending || isCompareChecking ? (
          <Loader2 className="animate-spin size-4 lg:size-5 text-black" />
        ) : (
          <span
            aria-hidden
            className={clsx(
              "size-5 lg:size-6 transition-colors duration-300",
              isCompared ? "bg-primary" : "bg-black"
            )}
            style={{
              maskImage: `url(${IMAGES.compareArrows})`,
              maskRepeat: "no-repeat",
              maskPosition: "center",
              maskSize: "contain",
              WebkitMaskImage: `url(${IMAGES.compareArrows})`,
              WebkitMaskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
              WebkitMaskSize: "contain",
            }}
          />
        )}
      </button>

      <button
        onClick={handleWishlist}
        disabled={isWishlistPending || isChecking}
        className="flex items-center justify-center cursor-pointer hover:opacity-70 transition-opacity size-5 lg:size-6 shrink-0"
        aria-label="Wishlist"
      >
        {isWishlistPending || isChecking ? (
          <Loader2 className="animate-spin size-4 lg:size-5 text-black" />
        ) : (
          <Heart
            className={clsx(
              "size-5 lg:size-6 transition-colors duration-300",
              isWishlisted ? "fill-danger text-danger" : "fill-none text-black"
            )}
            strokeWidth={isWishlisted ? 2.5 : 1.5}
          />
        )}
      </button>
    </div>
  );
}