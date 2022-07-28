import {
  Box3,
  Line3,
  Matrix4,
  Mesh,
  MeshStandardMaterial,
  Vector3,
} from 'three'
import { RoundedBoxGeometry } from 'three140/examples/jsm/geometries/RoundedBoxGeometry'

export const makeAvatarCTX = () => {
  // characters
  let player = new Mesh(
    new RoundedBoxGeometry(1.0, 2.0, 1.0, 10, 0.5),
    new MeshStandardMaterial()
  )
  player.name = 'myavatar'
  player.geometry.translate(0, -0.5, 0)
  player.capsuleInfo = {
    radius: 0.5,
    segment: new Line3(new Vector3(), new Vector3(0, -1.0, 0.0)),
  }

  player.position.y = 5

  return {
    playerIsOnGround: false,
    player,

    // displayCollider: false,
    // displayBVH: false,
    // visualizeDepth: 10,

    gravity: -30,
    playerSpeed: 10,
    physicsSteps: 5,

    fwdPressed: false,
    bkdPressed: false,
    lftPressed: false,
    rgtPressed: false,
    lftRotPressed: false,
    rgtRotPressed: false,

    playerVelocity: new Vector3(),
    resetPositon: new Vector3(0, 3, 3),
    upVector: new Vector3(0, 1, 0),
    tempVector: new Vector3(),
    tempVector2: new Vector3(),
    tempBox: new Box3(),
    tempMat: new Matrix4(),
    tempSegment: new Line3(),
    deltaTarget: new Vector3(0, 0, 0),
  }
}
