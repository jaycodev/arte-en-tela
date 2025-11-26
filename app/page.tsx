'use client'

import { Download, RotateCcw, Shirt, View } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'

import { ThreeDViewer } from '@/components/3d/ThreeDViewer'
import DesignArea from '@/components/shared/DesignArea'
import LineToolBar from '@/components/shared/LineToolBar'
import TextToolBar from '@/components/shared/TextToolBar'
import ToolBar from '@/components/shared/ToolBar'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { setSelectedView } from '@/lib/features/tshirtSlice'
import { useCanvas } from '@/lib/hooks/useCanvas'
import { useCanvasTextureSync } from '@/lib/hooks/useCanvasTextureSync'
import type { RootState } from '@/lib/store'

export default function Home() {
  const dispatch = useDispatch()
  const tshirtColor = useSelector((state: RootState) => state.tshirt.tshirtColor)
  const selectedView = useSelector((state: RootState) => state.tshirt.selectedView)

  const { frontCanvas, backCanvas } = useCanvas()
  const { designTextureFront, designTextureBack, manualTriggerSync } = useCanvasTextureSync({
    frontCanvas,
    backCanvas,
    selectedView,
  })

  // Handler para cambios de vista desde el modelo 3D
  const handle3DViewChange = (newView: 'front' | 'back') => {
    dispatch(setSelectedView(newView))
  }

  const resetAll = () => {
    if (confirm('¿Estás seguro? Se eliminarán todos los diseños.')) {
      // Clear canvas
      if (frontCanvas) {
        frontCanvas.clear()
        frontCanvas.renderAll()
      }
      if (backCanvas) {
        backCanvas.clear()
        backCanvas.renderAll()
      }
      // Clear localStorage
      localStorage.clear()
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-card">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
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
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Canvas Area - Left side */}
          <div className="flex-1 space-y-4">
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

            <div className="rounded-lg border bg-card p-6">
              <h2 className="mb-4 text-lg font-semibold">Área de Diseño</h2>
              <DesignArea />
            </div>
          </div>

          {/* Sidebar - Right side */}
          <div className="w-full space-y-4 lg:w-80">
            <div className="rounded-lg border bg-card p-4">
              <h3 className="mb-4 font-semibold text-foreground">Herramientas de Diseño</h3>
              <ToolBar manualSync={manualTriggerSync} />
              <TextToolBar manualSync={manualTriggerSync} />
              <LineToolBar manualSync={manualTriggerSync} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
