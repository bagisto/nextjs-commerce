
import { isArray, isObject } from "@/utils/type-guards";

/**
 * Storage keys
 */
export const CURRENCY_CODE = "current_currency";
export const STORE_CODE = "current_store";
export const STORE_CONFIG = "store_config";
export const SELECTED_LOCATION = "elected_location";
export const GUEST_CART = "guest_cart";
export const CART_DATA = "cart_data";
export const COUNTRIES = "countries";
export const LAST_ORDER_ID = "last_order_id";
export const MULTI_CHECKOUT = "ulti_checkout";
export const SHIPPING_ADDRESS = "hipping_address";
export const COMPARE_LIST = "recently_compared_product";
export const COMPARE_ID = "compare_list_uid";
export const IS_GUEST = "is_guest";
export const CUSTOMER = "customer";
export const IS_VIRTUAL_CART = "isVirtualCart";
export const CURRENCY_RATES = "currency_rates";
export const itemsArray = new Array(10).fill(0);
export const SELECTED_STORE = "Store";
export const DEFAULT_CURRENCY_CODE = "DEFAULT_CURRENCY_CODE";
export const IS_AUTO_CURRENCY_SET = "IS_AUTO_CURRENCY_SET";
export const EMAIL = "email";
export const ORDER_DETAILS = "order-details";

export const CACHED_KEYS = {
  MEGA_MENU: "MEGA_MENU",
  ROOT_CATEGORIES: "ROOT_CATEGORIES",
};
/**
 * Set local storage
 *
 * @param {string} key - Key for the storage
 * @param {any} data - Data to be stored
 * @returns void
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const setLocalStorage = (key: string, data: any) => {
  if (typeof window !== "undefined") {
    if (isArray(data) || isObject(data)) {
      data = JSON.stringify(data);
    }
    if (typeof data === "string") {
      localStorage.setItem(key, data);
    }
  }
};

/**
 * Get data from local storage
 *
 * @param {string} key - Key for the storage
 * @param {boolean} needParsedData - Whether to parse the data or not
 * @returns any
 */
export const getLocalStorage = (key: string, needParsedData = false) => {
  try {
    if (typeof window !== "undefined" && window) {
      const data = localStorage.getItem(key);

      if (!data || typeof data === "undefined") return null;
      if (needParsedData) return JSON.parse(data);

      return data;
    }
  } catch (error) {
    console.error('Error:' , error)
    return null;
  }
};

/**
 * Get a specific key from local storage
 *
 * @param {string} storageKey - Key for the storage
 * @param {string} requiredKey - Required key
 * @returns any
 */
export const getKeyFromStorage = (
  storageKey: string ,
  requiredKey: string 
) => {
  const data = getLocalStorage(storageKey, true);

  return data?.[requiredKey] || null;
};

/**
 * Remove data from local storage
 *
 * @param {string} storageKey - Key for the storage
 * @returns void
 */
export const removeFromLocalStorage = (storageKey: string) => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(storageKey);
  }
};

/**
 * Reset cart storage
 *
 * @returns void
 */
export const resetCartStorage = () => {
  removeFromLocalStorage(CART_DATA);
  removeFromLocalStorage(GUEST_CART);
  removeFromLocalStorage(SHIPPING_ADDRESS);
};
