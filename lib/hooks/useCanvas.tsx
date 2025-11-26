'use client'

import { createContext, ReactNode, useContext, useState } from 'react'

interface CanvasContextType {
  frontCanvas: any | null
  setFrontCanvas: (canvas: any) => void
  backCanvas: any | null
  setBackCanvas: (canvas: any) => void
  activeCanvas: any | null
  setActiveCanvas: (canvas: any) => void
  selectedObject: any | null
  setSelectedObject: (object: any) => void
}

const CanvasContext = createContext<CanvasContextType | null>(null)

export const CanvasProvider = ({ children }: { children: ReactNode }) => {
  const [frontCanvas, setFrontCanvas] = useState<any | null>(null)
  const [backCanvas, setBackCanvas] = useState<any | null>(null)
  const [activeCanvas, setActiveCanvas] = useState<any | null>(null)
  const [selectedObject, setSelectedObject] = useState<any | null>(null)

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
