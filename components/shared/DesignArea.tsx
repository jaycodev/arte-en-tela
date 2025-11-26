'use client'

import { useDispatch, useSelector } from 'react-redux'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { TSHIRT_TYPES } from '@/lib/constants/designConstants'
import { setSelectedView } from '@/lib/features/tshirtSlice'
import { useCanvas } from '@/lib/hooks/useCanvas'
import type { RootState } from '@/lib/store'

import TshirtCanvasBack from './TshirtCanvasBack'
import TshirtCanvasFront from './TshirtCanvasFront'

const DesignArea = () => {
  const dispatch = useDispatch()
  const selectedType = useSelector((state: RootState) => state.tshirt.selectedType)
  const selectedView = useSelector((state: RootState) => state.tshirt.selectedView)
  const { activeCanvas, setSelectedObject } = useCanvas()

  const getSvgPath = (view: 'front' | 'back') => {
    const tshirtType = TSHIRT_TYPES[selectedType as keyof typeof TSHIRT_TYPES]
    return view === 'front' ? tshirtType.frontPath : tshirtType.backPath
  }

  const handleViewChange = (view: 'front' | 'back') => {
    if (view !== selectedView) {
      // Clear selected object before switching views
      if (activeCanvas) {
        activeCanvas.discardActiveObject()
        activeCanvas.renderAll()
      }
      setSelectedObject(null)
      dispatch(setSelectedView(view))
    }
  }

  return (
    <div className="flex flex-col items-center">
      {/* Toggle Buttons */}
      <div className="mb-5 flex gap-4">
        <Button
          onClick={() => handleViewChange('front')}
          variant={selectedView === 'front' ? 'default' : 'outline'}
        >
          Vista Frontal
        </Button>
        <Button
          onClick={() => handleViewChange('back')}
          variant={selectedView === 'back' ? 'default' : 'outline'}
        >
          Vista Trasera
        </Button>
      </div>

      {/* Conditional Rendering: Only show the selected canvas */}
      <div className="flex justify-center">
        {selectedView === 'front' && (
          <Card>
            <CardContent>
              <TshirtCanvasFront svgPath={getSvgPath('front')} />
            </CardContent>
          </Card>
        )}
        {selectedView === 'back' && (
          <Card>
            <CardContent>
              <TshirtCanvasBack svgPath={getSvgPath('back')} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default DesignArea
