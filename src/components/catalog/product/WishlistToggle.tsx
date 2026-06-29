"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import { Heart, Loader2 } from "lucide-react";
import { toggleWishlistAction, getWishlistProductIdsAction } from "@/utils/actions";
import {
  isIdInCache,
  addIdToCache,
  removeIdFromCache,
  ensureIdsLoaded,
  clearCache as clearWishlistCache,
} from "@/utils/wishlist-cache";
import { useCustomToast } from "@/utils/hooks/useToast";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface WishlistToggleProps {
  productId: string | number;
  initialIsWishlisted?: boolean;
}

export function WishlistToggle({ productId, initialIsWishlisted = false }: WishlistToggleProps) {
  const { showToast } = useCustomToast();
  const { data: session, status } = useSession();
  const router = useRouter();
  const fetchInitiated = useRef(false);
  const prevStatusRef = useRef(status);

  const productIdStr = String(productId);


  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(true);
  const [isPending, startTransition] = useTransition();


  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(() => {
      if (cancelled) return;
      try {
        if (initialIsWishlisted) {
          setIsWishlisted(true);
          return;
        }
        const stored = localStorage.getItem("wishlist_ids");
        if (stored) {
          const parsed: string[] = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            const ids = new Set(parsed);
            const numericId = productIdStr.match(/\d+$/)?.[0] || productIdStr;
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
        setIsWishlisted(isIdInCache(productId.toString()));
      })
      .catch(() => {
      })
      .finally(() => {
        setIsChecking(false);
        fetchInitiated.current = false;
      });
  }, [status]);

  const handleToggle = async () => {
    if (!session) {
      showToast("Please login to manage your wishlist", "warning");
      router.push("/customer/login");
      return;
    }

    startTransition(async () => {
      const previousState = isWishlisted;
      setIsWishlisted(!previousState);

      const result = await toggleWishlistAction(productId);

      if (result.success) {
        const removed = !result.data || !result.data.wishlist;

        if (removed) {
          removeIdFromCache(productId.toString());
          setIsWishlisted(false);
          showToast("Removed from wishlist successfully!", "warning");
        } else {
          addIdToCache(productId.toString());
          setIsWishlisted(true);
          showToast("Added to wishlist successfully!", "success");
        }
      } else {
        setIsWishlisted(previousState);
        showToast(result.message || "Failed to update wishlist", "danger");
      }
    });
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleToggle}
      disabled={isPending || isChecking}
      className={clsx(
        "relative flex shrink-0 items-center justify-center rounded-[10233px] border-[1.02px] border-white transition-all duration-300",
        "w-[40px] h-[40px] p-[10px] lg:w-[48px] lg:h-[48px] lg:p-[12px]",
        "bg-action backdrop-blur-[12.28px] cursor-pointer shadow-md",
        isWishlisted
          ? "text-danger"
          : "text-neutral-900 hover:text-danger"
      )}
      title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      <AnimatePresence mode="wait">
        {isChecking || isPending ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center w-full h-full"
          >
            <Loader2 className="animate-spin text-danger size-5 lg:size-6" />
          </motion.div>
        ) : (
          <motion.div
            key={isWishlisted ? "filled" : "outline"}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center w-full h-full"
          >
            <Heart
              className={clsx(
                "transition-colors duration-300 size-5 lg:size-6",
                isWishlisted ? "fill-current" : "fill-none"
              )}
              strokeWidth={isWishlisted ? 2.5 : 2}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}