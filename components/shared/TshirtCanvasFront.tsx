'use client'

import { CANVAS_CONFIG } from '@/lib/constants/designConstants'
import { useTshirtCanvas } from '@/lib/hooks/useTshirtCanvas'

interface TshirtCanvasFrontProps {
  svgPath: string
}

const TshirtCanvasFront = ({ svgPath }: TshirtCanvasFrontProps) => {
  const { canvasRef, tshirtColor } = useTshirtCanvas({
    svgPath,
    view: 'front',
  })

  return (
    <div className="relative w-full h-auto">
      <div className="absolute inset-0 pointer-events-none">
        <svg viewBox="0 0 810 810" className="w-full h-full">
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

export default TshirtCanvasFront
