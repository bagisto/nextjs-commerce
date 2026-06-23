"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import { ArrowRightLeft, Loader2 } from "lucide-react";
import { toggleCompareAction, getCompareProductIdsAction } from "@/utils/actions";
import {
  isIdInCache,
  addIdToCache,
  removeIdFromCache,
  getSyncCachedValue,
  ensureIdsLoaded,
  clearCache as clearCompareCache,
} from "@/utils/compare-cache";
import { useCustomToast } from "@/utils/hooks/useToast";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";

interface CompareToggleProps {
  productId: string | number;
  initialIsCompared?: boolean;
}

export function CompareToggle({ productId, initialIsCompared = false }: CompareToggleProps) {
  const [isPending, startTransition] = useTransition();
  const { showToast } = useCustomToast();
  const { data: session, status } = useSession();
  const router = useRouter();
  const fetchInitiated = useRef(false);
  const prevStatusRef = useRef(status);

  const productIdStr = String(productId);

  const [isCompared, setIsCompared] = useState<boolean>(initialIsCompared);
  const [isChecking, setIsChecking] = useState<boolean>(true);

  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(() => {
      if (cancelled) return;
      try {
        if (initialIsCompared) {
          setIsCompared(true);
          return;
        }
        const cached = getSyncCachedValue(productIdStr);
        if (cached !== undefined) {
          setIsCompared(cached);
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
          clearCompareCache();
          setIsCompared(false);
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

    ensureIdsLoaded(getCompareProductIdsAction)
      .then(() => {
        setIsCompared(isIdInCache(productIdStr));
      })
      .catch(() => {
      })
      .finally(() => {
        setIsChecking(false);
        fetchInitiated.current = false;
      });
  }, [status]);

  const handleCompare = async () => {
    if (!session) {
      showToast("Please login to manage your comparison list", "warning");
      router.push("/customer/login");
      return;
    }

    startTransition(async () => {
      const previousState = isCompared;
      setIsCompared(!previousState);

      const result = await toggleCompareAction(productId, previousState);

      if (result.success) {
        const removed = "removed" in result && result.removed === true;

        if (removed) {
          removeIdFromCache(productIdStr);
          setIsCompared(false);
          showToast("Removed from comparison list successfully!", "warning");
        } else {
          addIdToCache(productIdStr);
          setIsCompared(true);
          showToast("Added to comparison list successfully!", "success");
        }
      } else {
        setIsCompared(previousState);
        showToast(result.message || "Failed to update comparison list", "danger");
      }
    });
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleCompare}
      disabled={isPending || isChecking}
      className={clsx(
        "relative flex shrink-0 items-center justify-center rounded-full border-[1.02px] border-white transition-all duration-300",
        "h-[42px] w-14 sm:h-14 sm:w-[74px]",
        "bg-overlay-light shadow-[0_2px_10px_rgba(0,0,0,0.05)]",
        "backdrop-blur-[12.28px] hover:border-neutral-300 disabled:opacity-50",
        isCompared ? "text-primary" : "text-neutral-900"
      )}
      title={isCompared ? "Remove from comparison list" : "Add to comparison list"}
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
            <Loader2 className="animate-spin size-5 sm:size-[22px]" />
          </motion.div>
        ) : (
          <motion.div
            key={isCompared ? "active" : "inactive"}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center w-full h-full"
          >
            <ArrowRightLeft
              className="transition-colors duration-300 size-5 sm:size-[22px]"
              strokeWidth={isCompared ? 2.5 : 2}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
