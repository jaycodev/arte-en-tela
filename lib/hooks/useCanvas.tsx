'use client'

import { createContext, ReactNode, useContext, useState } from 'react'

import * as fabric from 'fabric'

interface CanvasContextType {
  frontCanvas: fabric.Canvas | null
  setFrontCanvas: (canvas: fabric.Canvas | null) => void
  backCanvas: fabric.Canvas | null
  setBackCanvas: (canvas: fabric.Canvas | null) => void
  activeCanvas: fabric.Canvas | null
  setActiveCanvas: (canvas: fabric.Canvas | null) => void
  selectedObject: fabric.FabricObject | null
  setSelectedObject: (object: fabric.FabricObject | null) => void
}

const CanvasContext = createContext<CanvasContextType | null>(null)

export const CanvasProvider = ({ children }: { children: ReactNode }) => {
  const [frontCanvas, setFrontCanvas] = useState<fabric.Canvas | null>(null)
  const [backCanvas, setBackCanvas] = useState<fabric.Canvas | null>(null)
  const [activeCanvas, setActiveCanvas] = useState<fabric.Canvas | null>(null)
  const [selectedObject, setSelectedObject] = useState<fabric.FabricObject | null>(null)

  return (
    <CanvasContext.Provider
      value={{
        frontCanvas,
        setFrontCanvas,
        backCanvas,
        setBackCanvas,
        activeCanvas,
        setActiveCanvas,
        selectedObject,
        setSelectedObject,
      }}
    >
      {children}
    </CanvasContext.Provider>
  )
}

export const useCanvas = () => {
  const context = useContext(CanvasContext)
  if (!context) {
    throw new Error('useCanvas must be used within a CanvasProvider')
  }
  return context
}
