"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { setUser, clearUser } from "@/store/slices/user-slice";

export const SessionSync = () => {
    const { data: session, status } = useSession();
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (status === "authenticated" && session?.user) {
            dispatch(setUser(session.user as any));
        } else if (status === "unauthenticated") {
            dispatch(clearUser());
        }
    }, [session, status, dispatch]);

    return null;
}
