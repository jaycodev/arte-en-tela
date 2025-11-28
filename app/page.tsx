'use client'

import React, { useRef, useState } from 'react'

import * as fabric from 'fabric'
import {
  ImageIcon,
  Palette,
  Pencil,
  RotateCcw,
  Shirt,
  ShoppingCart,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
  FABRIC_TYPES,
  FONT_OPTIONS,
  TSHIRT_SIZES,
  TSHIRT_TYPES,
} from '@/lib/constants/designConstants'
import {
  setSelectedFabric,
  setSelectedSize,
  setSelectedType,
  setSelectedView,
  setTshirtColor,
} from '@/lib/features/tshirtSlice'
import { useCanvas } from '@/lib/hooks/useCanvas'
import { useCanvasTextureSync } from '@/lib/hooks/useCanvasTextureSync'
import type { RootState } from '@/lib/store'
import { calculateTotalPrice } from '@/lib/utils'
import canvasStorageManager from '@/lib/utils-canvas/canvasStorageManager'

export default function Home() {
  const dispatch = useDispatch()
  const tshirtColor = useSelector((state: RootState) => state.tshirt.tshirtColor)
  const selectedView = useSelector((state: RootState) => state.tshirt.selectedView)
  const selectedType = useSelector((state: RootState) => state.tshirt.selectedType)
  const selectedSize = useSelector((state: RootState) => state.tshirt.selectedSize)
  const selectedFabric = useSelector((state: RootState) => state.tshirt.selectedFabric)

  const { frontCanvas, backCanvas, activeCanvas, selectedObject } = useCanvas()
  const { designTextureFront, designTextureBack, manualTriggerSync } = useCanvasTextureSync({
    frontCanvas,
    backCanvas,
    selectedView,
  })

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [lineColor, setLineColor] = useState('#000000')
  const [lineWidth, setLineWidth] = useState(2)

  const [text, setText] = useState('')
  const [textColor, setTextColor] = useState('#000000')
  const [font, setFont] = useState('arial')
  const [fontSize, setFontSize] = useState(20)

  const [canvasObjects, setCanvasObjects] = useState<fabric.FabricObject[]>([])
  const [showPurchasePreview, setShowPurchasePreview] = useState(false)

  // Calcula el precio total del polo
  const getTotalPrice = () => {
    const imageCount = canvasObjects.filter((obj) => obj.type === 'image').length
    const textCount = canvasObjects.filter((obj) => obj.type === 'textbox').length
    const priceData = calculateTotalPrice(selectedFabric, imageCount, textCount)
    return priceData.total
  }

  // Obtiene los detalles de la compra
  const getPurchaseDetails = () => {
    const imageCount = canvasObjects.filter((obj) => obj.type === 'image').length
    const textCount = canvasObjects.filter((obj) => obj.type === 'textbox').length
    const priceData = calculateTotalPrice(selectedFabric, imageCount, textCount)

    const fabricLabel =
      FABRIC_TYPES[selectedFabric as keyof typeof FABRIC_TYPES]?.label || 'Desconocido'
    const sizeLabel = TSHIRT_SIZES[selectedSize as keyof typeof TSHIRT_SIZES]?.label || 'M'
    const neckLabel =
      TSHIRT_TYPES[selectedType as keyof typeof TSHIRT_TYPES]?.name || 'Cuello Redondo'

    return {
      fabricLabel,
      sizeLabel,
      neckLabel,
      imageCount,
      textCount,
      priceData,
    }
  }

  const handle3DViewChange = (newView: 'front' | 'back') => {
    dispatch(setSelectedView(newView))
  }

  const handleShirtColorChange = (color: string) => {
    dispatch(setTshirtColor(color))
  }

  const handleTypeChange = (value: string) => {
    dispatch(setSelectedType(value))
  }

  const handleSizeChange = (value: string) => {
    dispatch(setSelectedSize(value))
  }

  const handleFabricChange = (value: string) => {
    dispatch(setSelectedFabric(value))
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

    // eslint-disable-next-line no-alert
    if (window.confirm('¿Estás seguro? Se eliminarán todos los diseños.')) {
      if (frontCanvas && frontCanvas.clear) {
        frontCanvas.clear()
        frontCanvas.renderAll()
      }
      if (backCanvas && backCanvas.clear) {
        backCanvas.clear()
        backCanvas.renderAll()
      }

      canvasStorageManager.clearCanvasStorage('all')

      manualTriggerSync('front')
      manualTriggerSync('back')
    }
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedObject || !activeCanvas || selectedObject.type !== 'textbox') return
    const newText = e.target.value
    setText(newText)
    const textbox = selectedObject as fabric.Textbox
    textbox.set('text', newText)
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

  // Update canvas objects list
  React.useEffect(() => {
    if (activeCanvas) {
      const updateObjects = () => {
        const objects = activeCanvas.getObjects()
        setCanvasObjects([...objects])
      }

      activeCanvas.on('object:added', updateObjects)
      activeCanvas.on('object:removed', updateObjects)
      activeCanvas.on('object:modified', updateObjects)

      updateObjects()

      return () => {
        activeCanvas.off('object:added', updateObjects)
        activeCanvas.off('object:removed', updateObjects)
        activeCanvas.off('object:modified', updateObjects)
      }
    }
  }, [activeCanvas])

  // Update local states when object is selected
  React.useEffect(() => {
    if (selectedObject && selectedObject.type === 'textbox') {
      const textbox = selectedObject as fabric.Textbox
      setText(textbox.text || '')
      setTextColor((textbox.fill as string) || '#000000')
      setFont(textbox.fontFamily || 'arial')
      setFontSize(textbox.fontSize || 20)
    } else if (selectedObject && selectedObject.type === 'line') {
      const line = selectedObject as fabric.Line
      setLineColor((line.stroke as string) || '#000000')
      setLineWidth(line.strokeWidth || 2)
    }
  }, [selectedObject])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-card">
        <div className="mx-auto max-w-[1920px] px-4 py-3 sm:py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-primary text-white">
                <Shirt className="size-3 sm:h-4 sm:w-4" />
              </div>
              <h1 className="text-lg font-bold text-foreground">Arte en Tela</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={resetAll}
                variant="outline"
                size="sm"
                className="gap-1 sm:gap-2 bg-transparent px-2 sm:px-3"
              >
                <RotateCcw className="h-4 w-4" />
                <span className="hidden sm:inline">Resetear</span>
              </Button>
              <Button
                onClick={() => setShowPurchasePreview(true)}
                size="sm"
                className="gap-1 sm:gap-2 px-2 sm:px-3"
              >
                <ShoppingCart className="h-4 w-4" />
                <span className="hidden sm:inline">Comprar</span>
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1920px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:grid lg:grid-cols-4">
          {/* Canvas Area */}
          <div className="lg:col-span-3 grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* 3D Viewer */}
            <div className="rounded-lg border bg-card p-4 sm:p-6">
              <h2 className="mb-4 flex justify-center items-center gap-2 text-base sm:text-lg">
                <View className="size-4 sm:size-5" />
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
            <div className="rounded-lg border bg-card p-4 sm:p-6">
              <h2 className="mb-4 flex justify-center items-center gap-2 text-base sm:text-lg">
                <Pencil className="size-4 sm:size-5" />
                Área de Diseño
              </h2>
              <DesignArea />
            </div>
          </div>

          <div className="space-y-4 lg:sticky lg:top-20 lg:h-fit">
            <div className="rounded-lg border bg-card p-4 space-y-4 max-h-none lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
              <div className="bg-secondary rounded-lg p-4 space-y-2">
                <h3 className="text-sm font-semibold text-foreground">Precio Total</h3>
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-muted-foreground">Subtotal:</span>
                  <span className="text-lg font-bold text-primary">
                    S/ {getTotalPrice().toFixed(2)}
                  </span>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="mb-3 flex items-center gap-2 text-sm sm:text-base font-semibold text-foreground">
                  <Palette className="size-4" />
                  Color del Polo
                </h3>
                <ColorPicker
                  value={tshirtColor}
                  onChange={handleShirtColorChange}
                  colors={[
                    '#ffffff',
                    '#000000',
                    '#ef4444',
                    '#f97316',
                    '#22c55e',
                    '#0ea5e9',
                    '#6366f1',
                    '#ec4899',
                  ]}
                />
              </div>

              <Separator />

              <div>
                <Label className="mb-3 text-sm sm:text-base font-semibold text-foreground block">
                  Tipo de Cuello
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(TSHIRT_TYPES).map(([value, { name }]) => (
                    <button
                      key={value}
                      onClick={() => handleTypeChange(value)}
                      className={`flex flex-col items-center gap-1 rounded-lg border-2 px-2 py-2 sm:px-3 text-center transition-all cursor-pointer ${
                        selectedType === value
                          ? 'border-primary bg-secondary'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <span className="text-xs font-medium">{name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <Label className="mb-3 text-sm sm:text-base font-semibold text-foreground block">
                  Talla
                </Label>
                <div className="grid grid-cols-4 gap-2">
                  {Object.entries(TSHIRT_SIZES).map(([value, { label }]) => (
                    <button
                      key={value}
                      onClick={() => handleSizeChange(value)}
                      className={`flex items-center justify-center gap-1 rounded-lg border-2 px-2 py-2 sm:px-3 text-center transition-all cursor-pointer font-medium ${
                        selectedSize === value
                          ? 'border-primary bg-secondary'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <span className="text-sm">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <Label className="mb-3 text-sm sm:text-base font-semibold text-foreground block">
                  Tipo de Tela
                </Label>
                <Select value={selectedFabric} onValueChange={handleFabricChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccionar tela" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {Object.entries(FABRIC_TYPES).map(([value, { label, basePrice }]) => (
                        <SelectItem key={value} value={value}>
                          {label} - S/ {basePrice.toFixed(2)}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-2 sm:space-y-3">
                <h3 className="flex items-center gap-2 text-sm sm:text-base font-semibold text-foreground">
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

                <Button
                  variant="outline"
                  onClick={triggerFileInput}
                  className="w-full gap-2 text-sm"
                >
                  <ImageIcon className="h-4 w-4" />
                  Agregar Imagen
                </Button>

                <Button variant="outline" onClick={handleAddText} className="w-full gap-2 text-sm">
                  <Type className="h-4 w-4" />
                  Agregar Texto
                </Button>

                <Button variant="outline" onClick={handleAddLine} className="w-full gap-2 text-sm">
                  <Slash className="h-4 w-4" />
                  Agregar Línea
                </Button>

                {selectedObject && (
                  <Button
                    onClick={handleDelete}
                    variant="destructive"
                    className="w-full gap-2 text-sm"
                  >
                    <Trash2 className="h-4 w-4" />
                    Eliminar Selección
                  </Button>
                )}
              </div>

              {selectedObject && selectedObject.type === 'textbox' && (
                <>
                  <Separator />
                  <div className="space-y-2 sm:space-y-3">
                    <Label className="text-base sm:text-lg font-bold">Editar Texto</Label>

                    <div>
                      <Label className="text-xs text-muted-foreground">Tu Texto</Label>
                      <Input
                        type="text"
                        value={text}
                        onChange={handleTextChange}
                        className="mt-1 text-sm"
                      />
                    </div>

                    <div>
                      <Label className="text-xs text-muted-foreground">Tipo de Fuente</Label>
                      <Select value={font} onValueChange={handleFontChange}>
                        <SelectTrigger className="mt-1 w-full">
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

              {selectedObject && selectedObject.type === 'line' && (
                <>
                  <Separator />
                  <div className="space-y-2 sm:space-y-3">
                    <Label className="text-base sm:text-lg font-bold">Editar Línea</Label>

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

              {/* Lista de Elementos */}
              {canvasObjects.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-2 sm:space-y-3">
                    <Label className="text-sm sm:text-base font-semibold">
                      Elementos ({canvasObjects.length})
                    </Label>
                    <div className="max-h-64 space-y-2 overflow-y-auto mt-3">
                      {canvasObjects.map((obj, index) => {
                        const objId = `obj-${index}`
                        const isSelected = selectedObject === obj

                        return (
                          <div
                            key={objId}
                            onClick={() => {
                              if (activeCanvas) {
                                activeCanvas.setActiveObject(obj)
                                activeCanvas.renderAll()
                              }
                            }}
                            className={`cursor-pointer rounded-lg border-2 p-3 transition-all ${
                              isSelected
                                ? 'border-primary bg-secondary'
                                : 'border-border hover:border-primary/50'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0 flex-1">
                                {obj.type === 'textbox' && (
                                  <>
                                    <div className="flex items-center gap-2 mb-1">
                                      <Type className="h-4 w-4" />
                                      <p className="truncate text-sm font-medium">
                                        {(obj as fabric.Textbox).text || 'Texto'}
                                      </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <div
                                        className="h-4 w-4 rounded border border-border"
                                        style={{
                                          backgroundColor:
                                            ((obj as fabric.Textbox).fill as string) || '#000',
                                        }}
                                      />
                                      <span className="text-xs text-muted-foreground">
                                        {(obj as fabric.Textbox).fontSize || 20}px
                                      </span>
                                    </div>
                                  </>
                                )}
                                {obj.type === 'image' && (
                                  <div className="flex items-center gap-2">
                                    <ImageIcon className="h-4 w-4" />
                                    <p className="text-sm font-medium">Imagen</p>
                                  </div>
                                )}
                                {obj.type === 'line' && (
                                  <>
                                    <div className="flex items-center gap-2 mb-1">
                                      <Slash className="h-4 w-4" />
                                      <p className="text-sm font-medium">Línea</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <div
                                        className="h-3 w-8 rounded border border-border"
                                        style={{
                                          backgroundColor:
                                            ((obj as fabric.Line).stroke as string) || '#000',
                                          height: `${(obj as fabric.Line).strokeWidth || 2}px`,
                                        }}
                                      />
                                      <span className="text-xs text-muted-foreground">
                                        {(obj as fabric.Line).strokeWidth || 2}px
                                      </span>
                                    </div>
                                  </>
                                )}
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  if (activeCanvas) {
                                    activeCanvas.remove(obj)
                                    activeCanvas.renderAll()
                                    manualTriggerSync()
                                  }
                                }}
                                className="text-destructive hover:text-destructive/80"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Purchase Preview Dialog */}
      <Dialog open={showPurchasePreview} onOpenChange={setShowPurchasePreview}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Resumen de tu Compra</DialogTitle>
            <DialogDescription>
              Verifica los detalles de tu pedido antes de continuar
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {(() => {
              const details = getPurchaseDetails()
              return (
                <>
                  <div className="rounded-lg bg-secondary p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground">Tamaño</p>
                        <p className="font-semibold">{details.sizeLabel}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Cuello</p>
                        <p className="font-semibold">{details.neckLabel}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Color</p>
                        <div className="flex items-center gap-2">
                          <div
                            className="h-6 w-6 rounded border border-border"
                            style={{ backgroundColor: tshirtColor }}
                          />
                          <p className="font-semibold">{tshirtColor}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Tela</p>
                        <p className="font-semibold">{details.fabricLabel}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Detalles del Diseño</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>• Imágenes: {details.imageCount}</p>
                      <p>• Textos: {details.textCount}</p>
                      <p>• Elementos totales: {canvasObjects.length}</p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-semibold">Total:</span>
                      <span className="text-2xl font-bold text-primary">
                        S/ {details.priceData.total.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{details.priceData.details}</p>
                  </div>
                </>
              )
            })()}
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowPurchasePreview(false)}
              className="flex-1"
            >
              Continuar Editando
            </Button>
            <Button className="flex-1">Comprar Ahora</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
