"use client"

import { useEffect, useRef } from "react"
import { encodeAddress } from "@polkadot/util-crypto"
import { toSvg } from "jdenticon"
import { cn } from "@/lib/utils"

interface AccountAvatarProps {
  address: string
  size?: number
  className?: string
}

export function AccountAvatar({
  address,
  size = 40,
  className,
}: AccountAvatarProps) {
  const svgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!svgRef.current || !address) return

    try {
      // Encode address to ensure consistent format
      const encoded = encodeAddress(address, 42)
      // Generate identicon SVG
      const svg = toSvg(encoded, size)
      svgRef.current.innerHTML = svg
    } catch {
      // Fallback to basic identicon if encoding fails
      const svg = toSvg(address, size)
      svgRef.current.innerHTML = svg
    }
  }, [address, size])

  return (
    <div
      ref={svgRef}
      className={cn(
        "rounded-full overflow-hidden bg-muted flex-shrink-0",
        className
      )}
      style={{ width: size, height: size }}
    />
  )
}
