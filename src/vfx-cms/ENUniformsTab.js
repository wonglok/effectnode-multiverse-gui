import { useEffect, useMemo, useRef, useState } from 'react'
import { Pane } from 'tweakpane'
import { getID } from '@/vfx-runtime/ENUtils'
import { ENMethods, ENState } from './ENState'

export function ENUniformsTab() {
  let DataKey = 'uniforms'
  ENState.makeKeyReactive('currentEditNodeID')
  ENState.makeKeyReactive('currentEditNodeID')
  let fireNodeID = ENState.currentEditNodeID
  let node = useMemo(() => {
    let node = ENState.nodes.find((e) => e._fid === fireNodeID)

    return node
  }, [fireNodeID])
  node.data[DataKey] = node.data[DataKey] || []

  let [, reload] = useState(0)
  //

  let refName = useRef()
  let refType = useRef()

  //
  // data
  //
  let onSaveLater = (mm) => () => {
    ENMethods.saveCodeBlock({ node }).then(() => {
      // reload((s) => s + 1)
    })
  }
  let onRemove = (mm) => () => {
    let arr = node.data[DataKey]
    arr.splice(
      arr.findIndex((e) => {
        return e._id === mm._id
      }),
      1
    )

    ENMethods.saveCodeBlock({ node }).then(() => {
      reload((s) => s + 1)
    })
  }
  //
  return (
    <div className='p-3'>
      <div className='flex  mb-3'>
        <input
          type='text'
          className='p-2 bg-gray-200'
          ref={refName}
          defaultValue={'newUniformData'}
        ></input>

        <select
          ref={refType}
          defaultValue={'float'}
          className='p-2 bg-gray-100'
        >
          <option value={'text'}>Text</option>
          <option value={'float'}>Float</option>
          <option value={'vec2'}>Vector2</option>
          <option value={'vec3'}>Vector3</option>
          <option value={'vec4'}>Vector4</option>
          <option value={'color'}>Color</option>
        </select>

        {/*  */}
        {/*  */}
        {/*  */}
        <button
          className='p-2 px-3 bg-gray-300'
          onClick={() => {
            //
            let getDefault = (type) => {
              if (type === 'text') {
                return ''
              }
              if (type === 'float') {
                return 1
              }
              if (type === 'vec2') {
                return { x: 0, y: 0 }
              }
              if (type === 'vec3') {
                return { x: 0, y: 0, z: 0 }
              }
              if (type === 'vec4') {
                return { x: 0, y: 0, z: 0, w: 1 }
              }
              if (type === 'color') {
                return '#ffffff'
              }
            }

            //
            node.data[DataKey].push({
              _id: getID(),
              name: refName.current.value,
              type: refType.current.value,
              nodeID: node.data._id,

              value: getDefault(refType.current.value),
            })

            ENMethods.saveCodeBlock({ node }).then(() => {
              reload((s) => s + 1)
            })
          }}
        >
          Add
        </button>
      </div>
      <div className='flex flex-wrap'>
        {node.data[DataKey].map((mm) => {
          return (
            <div key={mm._id} className='mb-3 mr-3'>
              <div className='inline-block'>
                {mm.type === 'text' && (
                  <TextInput
                    object={mm}
                    name={'value'}
                    label={mm.name}
                    value={mm.value}
                    onSaveLater={onSaveLater(mm)}
                    onRemove={onRemove(mm)}
                  ></TextInput>
                )}

                {mm.type === 'float' && (
                  <FloatInput
                    object={mm}
                    name={'value'}
                    label={mm.name}
                    value={mm.value}
                    onSaveLater={onSaveLater(mm)}
                    onRemove={onRemove(mm)}
                  ></FloatInput>
                )}

                {mm.type === 'vec2' && (
                  <Vector2Input
                    object={mm}
                    name={'value'}
                    label={mm.name}
                    value={mm.value}
                    onSaveLater={onSaveLater(mm)}
                    onRemove={onRemove(mm)}
                  ></Vector2Input>
                )}

                {mm.type === 'vec3' && (
                  <Vector3Input
                    object={mm}
                    name={'value'}
                    label={mm.name}
                    value={mm.value}
                    onSaveLater={onSaveLater(mm)}
                    onRemove={onRemove(mm)}
                  ></Vector3Input>
                )}

                {mm.type === 'vec4' && (
                  <Vector4Input
                    object={mm}
                    name={'value'}
                    label={mm.name}
                    value={mm.value}
                    onSaveLater={onSaveLater(mm)}
                    onRemove={onRemove(mm)}
                  ></Vector4Input>
                )}

                {mm.type === 'color' && (
                  <ColorInput
                    object={mm}
                    name={'value'}
                    label={mm.name}
                    value={mm.value}
                    onSaveLater={onSaveLater(mm)}
                    onRemove={onRemove(mm)}
                  ></ColorInput>
                )}
              </div>

              {/*  */}
              {/*  */}
              {/*  */}
            </div>
          )
        })}
      </div>
    </div>
  )
}

//
//
//

function ColorInput({
  object = { value: { x: 0, y: 0, z: 0, w: 1 } },
  name = 'value',
  label,
  value = 0,
  min,
  max,
  step = 0.01,
  onSave = () => {},
  onSaveLater = () => {},
  onRemove = () => {},
}) {
  let ref = useRef()
  useEffect(() => {
    const pane = new Pane({
      container: ref.current,
    })
    let tt = 0
    pane
      .addInput(object, name, {
        label,
        min,
        max,
        value,
        step,
        picker: 'inline',
        expanded: true,
      })
      .on('change', () => {
        onSave()

        clearTimeout(tt)
        tt = setTimeout(() => {
          onSaveLater()
        }, 100)
      })

    const btn = pane.addButton({
      title: 'Remove',
      label: 'Remove', // optional
    })

    btn.on('click', () => {
      if (window.confirm('remove?')) {
        onRemove()
      }
    })

    return () => {
      //
      pane.dispose()
    }
  }, [])
  return (
    <div>
      <div ref={ref}></div>
    </div>
  )
}

