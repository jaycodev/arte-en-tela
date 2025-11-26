'use client'

import React, { useRef, useState } from 'react'

import * as fabric from 'fabric'
import {
  Download,
  ImageIcon,
  Palette,
  RotateCcw,
  Shirt,
  Slash,
  Trash2,
  Type,
  View,
} from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'

import { ThreeDViewer } from '@/components/3d/ThreeDViewer'
import ColorPicker from '@/components/shared/color-picker'
import DesignArea from '@/components/shared/DesignArea'
import { Button } from '@/components/ui/button'
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
import { ThemeToggle } from '@/components/ui/theme-toggle'
import {
  CANVAS_CONFIG,
  DEFAULT_TEXT_CONFIG,
  FONT_OPTIONS,
  TSHIRT_COLOR_CODES,
  TSHIRT_TYPES,
} from '@/lib/constants/designConstants'
import { setSelectedType, setSelectedView, setTshirtColor } from '@/lib/features/tshirtSlice'
import { useCanvas } from '@/lib/hooks/useCanvas'
import { useCanvasTextureSync } from '@/lib/hooks/useCanvasTextureSync'
import type { RootState } from '@/lib/store'
import canvasStorageManager from '@/lib/utils-canvas/canvasStorageManager'

export default function Home() {
  const dispatch = useDispatch()
  const tshirtColor = useSelector((state: RootState) => state.tshirt.tshirtColor)
  const selectedView = useSelector((state: RootState) => state.tshirt.selectedView)
  const selectedType = useSelector((state: RootState) => state.tshirt.selectedType)

  const { frontCanvas, backCanvas, activeCanvas, selectedObject } = useCanvas()
  const { designTextureFront, designTextureBack, manualTriggerSync } = useCanvasTextureSync({
    frontCanvas,
    backCanvas,
    selectedView,
  })

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [lineColor, setLineColor] = useState('#000000')
  const [lineWidth, setLineWidth] = useState(2)

  // Text editing states
  const [text, setText] = useState('')
  const [textColor, setTextColor] = useState('#000000')
  const [font, setFont] = useState('arial')
  const [fontSize, setFontSize] = useState(20)

  // Handler para cambios de vista desde el modelo 3D
  const handle3DViewChange = (newView: 'front' | 'back') => {
    dispatch(setSelectedView(newView))
  }

  const handleShirtColorChange = (color: string) => {
    dispatch(setTshirtColor(color))
  }

  const handleTypeChange = (value: string) => {
    dispatch(setSelectedType(value))
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

    const newText = new fabric.Textbox('Agrega tu texto aquí...', {
      fontSize: DEFAULT_TEXT_CONFIG.fontSize,
      fontFamily: DEFAULT_TEXT_CONFIG.fontFamily,
      fill: DEFAULT_TEXT_CONFIG.fill,
      left: activeCanvas.width! / 2,
      top: activeCanvas.height! / 2,
      width: 200,
      editable: false,
    })

    activeCanvas.add(newText)
    activeCanvas.setActiveObject(newText)
    activeCanvas.renderAll()
  }

  const handleAddLine = () => {
    if (!activeCanvas) return

    const line = new fabric.Line([100, 200, 250, 200], {
      stroke: lineColor,
      strokeWidth: lineWidth,
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
    manualTriggerSync()
  }

  const resetAll = () => {
    if (!activeCanvas) return

    if (window.confirm('¿Estás seguro? Se eliminarán todos los diseños.')) {
      // Clear both canvases
      if (frontCanvas) {
        frontCanvas.clear()
        frontCanvas.renderAll()
      }
      if (backCanvas) {
        backCanvas.clear()
        backCanvas.renderAll()
      }

      // Clear all storage
      canvasStorageManager.clearCanvasStorage('all')

      // Trigger sync to update textures
      manualTriggerSync()
    }
  }

  // Text editing handlers
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedObject || !activeCanvas || selectedObject.type !== 'textbox') return
    const newText = e.target.value
    setText(newText)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(selectedObject as any).set('text', newText)
    activeCanvas.renderAll()
    manualTriggerSync()
  }

  const handleTextColorChange = (color: string) => {
    if (!selectedObject || !activeCanvas || selectedObject.type !== 'textbox') return
    setTextColor(color)
    selectedObject.set('fill', color)
    activeCanvas.renderAll()
    manualTriggerSync()
  }

  const handleFontChange = (newFont: string) => {
    if (!selectedObject || !activeCanvas || selectedObject.type !== 'textbox') return
    setFont(newFont)
    selectedObject.set('fontFamily', newFont)
    activeCanvas.renderAll()
    manualTriggerSync()
  }

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedObject || !activeCanvas || selectedObject.type !== 'textbox') return
    const newSize = parseInt(e.target.value, 10)
    if (isNaN(newSize) || newSize < 1) return
    setFontSize(newSize)
    selectedObject.set('fontSize', newSize)
    activeCanvas.renderAll()
    manualTriggerSync()
  }

  // Line editing handlers
  const handleLineColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedObject || !activeCanvas || selectedObject.type !== 'line') return
    const newColor = e.target.value
    setLineColor(newColor)
    selectedObject.set('stroke', newColor)
    activeCanvas.renderAll()
    manualTriggerSync()
  }

  const handleLineWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedObject || !activeCanvas || selectedObject.type !== 'line') return
    const newWidth = parseInt(e.target.value, 10)
    if (isNaN(newWidth) || newWidth < 1) return
    setLineWidth(newWidth)
    selectedObject.set('strokeWidth', newWidth)
    activeCanvas.renderAll()
    manualTriggerSync()
  }

  // Update local states when object is selected
  React.useEffect(() => {
    if (selectedObject && selectedObject.type === 'textbox') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setText((selectedObject as any).text || '')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setTextColor((selectedObject as any).fill || '#000000')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setFont((selectedObject as any).fontFamily || 'arial')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setFontSize((selectedObject as any).fontSize || 20)
    } else if (selectedObject && selectedObject.type === 'line') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setLineColor((selectedObject as any).stroke || '#000000')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setLineWidth((selectedObject as any).strokeWidth || 2)
    }
  }, [selectedObject])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-card">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Shirt className="size-4" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">Arte en Tela</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={resetAll}
                variant="outline"
                size="sm"
                className="gap-2 bg-transparent"
              >
                <RotateCcw className="h-4 w-4" />
                <span className="hidden sm:inline">Resetear</span>
              </Button>
              <Button size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Descargar</span>
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Canvas Area */}
          <div className="lg:col-span-2 space-y-4">
            {/* 3D Viewer */}
            <div className="rounded-lg border bg-card p-6">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <View className="h-5 w-5" />
                Vista 3D del Modelo
              </h2>
              <ThreeDViewer
                tshirtColor={tshirtColor}
                designTextureFront={designTextureFront}
                designTextureBack={designTextureBack}
                onViewChange={handle3DViewChange}
              />
            </div>

            {/* Design Area */}
            <div className="rounded-lg border bg-card p-6">
              <h2 className="mb-4 text-lg font-semibold">Área de Diseño</h2>
              <DesignArea />
            </div>
          </div>

          {/* Sidebar - Right side with sticky scroll */}
          <div className="space-y-4">
            <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto rounded-lg border bg-card p-4">
              {/* Shirt Color */}
              <div className="mb-4">
                <h3 className="mb-3 flex items-center gap-2 font-semibold text-foreground">
                  <Palette className="h-4 w-4" />
                  Color del Polo
                </h3>
                <ColorPicker
                  value={tshirtColor}
                  onChange={handleShirtColorChange}
                  colors={TSHIRT_COLOR_CODES}
                />
              </div>

              <Separator className="my-4" />

              {/* Neckline Type */}
              <div className="mb-4">
                <Label className="mb-2 text-xs text-muted-foreground">Tipo de Cuello</Label>
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

              <Separator className="my-4" />

              {/* Tools */}
              <div className="space-y-3">
                <h3 className="flex items-center gap-2 font-semibold text-foreground">
                  <Type className="h-4 w-4" />
                  Herramientas
                </h3>

                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleAddImage}
                  className="hidden"
                />

                <Button variant="outline" onClick={triggerFileInput} className="w-full gap-2">
                  <ImageIcon className="h-4 w-4" />
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

                {selectedObject && (
                  <Button onClick={handleDelete} variant="destructive" className="w-full gap-2">
                    <Trash2 className="h-4 w-4" />
                    Eliminar Selección
                  </Button>
                )}
              </div>

              {/* Text Editor - Solo aparece cuando hay texto seleccionado */}
              {selectedObject && selectedObject.type === 'textbox' && (
                <>
                  <Separator className="my-4" />
                  <div className="space-y-3">
                    <Label className="text-lg font-bold">Editar Texto</Label>

                    <div>
                      <Label className="text-xs text-muted-foreground">Tu Texto</Label>
                      <Input
                        type="text"
                        value={text}
                        onChange={handleTextChange}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label className="text-xs text-muted-foreground">Tipo de Fuente</Label>
                      <Select value={font} onValueChange={handleFontChange}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Seleccionar Fuente" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {FONT_OPTIONS.map((fontOption) => (
                              <SelectItem key={fontOption.value} value={fontOption.value}>
                                {fontOption.label}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-xs text-muted-foreground">Tamaño: {fontSize}px</Label>
                      <input
                        type="range"
                        min="12"
                        max="72"
                        value={fontSize}
                        onChange={handleFontSizeChange}
                        className="mt-1 w-full"
                      />
                    </div>

                    <div>
                      <Label className="text-xs text-muted-foreground">Color del Texto</Label>
                      <ColorPicker
                        value={textColor}
                        onChange={handleTextColorChange}
                        colors={[
                          '#000000',
                          '#ffffff',
                          '#ef4444',
                          '#f97316',
                          '#22c55e',
                          '#0ea5e9',
                          '#6366f1',
                          '#ec4899',
                        ]}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Line Editor - Solo aparece cuando hay línea seleccionada */}
              {selectedObject && selectedObject.type === 'line' && (
                <>
                  <Separator className="my-4" />
                  <div className="space-y-3">
                    <Label className="text-lg font-bold">Editar Línea</Label>

                    <div>
                      <Label className="text-xs text-muted-foreground">Color de Línea</Label>
                      <div className="mt-2 flex gap-2">
                        <input
                          type="color"
                          value={lineColor}
                          onChange={handleLineColorChange}
                          className="h-9 w-9 cursor-pointer rounded-md border border-border"
                        />
                        <Input value={lineColor} readOnly className="flex-1 font-mono text-xs" />
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs text-muted-foreground">Grosor: {lineWidth}px</Label>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={lineWidth}
                        onChange={handleLineWidthChange}
                        className="mt-1 w-full"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
