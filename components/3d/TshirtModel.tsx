'use client'

/* eslint-disable react/no-unknown-property */

import { useEffect, useRef } from 'react'

import { Center, Decal, useGLTF, useTexture } from '@react-three/drei'

interface TshirtModelProps {
  tshirtColor: string
  designTexture: string | null
  designTextureBack: string | null
  onViewChange: (view: 'front' | 'back') => void
}

export function TshirtModel({
  tshirtColor,
  designTexture,
  designTextureBack,
  onViewChange,
}: TshirtModelProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { nodes, materials } = useGLTF('/3Dmodels/02.glb') as any
  const texture = useTexture(designTexture || '/3Dmodels/textures/design-fallback.png')
  const textureBack = useTexture(designTextureBack || '/3Dmodels/textures/design-fallback.png')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const meshRef = useRef<any>(null)

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.material.color.set(tshirtColor)
    }
  }, [tshirtColor])

  const handleClick = (view: 'front' | 'back') => {
    onViewChange(view)
  }

  return (
    <Center position={[0, 0.1, 0]}>
      <group dispose={null}>
        <group rotation={[Math.PI / 2, 0, 0]}>
          <mesh
            scale={7.5}
            position={[0, 0, 2]}
            castShadow
            receiveShadow
            geometry={nodes['T-Shirt_1'].geometry}
            material={materials.Shirt}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes['T-Shirt_2'].geometry}
            scale={7.5}
            position={[0, 0, 2]}
            material={materials['front.001']}
          >
            <meshBasicMaterial transparent opacity={0} />
            <Decal
              position={[0, 0.2, -0.31]}
              rotation={[-Math.PI / 2 - 0.05, 0, 0]}
              scale={[0.52, 0.7, 0.5]}
              onClick={() => handleClick('front')}
            >
              <meshStandardMaterial
                map={texture}
                toneMapped={false}
                transparent
                polygonOffset
                polygonOffsetFactor={-1}
              />
            </Decal>
          </mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes['T-Shirt_3'].geometry}
            material={materials.back}
            scale={7.5}
            position={[0, 0, 2]}
          >
            <meshBasicMaterial transparent opacity={0} />
            <Decal
              position={[0, -0.2, -0.27]}
              rotation={[Math.PI / 2 - 0.2, 0, Math.PI]}
              scale={[0.52, 0.7, 0.5]}
              onClick={() => handleClick('back')}
            >
              <meshStandardMaterial
                map={textureBack}
                toneMapped={false}
                transparent
                polygonOffset
                polygonOffsetFactor={-1}
              />
            </Decal>
          </mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes['T-Shirt_4'].geometry}
            material={materials['left hand']}
            scale={7.5}
            position={[0, 0, 2]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes['T-Shirt_5'].geometry}
            material={materials['right hand']}
            scale={7.5}
            position={[0, 0, 2]}
          />
        </group>
        <group rotation={[Math.PI / 2, 0, 0]}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes['T-Shirt001'].geometry}
            material={materials.background}
            scale={7.5}
            position={[0, 0, 2]}
            ref={meshRef}
          />
        </group>
      </group>
    </Center>
  )
}

useGLTF.preload('/3Dmodels/02.glb')
