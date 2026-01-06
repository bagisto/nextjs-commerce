import { NEXT_AUTH_SECRET } from "./constants";

export const encodeJWT = (payload: object): string => {
  try {
    const jsonStr = JSON.stringify(payload);
    const encodedPayload = btoa(encodeURIComponent(jsonStr));

    const header = btoa(JSON.stringify({ alg: "none", typ: "JWT" }));

    const token = `${header}.${encodedPayload}.${NEXT_AUTH_SECRET}`;

    return encodeURIComponent(token);
  } catch (e) {
    console.error("Error encoding JWT:", e);
    return "";
  }
};


export const decodeJWT = <T = any>(token: string, isGuest: boolean = true): T | null => {
  try {
    if (!isGuest) {
      return { sessionToken: token } as unknown as T;
    }

    const decodedToken = decodeURIComponent(token);
    const parts = decodedToken.split(".");

    if (parts.length !== 3) {
      return null;
    }

    const payloadPart = parts[1];
    if (!payloadPart) return null;

    const jsonStr = decodeURIComponent(atob(payloadPart));
    return JSON.parse(jsonStr) as T;
  } catch (e) {
    console.warn("Error decoding JWT:", e);
    return null;
  }
};
