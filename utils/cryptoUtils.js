// utils/cryptoUtils.ts
import { sha512 } from 'js-sha512'; // Asegúrate que js-sha512 esté en tus dependencias

/**
 * Hashes a string using HMAC-SHA512 with a provided key.
 * @param text The string to hash.
 * @param key The key to use for hashing.
 * @returns The hashed string.
 */
export function hashStringWithKey(text, key) {
    return sha512.hmac(key, text);
}