function Vector4Input({
  object = { value: { x: 0, y: 0, z: 0, w: 1 } },
  name = 'value',
  label,
  value = 0,
  min,
  max,
  step = 0.01,
  onSave = () => {},
  onSaveLater = () => {},
  onRemove = () => {},
}) {
  let ref = useRef()
  useEffect(() => {
    const pane = new Pane({
      container: ref.current,
    })
    let tt = 0
    pane
      .addInput(object, name, {
        label,
        min,
        max,
        value,
        step,
        picker: 'inline',
        expanded: true,
      })
      .on('change', () => {
        onSave()

        clearTimeout(tt)
        tt = setTimeout(() => {
          onSaveLater()
        }, 100)
      })

    const btn = pane.addButton({
      title: 'Remove',
      label: 'Remove', // optional
    })

    btn.on('click', () => {
      if (window.confirm('remove?')) {
        onRemove()
      }
    })

    return () => {
      //
      pane.dispose()
    }
  }, [])
  return (
    <div>
      <div ref={ref}></div>
    </div>
  )
}

function Vector3Input({
  object = { value: { x: 0, y: 0, z: 0 } },
  name = 'value',
  label,
  value = 0,
  min,
  max,
  step = 0.01,
  onSave = () => {},
  onSaveLater = () => {},
  onRemove = () => {},
}) {
  let ref = useRef()
  useEffect(() => {
    const pane = new Pane({
      container: ref.current,
    })
    let tt = 0
    pane
      .addInput(object, name, {
        label,
        min,
        max,
        value,
        step,
        picker: 'inline',
        expanded: true,
      })
      .on('change', () => {
        onSave()

        clearTimeout(tt)
        tt = setTimeout(() => {
          onSaveLater()
        }, 100)
      })

    const btn = pane.addButton({
      title: 'Remove',
      label: 'Remove', // optional
    })

    btn.on('click', () => {
      if (window.confirm('remove?')) {
        onRemove()
      }
    })

    return () => {
      //
      pane.dispose()
    }
  }, [])
  return (
    <div>
      <div ref={ref}></div>
    </div>
  )
}

function Vector2Input({
  object = { value: { x: 0, y: 0 } },
  name = 'value',
  label,
  value = 0,
  min,
  max,
  step = 0.01,
  onSave = () => {},
  onSaveLater = () => {},
  onRemove = () => {},
}) {
  let ref = useRef()
  useEffect(() => {
    const pane = new Pane({
      container: ref.current,
    })
    let tt = 0
    pane
      .addInput(object, name, {
        label,
        min,
        max,
        value,
        step,
        picker: 'inline',
        expanded: true,
      })
      .on('change', () => {
        onSave()

        clearTimeout(tt)
        tt = setTimeout(() => {
          onSaveLater()
        }, 100)
      })

    const btn = pane.addButton({
      title: 'Remove',
      label: 'Remove', // optional
    })

    btn.on('click', () => {
      if (window.confirm('remove?')) {
        onRemove()
      }
    })

    return () => {
      //
      pane.dispose()
    }
  }, [])
  return (
    <div>
      <div ref={ref}></div>
    </div>
  )
}

function FloatInput({
  object = { value: 0 },
  name = 'value',
  label,
  value = 0,
  min,
  max,
  step = 0.01,
  onSave = () => {},
  onSaveLater = () => {},
  onRemove = () => {},
}) {
  let ref = useRef()
  useEffect(() => {
    const pane = new Pane({
      container: ref.current,
    })
    let tt = 0
    pane
      .addInput(object, name, {
        label,
        min,
        max,
        value,
        step,
      })
      .on('change', () => {
        onSave()

        clearTimeout(tt)
        tt = setTimeout(() => {
          onSaveLater()
        }, 100)
      })

    const btn = pane.addButton({
      title: 'Remove',
      label: 'Remove', // optional
    })

    btn.on('click', () => {
      if (window.confirm('remove?')) {
        onRemove()
      }
    })

    return () => {
      //
      pane.dispose()
    }
  }, [])
  return (
    <div>
      <div ref={ref}></div>
    </div>
  )
}

function TextInput({
  object = { value: 0 },
  name = 'value',
  label,
  value = 0,
  min,
  max,
  step = 0.01,
  onSave = () => {},
  onSaveLater = () => {},
  onRemove = () => {},
}) {
  let ref = useRef()
  useEffect(() => {
    const pane = new Pane({
      container: ref.current,
    })

    //
    let tt = 0
    pane
      .addInput(object, name, {
        label,
        value,
        step,
      })
      .on('change', () => {
        onSave()

        clearTimeout(tt)
        tt = setTimeout(() => {
          onSaveLater()
        }, 100)
      })

    const btn = pane.addButton({
      title: 'Remove',
      label: 'Remove', // optional
    })

    btn.on('click', () => {
      if (window.confirm('remove?')) {
        onRemove()
      }
    })

    return () => {
      //
      pane.dispose()
    }
  }, [])
  return (
    <div>
      <div ref={ref}></div>
    </div>
  )
}
