import { useENEditor } from '@/vfx-studio/store/use-en-editor'
import { useFilterEffectNode } from '@/vfx-studio/store/use-filter-effectnode'
import md5 from 'md5'
import { useEffect, useState } from 'react'
import { EffectNodeObject } from '../EffectNodeObject/EffectNodeObject'

export function EffectNodeRuntime({
  glbObject,
  originalGLBObject,
  disabledNodes = ['effect-composer', '.pass.', 'global.'],
}) {
  let reloadGraphID = useENEditor((s) => s.reloadGraphID)
  let ens = useFilterEffectNode({ glbObject })
  glbObject.scene.updateMatrixWorld(true)

  let [ready, setReady] = useState(false)
  useEffect(() => {
    setReady(false)

    glbObject.scene.traverse((it) => {
      if (it.geometry) {
        it.userData.posMD5 = md5(
          it.geometry.attributes.position.array.length + it.name
        )
      }
    })

    if (originalGLBObject) {
      originalGLBObject.scene.traverse((it) => {
        if (it.geometry) {
          it.userData.posMD5 = md5(
            it.geometry.attributes.position.array.length + it.name
          )
        }
      })
    }

    setTimeout(() => {
      let ens = []

      if (glbObject) {
        glbObject.scene.traverse((it) => {
          if (it.userData.effectNode) {
            ens.push(it)
          }
        })
      }

      ens.forEach((en) => {
        en.updateMatrixWorld()
        //
        if (en.userData.effectNode) {
          if (originalGLBObject) {
            originalGLBObject.scene.traverse((oo) => {
              if (oo.userData.posMD5 === en.userData.posMD5) {
                if (oo.material) {
                  en.material = oo.material.clone()
                  en.material.needsUpdate = true
                }
                if (oo.geometry) {
                  if (
                    en.geometry.attributes.position.array.length !==
                    oo.geometry.attributes.position.array.length
                  ) {
                    en.geometry = oo.geometry.clone()
                    en.geometry.needsUpdate = true
                  }
                }
              }
            })
          }
        }
      })

      setReady(true)
    })
  }, [glbObject, originalGLBObject, reloadGraphID])

  //
  return (
    <>
      <group>
        {ready &&
          glbObject &&
          ens.length > 0 &&
          ens.map((en) => {
            return (
              <EffectNodeObject
                key={en.uuid + reloadGraphID + glbObject.uuid}
                glbObject={glbObject}
                item={en}
                disabledNodes={disabledNodes}
                effectNode={en.userData.effectNode}
              ></EffectNodeObject>
            )
          })}
      </group>
    </>
  )
}

//
