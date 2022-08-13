import { uploadS3 } from '@/aws/aws.s3.gui'
import { avatarCDN_A } from 'firebase.config'
import md5 from 'md5'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import create from 'zustand'
import { makeAvatarCTX } from '../ctx/make-avatar-ctx'
import { exportGLB } from './export-glb'
import { firebase } from './firebase'
import { sceneToCollider } from './scene-to-bvh'
// import path from 'path'
export const useMetaStore = create((set, get) => {
  // return

  let myCTX = makeAvatarCTX()
  return {
    myCTX,

    //
    mode: 'ready',
    setMode: (mode) => {
      //
      set({ mode })
    },

    myAvatars: [],

    loadMyAvatars: () => {
      //
    },
    //
    myself: false,
    cloneSelf: false,
    setMyself: (user) => {
      //
      set({ myself: user })
    },
    players: [],
    videoTextures: {},
    setVidTextureByUID: (uid, val) => {
      let videoTextures = get().videoTextures

      videoTextures[uid] = val

      set({ videoTextures: { ...videoTextures } })
    },

    uploadAvatar: async (file) => {
      //
      let { myself } = get()
      let result = await uploadS3({
        file,
        idToken: '',
        folderPath: 'user-avatar',
      })
      let db = firebase.database()
      let myData = db.ref(`/meta/avatars/${myself.uid}`)

      let newitem = myData.push()

      newitem.set({
        cdn: avatarCDN_A,
        result,
        url: avatarCDN_A + result.fileKey,
      })

      return {
        url: avatarCDN_A + result.fileKey,
      }
      //
      //
      // //
      // setAvatar({
      //   vendor: 'temp',
      //   avatarURL: URL.createObjectURL(file),
      // })
      //
    },

    //

    setVoiceID: (v) => {
      let myCTX = get().myCTX
      myCTX.voiceID = v
      set({ myCTX: myCTX })
    },
    getVoicePlayer: (voiceID) => {
      //
      let { players, myCTX } = get()

      let myAr = [...(players || [])]
      myAr.push(myCTX)

      let playerMesh = myAr.find((e) => e.voiceID === voiceID)
      return playerMesh || null
    },

    // asssets
    avatars: [],
    //
    playerInfoIsReady: false,
    setPlayerReady: (v) => {
      set({ playerInfoIsReady: v })
    },

    removeAvatar: (avaID) => {
      let myself = get().myself
      let db = firebase.database()

      let avatars = db.ref(`/meta/avatars/${myself.uid}/${avaID}`)

      return avatars.remove()
    },

    mapID: false,

    goOfflineBroken: (otherPlayer) => {
      let db = firebase.database()
      otherPlayer.heartbeat =
        otherPlayer.heartbeat || new Date().getTime() - 500000

      let mapID = get().mapID
      let diff = new Date().getTime() - otherPlayer.heartbeat
      console.log(diff)

      if (diff >= 80000 && diff <= 50000000 && mapID) {
        //
        let userData = db.ref(`/meta/mapOnline/${mapID}/${otherPlayer.uid}`)
        userData.remove()
      }
    },
    goOnline: (cloneSelf, myself, seed) => {
      set({ cloneSelf })
      let mapID = md5(seed)
      set({ mapID })
      let db = firebase.database()
      let entireMapData = db.ref(`/meta/mapOnline/${mapID}`)
      let userData = db.ref(`/meta/mapOnline/${mapID}/${cloneSelf.uid}`)
      let activeData = db.ref(`/meta/activeData/${myself.uid}`)
      let avatars = db.ref(`/meta/avatars/${myself.uid}`)

      // console.log(avatars)

      let hhAvatars = (snap) => {
        //
        let val = snap && snap.val()
        let arr = []

        if (val) {
          for (let kn in val) {
            let value = val[kn]
            let key = kn

            //
            arr.push({
              _id: key,
              ...(value || {}),
            })
          }
        }

        set({ avatars: arr })
        //
      }
      avatars.on('value', hhAvatars)

      let offAvatarsSync = () => {
        avatars.off('value', hhAvatars)
      }

      let hhSync = (snap) => {
        let val = snap && snap.val()
        let arr = []

        if (val) {
          for (let kn in val) {
            let value = val[kn]
            let key = kn

            //
            arr.push({
              uid: key,
              ...(value || {}),
            })
          }
        }

        //
        arr = arr.filter((a) => a.uid !== cloneSelf.uid)

        set({ players: arr })

        // console.log(arr)

        // console.log(val)
      }

      // OtherOnePlayer
      entireMapData.on('value', hhSync)
      let offSnyc = () => {
        entireMapData.off('value', hhSync)
      }

      let rand = 0
      let intervTick = setInterval(() => {
        rand = Math.random()
      }, 2500)
      let check = () => {
        return JSON.stringify(get().myCTX + rand)
      }

      let prepare = () => {
        let {
          avatarURL,
          avatarVendor,

          //
          avatarURLWrap,

          avatarActionResumeOnKeyUp,
          avatarActionName,
          avatarActionIdleName,
          avatarActionRepeat,

          avatarPartUpper,
          avatarPartLower,
          avatarPartShoes,
          avatarPartSkeleton,

          voiceID,
        } = get().myCTX

        if (avatarActionRepeat === Infinity) {
          avatarActionRepeat = 'Infinity'
        }

        let output = {
          uid: cloneSelf.uid,

          //
          avatarURL,
          avatarVendor,

          //
          avatarURLWrap,

          avatarActionResumeOnKeyUp,
          avatarActionName,
          avatarActionIdleName,
          avatarActionRepeat,

          //
          avatarPartUpper,
          avatarPartLower,
          avatarPartShoes,
          avatarPartSkeleton,

          voiceID,
          heartbeat: new Date().getTime(),
          //
          [mapID]: get().myCTX.player.position.toArray(),
          playerPosition: get().myCTX.player.position.toArray(),
        }

        for (let kn in output) {
          if (typeof output[kn] === 'undefined') {
            delete output[kn]
          }
        }
        return output
      }

      let offInternval = () => {}
      activeData.get().then((snap) => {
        //
        //
        if (snap && snap.val()) {
          let value = snap.val() || {}

          //
          let myCTX = get().myCTX

          myCTX.player.position.fromArray(value[mapID] || [0, 10, 0])

          for (let kn in value) {
            if (typeof value[kn] !== 'undefined') {
              myCTX[kn] = value[kn]
            }
          }

          set({ myCTX })
        } else {
          activeData.set({
            ...prepare(),
          })
        }

        set({ playerInfoIsReady: true })

        let last = ''
        let tt = setInterval(() => {
          let latest = check()
          if (latest !== last) {
            last = latest

            //
            userData.set({
              ...prepare(),
            })

            //
            activeData.set({
              ...prepare(),
            })
          }
        }, 500)

        offInternval = () => {
          clearInterval(tt)
        }
      })

      userData.onDisconnect().remove()

      return () => {
        //
        offAvatarsSync()
        offInternval()
        userData.remove()
        offSnyc()
        clearInterval(intervTick)
        //
        //
      }
    },
    getLoginUser: (playerID) => {
      //
      let { players } = get()
      let idx = players.findIndex((e) => e._id === playerID)
      return players[idx] || null
    },

    //
    // addLoginUser: (player) => {
    //   let { players } = get()
    //   players.push(player)
    //   set({ players })
    // },
    // //
    // removeLoginUserID: (playerID) => {
    //   let { players } = get()
    //   let idx = players.findIndex((e) => e._id === playerID)
    //   //
    //   if (idx !== -1) {
    //     players.splice(idx, 1)
    //     set({ players: [...players] })
    //   } else {
    //     console.log('not found')
    //   }
    // },

    //
    loader: 'ready',
    setStartLoading: () => {
      set({ loader: 'loading' })
    },
    setDoneLoading: () => {
      set({ loader: 'ready' })
    },
    //
    otherAvatars: [],
    collider: false,
    setColliderFromScene: ({ scene }) => {
      sceneToCollider({ scene }).then((collider) => {
        set({ collider })
      })
    },

    controls: false,
    camera: false,
    scene: false,

    setScene: (v) => {
      set({ scene: v })
    },

    setControls: ({ camera, dom }) => {
      let self = get()

      if (self.controls) {
        self.controls.dispose()
      }

      let controls = new OrbitControls(camera, dom)

      camera.near = 0.05
      camera.far = 500
      camera.updateProjectionMatrix()

      set({ controls, camera })

      get().setPosition({})

      return () => {
        controls.dispose()
      }
    },

    setPosition: ({ initPos = [0, 5, 0], cameraOffset = [0, -3, 5] }) => {
      let controls = get().controls
      let camera = get().camera
      myCTX.setPositionByArray(initPos)
      camera.position.copy(myCTX.player.position)
      camera.position.x += cameraOffset[0]
      camera.position.y += cameraOffset[1]
      camera.position.z += cameraOffset[2]
      camera.lookAt(0, 0, 0)
      controls.update()
    },

    setAction: (v, repeats = Infinity, restoreAction) => {
      myCTX.avatarActionName = v

      if (restoreAction) {
        myCTX.avatarActionResumeOnKeyUp = restoreAction
      }

      if (typeof repeats !== undefined) {
        myCTX.avatarActionRepeat = repeats
      }

      //
      set({ myCTX: myCTX })
    },

    goFowradDown: () => {
      myCTX.fwdPressed = true
      get().setAction('front', Infinity)
    },
    goFowradUp: () => {
      myCTX.fwdPressed = false
      if (myCTX.avatarActionRepeat === Infinity) {
        get().setAction(myCTX.avatarActionResumeOnKeyUp, Infinity)
      }
    },
    setKeyboard: () => {
      let setAction = get().setAction

      let onKeyDown = (e) => {
        switch (e.code) {
          case 'KeyX':
            if (myCTX.avatarActionResumeOnKeyUp === 'fightready') {
              setAction('stand', 1, 'stand')
            } else {
              setAction('fightready', 1, 'fightready')
            }
            break
          case 'KeyF':
            setAction('sidekick', 1)
            break
          case 'KeyV':
            setAction('warmup', 1)
            break
          case 'KeyR':
            setAction('backflip', 1)
            break
          case 'KeyW':
            myCTX.fwdPressed = true
            setAction('front', Infinity)
            break
          case 'KeyS':
            myCTX.bkdPressed = true
            setAction('back', Infinity)
            break
          case 'KeyD':
            myCTX.rgtPressed = true
            setAction('right', Infinity)
            break
          case 'KeyA':
            myCTX.lftPressed = true
            setAction('left', Infinity)
            break
          case 'KeyE':
            myCTX.rgtRotPressed = true
            break
          case 'KeyQ':
            myCTX.lftRotPressed = true
            break
          case 'ArrowUp':
            myCTX.fwdPressed = true
            setAction('running', Infinity)
            break
          case 'ArrowDown':
            myCTX.bkdPressed = true
            setAction('running', Infinity)
            break
          case 'ArrowRight':
            myCTX.rgtPressed = true
            setAction('running', Infinity)
            break
          case 'ArrowLeft':
            myCTX.lftPressed = true
            setAction('running', Infinity)
            break
          case 'Space':
            if (myCTX.playerIsOnGround) {
              myCTX.playerVelocity.y = 10.0
              setAction('jump', Infinity)
            }
            break
        }
      }

      //KeyboardControls
      window.addEventListener('keydown', onKeyDown)
      // this.parent.core.onClean(() => {
      //   window.removeEventListener('keydown', onKeyDown)
      // })

      let onKeyUp = (e) => {
        // if (!myCTX.xPressed) {
        //   // Core.now.drunkMode = false
        //   setAction('stand')
        // }

        switch (e.code) {
          case 'KeyW':
            myCTX.fwdPressed = false
          case 'KeyS':
            myCTX.bkdPressed = false
          case 'KeyD':
            myCTX.rgtPressed = false
          case 'KeyA':
            myCTX.lftPressed = false
          case 'KeyE':
            myCTX.rgtRotPressed = false
          case 'KeyQ':
            myCTX.lftRotPressed = false
          case 'ArrowUp':
            myCTX.fwdPressed = false
          case 'ArrowDown':
            myCTX.bkdPressed = false
          case 'ArrowRight':
            myCTX.rgtPressed = false
          case 'ArrowLeft':
            myCTX.lftPressed = false
          case 'Space':

          case 'KeyX':
            myCTX.xPressed = false
        }

        if (myCTX.avatarActionRepeat === Infinity) {
          setAction(myCTX.avatarActionResumeOnKeyUp, Infinity)
        }
      }

      window.addEventListener('focus', onKeyUp)
      // this.parent.core.onClean(() => {
      //   window.removeEventListener('focus', onKeyUp)
      // })

      window.addEventListener('blur', onKeyUp)
      // this.parent.core.onClean(() => {
      //   window.removeEventListener('blur', onKeyUp)
      // })

      window.addEventListener('keyup', onKeyUp)
      // this.parent.core.onClean(() => {
      //   window.removeEventListener('keyup', onKeyUp)
      // })

      return () => {
        window.removeEventListener('keydown', onKeyDown)
        window.removeEventListener('focus', onKeyUp)
        window.removeEventListener('blur', onKeyUp)
        window.removeEventListener('keyup', onKeyUp)
      }
    },

    //

    clips: [],
    mixer: false,
    group: false,
    setExporter: (v) => {
      set({
        //
        group: v.group,
        clips: v.clips,
        mixer: v.mixer,
      })
    },
    exportAvatar: () => {
      let ttt = setInterval(() => {
        let { clips, group, mixer, setAction } = get()

        if (group) {
          clearInterval(ttt)
          group.traverse(console.log)

          exportGLB({
            clips,
            group,
            mixer,
            onDone: () => {
              setAction('backflip', 1)
            },
          })
        }
      })
    },

    setAvatar: ({
      vendor,
      avatarURL,
      avatarPartUpper,
      avatarPartLower,
      avatarPartShoes,
    }) => {
      //
      if (vendor === 'rpm') {
        myCTX.avatarVendor = 'rpm'
        myCTX.avatarURL = avatarURL
        set({ myCTX })
      }
      if (vendor === 'closet') {
        myCTX.avatarVendor = 'closet'

        myCTX.avatarPartUpper = avatarPartUpper || myCTX.avatarPartUpper
        myCTX.avatarPartLower = avatarPartLower || myCTX.avatarPartLower
        myCTX.avatarPartShoes = avatarPartShoes || myCTX.avatarPartShoes

        set({ myCTX: myCTX })
      }
      //
      if (vendor === 'temp') {
        myCTX.avatarVendor = 'temp'
        myCTX.avatarURLWrap = avatarURL

        set({ myCTX: myCTX })
      }
    },

    updatePlayer: (delta) => {
      if (delta > 1 / 60) {
        delta = 1 / 60
      }

      let self = get()
      // console.log(self)

      if (!self.collider) {
        return
      }
      if (!self.controls) {
        return
      }
      if (!self.camera) {
        return
      }

      myCTX.playerVelocity.y += myCTX.playerIsOnGround
        ? 0
        : delta * myCTX.gravity
      myCTX.player.position.addScaledVector(myCTX.playerVelocity, delta)

      // move the player
      const angle = self.controls.getAzimuthalAngle()
      if (myCTX.fwdPressed) {
        myCTX.tempVector.set(0, 0, -1).applyAxisAngle(myCTX.upVector, angle)
        myCTX.player.position.addScaledVector(
          myCTX.tempVector,
          myCTX.playerSpeed * delta
        )
        myCTX.player.rotation.y = self.controls.getAzimuthalAngle()
      }

      if (myCTX.bkdPressed) {
        myCTX.tempVector.set(0, 0, 1).applyAxisAngle(myCTX.upVector, angle)
        myCTX.player.position.addScaledVector(
          myCTX.tempVector,
          myCTX.playerSpeed * delta
        )
        myCTX.player.rotation.y = self.controls.getAzimuthalAngle()
      }

      if (myCTX.lftPressed) {
        myCTX.tempVector.set(-1, 0, 0).applyAxisAngle(myCTX.upVector, angle)
        myCTX.player.position.addScaledVector(
          myCTX.tempVector,
          myCTX.playerSpeed * delta
        )
        myCTX.player.rotation.y = self.controls.getAzimuthalAngle()
      }
      if (myCTX.rgtPressed) {
        myCTX.tempVector.set(1, 0, 0).applyAxisAngle(myCTX.upVector, angle)
        myCTX.player.position.addScaledVector(
          myCTX.tempVector,
          myCTX.playerSpeed * delta
        )
        myCTX.player.rotation.y = self.controls.getAzimuthalAngle()
      }

      if (myCTX.lftRotPressed) {
        myCTX.tempVector
          .set(1, 0, 0)
          .applyQuaternion(self.controls.object.quaternion)

        myCTX.quaternion.setFromAxisAngle(myCTX.tempVector, 0.1)
        self.controls.object.quaternion.premultiply(myCTX.quaternion)
        myCTX.tempVector.applyQuaternion(myCTX.quaternion)
        self.controls.object.position.addScaledVector(
          myCTX.tempVector,
          myCTX.coord
            .copy(self.camera.position)
            .sub(self.controls.target)
            .length() * 0.03
        )
        self.controls.saveState()
        self.controls.update()
        myCTX.player.rotation.y = self.controls.getAzimuthalAngle()
      }

      if (myCTX.rgtRotPressed) {
        myCTX.tempVector
          .set(-1, 0, 0)
          .applyQuaternion(self.controls.object.quaternion)

        myCTX.quaternion.setFromAxisAngle(myCTX.tempVector, 0.1)
        self.controls.object.quaternion.premultiply(myCTX.quaternion)
        myCTX.tempVector.applyQuaternion(myCTX.quaternion)
        self.controls.object.position.addScaledVector(
          myCTX.tempVector,
          myCTX.coord
            .copy(self.camera.position)
            .sub(self.controls.target)
            .length() * 0.03
        )
        self.controls.saveState()
        self.controls.update()
        myCTX.player.rotation.y = self.controls.getAzimuthalAngle()
      }

      myCTX.player.updateMatrixWorld()

      // adjust player position based on collisions
      const capsuleInfo = myCTX.player.capsuleInfo
      myCTX.tempBox.makeEmpty()
      myCTX.tempMat.copy(self.collider.matrixWorld).invert()
      myCTX.tempSegment.copy(capsuleInfo.segment)

      // get the position of the capsule in the local space of the collider
      myCTX.tempSegment.start
        .applyMatrix4(myCTX.player.matrixWorld)
        .applyMatrix4(myCTX.tempMat)
      myCTX.tempSegment.end
        .applyMatrix4(myCTX.player.matrixWorld)
        .applyMatrix4(myCTX.tempMat)

      // get the axis aligned bounding box of the capsule
      myCTX.tempBox.expandByPoint(myCTX.tempSegment.start)
      myCTX.tempBox.expandByPoint(myCTX.tempSegment.end)

      myCTX.tempBox.min.addScalar(-capsuleInfo.radius)
      myCTX.tempBox.max.addScalar(capsuleInfo.radius)

      self.collider.geometry.boundsTree.shapecast({
        intersectsBounds: (box) => box.intersectsBox(myCTX.tempBox),

        intersectsTriangle: (tri) => {
          // check if the triangle is intersecting the capsule and adjust the
          // capsule position if it is.
          const triPoint = myCTX.tempVector
          const capsulePoint = myCTX.tempVector2

          const distance = tri.closestPointToSegment(
            myCTX.tempSegment,
            triPoint,
            capsulePoint
          )
          if (distance < capsuleInfo.radius) {
            const depth = capsuleInfo.radius - distance
            const direction = capsulePoint.sub(triPoint).normalize()

            myCTX.tempSegment.start.addScaledVector(direction, depth)
            myCTX.tempSegment.end.addScaledVector(direction, depth)
          }
        },
      })

      // get the adjusted position of the capsule collider in world space after checking
      // triangle collisions and moving it. capsuleInfo.segment.start is assumed to be
      // the origin of the player model.
      const newPosition = myCTX.tempVector
      newPosition
        .copy(myCTX.tempSegment.start)
        .applyMatrix4(self.collider.matrixWorld)

      // check how much the collider was moved
      const deltaVector = myCTX.tempVector2
      deltaVector.subVectors(newPosition, myCTX.player.position)

      // if the player was primarily adjusted vertically we assume it's on something we should consider ground
      myCTX.playerIsOnGround =
        deltaVector.y > Math.abs(delta * myCTX.playerVelocity.y * 0.25)

      const offset = Math.max(0.0, deltaVector.length() - 1e-5)
      deltaVector.normalize().multiplyScalar(offset)

      // adjust the player model
      myCTX.player.position.add(deltaVector)

      if (!myCTX.playerIsOnGround) {
        deltaVector.normalize()
        myCTX.playerVelocity.addScaledVector(
          deltaVector,
          -deltaVector.dot(myCTX.playerVelocity)
        )
      } else {
        myCTX.playerVelocity.set(0, 0, 0)
      }

      // adjust the camera
      self.camera.position.sub(self.controls.target)
      self.controls.target.copy(myCTX.player.position)
      self.camera.position.add(myCTX.player.position)

      self.controls.target.y += 0.0001 * Math.sin(delta)

      // if the player has fallen too far below the level reset their position to the start
      if (myCTX.player.position.y < -100) {
        // self.myCTX.player.position.copy({
        //   lookAtTarget: [3.3, 1.5, 32.1],
        //   cameraPositionOffset: [0, 1, 4],
        // })
        self.myCTX.player.position.fromArray([0, 5, 0])
        self.myCTX.playerVelocity.set(0, 0, 0)

        // this.reset({ position: [0, 3, 3], lookAtTarget: [0, 3, 3] })
      }
    },

    //
  }
})
