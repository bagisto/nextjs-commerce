import { WISHLIST_AUTH_KEY, WISHLIST_DEFAULT_TTL_MS, WISHLIST_STORAGE_KEY, WISHLIST_TIMESTAMP_KEY } from "./constants";

export function extractNumericId(id: string): string {
  const match = String(id).match(/\d+$/);
  return match ? match[0] : id;
}



let cachedIds: Set<string> | null = null;


export function hasAuthFlag(): boolean {
  try {
    return localStorage.getItem(WISHLIST_AUTH_KEY) === "true";
  } catch {
    return false;
  }
}


export function getSyncCachedValue(productId: string): boolean | undefined {
  if (cachedIds !== null) {
    return cachedIds.has(extractNumericId(productId));
  }

  if (!hasAuthFlag()) return undefined;

  try {
    const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (stored) {
      const parsed: string[] = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        cachedIds = new Set(parsed);
        return cachedIds.has(extractNumericId(productId));
      }
    }
  } catch {
  }

  return undefined;
}

function getOrInitCache(): Set<string> {
  if (cachedIds !== null) return cachedIds;
  if (!hasAuthFlag()) {
    cachedIds = new Set();
    return cachedIds;
  }
  try {
    const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (stored) {
      const parsed: string[] = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        cachedIds = new Set(parsed);
        return cachedIds;
      }
    }
  } catch { }
  cachedIds = new Set();
  return cachedIds;
}

function persistAuthenticated(): void {
  try {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify([...getOrInitCache()]));
    localStorage.setItem(WISHLIST_TIMESTAMP_KEY, String(Date.now()));
    localStorage.setItem(WISHLIST_AUTH_KEY, "true");
  } catch { }
}

export function isIdInCache(productId: string): boolean {
  return getOrInitCache().has(extractNumericId(productId));
}


export function setCachedIds(ids: string[]): void {
  cachedIds = new Set(ids);
  persistAuthenticated();
}

export function addIdToCache(productId: string): void {
  getOrInitCache().add(extractNumericId(productId));
  persistAuthenticated();
}

export function removeIdFromCache(productId: string): void {
  getOrInitCache().delete(extractNumericId(productId));
  persistAuthenticated();
}

export function getAllCachedIds(): string[] {
  return [...getOrInitCache()];
}

export function cachedCount(): number {
  return getOrInitCache().size;
}

export function isCachePopulated(): boolean {
  if (cachedIds !== null) return true;
  if (!hasAuthFlag()) return false;
  try {
    return localStorage.getItem(WISHLIST_STORAGE_KEY) !== null;
  } catch {
    return false;
  }
}

export function isCacheStale(ttlMs: number = WISHLIST_DEFAULT_TTL_MS): boolean {
  if (!hasAuthFlag()) return true;
  try {
    const ts = localStorage.getItem(WISHLIST_TIMESTAMP_KEY);
    if (!ts) return true;
    return Date.now() - Number(ts) > ttlMs;
  } catch {
    return true;
  }
}

export function getLastUpdateTime(): number {
  try {
    return Number(localStorage.getItem(WISHLIST_TIMESTAMP_KEY)) || 0;
  } catch {
    return 0;
  }
}


export function clearCache(): void {
  cachedIds = new Set();
  inflight = null;
  try {
    localStorage.removeItem(WISHLIST_STORAGE_KEY);
    localStorage.removeItem(WISHLIST_TIMESTAMP_KEY);
    localStorage.removeItem(WISHLIST_AUTH_KEY);
  } catch { }
}

let inflight: Promise<void> | null = null;

export function ensureIdsLoaded(
  fetcher: () => Promise<string[]>,
  ttlMs: number = WISHLIST_DEFAULT_TTL_MS
): Promise<void> {
  if (isCachePopulated() && !isCacheStale(ttlMs)) {
    getOrInitCache();
    return Promise.resolve();
  }
  if (inflight) return inflight;
  inflight = fetcher()
    .then((ids) => {
      setCachedIds(ids);
    })
    .catch(() => {
    })
    .finally(() => {
      inflight = null;
    });
  return inflight;
}