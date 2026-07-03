import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const NODE_DEFS = [
  { label: 'About', target: 'about', position: [-3.35, 2.05, -0.72], color: 0x22d3ee },
  { label: 'Skills', target: 'skills', position: [3.25, 2.05, -0.72], color: 0x34d399 },
  { label: 'Experience', target: 'experience', position: [-3.95, 0.22, -0.28], color: 0xfacc15 },
  { label: 'Projects', target: 'projects', position: [3.95, 0.22, -0.28], color: 0xf472b6 },
  { label: 'GitHub', target: 'github', position: [-2.75, -1.55, 0.08], color: 0x8b5cf6 },
  { label: 'Contact', target: 'contact', position: [2.75, -1.55, 0.08], color: 0x67e8f9 }
]

const ROBOT_MODEL_URLS = [
  '/models/robot.glb',
  '/models/robot.gltf',
  'https://threejs.org/examples/models/gltf/RobotExpressive/RobotExpressive.glb'
]

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

function makeCanvasTexture(draw, width = 640, height = 250) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  draw(ctx, width, height)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

function makeTextSprite(text, color = '#e6f6ff') {
  const texture = makeCanvasTexture((ctx, w, h) => {
    const gradient = ctx.createLinearGradient(0, 0, w, h)
    gradient.addColorStop(0, 'rgba(2, 6, 23, .94)')
    gradient.addColorStop(1, 'rgba(14, 165, 233, .48)')
    ctx.fillStyle = gradient
    ctx.strokeStyle = 'rgba(125, 211, 252, .92)'
    ctx.lineWidth = 4
    roundRect(ctx, 24, 42, w - 48, h - 84, 44)
    ctx.fill()
    ctx.stroke()
    ctx.shadowColor = 'rgba(34, 211, 238, .92)'
    ctx.shadowBlur = 18
    ctx.fillStyle = color
    ctx.font = '900 58px Inter, Arial, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, w / 2, h / 2)
  })
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false }))
  sprite.scale.set(1.45, 0.56, 1)
  return sprite
}

function makeTube(points, color, radius = 0.02, opacity = 0.8) {
  const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)))
  const geometry = new THREE.TubeGeometry(curve, 56, radius, 10, false)
  return new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color, transparent: true, opacity, blending: THREE.AdditiveBlending }))
}

function makeGlowSphere(radius, color, opacity = 0.18) {
  return new THREE.Mesh(
    new THREE.SphereGeometry(radius, 32, 32),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false })
  )
}

