import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

import { FABRIC_TYPES } from './constants/designConstants'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface DesignCostBreakdown {
  fabricPrice: number
  designCost: number
  total: number
  details: string
}

export function calculateFabricPrice(fabricType: string): number {
  const fabric = FABRIC_TYPES[fabricType as keyof typeof FABRIC_TYPES]
  return fabric?.basePrice || 35.0
}

export function estimateDesignCost(imageCount: number, textCount: number): number {
  // Estimación: imágenes medianas (S/ 12 c/u), textos cortos (S/ 3 c/u)
  const imageCost = imageCount * 12
  const textCost = textCount * 3
  return imageCost + textCost
}

export function calculateTotalPrice(
  fabricType: string,
  imageCount: number,
  textCount: number
): DesignCostBreakdown {
  const fabricPrice = calculateFabricPrice(fabricType)
  const designCost = estimateDesignCost(imageCount, textCount)
  const total = fabricPrice + designCost

  const details =
    imageCount > 0 || textCount > 0
      ? `Polo (${fabricPrice.toFixed(2)}) + Diseño (${designCost.toFixed(2)})`
      : `Polo (${fabricPrice.toFixed(2)})`

  return {
    fabricPrice,
    designCost,
    total,
    details,
  }
}
