'use client'

import { useRef } from 'react'

import * as fabric from 'fabric'
import { ImagePlus, Palette, Slash, Trash, Type } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'

import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  CANVAS_CONFIG,
  DEFAULT_TEXT_CONFIG,
  TSHIRT_COLOR_CODES,
  TSHIRT_TYPES,
} from '@/lib/constants/designConstants'
import { setSelectedType, setTshirtColor } from '@/lib/features/tshirtSlice'
import { useCanvas } from '@/lib/hooks/useCanvas'
import type { RootState } from '@/lib/store'
import canvasStorageManager from '@/lib/utils-canvas/canvasStorageManager'

interface ToolBarProps {
  manualSync: () => void
}

const ToolBar = ({ manualSync }: ToolBarProps) => {
  const dispatch = useDispatch()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const selectedType = useSelector((state: RootState) => state.tshirt.selectedType)
  const { activeCanvas, selectedObject } = useCanvas()

  const handleTypeChange = (value: string) => {
    dispatch(setSelectedType(value))
  }

  const handleColorChange = (color: string) => {
    dispatch(setTshirtColor(color))
  }

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!activeCanvas || !e.target.files || !e.target.files[0]) return

    const file = e.target.files[0]
    const reader = new FileReader()

    reader.onload = (event) => {
      const imgObj = new Image()
      imgObj.src = event.target?.result as string

      imgObj.onload = () => {
        const image = new fabric.Image(imgObj)

        const maxWidth = CANVAS_CONFIG.width * 0.5
        const maxHeight = CANVAS_CONFIG.height * 0.5

        if (image.width && image.height && (image.width > maxWidth || image.height > maxHeight)) {
          const scale = Math.min(maxWidth / image.width, maxHeight / image.height)
          image.scale(scale)
        }

        image.set({
          left: (activeCanvas.width! - image.getScaledWidth()) / 2,
          top: (activeCanvas.height! - image.getScaledHeight()) / 2,
        })

        activeCanvas.add(image)
        activeCanvas.setActiveObject(image)
        activeCanvas.renderAll()
      }
    }

    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const handleAddText = () => {
    if (!activeCanvas) return

    const text = new fabric.Textbox('Agrega tu texto aquí...', {
      ...DEFAULT_TEXT_CONFIG,
      left: activeCanvas.width! / 2,
      top: activeCanvas.height! / 2,
      width: 200,
      editable: false,
    })

    activeCanvas.add(text)
    activeCanvas.setActiveObject(text)
    activeCanvas.renderAll()
  }

  const handleAddLine = () => {
    if (!activeCanvas) return

    const line = new fabric.Line([100, 200, 250, 200], {
      stroke: 'black',
      strokeWidth: 3,
      selectable: true,
      hasControls: true,
      strokeLineCap: 'round',
    })

    activeCanvas.add(line)
    activeCanvas.setActiveObject(line)
    activeCanvas.renderAll()
  }

  const handleDelete = () => {
    if (!activeCanvas || !selectedObject) return

    activeCanvas.remove(selectedObject)
    activeCanvas.discardActiveObject()
    activeCanvas.renderAll()
    manualSync()
  }

  const handleClearAll = () => {
    if (!activeCanvas) return

    activeCanvas.clear()
    canvasStorageManager.clearCanvasStorage('all')
    activeCanvas.renderAll()
    manualSync()
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="mb-2 block text-xs font-medium text-muted-foreground">
          Tipo de Cuello
        </label>
        <Select value={selectedType} onValueChange={handleTypeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {Object.entries(TSHIRT_TYPES).map(([value, { name }]) => (
                <SelectItem key={value} value={value}>
                  {name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleAddImage}
        className="hidden"
      />

      <Button variant="outline" onClick={triggerFileInput} className="w-full gap-2">
        <ImagePlus className="h-4 w-4" />
        Agregar Imagen
      </Button>

      <Button variant="outline" onClick={handleAddText} className="w-full gap-2">
        <Type className="h-4 w-4" />
        Agregar Texto
      </Button>

      <Button variant="outline" onClick={handleAddLine} className="w-full gap-2">
        <Slash className="h-4 w-4" />
        Agregar Línea
      </Button>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full gap-2">
            <Palette className="h-4 w-4" />
            Color del Polo
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Seleccionar Color</h4>
              <p className="text-sm text-muted-foreground">Selecciona el color base de tu polo</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {TSHIRT_COLOR_CODES.map((color) => (
                <button
                  key={color}
                  className="h-8 w-8 rounded-full border-2 border-gray-200 shadow transition-all hover:scale-110 hover:shadow-lg"
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorChange(color)}
                  type="button"
                />
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <Button onClick={handleDelete} variant="destructive" className="w-full gap-2">
        <Trash className="h-4 w-4" />
        Eliminar Selección
      </Button>

      <Button onClick={handleClearAll} variant="destructive" className="w-full gap-2">
        <Trash className="h-4 w-4" />
        Limpiar Todo
      </Button>
    </div>
  )
}

export default ToolBar