function createFallbackRobot() {
  const robot = new THREE.Group()
  robot.name = 'CinematicRobotShell'
  robot.position.set(0, -0.62, 0.15)

  const fallback = new THREE.Group()
  fallback.name = 'FallbackProceduralRobot'
  robot.add(fallback)

  const armor = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.25, metalness: 0.78, emissive: 0x0f172a, emissiveIntensity: 0.16 })
  const black = new THREE.MeshStandardMaterial({ color: 0x020617, roughness: 0.38, metalness: 0.86, emissive: 0x0f172a, emissiveIntensity: 0.22 })
  const cyan = new THREE.MeshStandardMaterial({ color: 0x22d3ee, roughness: 0.1, metalness: 0.45, emissive: 0x22d3ee, emissiveIntensity: 1.5 })
  const skin = new THREE.MeshStandardMaterial({ color: 0xe6f6ff, roughness: 0.34, metalness: 0.18, emissive: 0x67e8f9, emissiveIntensity: 0.18 })

  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.98, 1.26, 0.5), armor)
  torso.position.y = 1.05
  fallback.add(torso)
  const abdomen = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.72, 0.42), black)
  abdomen.position.set(0, 0.36, 0.02)
  fallback.add(abdomen)
  const core = new THREE.Mesh(new THREE.OctahedronGeometry(0.18, 1), cyan)
  core.position.set(0, 1.2, 0.38)
  fallback.add(core, makeGlowSphere(0.5, 0x22d3ee, 0.14))
  fallback.children.at(-1).position.copy(core.position)

  const headPivot = new THREE.Group()
  headPivot.position.y = 2.15
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.34, 42, 42), skin)
  head.scale.set(1.05, 1.18, 0.92)
  const visor = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.11, 0.04), cyan)
  visor.position.set(0, 0.03, 0.31)
  const earL = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.12, 32), cyan)
  earL.position.set(-0.38, 0.04, 0)
  earL.rotation.z = Math.PI / 2
  const earR = earL.clone()
  earR.position.x = 0.38
  headPivot.add(head, visor, earL, earR)
  fallback.add(headPivot)

  const upperArmGeo = new THREE.CylinderGeometry(0.08, 0.1, 0.82, 22)
  const leftArmPivot = new THREE.Group()
  leftArmPivot.position.set(-0.73, 1.42, 0)
  const leftArm = new THREE.Mesh(upperArmGeo, armor)
  leftArm.position.y = -0.4
  leftArmPivot.add(leftArm)
  const rightArmPivot = new THREE.Group()
  rightArmPivot.position.set(0.73, 1.42, 0)
  const rightArm = new THREE.Mesh(upperArmGeo, armor)
  rightArm.position.y = -0.4
  rightArmPivot.add(rightArm)
  fallback.add(leftArmPivot, rightArmPivot)

  const rightForearm = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.09, 0.74, 22), black)
  rightForearm.position.set(1.02, 0.58, 0.08)
  rightForearm.rotation.z = 0.22
  const rightHand = new THREE.Mesh(new THREE.SphereGeometry(0.13, 24, 24), cyan)
  rightHand.position.set(1.12, 0.18, 0.2)
  const leftHand = rightHand.clone()
  leftHand.position.x = -1.12
  fallback.add(rightForearm, rightHand, leftHand)

  const leftLegPivot = new THREE.Group()
  leftLegPivot.position.set(-0.27, -0.22, 0)
  const rightLegPivot = new THREE.Group()
  rightLegPivot.position.set(0.27, -0.22, 0)
  const legGeo = new THREE.CylinderGeometry(0.12, 0.15, 0.92, 24)
  const leftLeg = new THREE.Mesh(legGeo, armor)
  leftLeg.position.y = -0.42
  const rightLeg = new THREE.Mesh(legGeo, armor)
  rightLeg.position.y = -0.42
  leftLegPivot.add(leftLeg)
  rightLegPivot.add(rightLeg)
  fallback.add(leftLegPivot, rightLegPivot)
  const footGeo = new THREE.BoxGeometry(0.38, 0.16, 0.62)
  const leftFoot = new THREE.Mesh(footGeo, black)
  leftFoot.position.set(-0.27, -1.18, 0.22)
  const rightFoot = leftFoot.clone()
  rightFoot.position.x = 0.27
  fallback.add(leftFoot, rightFoot)

  ;[0.9, 1.22, 1.55].forEach((r, i) => {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(r, 0.005, 8, 128), new THREE.MeshBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.22, blending: THREE.AdditiveBlending }))
    ring.position.y = 0.88 + i * 0.28
    ring.rotation.x = Math.PI / 2
    ring.userData.rotationSpeed = i % 2 === 0 ? 0.004 : -0.003
    fallback.add(ring)
  })

  const particleGeo = new THREE.BufferGeometry()
  const count = 170
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i += 1) {
    const radius = 0.75 + Math.random() * 1.65
    const angle = Math.random() * Math.PI * 2
    positions[i * 3] = Math.cos(angle) * radius
    positions[i * 3 + 1] = Math.random() * 3.55 - 1.12
    positions[i * 3 + 2] = Math.sin(angle) * radius * 0.75 + 0.1
  }
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  const particles = new THREE.Points(particleGeo, new THREE.PointsMaterial({ color: 0x7dd3fc, size: 0.022, transparent: true, opacity: 0.78, blending: THREE.AdditiveBlending }))
  particles.userData.isRobotParticles = true
  fallback.add(particles)

  robot.userData.parts = { fallback, headPivot, leftArmPivot, rightArmPivot, leftLegPivot, rightLegPivot, rightForearm, rightHand, core }
  return robot
}

