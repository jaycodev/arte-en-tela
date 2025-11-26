'use client'

import { CANVAS_CONFIG } from '@/lib/constants/designConstants'
import { useTshirtCanvas } from '@/lib/hooks/useTshirtCanvas'

interface TshirtCanvasBackProps {
  svgPath: string
}

const TshirtCanvasBack = ({ svgPath }: TshirtCanvasBackProps) => {
  const { canvasRef, tshirtColor } = useTshirtCanvas({
    svgPath,
    view: 'back',
  })

  return (
    <div className="relative h-auto w-full">
      <div className="pointer-events-none absolute inset-0">
        <svg className="h-full w-full" viewBox="0 0 810 810">
          <path d={svgPath} fill={tshirtColor} stroke="#000" strokeWidth="1" />
        </svg>
      </div>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-10"
        width={CANVAS_CONFIG.width}
        height={CANVAS_CONFIG.height}
      />
    </div>
  )
}

export default TshirtCanvasBack
