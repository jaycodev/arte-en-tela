'use client'

import { useEffect, useState } from 'react'

import * as fabric from 'fabric'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useCanvas } from '@/lib/hooks/useCanvas'

interface LineToolBarProps {
  manualSync: () => void
}

const LineToolBar = ({ manualSync }: LineToolBarProps) => {
  const { selectedObject, activeCanvas } = useCanvas()
  const [color, setColor] = useState('#000000')
  const [strokeWidth, setStrokeWidth] = useState(3)

  useEffect(() => {
    if (selectedObject && selectedObject.type === 'line') {
      const line = selectedObject as fabric.Line
      setColor((line.stroke as string) || '#000000')
      setStrokeWidth(line.strokeWidth || 3)
    }
  }, [selectedObject])

  if (!selectedObject || selectedObject.type !== 'line') {
    return null
  }

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedObject || !activeCanvas) return
    const newColor = e.target.value
    setColor(newColor)
    selectedObject.set('stroke', newColor)
    activeCanvas.renderAll()
    manualSync()
  }

  const handleStrokeWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedObject || !activeCanvas) return
    const newSize = parseInt(e.target.value, 10)
    if (isNaN(newSize) || newSize < 1) return
    setStrokeWidth(newSize)
    selectedObject.set('strokeWidth', newSize)
    activeCanvas.renderAll()
    manualSync()
  }

  return (
    <div className="mt-4 space-y-3">
      <div>
        <Label className="text-lg font-bold">Editar Línea</Label>
        <Separator className="mt-2" />
      </div>

      <div>
        <Label className="text-xs text-muted-foreground">Color de Línea</Label>
        <div className="mt-1 flex gap-2">
          <Input type="color" value={color} onChange={handleColorChange} className="w-16" />
          <Input value={color} readOnly className="flex-1 font-mono text-xs" />
        </div>
      </div>

      <div>
        <Label className="text-xs text-muted-foreground">Grosor de Línea</Label>
        <Input
          type="number"
          value={strokeWidth}
          min="1"
          onChange={handleStrokeWidthChange}
          className="mt-1"
        />
      </div>
    </div>
  )
}

export default LineToolBar