function normalizeRobotModel(model, targetHeight = 3.45) {
  const box = new THREE.Box3().setFromObject(model)
  const size = new THREE.Vector3()
  const center = new THREE.Vector3()
  box.getSize(size)
  box.getCenter(center)
  const scale = targetHeight / Math.max(size.y, 0.001)
  model.scale.setScalar(scale)
  model.position.sub(center.multiplyScalar(scale))
  const normalizedBox = new THREE.Box3().setFromObject(model)
  model.position.y -= normalizedBox.min.y + 1.22
}

function stylizeLoadedModel(model) {
  model.traverse((child) => {
    if (!child.isMesh) return
    child.castShadow = false
    child.receiveShadow = false
    const materials = Array.isArray(child.material) ? child.material : [child.material]
    materials.filter(Boolean).forEach((material) => {
      material.metalness = Math.max(material.metalness ?? 0, 0.35)
      material.roughness = Math.min(material.roughness ?? 0.5, 0.42)
      if ('emissive' in material) {
        material.emissive = material.emissive || new THREE.Color(0x000000)
        material.emissive.lerp(new THREE.Color(0x0ea5e9), 0.18)
        material.emissiveIntensity = Math.max(material.emissiveIntensity ?? 0, 0.12)
      }
    })
  })
}

function loadRealRobotModel(robot, mixerState) {
  const loader = new GLTFLoader()
  const status = document.getElementById('welcome-text')
  let index = 0

  const tryNext = () => {
    const url = ROBOT_MODEL_URLS[index]
    index += 1
    if (!url) {
      if (status) status.textContent = 'Using procedural fallback robot. Add /public/models/robot.glb for cinematic model.'
      return
    }
    loader.load(url, (gltf) => {
      const model = gltf.scene
      model.name = 'LoadedCinematicRobotModel'
      normalizeRobotModel(model)
      stylizeLoadedModel(model)
      robot.userData.parts.fallback.visible = false
      robot.add(model)
      mixerState.model = model
      mixerState.mixer = gltf.animations?.length ? new THREE.AnimationMixer(model) : null
      if (mixerState.mixer) {
        const preferred = gltf.animations.find(a => /walk|idle|run/i.test(a.name)) || gltf.animations[0]
        mixerState.action = mixerState.mixer.clipAction(preferred)
        mixerState.action.reset().fadeIn(0.25).play()
      }
      if (status) status.textContent = url.startsWith('/models/') ? 'Cinematic robot model loaded.' : 'Demo GLB robot loaded. Replace /models/robot.glb for movie-grade detail.'
    }, undefined, tryNext)
  }
  tryNext()
}

function createFloatingModule(node, interactiveNodes) {
  const group = new THREE.Group()
  group.position.set(...node.position)
  group.userData = { target: node.target, label: node.label }
  const panel = new THREE.Mesh(new THREE.PlaneGeometry(1.25, 0.74), new THREE.MeshBasicMaterial({ color: node.color, transparent: true, opacity: 0.12, side: THREE.DoubleSide, depthWrite: false }))
  const frame = new THREE.Mesh(new THREE.TorusGeometry(0.46, 0.008, 8, 96), new THREE.MeshBasicMaterial({ color: node.color, transparent: true, opacity: 0.52, blending: THREE.AdditiveBlending }))
  frame.scale.y = 0.62
  frame.position.z = 0.03
  const core = new THREE.Mesh(new THREE.SphereGeometry(0.12, 32, 32), new THREE.MeshStandardMaterial({ color: node.color, emissive: node.color, emissiveIntensity: 1.7, roughness: 0.2, metalness: 0.35 }))
  core.position.z = 0.08
  core.userData = { target: node.target, label: node.label, rootGroup: group }
  const hit = new THREE.Mesh(new THREE.SphereGeometry(0.42, 24, 24), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }))
  hit.userData = { target: node.target, label: node.label, rootGroup: group }
  const label = makeTextSprite(node.label)
  label.position.set(0, 0.55, 0.08)
  group.add(panel, frame, core, hit, label, makeGlowSphere(0.55, node.color, 0.12))
  interactiveNodes.push(core, hit)
  return group
}

