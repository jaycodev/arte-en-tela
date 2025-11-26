'use client'

import { useCallback, useEffect, useState } from 'react'

import { canvasSyncManager } from '@/lib/utils-canvas/canvasSyncManager'

interface UseCanvasTextureSyncOptions {
  frontCanvas: any | null
  backCanvas: any | null
  selectedView?: 'front' | 'back'
}

export const useCanvasTextureSync = (
  options: UseCanvasTextureSyncOptions = {} as UseCanvasTextureSyncOptions
) => {
  const { frontCanvas, backCanvas, selectedView = 'front' } = options

  const [designTextureFront, setDesignTextureFront] = useState<string | null>(null)
  const [designTextureBack, setDesignTextureBack] = useState<string | null>(null)

  useEffect(() => {
    const canvasMap = {
      front: { canvas: frontCanvas, setter: setDesignTextureFront },
      back: { canvas: backCanvas, setter: setDesignTextureBack },
    }

    const criticalEvents = ['object:modified', 'object:added', 'object:removed']

    const updateTexture = async (view: 'front' | 'back') => {
      const { canvas, setter } = canvasMap[view]
      if (!canvas) return

      try {
        const hasActiveObjects = canvas.getObjects().length > 0
        if (!hasActiveObjects) return

        const texture = await (selectedView === view
          ? canvasSyncManager.getCanvasTexture(canvas)
          : await canvasSyncManager.getCanvasTextureFromStorage(view))

        setter((prevTexture: string | null) =>
          prevTexture !== texture ? (texture as string) : prevTexture
        )
      } catch (error) {
        console.error(`${view} canvas texture update failed:`, error)
      }
    }

    const debouncedUpdateFront = canvasSyncManager.debounce(() => updateTexture('front'), 100)
    const debouncedUpdateBack = canvasSyncManager.debounce(() => updateTexture('back'), 100)

    // Setup events for front canvas
    if (frontCanvas) {
      criticalEvents.forEach((event) => {
        frontCanvas.on(event, debouncedUpdateFront)
      })
    }

    // Setup events for back canvas
    if (backCanvas) {
      criticalEvents.forEach((event) => {
        backCanvas.on(event, debouncedUpdateBack)
      })
    }

    // Initial updates
    updateTexture('front')
    updateTexture('back')

    // Cleanup
    return () => {
      if (frontCanvas) {
        criticalEvents.forEach((event) => {
          frontCanvas.off(event, debouncedUpdateFront)
        })
      }
      if (backCanvas) {
        criticalEvents.forEach((event) => {
          backCanvas.off(event, debouncedUpdateBack)
        })
      }
    }
  }, [frontCanvas, backCanvas, selectedView])

  const manualTriggerSync = useCallback(
    async (view: 'front' | 'back' = 'front') => {
      const canvasMap = {
        front: { canvas: frontCanvas, setter: setDesignTextureFront },
        back: { canvas: backCanvas, setter: setDesignTextureBack },
      }

      const { canvas, setter } = canvasMap[view]

      if (!canvas) {
        console.warn(`manualTriggerSync failed: No canvas available for ${view}`)
        return
      }

      try {
        const texture = await canvasSyncManager.getCanvasTexture(canvas)

        if (!texture) {
          console.warn(`No texture received for ${view}`)
          return
        }

        setter(texture)
      } catch (error) {
        console.error(`Manual ${view} canvas texture update failed:`, error)
      }
    },
    [frontCanvas, backCanvas]
  )

  return {
    designTextureFront,
    designTextureBack,
    manualTriggerSync,
  }
}
