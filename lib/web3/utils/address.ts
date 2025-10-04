import { encodeAddress, decodeAddress } from "@polkadot/util-crypto"

/**
 * Convert address to SS58 format with specific prefix
 */
export function toSS58(address: string, prefix = 42): string | null {
  try {
    return encodeAddress(decodeAddress(address), prefix)
  } catch {
    return null
  }
}

/**
 * Validate if string is a valid Substrate address
 */
export function isValidSubstrateAddress(address: string): boolean {
  try {
    decodeAddress(address)
    return true
  } catch {
    return false
  }
}

/**
 * Get generic substrate address (prefix 42)
 */
export function toGenericSubstrateAddress(address: string): string | null {
  return toSS58(address, 42)
}
