'use client'

import { useEffect, useState } from 'react'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { FONT_OPTIONS } from '@/lib/constants/designConstants'
import { useCanvas } from '@/lib/hooks/useCanvas'

interface TextToolBarProps {
  manualSync: () => void
}

const TextToolBar = ({ manualSync }: TextToolBarProps) => {
  const { activeCanvas, selectedObject } = useCanvas()

  const [text, setText] = useState('')
  const [color, setColor] = useState('#000000')
  const [font, setFont] = useState('arial')
  const [fontSize, setFontSize] = useState(20)

  useEffect(() => {
    if (selectedObject && selectedObject.type === 'textbox') {
      setText((selectedObject as any).text || '')
      setColor((selectedObject as any).fill || '#000000')
      setFont((selectedObject as any).fontFamily || 'arial')
      setFontSize((selectedObject as any).fontSize || 20)
    }
  }, [selectedObject])

  if (!selectedObject || selectedObject.type !== 'textbox') {
    return null
  }

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedObject || !activeCanvas) return
    const newColor = e.target.value
    setColor(newColor)
    selectedObject.set('fill', newColor)
    activeCanvas.renderAll()
    manualSync()
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedObject || !activeCanvas) return
    const newText = e.target.value
    setText(newText)
    ;(selectedObject as any).set('text', newText)
    activeCanvas.renderAll()
    manualSync()
  }

  const handleFontChange = (newFont: string) => {
    if (!selectedObject || !activeCanvas) return
    setFont(newFont)
    selectedObject.set('fontFamily', newFont)
    activeCanvas.renderAll()
    manualSync()
  }

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedObject || !activeCanvas) return
    const newSize = parseInt(e.target.value, 10)
    if (isNaN(newSize) || newSize < 1) return
    setFontSize(newSize)
    selectedObject.set('fontSize', newSize)
    activeCanvas.renderAll()
    manualSync()
  }

  return (
    <div className="mt-4 space-y-3">
      <div>
        <Label className="text-lg font-bold">Editar Texto</Label>
        <Separator className="mt-2" />
      </div>

      <div>
        <Label className="text-xs text-muted-foreground">Tu Texto</Label>
        <Input type="text" value={text} onChange={handleTextChange} className="mt-1" />
      </div>

      <div>
        <Label className="text-xs text-muted-foreground">Tipo de Fuente</Label>
        <Select value={font} onValueChange={handleFontChange}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Seleccionar Fuente" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {FONT_OPTIONS.map((font) => (
                <SelectItem key={font.value} value={font.value}>
                  {font.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-xs text-muted-foreground">Tamaño de Fuente</Label>
        <Input
          type="number"
          value={fontSize}
          min="1"
          onChange={handleFontSizeChange}
          className="mt-1"
        />
      </div>

      <div>
        <Label className="text-xs text-muted-foreground">Color del Texto</Label>
        <div className="mt-1 flex gap-2">
          <Input type="color" value={color} onChange={handleColorChange} className="w-16" />
          <Input value={color} readOnly className="flex-1 font-mono text-xs" />
        </div>
      </div>
    </div>
  )
}

export default TextToolBar
