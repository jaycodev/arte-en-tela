'use client'

import { useState } from 'react'

import { Download, ImageIcon, Palette, Pen, RotateCcw, Shirt, Trash2, Type } from 'lucide-react'
import type React from 'react'

import ColorPicker from '@/components/shared/color-picker'
import DesignCanvas from '@/components/shared/design-canvas'
import NecklineSelector from '@/components/shared/neckline-selector'
import TextEditor from '@/components/shared/text-editor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ThemeToggle } from '@/components/ui/theme-toggle'

export default function Home() {
  const [view, setView] = useState<'front' | 'back'>('front')
  const [shirtColor, setShirtColor] = useState('#ffffff')
  const [neckline, setNeckline] = useState<'round' | 'v' | 'polo'>('round')
  const [designs, setDesigns] = useState<
    Array<{ id: string; text: string; color: string; size: number; type: 'front' | 'back' }>
  >([])
  const [selectedDesign, setSelectedDesign] = useState<string | null>(null)
  const [showTextEditor, setShowTextEditor] = useState(false)
  const [lines, setLines] = useState<
    Array<{
      id: string
      x1: number
      y1: number
      x2: number
      y2: number
      color: string
      width: number
      type: 'front' | 'back'
    }>
  >([])
  const [lineColor, setLineColor] = useState('#000000')
  const [lineWidth, setLineWidth] = useState(2)
  const [images, setImages] = useState<
    Array<{
      id: string
      src: string
      x: number
      y: number
      size: number
      type: 'front' | 'back'
    }>
  >([])
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [showImageUploader, setShowImageUploader] = useState(false)

  const addText = (text: string, color: string) => {
    const newDesign = {
      id: Date.now().toString(),
      text,
      color,
      size: 24,
      type: view as 'front' | 'back',
    }
    setDesigns([...designs, newDesign])
    setSelectedDesign(newDesign.id)
  }

  const updateDesign = (id: string, updates: Partial<(typeof designs)[0]>) => {
    setDesigns(designs.map((d) => (d.id === id ? { ...d, ...updates } : d)))
  }

  const deleteDesign = (id: string) => {
    setDesigns(designs.filter((d) => d.id !== id))
    setSelectedDesign(null)
  }

  const addLine = () => {
    const newLine = {
      id: Date.now().toString(),
      x1: 80,
      y1: 150,
      x2: 120,
      y2: 150,
      color: lineColor,
      width: lineWidth,
      type: view as 'front' | 'back',
    }
    setLines([...lines, newLine])
  }

  const updateLine = (id: string, updates: Partial<(typeof lines)[0]>) => {
    setLines(lines.map((l) => (l.id === id ? { ...l, ...updates } : l)))
  }

  const deleteLine = (id: string) => {
    setLines(lines.filter((l) => l.id !== id))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const src = event.target?.result as string
        const newImage = {
          id: Date.now().toString(),
          src,
          x: 100,
          y: 140,
          size: 60,
          type: view as 'front' | 'back',
        }
        setImages([...images, newImage])
        setSelectedImage(newImage.id)
        setShowImageUploader(false)
      }
      reader.readAsDataURL(file)
    }
  }

  const updateImage = (id: string, updates: Partial<(typeof images)[0]>) => {
    setImages(images.map((img) => (img.id === id ? { ...img, ...updates } : img)))
  }

  const deleteImage = (id: string) => {
    setImages(images.filter((img) => img.id !== id))
    setSelectedImage(null)
  }

  const resetAll = () => {
    if (confirm('¿Estás seguro? Se eliminarán todos los diseños.')) {
      setDesigns([])
      setLines([])
      setImages([])
      setSelectedDesign(null)
      setSelectedImage(null)
      setShowTextEditor(false)
      setShowImageUploader(false)
    }
  }

  const currentDesigns = designs.filter((d) => d.type === view)
  const currentLines = lines.filter((l) => l.type === view)
  const currentImages = images.filter((img) => img.type === view)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-card">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-lg font-bold text-primary-foreground">
                  <Shirt className="size-4" />
                </span>
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
            {/* View Toggle */}
            <div className="flex gap-2">
              <Button
                variant={view === 'front' ? 'default' : 'outline'}
                onClick={() => setView('front')}
                className="flex-1"
              >
                Frente
              </Button>
              <Button
                variant={view === 'back' ? 'default' : 'outline'}
                onClick={() => setView('back')}
                className="flex-1"
              >
                Espalda
              </Button>
            </div>

            {/* Canvas */}
            <div className="flex items-center justify-center rounded-lg bg-card p-6 sm:p-8">
              <DesignCanvas
                shirtColor={shirtColor}
                neckline={neckline}
                designs={currentDesigns}
                selectedDesign={selectedDesign}
                onSelectDesign={setSelectedDesign}
                lines={currentLines}
                images={currentImages}
                selectedImage={selectedImage}
                onSelectImage={setSelectedImage}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Shirt Color */}
            <div className="rounded-lg border bg-card p-4">
              <h3 className="mb-3 flex items-center gap-2 font-semibold text-foreground">
                <Palette className="h-4 w-4" />
                Color del Polo
              </h3>
              <ColorPicker
                value={shirtColor}
                onChange={setShirtColor}
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

            {/* Neckline */}
            <div className="rounded-lg border bg-card p-4">
              <h3 className="mb-3 font-semibold text-foreground">Tipo de Cuello</h3>
              <NecklineSelector value={neckline} onChange={setNeckline} />
            </div>

            {/* Text Tool */}
            <div className="rounded-lg border bg-card p-4">
              <h3 className="mb-3 flex items-center gap-2 font-semibold text-foreground">
                <Type className="h-4 w-4" />
                Texto
              </h3>
              <Button
                onClick={() => setShowTextEditor(!showTextEditor)}
                variant="default"
                className="w-full"
              >
                {showTextEditor ? 'Cancelar' : 'Agregar Texto'}
              </Button>
              {showTextEditor && (
                <TextEditor onAdd={addText} onClose={() => setShowTextEditor(false)} />
              )}
            </div>

            {/* Line Tool */}
            <div className="rounded-lg border bg-card p-4">
              <h3 className="mb-3 flex items-center gap-2 font-semibold text-foreground">
                <Pen className="h-4 w-4" />
                Líneas Rectas
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Color</label>
                  <div className="mt-2 flex gap-2">
                    <input
                      type="color"
                      value={lineColor}
                      onChange={(e) => setLineColor(e.target.value)}
                      className="h-9 w-9 cursor-pointer rounded-md border border-border"
                    />
                    <span className="flex-1 rounded-md border border-border text-center text-xs font-mono leading-9">
                      {lineColor}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">
                    Ancho: {lineWidth}px
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={lineWidth}
                    onChange={(e) => setLineWidth(Number(e.target.value))}
                    className="mt-2 w-full"
                  />
                </div>
                <Button onClick={addLine} variant="default" className="w-full">
                  Agregar Línea
                </Button>
              </div>
            </div>

            {/* Image Tool */}
            <div className="rounded-lg border bg-card p-4">
              <h3 className="mb-3 flex items-center gap-2 font-semibold text-foreground">
                <ImageIcon className="h-4 w-4" />
                Imagen
              </h3>
              <div className="space-y-3">
                <label className="block">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full text-muted-foreground file:border-input file:text-foreground p-0 pr-3 italic file:mr-3 file:h-full file:border-0 file:border-r file:border-solid file:bg-transparent file:px-3 file:text-sm file:font-medium file:not-italic"
                  />
                </label>
              </div>
            </div>

            {/* Designs List */}
            {currentDesigns.length > 0 && (
              <div className="rounded-lg border bg-card p-4">
                <h3 className="mb-3 font-semibold text-foreground">
                  Textos ({currentDesigns.length})
                </h3>
                <div className="max-h-64 space-y-2 overflow-y-auto">
                  {currentDesigns.map((design) => (
                    <div
                      key={design.id}
                      onClick={() => setSelectedDesign(design.id)}
                      className={`cursor-pointer rounded-lg border-2 p-3 transition-all ${
                        selectedDesign === design.id
                          ? 'border-primary bg-secondary'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{design.text}</p>
                          <div className="mt-1 flex items-center gap-2">
                            <div
                              className="h-4 w-4 rounded border border-border"
                              style={{ backgroundColor: design.color }}
                            />
                            <span className="text-xs text-muted-foreground">{design.size}px</span>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteDesign(design.id)
                          }}
                          className="text-destructive hover:text-destructive/80"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      {selectedDesign === design.id && (
                        <div className="mt-3 space-y-3 border-t border-border pt-3">
                          <div>
                            <label className="text-xs font-medium text-muted-foreground">
                              Tamaño: {design.size}px
                            </label>
                            <input
                              type="range"
                              min="12"
                              max="72"
                              value={design.size}
                              onChange={(e) =>
                                updateDesign(design.id, { size: Number(e.target.value) })
                              }
                              className="mt-1 w-full"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-muted-foreground">
                              Color del texto
                            </label>
                            <div className="mt-2 flex gap-2">
                              <input
                                type="color"
                                value={design.color}
                                onChange={(e) => updateDesign(design.id, { color: e.target.value })}
                                className="h-9 w-9 cursor-pointer rounded-md border border-border"
                              />
                              <div
                                className="flex-1 rounded-md border border-border text-center text-xs font-mono leading-9"
                                style={{
                                  backgroundColor: design.color,
                                  color: design.color === '#ffffff' ? '#000' : '#fff',
                                }}
                              >
                                {design.color}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Lines List */}
            {currentLines.length > 0 && (
              <div className="rounded-lg border bg-card p-4">
                <h3 className="mb-3 font-semibold text-foreground">
                  Líneas ({currentLines.length})
                </h3>
                <div className="max-h-40 space-y-2 overflow-y-auto">
                  {currentLines.map((line) => (
                    <div
                      key={line.id}
                      className="rounded-lg border border-border p-2 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="h-3 w-8 rounded border border-border"
                          style={{ backgroundColor: line.color, height: `${line.width}px` }}
                        />
                        <span className="text-xs text-muted-foreground">{line.width}px</span>
                      </div>
                      <button
                        onClick={() => deleteLine(line.id)}
                        className="text-destructive hover:text-destructive/80"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Images List */}
            {currentImages.length > 0 && (
              <div className="rounded-lg border bg-card p-4">
                <h3 className="mb-3 font-semibold text-foreground">
                  Imágenes ({currentImages.length})
                </h3>
                <div className="max-h-48 space-y-2 overflow-y-auto">
                  {currentImages.map((image) => (
                    <div
                      key={image.id}
                      onClick={() => setSelectedImage(image.id)}
                      className={`cursor-pointer rounded-lg border-2 p-2 transition-all ${
                        selectedImage === image.id
                          ? 'border-primary bg-secondary'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <img
                          src={image.src || '/placeholder.svg'}
                          alt="design"
                          className="h-10 w-10 rounded-md object-cover"
                        />
                        <div className="flex-1 text-xs text-muted-foreground">
                          <p>Tamaño: {image.size}px</p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteImage(image.id)
                          }}
                          className="text-destructive hover:text-destructive/80"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      {selectedImage === image.id && (
                        <div className="mt-3 border-t border-border pt-3">
                          <label className="text-xs font-medium text-muted-foreground">
                            Tamaño: {image.size}px
                          </label>
                          <input
                            type="range"
                            min="20"
                            max="150"
                            value={image.size}
                            onChange={(e) =>
                              updateImage(image.id, { size: Number(e.target.value) })
                            }
                            className="mt-1 w-full"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
