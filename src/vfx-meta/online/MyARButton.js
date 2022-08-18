import { useThree } from '@react-three/fiber'
import { useMetaStore } from '../store/use-meta-store'

export function MyARButton({ camera }) {
  let setControlsAR = useMetaStore((s) => s.setControlsAR)
  return (
    <>
      {camera && (
        <div
          style={{
            backdropFilter: 'blur(20px)',
            borderRadius: '30px',
            boxShadow: '0px 0px 30px 0px rgba(0,0,255,0.5)',
          }}
          onClick={() => {
            setControlsAR({ camera })
          }}
          className='inline-block w-full px-3 py-2 mb-4 text-center text-white bg-blue-500 cursor-pointer rounded-xl'
        >
          Augmented Reality
        </div>
      )}
    </>
  )
}

//
