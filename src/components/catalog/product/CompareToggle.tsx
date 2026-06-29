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
      } catch (error) {
        console.error("Failed to read compare cache", error);
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
        .catch((error) => {
          console.error("Failed to clear compare cache", error);
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
      .catch((error) => {
        console.error("Failed to load compare ids", error);
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
        "w-[40px] h-[40px] p-[10px] lg:w-[48px] lg:h-[48px] lg:p-[12px]",
        "bg-action backdrop-blur-[12.28px] cursor-pointer shadow-md",
        isCompared
          ? "text-primary"
          : "text-neutral-900 hover:text-primary"
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
            <Loader2 className="animate-spin size-5 lg:size-6" />
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
              className="transition-colors duration-300 size-5 lg:size-6"
              strokeWidth={isCompared ? 2.5 : 2}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
