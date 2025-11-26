import * as fabric from 'fabric'

import { STORAGE_KEYS } from './canvasStorageManager'

export const canvasSyncManager = {
  getCanvasTexture: (fabricCanvas: any) => {
    if (!fabricCanvas) return null
    try {
      // Force a render before getting the texture
      fabricCanvas.renderAll()

      // Use the upper canvas which contains the actual visible content
      const dataURL = fabricCanvas.toDataURL({
        format: 'png',
        quality: 1,
        multiplier: 1,
        enableRetinaScaling: true,
      })

      return dataURL
    } catch (error) {
      console.error('Error generating texture:', error)
      return null
    }
  },

  getCanvasTextureFromStorage: (view: 'front' | 'back') => {
    return new Promise((resolve) => {
      try {
        const storageKey = view === 'front' ? STORAGE_KEYS.FRONT_CANVAS : STORAGE_KEYS.BACK_CANVAS

        const storedObjects = localStorage.getItem(storageKey)
        if (!storedObjects) {
          resolve(null)
          return
        }

        resolve(null)
      } catch (error) {
        console.error('Error retrieving canvas texture from storage:', error)
        resolve(null)
      }
    })
  },

  // utility function
  debounce: (func: (...args: any[]) => void, wait: number) => {
    let timeout: NodeJS.Timeout
    return function executedFunction(...args: any[]) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  },
}
