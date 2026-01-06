import { GUEST_CART_TOKEN, IS_GUEST } from "@/utils/constants";
import { decodeJWT } from "@/utils/jwt-cookie";

export const getNativeCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;

  const cookies = document.cookie.split("; ").map((c) => c.trim());
  const found = cookies.find((c) => c.startsWith(name + "="));
  return found ? decodeURIComponent(found.split("=")[1]) : null;
};

export const getCartToken = (): string | null => {
  const raw = getNativeCookie(GUEST_CART_TOKEN);
  if (!raw) return null;

  const isGuest = getNativeCookie(IS_GUEST) !== "false";

  const decoded = decodeJWT<{ sessionToken: string }>(raw, isGuest);
  return decoded?.sessionToken ?? null;
};

//  fetch any cookie data
export const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;

  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
};

export const setCookie = (name: string, value: string, days = 7) => {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/`;
};

export const deleteCookie = (name: string) => {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; Max-Age=0; path=/`;
};
