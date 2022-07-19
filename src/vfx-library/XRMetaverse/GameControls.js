import { getID } from '@/vfx-runtime/ENUtils'
import { Quaternion, Vector3 } from 'three'
// import { Dev } from "./sayTJ";
// import nipplejs from "nipplejs";

export class GameControls {
  constructor({
    api,
    container,
    toggleView = () => {},
    state,
    player,
    controls,
  }) {
    container.style['user-select'] = 'none'
    container.style['-webkit-user-select'] = 'none'

    container.style['touch-action'] = 'manipulate'
    container.style['-webkit-touch-action'] = 'manipulate'

    let headerSVG = `data:image/svg+xml;utf8,`

    let getSVGBG = (svg) => {
      svg = svg.replace(/\n/, '')
      svg = svg.trim()
      return `${headerSVG}${encodeURIComponent(svg)}`
    }

    let svgJoyStick = `

<svg width="214px" height="214px" viewBox="0 0 214 214" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <defs>
        <radialGradient cx="50%" cy="50%" fx="50%" fy="50%" r="50%" id="radialGradient-_mdw4ym1zz-1">
            <stop stop-color="#E0E0E0" offset="0%"></stop>
            <stop stop-color="#FFFFFF" stop-opacity="0.158597506" offset="100%"></stop>
        </radialGradient>
        <linearGradient x1="50%" y1="0%" x2="50%" y2="208.284844%" id="linearGradient-_mdw4ym1zz-2">
            <stop stop-color="#FFBA00" stop-opacity="0" offset="0%"></stop>
            <stop stop-color="#FFA100" offset="100%"></stop>
        </linearGradient>
    </defs>
    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="Group" fill-rule="nonzero">
            <g id="Group-2">
                <circle id="Oval" fill="url(#radialGradient-_mdw4ym1zz-1)" cx="107" cy="107" r="107"></circle>
                <polygon id="Triangle" fill="url(#linearGradient-_mdw4ym1zz-2)" points="107 25 134.5 61 79.5 61"></polygon>
                <polygon id="Triangle-Copy" fill="url(#linearGradient-_mdw4ym1zz-2)" transform="translate(107.000000, 170.000000) scale(-1, 1) rotate(-180.000000) translate(-107.000000, -170.000000) " points="107 152 134.5 188 79.5 188"></polygon>
                <polygon id="Triangle-Copy" fill="url(#linearGradient-_mdw4ym1zz-2)" transform="translate(40.000000, 107.000000) rotate(-90.000000) translate(-40.000000, -107.000000) " points="40 89 67.5 125 12.5 125"></polygon>
                <polygon id="Triangle-Copy" fill="url(#linearGradient-_mdw4ym1zz-2)" transform="translate(178.000000, 107.000000) scale(-1, 1) rotate(-90.000000) translate(-178.000000, -107.000000) " points="178 89 205.5 125 150.5 125"></polygon>
                <path d="M131,99 L131,108 L126,105.44898 L126,101.55102 L131,99 Z M136,90 L120,98.1 L120,108.9 L136,117 L136,90 Z M102.769474,120 L95.2305265,120 L80,135.162 L83.8539664,139 L96.2744226,126.633714 L96.2744226,138.991857 L101.725577,138.991857 L101.725577,126.633714 L114.146034,139 L118,135.162 L102.769474,120 Z M111,79 C113.205333,79 115,80.7946667 115,83 C115,85.2053333 113.205333,87 111,87 C108.794667,87 107,85.2053333 107,83 C107,80.7946667 108.794667,79 111,79 Z M86,79 C88.2053333,79 90,80.7946667 90,83 C90,85.2053333 88.2053333,87 86,87 C83.7946667,87 82,85.2053333 82,83 C82,80.7946667 83.7946667,79 86,79 Z M110.5,74 C105.253286,74 101,78.2532857 101,83.5 C101,88.7467143 105.253286,93 110.5,93 C115.746714,93 120,88.7467143 120,83.5 C120,78.2532857 115.746714,74 110.5,74 Z M86.5,74 C81.2532857,74 77,78.2532857 77,83.5 C77,88.7467143 81.2532857,93 86.5,93 C91.7467143,93 96,88.7467143 96,83.5 C96,78.2532857 91.7467143,74 86.5,74 Z M110.875,98.5828102 C110.41025,98.5828102 109.95375,98.5390311 109.5,98.4979881 L109.5,108.159504 C109.5,108.914695 108.884,109.527603 108.125,109.527603 L88.875,109.527603 C88.116,109.527603 87.5,108.914695 87.5,108.159504 L87.5,98.4979881 C87.04625,98.5390311 86.58975,98.5828102 86.125,98.5828102 C84.69225,98.5828102 83.3145,98.3693868 82,98 L82,110.895703 C82,113.164011 83.848,115 86.125,115 L110.875,115 C113.152,115 115,113.164011 115,110.895703 L115,98 C113.6855,98.3693868 112.30775,98.5828102 110.875,98.5828102 L110.875,98.5828102 Z" id="Shape" fill="#FFFFFF"></path>
            </g>
        </g>
    </g>
</svg>`

    let controllerDiv = document.createElement('div')
    controllerDiv.addEventListener(
      'touchmove',
      (ev) => {
        ev.preventDefault()
        ev.stopImmediatePropagation()
        ev.stopPropagation()
      },
      { passive: false }
    )

    //
    controllerDiv.addEventListener(
      'touchstart',
      (ev) => {
        ev.preventDefault()
        ev.stopImmediatePropagation()
        ev.stopPropagation()
      },
      { passive: false }
    )

    controllerDiv.addEventListener(
      'dragstart',
      (ev) => {
        ev.preventDefault()
        ev.stopImmediatePropagation()
        ev.stopPropagation()
      },
      { passive: false }
    )
    controllerDiv.addEventListener(
      'drag',
      (ev) => {
        ev.preventDefault()
        ev.stopImmediatePropagation()
        ev.stopPropagation()
      },
      { passive: false }
    )

    container.appendChild(controllerDiv)
    api.onClean(() => {
      container.removeChild(controllerDiv)
    })

    controllerDiv.style.cssText = `
      position: ${
        api.now.mode === 'square' || api.now.mode === 'boxfull'
          ? 'absolute'
          : 'fixed'
      };
      bottom: calc(30px);
      right: 30px;
      width: 120px;
      height: 120px;
      border-radius: 100% 100% 100% 100%;
      z-index: 30px;
      user-select: none;
      touch-action: manipulation;
      -webkit-user-select: manipulation;

      // background: rgb(255,255,255);
      // background: radial-gradient(circle, rgba(255,255,255,0) 0%, rgba(255,217,159,1) 64%, rgba(255,255,255,0) 100%);
      background-image: url("${getSVGBG(svgJoyStick)}");
      background-size: contain;

      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 14px;
      text-align:center;
      padding: 35px 10px;

      color: white;
    `

    import('nipplejs').then((nipplejs) => {
      let manager = nipplejs.create({
        zone: controllerDiv,
        color: 'white',
      })

      api.onClean(() => {
        //
        manager.destroy()
      })

      let up = new Vector3(0, 1, 0)
      let forward = new Vector3()
      let coord = new Vector3()
      let tempVector = new Vector3()
      let quaternion = new Quaternion()
      let nippleAngle = 0
      let nippleForce = 0
      let active = 'off'

      let camera = controls.object

      // let lookAtTarget = new Vector3();

      manager
        .on('added', (evt, nipple) => {
          nipple.on('start move end dir plain', (evta, nipple) => {
            if (evta.type === 'move') {
              if (nipple?.angle?.radian) {
                active = 'on'

                state.running = true

                //
                console.log(nipple)
                console.log(nipple.vector)

                forward.x = nipple.vector.x
                forward.y = nipple.vector.y

                // if (nipple.direction) {
                //   if (nipple.direction.angle === 'up') {
                //     state.fwdArrowPressed = true
                //   } else if (nipple.direction.angle === 'down') {
                //     state.bkdArrowPressed = true
                //   } else if (nipple.direction.angle === 'left') {
                //     state.lftArrowPressed = true
                //   } else if (nipple.direction.angle === 'right') {
                //     state.rgtArrowPressed = true
                //   }
                // }

                //
                state.frontMotion = 'forward'

                nippleAngle = nipple.angle.radian + Math.PI * 0.5
                nippleForce = Math.abs(nipple.force)

                if (nippleForce >= 1) {
                  nippleForce = 1
                }
              }
            } else if (evta.type === 'end') {
              active = 'off'
              state.frontMotion = ''
              state.running = false

              state.fwdArrowPressed = false
              state.bkdArrowPressed = false
              state.rgtArrowPressed = false
              state.lftArrowPressed = false
            }
          })
        })
        .on('removed', (evt, nipple) => {
          nipple.off('start move end dir plain')
        })

      api.onLoop((delta) => {
        if (active === 'on') {
          //
          tempVector
            .set(forward.x, forward.y, 0)
            .applyQuaternion(controls.object.quaternion)

          quaternion.setFromAxisAngle(tempVector, 0.1)
          controls.object.quaternion.premultiply(quaternion)
          tempVector.applyQuaternion(quaternion)
          controls.object.position.addScaledVector(
            tempVector,
            coord.copy(camera.position).sub(controls.target).length() *
              delta *
              nippleForce
          )
          controls.saveState()
          controls.update()

          // console.log(nippleAngle, controls.getAzimuthalAngle());
          // controls.update()
          // forward.set(0, 0, 1.3)
          // forward.applyAxisAngle(up, nippleAngle + controls.getAzimuthalAngle())
          // forward.multiplyScalar(0.1)
          // player.position.add(forward)
          // player.rotation.y = nippleAngle + controls.getAzimuthalAngle()
        }
      })
    })

    //
    //
    //
    //
    //
    //
    //
    //
    //

    // let svgJoyStick = `<svg width="214px" height="214px" viewBox="0 0 214 214" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    //     <defs>
    //         <radialGradient cx="50%" cy="50%" fx="50%" fy="50%" r="50%" id="radialGradient-jzapbx9y2c-1">
    //             <stop stop-color="#E0E0E0" offset="0%"></stop>
    //             <stop stop-color="#FFFFFF" stop-opacity="0.158597506" offset="100%"></stop>
    //         </radialGradient>
    //         <linearGradient x1="50%" y1="0%" x2="50%" y2="208.284844%" id="linearGradient-jzapbx9y2c-2">
    //             <stop stop-color="#FFBA00" stop-opacity="0" offset="0%"></stop>
    //             <stop stop-color="#FFA100" offset="100%"></stop>
    //         </linearGradient>
    //     </defs>
    //     <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
    //         <g id="Group-2">
    //             <g id="Group">
    //                 <circle id="Oval" fill="url(#radialGradient-jzapbx9y2c-1)" cx="107" cy="107" r="107"></circle>
    //                 <polygon id="Triangle" fill="url(#linearGradient-jzapbx9y2c-2)" points="107 25 134.5 61 79.5 61"></polygon>
    //                 <polygon id="Triangle-Copy" fill="url(#linearGradient-jzapbx9y2c-2)" transform="translate(107.000000, 170.000000) scale(1, -1) translate(-107.000000, -170.000000) " points="107 152 134.5 188 79.5 188"></polygon>
    //                 <polygon id="Triangle-Copy" fill="url(#linearGradient-jzapbx9y2c-2)" transform="translate(40.000000, 107.000000) scale(-1, -1) rotate(90.000000) translate(-40.000000, -107.000000) " points="40 89 67.5 125 12.5 125"></polygon>
    //                 <polygon id="Triangle-Copy" fill="url(#linearGradient-jzapbx9y2c-2)" transform="translate(178.000000, 107.000000) scale(1, -1) rotate(90.000000) translate(-178.000000, -107.000000) " points="178 89 205.5 125 150.5 125"></polygon>
    //             </g>
    //             <g id="joystick" transform="translate(75.000000, 99.000000)" fill="#FFFFFF" fill-rule="nonzero">
    //                 <g id="Group-3">
    //                     <path d="M1.28141506,13.9881188 C1.52774024,14.3683168 1.77144495,14.6310231 2.01252917,14.7762376 C2.2536134,14.9214521 2.50780002,14.9940594 2.77508906,14.9940594 C2.84322155,14.9940594 2.90349261,14.9768977 2.95590222,14.9425743 C3.00831184,14.9082508 3.05286001,14.8462046 3.08954674,14.7564356 C3.12623347,14.6666667 3.15243828,14.5452145 3.16816116,14.3920792 C3.18388404,14.2389439 3.19174549,14.0435644 3.19174549,13.8059406 L3.19174549,4.87128713 L4.9134013,3.96831683 L5.64451542,3.96831683 L5.64451542,12.6019802 C5.64451542,13.320132 5.55410883,13.89967 5.37329566,14.3405941 C5.1924825,14.7815182 4.94877779,15.1234323 4.64218155,15.3663366 C4.33558531,15.6092409 3.97788969,15.7729373 3.56909471,15.8574257 C3.16029972,15.9419142 2.7279204,15.9841584 2.27195676,15.9841584 C1.95749908,15.9841584 1.68103837,15.9485149 1.44257462,15.8772277 C1.20411088,15.8059406 0.994472424,15.7174917 0.813659256,15.6118812 C0.632846088,15.5062706 0.476927486,15.3914191 0.345903452,15.2673267 C0.214879417,15.1432343 0.0995782664,15.0283828 0,14.9227723 L1.28141506,13.9881188 Z M3.09740818,1.30693069 C3.09740818,1.14323432 3.13147443,0.987458746 3.19960693,0.83960396 C3.26773943,0.691749175 3.36076649,0.565016502 3.47868812,0.459405941 C3.59660975,0.35379538 3.73418499,0.269306931 3.89141383,0.205940594 C4.04864267,0.142574257 4.21897392,0.110891089 4.40240757,0.110891089 C4.58060025,0.110891089 4.74962126,0.142574257 4.90947058,0.205940594 C5.0693199,0.269306931 5.20951562,0.35379538 5.33005773,0.459405941 C5.45059984,0.565016502 5.54493715,0.691749175 5.61306965,0.83960396 C5.68120215,0.987458746 5.71526839,1.14323432 5.71526839,1.30693069 C5.71526839,1.47062706 5.68120215,1.62508251 5.61306965,1.77029703 C5.54493715,1.91551155 5.45059984,2.04092409 5.33005773,2.14653465 C5.20951562,2.25214521 5.0693199,2.33663366 4.90947058,2.4 C4.74962126,2.46336634 4.58060025,2.4950495 4.40240757,2.4950495 C4.21897392,2.4950495 4.04864267,2.46336634 3.89141383,2.4 C3.73418499,2.33663366 3.59660975,2.25214521 3.47868812,2.14653465 C3.36076649,2.04092409 3.26773943,1.91551155 3.19960693,1.77029703 C3.13147443,1.62508251 3.09740818,1.47062706 3.09740818,1.30693069 Z" id="Shape"></path>
    //                     <path d="M11.9965606,12.3960396 C11.3571633,12.3960396 10.7662449,12.290429 10.2238054,12.0792079 C9.68136593,11.8679868 9.21229988,11.5775578 8.8166073,11.2079208 C8.42091471,10.8382838 8.11169799,10.4039604 7.88895713,9.9049505 C7.66621627,9.40594059 7.55484584,8.8660066 7.55484584,8.28514851 C7.55484584,7.6620462 7.66621627,7.08778878 7.88895713,6.56237624 C8.11169799,6.0369637 8.41960447,5.58415842 8.81267658,5.2039604 C9.20574868,4.82376238 9.67350448,4.52673267 10.215944,4.31287129 C10.7583835,4.0990099 11.3493019,3.99207921 11.9886992,3.99207921 C12.6280965,3.99207921 13.2203251,4.09636964 13.7653851,4.3049505 C14.3104451,4.51353135 14.7808214,4.8 15.1765139,5.16435644 C15.5722065,5.52871287 15.8827335,5.95775578 16.1080948,6.45148515 C16.3334562,6.94521452 16.4461368,7.47722772 16.4461368,8.04752475 C16.4461368,8.64422442 16.3347664,9.20660066 16.1120255,9.73465347 C15.8892847,10.2627063 15.580068,10.7234323 15.1843754,11.1168317 C14.7886828,11.510231 14.3183065,11.8217822 13.7732465,12.0514851 C13.2281865,12.2811881 12.6359579,12.3960396 11.9965606,12.3960396 Z M12.2795725,11.4059406 C12.4996929,11.4059406 12.7040904,11.3333333 12.892765,11.1881188 C13.0814396,11.0429043 13.2452197,10.8475248 13.3841051,10.6019802 C13.5229906,10.3564356 13.6304303,10.0726073 13.7064243,9.75049505 C13.7824182,9.42838284 13.8204152,9.09306931 13.8204152,8.74455446 C13.8204152,8.22706271 13.7824182,7.73993399 13.7064243,7.28316832 C13.6304303,6.82640264 13.5059575,6.42640264 13.3330058,6.08316832 C13.160054,5.73993399 12.9360029,5.4679868 12.6608525,5.26732673 C12.385702,5.06666667 12.0489702,4.96633663 11.6506572,4.96633663 C11.4567416,4.96633663 11.2706875,5.03762376 11.0924948,5.18019802 C10.9143021,5.32277228 10.7570733,5.51419142 10.6208083,5.75445545 C10.4845433,5.99471947 10.3757933,6.27194719 10.2945584,6.58613861 C10.2133235,6.90033003 10.1727061,7.23168317 10.1727061,7.58019802 C10.1727061,8.1029703 10.2211849,8.59669967 10.3181427,9.06138614 C10.4151005,9.52607261 10.553986,9.93135314 10.7347992,10.2772277 C10.9156123,10.6231023 11.1357327,10.8976898 11.3951603,11.1009901 C11.6545879,11.3042904 11.949392,11.4059406 12.2795725,11.4059406 Z" id="Shape"></path>
    //                     <path d="M18.4193588,14.1623762 C18.4717684,14.1887789 18.5412112,14.2231023 18.627687,14.2653465 C18.7141629,14.3075908 18.8085002,14.3471947 18.9106989,14.3841584 C19.0128977,14.4211221 19.1216476,14.4528053 19.2369488,14.4792079 C19.3522499,14.5056106 19.4675511,14.5188119 19.5828522,14.5188119 C19.6771895,14.5188119 19.7715268,14.4633663 19.8658641,14.3524752 C19.9602014,14.2415842 20.0492978,14.1122112 20.1331532,13.9643564 C20.2170086,13.8165017 20.2916923,13.6686469 20.3572043,13.5207921 C20.4227163,13.3729373 20.4711952,13.2646865 20.502641,13.1960396 L21.2023093,11.6673267 L17.2794497,4.13465347 L19.8580027,4.13465347 L22.3972485,8.99009901 L24.6456209,4.13465347 L26.3672767,4.13465347 L21.9177005,13.9009901 C21.7709536,14.2178218 21.5848995,14.5056106 21.3595381,14.7643564 C21.1341768,15.0231023 20.8878516,15.2435644 20.6205626,15.4257426 C20.3532736,15.6079208 20.0741924,15.7491749 19.783319,15.849505 C19.4924456,15.949835 19.205503,16 18.9224911,16 C18.6866478,16 18.4691479,15.9722772 18.2699914,15.9168317 C18.0708349,15.8613861 17.8978831,15.7782178 17.7511362,15.6673267 L18.4193588,14.1623762 Z" id="Path"></path>
    //                     <path d="M28.4898661,9.98019802 C28.6313721,10.4237624 28.8344593,10.7683168 29.0991279,11.0138614 C29.3637964,11.2594059 29.6952872,11.3821782 30.0936003,11.3821782 C30.2613111,11.3821782 30.4146092,11.3610561 30.5534947,11.3188119 C30.6923801,11.2765677 30.8129222,11.2171617 30.915121,11.1405941 C31.0173197,11.0640264 31.0959342,10.9755776 31.1509643,10.8752475 C31.2059943,10.7749175 31.2335094,10.6666667 31.2335094,10.550495 C31.2335094,10.360396 31.1981329,10.190099 31.1273799,10.039604 C31.056627,9.88910891 30.9583589,9.75313531 30.8325759,9.63168317 C30.7067928,9.51023102 30.5574254,9.3980198 30.3844737,9.2950495 C30.2115219,9.19207921 30.0254678,9.09570957 29.8263113,9.00594059 C29.5066126,8.86336634 29.1895345,8.70891089 28.8750768,8.54257426 C28.5606191,8.37623762 28.2776072,8.18613861 28.026041,7.97227723 C27.7744749,7.75841584 27.5713876,7.51419142 27.4167793,7.23960396 C27.2621709,6.9650165 27.1848667,6.64818482 27.1848667,6.28910891 C27.1848667,5.94587459 27.2556197,5.6330033 27.3971257,5.35049505 C27.5386316,5.0679868 27.7377882,4.82640264 27.9945953,4.62574257 C28.2514024,4.42508251 28.5579986,4.26930693 28.914384,4.15841584 C29.2707694,4.04752475 29.6638415,3.99207921 30.0936003,3.99207921 C30.4866724,3.99207921 30.8351963,4.0290429 31.1391721,4.1029703 C31.4431479,4.17689769 31.7104369,4.28250825 31.9410392,4.41980198 C32.1716415,4.55709571 32.376039,4.72475248 32.5542317,4.92277228 C32.7324244,5.12079208 32.8922737,5.34389439 33.0337796,5.59207921 L31.6187201,6.08316832 C31.5453466,5.82442244 31.4562503,5.62376238 31.351431,5.48118812 C31.2466118,5.33861386 31.1365516,5.23168317 31.0212505,5.16039604 C30.9059493,5.08910891 30.7932686,5.04554455 30.6832085,5.02970297 C30.5731483,5.01386139 30.4761905,5.00594059 30.3923351,5.00594059 C30.2403472,5.00594059 30.0962208,5.02310231 29.9599558,5.05742574 C29.8236908,5.09174917 29.7031487,5.14059406 29.5983294,5.2039604 C29.4935102,5.26732673 29.4096548,5.34521452 29.3467633,5.43762376 C29.2838718,5.530033 29.252426,5.6369637 29.252426,5.75841584 C29.252426,5.91155116 29.2917332,6.05676568 29.3703476,6.19405941 C29.448962,6.33135314 29.5590222,6.45940594 29.7005282,6.57821782 C29.8420341,6.6970297 30.0084347,6.80924092 30.1997298,6.91485149 C30.3910249,7.02046205 30.5993531,7.12079208 30.8247144,7.21584158 C31.1653769,7.35841584 31.4968677,7.51683168 31.8191868,7.69108911 C32.141506,7.86534653 32.4284486,8.0620462 32.6800147,8.28118812 C32.9315809,8.50033003 33.1333579,8.74323432 33.2853458,9.00990099 C33.4373337,9.27656766 33.5133276,9.57359736 33.5133276,9.9009901 C33.5133276,10.2547855 33.455677,10.5848185 33.3403759,10.8910891 C33.2250747,11.1973597 33.0377104,11.4640264 32.7782828,11.6910891 C32.5188552,11.9181518 32.1834336,12.0976898 31.7720182,12.229703 C31.3606027,12.3617162 30.8614011,12.4277228 30.2744135,12.4277228 C29.7712812,12.4277228 29.3454531,12.369637 28.9969291,12.2534653 C28.6484052,12.1372937 28.3536011,11.9881188 28.1125169,11.8059406 C27.8714327,11.6237624 27.6722761,11.4191419 27.5150473,11.1920792 C27.3578184,10.9650165 27.218933,10.7405941 27.0983909,10.5188119 L28.4898661,9.98019802 Z" id="Path"></path>
    //                     <path d="M34.4409778,5.14851485 L34.4409778,4.57029703 L35.7381157,4.13465347 L35.7381157,2.48712871 L37.4440486,1.58415842 L38.1751628,1.58415842 L38.1751628,4.13465347 L40.1483847,4.13465347 L40.1483847,5.14851485 L38.1751628,5.14851485 L38.1751628,10.3683168 C38.1751628,10.5320132 38.2170904,10.6745875 38.3009458,10.7960396 C38.3848012,10.9174917 38.4948614,10.9782178 38.6311264,10.9782178 C38.7149818,10.9782178 38.8080088,10.9491749 38.9102076,10.8910891 C39.0124063,10.8330033 39.1093641,10.7656766 39.2010809,10.6891089 C39.2927978,10.6125413 39.3740327,10.5346535 39.4447857,10.4554455 C39.5155386,10.3762376 39.566638,10.3155116 39.5980838,10.2732673 L40.4313966,10.9386139 C40.2951316,11.149835 40.1457642,11.3465347 39.9832944,11.5287129 C39.8208246,11.7108911 39.6347705,11.8679868 39.425132,12 C39.2154936,12.1320132 38.9744094,12.2363036 38.7018794,12.3128713 C38.4293494,12.3894389 38.1148917,12.4277228 37.7585063,12.4277228 C37.4178438,12.4277228 37.1217295,12.3788779 36.8701634,12.2811881 C36.6185972,12.1834983 36.4089588,12.0475248 36.241248,11.8732673 C36.0735372,11.6990099 35.9477542,11.490429 35.8638988,11.2475248 C35.7800434,11.0046205 35.7381157,10.7353135 35.7381157,10.439604 L35.7381157,5.14851485 L34.4409778,5.14851485 Z" id="Path"></path>
    //                     <path d="M41.8857634,4.87128713 L43.5995578,3.96831683 L44.3306719,3.96831683 L44.3306719,12.2455446 L41.8857634,12.2455446 L41.8857634,4.87128713 Z M41.7835647,1.30693069 C41.7835647,1.14323432 41.8176309,0.987458746 41.8857634,0.83960396 C41.9538959,0.691749175 42.0482332,0.565016502 42.1687753,0.459405941 C42.2893174,0.35379538 42.4282029,0.269306931 42.5854318,0.205940594 C42.7426606,0.142574257 42.9129919,0.110891089 43.0964255,0.110891089 C43.2798591,0.110891089 43.4515006,0.142574257 43.61135,0.205940594 C43.7711993,0.269306931 43.9100848,0.35379538 44.0280064,0.459405941 C44.145928,0.565016502 44.2389551,0.691749175 44.3070876,0.83960396 C44.3752201,0.987458746 44.4092863,1.14323432 44.4092863,1.30693069 C44.4092863,1.47062706 44.3752201,1.62508251 44.3070876,1.77029703 C44.2389551,1.91551155 44.145928,2.04092409 44.0280064,2.14653465 C43.9100848,2.25214521 43.7711993,2.33663366 43.61135,2.4 C43.4515006,2.46336634 43.2798591,2.4950495 43.0964255,2.4950495 C42.9129919,2.4950495 42.7426606,2.46336634 42.5854318,2.4 C42.4282029,2.33663366 42.2893174,2.25214521 42.1687753,2.14653465 C42.0482332,2.04092409 41.9538959,1.91551155 41.8857634,1.77029703 C41.8176309,1.62508251 41.7835647,1.47062706 41.7835647,1.30693069 Z" id="Shape"></path>
    //                     <path d="M52.2314212,6.52673267 C52.2104574,6.45808581 52.1659092,6.33927393 52.0977767,6.17029703 C52.0296442,6.00132013 51.9261352,5.82838284 51.7872497,5.65148515 C51.6483642,5.47458746 51.4649306,5.31749175 51.2369488,5.18019802 C51.008967,5.04290429 50.7246448,4.97425743 50.3839823,4.97425743 C50.1219342,4.97425743 49.886091,5.04026403 49.6764525,5.17227723 C49.4668141,5.30429043 49.2886214,5.48118812 49.1418745,5.7029703 C48.9951275,5.92475248 48.8811366,6.18349835 48.7999017,6.47920792 C48.7186668,6.77491749 48.6780494,7.08382838 48.6780494,7.40594059 C48.6780494,7.86006601 48.7291488,8.29306931 48.8313475,8.7049505 C48.9335462,9.11683168 49.0763624,9.47986799 49.2597961,9.79405941 C49.4432297,10.1082508 49.6659706,10.3577558 49.9280187,10.5425743 C50.1900667,10.7273927 50.4809401,10.819802 50.8006387,10.819802 C51.0731687,10.819802 51.3181837,10.7656766 51.5356836,10.6574257 C51.7531835,10.5491749 51.9510298,10.4013201 52.1292225,10.2138614 C52.3074151,10.0264026 52.4672645,9.80726073 52.6087704,9.55643564 C52.7502764,9.30561056 52.8839209,9.03762376 53.009704,8.75247525 L54.1731974,9.06930693 C54.0369324,9.59735974 53.8482578,10.0673267 53.6071736,10.4792079 C53.3660893,10.8910891 53.0791467,11.239604 52.7463457,11.5247525 C52.4135446,11.809901 52.0375056,12.0264026 51.6182287,12.1742574 C51.1989518,12.3221122 50.7429882,12.3960396 50.2503378,12.3960396 C49.6947959,12.3960396 49.1733202,12.2891089 48.6859108,12.0752475 C48.1985014,11.8613861 47.7739835,11.5709571 47.4123572,11.2039604 C47.0507309,10.8369637 46.7650985,10.4092409 46.55546,9.92079208 C46.3458216,9.43234323 46.2410023,8.91353135 46.2410023,8.36435644 C46.2410023,7.96831683 46.2921017,7.58415842 46.3943005,7.21188119 C46.4964992,6.83960396 46.6406256,6.49108911 46.8266798,6.16633663 C47.0127339,5.84158416 47.2354748,5.54587459 47.4949023,5.27920792 C47.7543299,5.01254125 48.0425828,4.78415842 48.359661,4.59405941 C48.6767391,4.4039604 49.0160914,4.25610561 49.3777177,4.15049505 C49.7393441,4.04488449 50.1140728,3.99207921 50.5019039,3.99207921 C50.9159399,3.99207921 51.2775662,4.01848185 51.586783,4.07128713 C51.8959997,4.12409241 52.1698399,4.20858086 52.4083036,4.32475248 C52.6467674,4.44092409 52.8642673,4.59273927 53.0608033,4.78019802 C53.2573394,4.96765677 53.4525652,5.1960396 53.6464808,5.46534653 L52.2314212,6.52673267 Z" id="Path"></path>
    //                     <polygon id="Path" points="58.3240388 6.91485149 61.4843385 4.13465347 63.2453016 4.13465347 59.7233755 7.23960396 64 12.2455446 61.1148508 12.2455446 58.3240388 8.99009901 58.3240388 12.2455446 55.8712689 12.2455446 55.8712689 0.902970297 57.5929247 0 58.3240388 0"></polygon>
    //                 </g>
    //             </g>
    //         </g>
    //     </g>
    // </svg>`

    //   let svgPerspective = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#555" d="M17 17h-10v-10h10v10zm7 3l-5-3v-10l5-3v16zm-24-16l5 3v10l-5 3v-16z"/></svg>`

    //   let svgJump = `<svg
    //   width="24"
    //   height="24"
    //   xmlns="http://www.w3.org/2000/svg"
    //   fill-rule="evenodd"
    //   clip-rule="evenodd"
    // >
    //   <path
    //     fill="#555"
    //     d="M18.028 24h-.018c-.268 0-.49-.213-.499-.483-.05-1.462.19-2.847 2.265-3.08.795-.089.858-.367.996-.977.229-1.008.607-1.922 2.701-2.032.285-.02.512.197.526.473.014.276-.197.512-.473.526-1.512.079-1.618.547-1.778 1.254-.152.667-.359 1.581-1.861 1.751-1.016.113-1.432.423-1.377 2.051.01.276-.207.507-.482.517zm-8.342-18.714c.241.213.53.366.842.444l3.566.896c.3.076.617.051.903-.07 1.082-.461 3.862-1.684 5.062-2.155.76-.299 1.268.63.655 1.097-1.39 1.062-5.714 4.086-5.714 4.086l-.862 3.648s1.785 1.86 2.544 2.7c.423.469.696.919.421 1.595-.481 1.181-1.457 3.477-1.908 4.547-.255.605-1.164.453-1.015-.322.217-1.128.781-4.016.781-4.016l-3.558-1.62s-.253 5.953-.327 7.296c-.019.341-.253.589-.582.588-.249-.001-.508-.173-.612-.596-.534-2.178-2.142-8.99-2.142-8.99-.209-.837-.329-1.53-.053-2.564l.915-3.85s-2.726-3.984-3.709-5.476c-.402-.611.356-1.18.808-.78l3.985 3.542zm-7.178 8.489l-.853.511 2.708 4.524c-1.788.306-2.917 1.904-2.048 3.356.537.897 1.753 1.106 2.622.586 1.034-.619 1.774-1.952.979-3.284l-3.408-5.693zm17.721-5.193l.904 1.669 1.867.344-1.308 1.376.249 1.882-1.712-.819-1.713.819.25-1.882-1.309-1.376 1.867-.344.905-1.669zm-17.298-2.935l-2.934 2.935 2.934 2.935 2.935-2.935-2.935-2.935zm9.055-5.398c1.36-.626 2.972-.03 3.597 1.33.626 1.36.03 2.972-1.33 3.598-1.36.625-2.972.029-3.598-1.331-.625-1.36-.029-2.972 1.331-3.597z"
    //   />
    // </svg>`

    // let getSVGBG = (svg) => {
    //   svg = svg.replace(/\n/, '')
    //   svg = svg.trim()
    //   return `${headerSVG}${encodeURIComponent(svg)}`
    // }

    // let controllerDiv = document.createElement('div')
    // controllerDiv.addEventListener(
    //   'touchmove',
    //   (ev) => {
    //     ev.preventDefault()
    //     ev.stopImmediatePropagation()
    //     ev.stopPropagation()
    //   },
    //   { passive: false }
    // )
    // controllerDiv.addEventListener(
    //   'touchstart',
    //   (ev) => {
    //     ev.preventDefault()
    //     ev.stopImmediatePropagation()
    //     ev.stopPropagation()
    //   },
    //   { passive: false }
    // )

    // controllerDiv.addEventListener(
    //   'dragstart',
    //   (ev) => {
    //     ev.preventDefault()
    //     ev.stopImmediatePropagation()
    //     ev.stopPropagation()
    //   },
    //   { passive: false }
    // )
    // controllerDiv.addEventListener(
    //   'drag',
    //   (ev) => {
    //     ev.preventDefault()
    //     ev.stopImmediatePropagation()
    //     ev.stopPropagation()
    //   },
    //   { passive: false }
    // )

    // container.appendChild(controllerDiv);
    // api.onClean(() => {
    //   container.removeChild(controllerDiv);
    // });

    // controllerDiv.style.cssText = `
    //   position: ${
    //     api.now.mode === 'square' || api.now.mode === 'boxfull'
    //       ? 'absolute'
    //       : 'fixed'
    //   };
    //   bottom: calc(30px);
    //   left: 30px;
    //   width: 120px;
    //   height: 120px;
    //   border-radius: 100% 100% 100% 100%;
    //   z-index: 30px;
    //   user-select: none;
    //   touch-action: manipulation;
    //   -webkit-user-select: manipulation;

    //   // background: rgb(255,255,255);
    //   // background: radial-gradient(circle, rgba(255,255,255,0) 0%, rgba(255,217,159,1) 64%, rgba(255,255,255,0) 100%);
    //   background-image: url("${getSVGBG(svgJoyStick)}");
    //   background-size: contain;

    //   display: flex;
    //   justify-content: center;
    //   align-items: center;
    //   font-size: 14px;
    //   text-align:center;
    //   padding: 35px 10px;

    //   color: white;
    // `

    // import('nipplejs').then((nipplejs) => {
    //   let manager = nipplejs.create({
    //     zone: controllerDiv,
    //     color: 'white',
    //   })

    //   api.onClean(() => {
    //     //
    //     manager.destroy()
    //   })

    //   let up = new Vector3(0, 1, 0)
    //   let forward = new Vector3()
    //   let nippleAngle = 0
    //   let nippleForce = 0
    //   let active = 'off'

    //   // let lookAtTarget = new Vector3();

    //   manager
    //     .on('added', (evt, nipple) => {
    //       nipple.on('start move end dir plain', (evta, nipple) => {
    //         if (evta.type === 'move') {
    //           if (nipple?.angle?.radian) {
    //             active = 'on'

    //             state.running = true

    //             //
    //             state.frontMotion = 'forward'

    //             nippleAngle = nipple.angle.radian + Math.PI * 0.5
    //             nippleForce = Math.abs(nipple.force)

    //             if (nippleForce >= 1) {
    //               nippleForce = 1
    //             }
    //           }
    //         } else if (evta.type === 'end') {
    //           active = 'off'
    //           state.frontMotion = ''
    //           state.running = false
    //         }
    //       })
    //     })
    //     .on('removed', (evt, nipple) => {
    //       nipple.off('start move end dir plain')
    //     })

    //   api.onLoop(() => {
    //     if (active === 'on') {
    //       // console.log(nippleAngle, controls.getAzimuthalAngle());
    //       controls.update()
    //       forward.set(0, 0, 1.3)
    //       forward.applyAxisAngle(up, nippleAngle + controls.getAzimuthalAngle())

    //       forward.multiplyScalar(0.1)
    //       player.position.add(forward)

    //       player.rotation.y = nippleAngle + controls.getAzimuthalAngle()
    //     }
    //   })
    // })

    // let jump = document.createElement('div')
    // jump.style.cssText = `
    //   position: ${
    //     api.now.mode === 'square' || api.now.mode === 'boxfull'
    //       ? 'absolute'
    //       : 'fixed'
    //   };
    //   bottom: 60px;
    //   right: 35px;
    //   width: 35px;
    //   height: 35px;
    //   // border: white solid 3px;
    //   border-radius: 100%;
    //   z-index: 10px;
    //   user-select: none;
    //   -webkit-user-select: none;
    //   touch-action: none;
    //   background: rgba(255,255,255,0.6);

    //   color: black;
    //   display: flex;
    //   justify-content: center;
    //   align-items: center;
    //   font-size: 14px;
    //   color: #777;
    //   text-align:center;
    //   padding: 30px;

    //   background-image: url("${getSVGBG(svgJump)}");
    //   background-size: 60% 60%;
    //   background-position: center center;
    //   background-repeat: no-repeat no-repeat;
    // `
    // container.appendChild(jump)
    // api.onClean(() => {
    //   container.removeChild(jump)
    // })

    // api.autoEvent(
    //   'pointerdown',
    //   () => {
    //     //
    //     if (state.playerIsOnGround) {
    //       state.playerVelocity.y = 10.0
    //       state.spacePressed = true
    //     }
    //   },
    //   jump,
    //   {}
    // )

    // api.autoEvent(
    //   'pointerup',
    //   () => {
    //     state.spacePressed = false
    //   },
    //   jump,
    //   {}
    // )
    // // jump.addEventListener("pointerdown", () => {
    // //   if (state.playerIsOnGround) {
    // //     state.playerVelocity.y = 10.0;
    // //     state.spacePressed = true;
    // //   }
    // // });
    // // jump.addEventListener("pointerup", () => {
    // //   state.spacePressed = false;
    // // });

    // // jump.addEventListener("mousedown", () => {
    // //   if (state.playerIsOnGround) {
    // //     state.playerVelocity.y = 15.0;
    // //   }
    // // });

    // let viewBtn = document.createElement('div')
    // viewBtn.style.cssText = `

    //   position: ${
    //     api.now.mode === 'square' || api.now.mode === 'boxfull'
    //       ? 'absolute'
    //       : 'fixed'
    //   };

    //   top: 30px;
    //   right: 35px;
    //   width: 30px;
    //   height: 30px;
    //   // border: white solid 3px;
    //   border-radius: 100%;
    //   z-index: 10px;
    //   user-select: none;
    //   -webkit-user-select: none;
    //   touch-action: none;
    //   background: rgba(255,255,255,0.6);

    //   color: black;
    //   display: flex;
    //   justify-content: center;
    //   align-items: center;
    //   font-size: 14px;
    //   color: #777;
    //   text-align:center;
    //   padding: 30px;

    //   background-image: url("${getSVGBG(svgPerspective)}");
    //   background-size: 60% 60%;
    //   background-position: center center;
    //   background-repeat: no-repeat no-repeat;

    // `
    // container.appendChild(viewBtn)
    // api.onClean(() => {
    //   container.removeChild(viewBtn)
    // })

    // viewBtn.addEventListener("touchstart", () => {
    //   toggleView();
    // });

    // viewBtn.addEventListener('pointerdown', () => {
    //   toggleView()
    // })
  }
}

GameControls.key = getID()
