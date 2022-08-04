import { NoodleRenderable } from '@/vfx-library/Noodle/NoodleRenderable'
import { NoodleSegmentCompute } from '@/vfx-library/Noodle/NoodleSegmentCompute'
import { ParticleRenderable } from '@/vfx-library/Noodle/ParticleRenderable'
import { PhysicsCompute } from '@/vfx-library/Noodle/PhysicsCompute'
import { getID } from '@/vfx-runtime/ENUtils'

//

export async function nodeData({ defaultData, nodeID }) {
  return {
    ...defaultData,

    //
    //
    inputs: [
      //
      { _id: getID(), type: 'input', nodeID },
      { _id: getID(), type: 'input', nodeID },
      { _id: getID(), type: 'input', nodeID },
    ],

    // at least 1
    //
    outputs: [
      //
      { _id: getID(), type: 'output', nodeID },
      { _id: getID(), type: 'output', nodeID },
      { _id: getID(), type: 'output', nodeID },
    ],

    uniforms: [
      //
      //       {
      //         _id: getID(),
      //         nodeID,
      //         name: 'speed',
      //         type: 'float',
      //         value: 1,
      //       },
      //       {
      //         _id: getID(),
      //         nodeID,
      //         name: 'colorA',
      //         type: 'color',
      //         value: '#ef05ba',
      //       },
      //       {
      //         _id: getID(),
      //         nodeID,
      //         name: 'colorB',
      //         type: 'color',
      //         value: '#02ffe0',
      //       },
      //       {
      //         _id: getID(),
      //         nodeID,
      //         name: 'colorC',
      //         type: 'color',
      //         value: '#ffffff',
      //       },
      //       {
      //         id: getID(),
      //         nodeID,
      //         name: 'shader',
      //         type: `glsl`,
      //         value: `
      // `,
      //       },
      //
    ],

    //
    shaders: [],
    material: [],

    //
  }
}

export async function effect({ node, mini, data }) {
  //

  let physics = new PhysicsCompute({
    tracker: mini.now.mounter,
  })
  //
  let sim = new NoodleSegmentCompute({
    node: mini,
    tracker: mini.now.mounter,
    getHeadList: () => {
      return physics.getHeadList()
    },
    howManyTracker: 128,
    howLongTail: 32,
  })
  let noodle = new NoodleRenderable({ node: mini, sim })

  mini.onLoop(() => {
    sim.render()
  })

  let scene = mini.now.scene
  scene.add(noodle.o3d)

  let pars = new ParticleRenderable({
    core: mini,
    getTextureAlpha: () => {
      return physics.getHeadList()
    },
    getTextureBeta: () => {
      return physics.getHeadList2()
    },
  })

  scene.add(pars)

  //
  //
  // let myItem = new TheVortex({
  //   enableDetection: true,
  //   tracker: mini.now.mounter,
  // })
  // //
  // //
  // mini.now.scene.add(myItem)
  // mini.onClean(() => {
  //   myItem.removeFromParent()
  // })
  // // mini.onLoop(() => {
  // //   mini.now.mounter.getWorldPosition(myItem.position)
  // // })
  // //
  // data.uniforms.shader((v) => {
  //   if (v && typeof v.value !== 'undefined') {
  //     myItem.shader = v.value
  //   }
  // })
  // mini.onLoop(() => {
  //   myItem.traverse((it) => {
  //     it.frustumCulled = false
  //   })
  // })
  // // data.uniforms.colorA((v) => {
  // //   if (v && typeof v.value !== 'undefined') {
  // //     myItem.colorA = v.value
  // //   }
  // // })
  // // data.uniforms.colorB((v) => {
  // //   if (v && typeof v.value !== 'undefined') {
  // //     myItem.colorB = v.value
  // //   }
  // // })
  // // data.uniforms.colorC((v) => {
  // //   if (v && typeof v.value !== 'undefined') {
  // //     myItem.colorC = v.value
  // //   }
  // // })
  // // node.out0.pulse(myItem)
}

//

//