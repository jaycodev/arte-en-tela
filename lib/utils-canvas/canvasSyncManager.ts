import * as fabric from 'fabric'

import { STORAGE_KEYS } from './canvasStorageManager'

export const canvasSyncManager = {
  getCanvasTexture: (fabricCanvas: fabric.Canvas | null) => {
    if (!fabricCanvas) return null
    try {
      fabricCanvas.renderAll()

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
    return new Promise<string | null>((resolve) => {
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

  debounce: <T extends unknown[]>(func: (...args: T) => void, wait: number) => {
    let timeout: NodeJS.Timeout
    return function executedFunction(...args: T) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  },
}
