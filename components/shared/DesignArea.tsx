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
  const { setSelectedObject } = useCanvas()

  const getSvgPath = (view: 'front' | 'back') => {
    const tshirtType = TSHIRT_TYPES[selectedType as keyof typeof TSHIRT_TYPES]
    return view === 'front' ? tshirtType.frontPath : tshirtType.backPath
  }

  const handleViewChange = (view: 'front' | 'back') => {
    if (view !== selectedView) {
      setSelectedObject(null)
      dispatch(setSelectedView(view))
    }
  }

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex gap-2 sm:gap-4 mb-4 sm:mb-5 w-full justify-center">
        <Button
          onClick={() => handleViewChange('front')}
          variant={selectedView === 'front' ? 'default' : 'outline'}
          className="text-xs sm:text-sm"
        >
          Vista frontal
        </Button>
        <Button
          onClick={() => handleViewChange('back')}
          variant={selectedView === 'back' ? 'default' : 'outline'}
          className="text-xs sm:text-sm"
        >
          Vista trasera
        </Button>
      </div>

      <div className="flex justify-center w-full max-w-md sm:max-w-none">
        <Card className="shadow-none w-full">
          <CardContent className="p-2 sm:p-4">
            <div className={selectedView === 'front' ? 'block' : 'hidden'}>
              <TshirtCanvasFront svgPath={getSvgPath('front')} />
            </div>
            <div className={selectedView === 'back' ? 'block' : 'hidden'}>
              <TshirtCanvasBack svgPath={getSvgPath('back')} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default DesignArea
