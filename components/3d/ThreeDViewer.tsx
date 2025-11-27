'use client'

import { Suspense } from 'react'

import { Environment, Loader, OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'

import { TshirtModel } from './TshirtModel'

interface ThreeDViewerProps {
  tshirtColor: string
  designTextureFront: string | null
  designTextureBack: string | null
  onViewChange: (view: 'front' | 'back') => void
}

export function ThreeDViewer({
  tshirtColor,
  designTextureFront,
  designTextureBack,
  onViewChange,
}: ThreeDViewerProps) {
  return (
    <div className="relative h-[400px] md:h-[560px] w-full rounded-lg overflow-hidden bg-card">
      <Canvas>
        <OrbitControls maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 3} />
        <Suspense fallback={null}>
          <TshirtModel
            tshirtColor={tshirtColor}
            onViewChange={onViewChange}
            designTexture={designTextureFront}
            designTextureBack={designTextureBack}
          />
          <Environment preset="sunset" />
        </Suspense>
      </Canvas>
      <Loader
        containerStyles={{
          position: 'absolute',
          top: 0,
          left: 10,
          width: '100%',
          height: '100%',
          background: 'var(--background)',
          pointerEvents: 'none',
        }}
        dataStyles={{
          color: 'var(--foreground)',
          fontSize: '14px',
          fontWeight: '500',
        }}
        barStyles={{
          backgroundColor: '#2563eb',
          height: '2px',
        }}
      />
    </div>
  )
}