function createDigitalWorld(interactiveNodes) {
  const group = new THREE.Group()
  const pointCount = 420
  const positions = new Float32Array(pointCount * 3)
  for (let i = 0; i < pointCount; i += 1) {
    positions[i * 3] = (Math.random() - 0.5) * 14
    positions[i * 3 + 1] = (Math.random() - 0.5) * 8.4
    positions[i * 3 + 2] = (Math.random() - 0.5) * 9.5 - 1.0
  }
  const particleGeometry = new THREE.BufferGeometry()
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  group.add(new THREE.Points(particleGeometry, new THREE.PointsMaterial({ color: 0x7dd3fc, size: 0.022, transparent: true, opacity: 0.78, blending: THREE.AdditiveBlending })))
  const linePositions = []
  for (let i = 0; i < pointCount; i += 3) {
    const a = i * 3
    const b = ((i + 23) % pointCount) * 3
    linePositions.push(positions[a], positions[a + 1], positions[a + 2], positions[b], positions[b + 1], positions[b + 2])
  }
  const lineGeometry = new THREE.BufferGeometry()
  lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3))
  group.add(new THREE.LineSegments(lineGeometry, new THREE.LineBasicMaterial({ color: 0x0ea5e9, transparent: true, opacity: 0.13 })))
  ;['SYSTEM OVERVIEW', 'AI CORE', 'JAVA 8', 'OPEN API', 'GATEWAY', 'REDIS', 'MYSQL', 'TRACE', 'MQ', 'FINTECH'].forEach((text, i) => {
    const label = makeTextSprite(text, '#67e8f9')
    const angle = (i / 10) * Math.PI * 2
    label.position.set(Math.cos(angle) * 5.25, 0.15 + (i % 4) * 0.82, Math.sin(angle) * 2.25 - 2.0)
    label.scale.set(1.15, 0.34, 1)
    label.material.opacity = 0.55
    group.add(label)
  })
  NODE_DEFS.forEach(node => group.add(createFloatingModule(node, interactiveNodes)))
  return group
}

function createPlatform() {
  const group = new THREE.Group()
  ;[1.45, 2.3, 3.15, 4.05, 5.1].forEach((r, i) => {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(r, 0.006, 8, 180), new THREE.MeshBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.32, blending: THREE.AdditiveBlending }))
    ring.rotation.x = Math.PI / 2
    ring.position.y = -1.82
    ring.userData.rotationSpeed = i % 2 === 0 ? 0.002 : -0.0015
    group.add(ring)
  })
  const grid = new THREE.GridHelper(16, 64, 0x0ea5e9, 0x0f3b5f)
  grid.position.y = -1.84
  grid.material.transparent = true
  grid.material.opacity = 0.24
  group.add(grid)
  return group
}

function triggerDomEffect(label) {
  const old = document.querySelector('.module-jump-effect')
  old?.remove()
  const overlay = document.createElement('div')
  overlay.className = 'module-jump-effect'
  overlay.innerHTML = `<div class="jump-ring"></div><div class="jump-copy"><span>ROBOT ACCESSING MODULE</span><strong>${label}</strong></div>`
  document.body.appendChild(overlay)
  window.setTimeout(() => overlay.remove(), 1200)
  const status = document.getElementById('welcome-text')
  if (status) status.textContent = `Robot is opening ${label} module...`
}

