'use client'

import { useCallback, useEffect, useRef } from 'react'

import * as fabric from 'fabric'
import { useDispatch, useSelector } from 'react-redux'

import { CANVAS_CONFIG } from '@/lib/constants/designConstants'
import { useCanvas } from '@/lib/hooks/useCanvas'
import canvasStorageManager from '@/lib/utils-canvas/canvasStorageManager'
import { canvasSyncManager } from '@/lib/utils-canvas/canvasSyncManager'

import type { RootState } from '../store'

interface UseTshirtCanvasProps {
  svgPath: string
  view: 'front' | 'back'
  onDesignUpdate?: (textureDataUrl: string) => void
}

export const useTshirtCanvas = ({ svgPath, view, onDesignUpdate }: UseTshirtCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null)
  const tshirtColor = useSelector((state: RootState) => state.tshirt.tshirtColor)
  const selectedView = useSelector((state: RootState) => state.tshirt.selectedView)
  const dispatch = useDispatch()

  const { setActiveCanvas, setSelectedObject, setFrontCanvas, setBackCanvas } = useCanvas()

  const saveCanvas = () => {
    if (fabricCanvasRef.current) {
      canvasStorageManager.saveCanvasObjects(view, fabricCanvasRef.current)
    }
  }

  const notifyDesignChange = useCallback(() => {
    if (fabricCanvasRef.current && onDesignUpdate) {
      const textureDataUrl = canvasSyncManager.getCanvasTexture(fabricCanvasRef.current)
      if (textureDataUrl) {
        onDesignUpdate(textureDataUrl)
      }
    }
  }, [onDesignUpdate])

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = new fabric.Canvas(canvasRef.current, {
      ...CANVAS_CONFIG,
      preserveObjectStacking: true,
    })

    fabricCanvasRef.current = canvas

    if (view === 'front') setFrontCanvas(canvas)
    if (view === 'back') setBackCanvas(canvas)

    if (selectedView === view) {
      setActiveCanvas(canvas)
    }

    window.addEventListener('beforeunload', saveCanvas)

    const savedObjects = canvasStorageManager.loadCanvasObjects(view)
    if (savedObjects) {
      savedObjects.forEach((obj: Record<string, unknown> & { type?: string }) =>
        addFabricObject(canvas, obj)
      )
      canvas.renderAll()
    }

    canvas.on('selection:created', (e) => {
      const target = (e as { selected?: fabric.FabricObject[] }).selected?.[0]
      if (target) setSelectedObject(target)
    })

    canvas.on('selection:updated', (e) => {
      const target = (e as { selected?: fabric.FabricObject[] }).selected?.[0]
      if (target) setSelectedObject(target)
    })

    canvas.on('selection:cleared', () => {
      setSelectedObject(null)
    })

    canvas.on('object:modified', notifyDesignChange)
    canvas.on('object:added', notifyDesignChange)
    canvas.on('object:removed', notifyDesignChange)

    // Cleanup
    return () => {
      saveCanvas()
      canvas.off('object:modified', notifyDesignChange)
      canvas.off('object:added', notifyDesignChange)
      canvas.off('object:removed', notifyDesignChange)
      canvas.dispose()
      fabricCanvasRef.current = null
      if (selectedView === view) {
        setActiveCanvas(null)
      }
      setSelectedObject(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, view])

  useEffect(() => {
    if (selectedView === view && fabricCanvasRef.current) {
      setActiveCanvas(fabricCanvasRef.current)
      
      const savedObjects = canvasStorageManager.loadCanvasObjects(view)
      if (savedObjects) {
        const canvas = fabricCanvasRef.current
        canvas.clear()
        savedObjects.forEach((obj: Record<string, unknown> & { type?: string }) =>
          addFabricObject(canvas, obj)
        )
        canvas.renderAll()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedView, dispatch, view])

  useEffect(() => {
    const canvas = fabricCanvasRef.current
    if (!canvas || !svgPath) return

    const clipPath = new fabric.Path(svgPath)
    const scale = CANVAS_CONFIG.height / 810
    clipPath.set({
      scaleX: scale * 0.9,
      scaleY: scale * 0.9,
      left: 5,
      top: 64,
      originX: 'left',
      originY: 'top',
      absolutePositioned: true,
    })

    canvas.clipPath = clipPath
  }, [svgPath])

  return { canvasRef, fabricCanvasRef, tshirtColor }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const addFabricObject = (canvas: fabric.Canvas, objectData: any) => {
  switch (objectData.type) {
    case 'Line':
      canvas.add(
        new fabric.Line([objectData.x1, objectData.y1, objectData.x2, objectData.y2], {
          left: objectData.left || 0,
          top: objectData.top || 0,
          stroke: objectData.stroke || 'black',
          strokeWidth: objectData.strokeWidth || 2,
          strokeLineCap: objectData.strokeLineCap || 'round',
          strokeLineJoin: objectData.strokeLineJoin || 'miter',
          opacity: objectData.opacity || 1,
          angle: objectData.angle || 0,
          scaleX: objectData.scaleX || 1,
          scaleY: objectData.scaleY || 1,
        })
      )
      break
    case 'Textbox':
      const textbox = new fabric.Textbox(objectData.text, {
        left: objectData.left,
        top: objectData.top,
        width: objectData.width,
        fontSize: objectData.fontSize,
        fontFamily: objectData.fontFamily,
        textAlign: objectData.textAlign,
        fill: objectData.fill,
        scaleX: objectData.scaleX,
        scaleY: objectData.scaleY,
        angle: objectData.angle,
        opacity: objectData.opacity,
      })

      // Force text re-rendering and positioning
      textbox.initDimensions()
      textbox.set({
        width: textbox.width,
        height: textbox.height,
      })

      canvas.add(textbox)

      // Ensure proper rendering after a short delay

      canvas.renderAll()
      break
    case 'Image':
      if (!objectData.src.startsWith('data:image')) return
      const imgElement = new Image()
      imgElement.src = objectData.src
      imgElement.onload = () => {
        const fabricImg = new fabric.Image(imgElement, {
          left: objectData.left || 0,
          top: objectData.top || 0,
          scaleX: objectData.scaleX || 1,
          scaleY: objectData.scaleY || 1,
          angle: objectData.angle || 0,
          opacity: objectData.opacity || 1,
        })
        canvas.add(fabricImg)
        canvas.renderAll()
      }
      break
  }
}
