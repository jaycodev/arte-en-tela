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
    return new Promise<string | null>((resolve, reject) => {
      try {
        const storageKey = view === 'front' ? STORAGE_KEYS.FRONT_CANVAS : STORAGE_KEYS.BACK_CANVAS

        const storedObjects = localStorage.getItem(storageKey)
        if (!storedObjects) {
          resolve(null)
          return
        }

        const parsedObjects = JSON.parse(storedObjects)

        const tempCanvasEl = document.createElement('canvas')
        tempCanvasEl.width = 450
        tempCanvasEl.height = 500
        const tempCanvas = new fabric.Canvas(tempCanvasEl, {
          width: 450,
          height: 500,
        })

        // @ts-ignore
        fabric.util.enlivenObjects(parsedObjects, (objects: fabric.FabricObject[]) => {
          objects.forEach((obj) => {
            tempCanvas.add(obj)
          })

          const dataURL = tempCanvas.toDataURL({
            format: 'png',
            quality: 1,
            multiplier: 1,
            enableRetinaScaling: true,
          })

          resolve(dataURL)
        })
      } catch (error) {
        console.error('Error retrieving canvas texture from storage:', error)
        reject(error)
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