export function initThreeScene({ rootSelector = '#three-scene-root' } = {}) {
  const root = document.querySelector(rootSelector)
  if (!root) return null
  const scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2(0x020617, 0.042)
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 80)
  camera.position.set(0, 1.25, 8.1)
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8))
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.outputColorSpace = THREE.SRGBColorSpace
  root.appendChild(renderer.domElement)

  scene.add(new THREE.AmbientLight(0x9bdcff, 0.5))
  const key = new THREE.DirectionalLight(0xffffff, 1.35)
  key.position.set(3.8, 5.5, 4)
  const rimLeft = new THREE.PointLight(0x22d3ee, 3.4, 12)
  rimLeft.position.set(-4.2, 2.0, 2.4)
  const rimRight = new THREE.PointLight(0x8b5cf6, 2.4, 12)
  rimRight.position.set(4.4, 1.8, 2.3)
  scene.add(key, rimLeft, rimRight)

  const interactiveNodes = []
  const digitalWorld = createDigitalWorld(interactiveNodes)
  scene.add(digitalWorld)
  const world = new THREE.Group()
  world.position.set(0.45, -0.05, 0)
  scene.add(world)
  const robot = createFallbackRobot()
  const platform = createPlatform()
  world.add(robot, platform)
  const mixerState = { mixer: null, model: null, action: null }
  loadRealRobotModel(robot, mixerState)

  const beam = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]), new THREE.LineBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0, blending: THREE.AdditiveBlending }))
  world.add(beam)
  const raycaster = new THREE.Raycaster()
  const pointer = new THREE.Vector2(99, 99)
  let mouseX = 0
  let mouseY = 0
  let hovered = null
  let action = null
  const robotHome = new THREE.Vector3(0, -0.62, 0.15)
  const robotGoal = robotHome.clone()

  const getPointer = (event) => {
    const rect = renderer.domElement.getBoundingClientRect()
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
  }
  const onMove = (event) => {
    mouseX = (event.clientX / window.innerWidth - 0.5) * 2
    mouseY = (event.clientY / window.innerHeight - 0.5) * 2
    getPointer(event)
  }
  const onClick = (event) => {
    getPointer(event)
    raycaster.setFromCamera(pointer, camera)
    const hit = raycaster.intersectObjects(interactiveNodes, false)[0]
    if (!hit?.object?.userData?.target) return
    const node = hit.object
    const nodeWorld = new THREE.Vector3()
    node.getWorldPosition(nodeWorld)
    const local = world.worldToLocal(nodeWorld.clone())
    robotGoal.set(local.x * 0.34, -0.62, Math.min(0.62, local.z + 0.25))
    action = { startedAt: performance.now(), node, local, opened: false }
    triggerDomEffect(node.userData.label)
    document.body.classList.add('warp')
    window.setTimeout(() => document.body.classList.remove('warp'), 760)
  }
  renderer.domElement.addEventListener('pointermove', onMove)
  renderer.domElement.addEventListener('click', onClick)
  const resize = () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  }
  window.addEventListener('resize', resize)

  const clock = new THREE.Clock()
  const scaleTarget = new THREE.Vector3(1, 1, 1)
  const sceneTargets = {
    home: { rx: -0.02, ry: -0.08, scale: 1, px: 0.42, py: -0.05, camZ: 8.1 },
    about: { rx: 0.02, ry: 0.1, scale: 1.02, px: 0.68, py: -0.05, camZ: 7.8 },
    skills: { rx: 0.05, ry: -0.08, scale: 1.06, px: 0.26, py: 0, camZ: 7.5 },
    experience: { rx: 0.1, ry: -0.25, scale: 1.02, px: 0.76, py: -0.12, camZ: 7.9 },
    projects: { rx: 0.06, ry: 0.24, scale: 1.06, px: 0.22, py: 0, camZ: 7.55 },
    github: { rx: -0.02, ry: -0.18, scale: 1.02, px: 0.62, py: -0.08, camZ: 7.9 },
    contact: { rx: 0.06, ry: 0.18, scale: 1.02, px: 0.35, py: -0.08, camZ: 7.85 }
  }

  function animate() {
    const delta = clock.getDelta()
    const elapsed = clock.elapsedTime
    mixerState.mixer?.update(delta)
    const target = sceneTargets[document.body.dataset.scene || 'home'] || sceneTargets.home
    world.rotation.x += (target.rx + mouseY * 0.028 - world.rotation.x) * 0.03
    world.rotation.y += (target.ry + mouseX * 0.04 - world.rotation.y) * 0.03
    world.position.x += (target.px - world.position.x) * 0.025
    world.position.y += (target.py - world.position.y) * 0.025
    camera.position.z += (target.camZ - camera.position.z) * 0.025
    scaleTarget.set(target.scale, target.scale, target.scale)
    world.scale.lerp(scaleTarget, 0.03)

    const parts = robot.userData.parts
    const gait = Math.sin(elapsed * 4.2)
    const actionAge = action ? (performance.now() - action.startedAt) / 1000 : 0
    if (!action) {
      robotGoal.copy(robotHome)
      robot.position.x += (Math.sin(elapsed * 0.38) * 0.35 - robot.position.x) * 0.01
      robot.position.z += (robotHome.z + Math.cos(elapsed * 0.42) * 0.08 - robot.position.z) * 0.015
      parts.headPivot.rotation.y = Math.sin(elapsed * 0.8) * 0.22
    } else {
      robot.position.lerp(robotGoal, 0.045)
      const direction = action.local.x > robot.position.x ? -0.22 : 0.22
      robot.rotation.y += (direction - robot.rotation.y) * 0.05
      parts.headPivot.rotation.y += (direction * -0.9 - parts.headPivot.rotation.y) * 0.05
      if (actionAge > 1.05 && !action.opened) {
        action.opened = true
        beam.material.opacity = 0.85
        window.dispatchEvent(new CustomEvent('portfolio:open-module', { detail: { target: action.node.userData.target, label: action.node.userData.label } }))
        window.setTimeout(() => { beam.material.opacity = 0; action = null }, 950)
      }
    }

    parts.leftLegPivot.rotation.x = gait * 0.34
    parts.rightLegPivot.rotation.x = -gait * 0.34
    parts.leftArmPivot.rotation.x = -gait * 0.28
    parts.rightArmPivot.rotation.x = action ? -1.05 : gait * 0.22
    parts.rightForearm.rotation.z = action ? -0.58 : 0.22
    parts.rightHand.position.set(action ? 1.32 : 1.12, action ? 0.56 : 0.18, 0.2)
    parts.core.rotation.y += 0.025
    robot.position.y += (-0.62 + Math.abs(gait) * 0.035 - robot.position.y) * 0.12

    if (action && actionAge > 0.75) {
      const handWorld = new THREE.Vector3()
      parts.rightHand.getWorldPosition(handWorld)
      const nodeWorld = new THREE.Vector3()
      action.node.getWorldPosition(nodeWorld)
      beam.geometry.setFromPoints([world.worldToLocal(handWorld.clone()), world.worldToLocal(nodeWorld.clone())])
      beam.material.opacity = Math.min(0.9, Math.max(0, (actionAge - 0.75) * 2))
    }

    robot.children.forEach(child => {
      if (child.userData?.rotationSpeed) child.rotation.z += child.userData.rotationSpeed
      if (child.userData?.isRobotParticles) child.rotation.y += 0.006
    })
    parts.fallback.children.forEach(child => {
      if (child.userData?.rotationSpeed) child.rotation.z += child.userData.rotationSpeed
      if (child.userData?.isRobotParticles) child.rotation.y += 0.006
    })
    platform.children.forEach(child => { if (child.userData?.rotationSpeed) child.rotation.z += child.userData.rotationSpeed })
    digitalWorld.rotation.y = elapsed * 0.012
    digitalWorld.children.forEach((child, index) => {
      if (child.userData?.target) {
        child.position.y += Math.sin(elapsed * 1.4 + index) * 0.0009
        child.rotation.y = -world.rotation.y * 0.5 + Math.sin(elapsed * 0.4 + index) * 0.05
      }
    })

    raycaster.setFromCamera(pointer, camera)
    const hit = raycaster.intersectObjects(interactiveNodes, false)[0]
    hovered = hit?.object || null
    renderer.domElement.style.cursor = hovered ? 'pointer' : 'default'
    interactiveNodes.forEach((node) => {
      const rootGroup = node.userData.rootGroup
      if (rootGroup) {
        const s = hovered === node ? 1.16 : 1
        rootGroup.scale.lerp(new THREE.Vector3(s, s, s), 0.12)
      }
    })
    renderer.render(scene, camera)
    requestAnimationFrame(animate)
  }
  animate()

  return { destroy() { renderer.domElement.removeEventListener('pointermove', onMove); renderer.domElement.removeEventListener('click', onClick); window.removeEventListener('resize', resize); root.innerHTML = '' } }
}
