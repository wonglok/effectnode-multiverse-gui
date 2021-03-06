import Shader from '@/components/canvas/Shader/Shader'
import { ENLogicGraphAutoLoad } from '@/vfx-runtime/ENLogicGraph'
import { HomePageGraphID } from 'firebase.config'
import dynamic from 'next/dynamic'
import { useEffect } from 'react'
import { VRCanvas } from '@react-three/xr'
// import { Box } from '@react-three/drei'

const LCanvas = dynamic(() => import('@/components/layout/canvas'), {
  ssr: false,
})

export default function Page() {
  return (
    <>
      <LCanvas MyVRCanvas={VRCanvas}>
        <Content></Content>
      </LCanvas>
    </>
  )
}

function Content() {
  return (
    <group position={[0, 0, 0]}>
      {/* <mesh>
        <boxGeometry />
        <meshBasicMaterial color='blue' />
      </mesh> */}
      {/* <Shader></Shader> */}

      {/* XR */}
      <ENLogicGraphAutoLoad
        graphID={`-N7Izr9ntFQQWtZfGurM`}
      ></ENLogicGraphAutoLoad>
    </group>
  )
}
