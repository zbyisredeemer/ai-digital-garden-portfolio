import * as THREE from 'three'

const MODULES = [
  { label: 'About', target: 'about', position: [-3.45, 2.05, -0.75], color: 0x22d3ee },
  { label: 'Skills', target: 'skills', position: [3.35, 2.0, -0.75], color: 0x34d399 },
  { label: 'Experience', target: 'experience', position: [-4.0, 0.2, -0.25], color: 0xfacc15 },
  { label: 'Projects', target: 'projects', position: [4.0, 0.2, -0.25], color: 0xf472b6 },
  { label: 'GitHub', target: 'github', position: [-2.65, -1.55, 0.1], color: 0x8b5cf6 },
  { label: 'Contact', target: 'contact', position: [2.75, -1.55, 0.1], color: 0x67e8f9 }
]

function glowMaterial(color, opacity = 0.3) {
  return new THREE.MeshBasicMaterial({ color, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false })
}

function standardGlow(color, intensity = 1.2) {
  return new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: intensity, metalness: 0.2, roughness: 0.18 })
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

function textSprite(text, color = '#e6f6ff') {
  const canvas = document.createElement('canvas')
  canvas.width = 640
  canvas.height = 240
  const ctx = canvas.getContext('2d')
  const gradient = ctx.createLinearGradient(0, 0, 640, 240)
  gradient.addColorStop(0, 'rgba(2, 6, 23, .92)')
  gradient.addColorStop(1, 'rgba(14, 165, 233, .42)')
  ctx.fillStyle = gradient
  ctx.strokeStyle = 'rgba(125, 211, 252, .85)'
  ctx.lineWidth = 4
  roundRect(ctx, 24, 42, 592, 156, 42)
  ctx.fill()
  ctx.stroke()
  ctx.shadowColor = 'rgba(34, 211, 238, .9)'
  ctx.shadowBlur = 18
  ctx.fillStyle = color
  ctx.font = '900 58px Inter, Arial, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, 320, 120)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false }))
  sprite.scale.set(1.42, 0.54, 1)
  return sprite
}

function makeLine(points, color = 0x22d3ee, opacity = 0.42) {
  const geometry = new THREE.BufferGeometry().setFromPoints(points.map(p => new THREE.Vector3(...p)))
  const material = new THREE.LineBasicMaterial({ color, transparent: true, opacity, blending: THREE.AdditiveBlending })
  return new THREE.Line(geometry, material)
}

function makeTube(points, color = 0x22d3ee, radius = 0.015, opacity = 0.55) {
  const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)))
  const geometry = new THREE.TubeGeometry(curve, 48, radius, 8, false)
  return new THREE.Mesh(geometry, glowMaterial(color, opacity))
}

function pushEllipsoid(points, original, phases, center, radius, count, surfaceOnly = false) {
  for (let i = 0; i < count; i += 1) {
    const u = Math.random()
    const v = Math.random()
    const theta = Math.PI * 2 * u
    const phi = Math.acos(2 * v - 1)
    const scale = surfaceOnly ? 1 : Math.cbrt(Math.random())
    const x = center[0] + Math.sin(phi) * Math.cos(theta) * radius[0] * scale
    const y = center[1] + Math.cos(phi) * radius[1] * scale
    const z = center[2] + Math.sin(phi) * Math.sin(theta) * radius[2] * scale
    points.push(x, y, z)
    original.push(x, y, z)
    phases.push(Math.random() * Math.PI * 2)
  }
}

function pushSegment(points, original, phases, a, b, radius, count) {
  const av = new THREE.Vector3(...a)
  const bv = new THREE.Vector3(...b)
  for (let i = 0; i < count; i += 1) {
    const t = Math.random()
    const base = av.clone().lerp(bv, t)
    const angle = Math.random() * Math.PI * 2
    const r = Math.random() * radius
    const x = base.x + Math.cos(angle) * r
    const y = base.y + (Math.random() - 0.5) * radius
    const z = base.z + Math.sin(angle) * r
    points.push(x, y, z)
    original.push(x, y, z)
    phases.push(Math.random() * Math.PI * 2)
  }
}

function createHologramAI() {
  const robot = new THREE.Group()
  robot.name = 'HologramAIDigitalHuman'
  robot.position.set(0, -0.68, 0.18)

  const points = []
  const original = []
  const phases = []

  pushEllipsoid(points, original, phases, [0, 2.15, 0.02], [0.36, 0.46, 0.28], 620, false)
  pushEllipsoid(points, original, phases, [0, 1.1, 0], [0.62, 0.9, 0.28], 900, false)
  pushEllipsoid(points, original, phases, [0, 0.15, 0], [0.42, 0.34, 0.22], 300, false)
  pushSegment(points, original, phases, [-0.62, 1.58, 0], [-1.18, 0.65, 0.08], 0.12, 260)
  pushSegment(points, original, phases, [0.62, 1.58, 0], [1.18, 0.65, 0.08], 0.12, 260)
  pushSegment(points, original, phases, [-1.18, 0.65, 0.08], [-1.26, 0.12, 0.2], 0.1, 180)
  pushSegment(points, original, phases, [1.18, 0.65, 0.08], [1.26, 0.12, 0.2], 0.1, 180)
  pushSegment(points, original, phases, [-0.26, -0.12, 0], [-0.33, -1.25, 0.12], 0.13, 320)
  pushSegment(points, original, phases, [0.26, -0.12, 0], [0.33, -1.25, 0.12], 0.13, 320)

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3))
  geometry.setAttribute('original', new THREE.Float32BufferAttribute(original, 3))
  geometry.setAttribute('phase', new THREE.Float32BufferAttribute(phases, 1))
  const particles = new THREE.Points(geometry, new THREE.PointsMaterial({ color: 0x7dd3fc, size: 0.026, transparent: true, opacity: 0.86, blending: THREE.AdditiveBlending, depthWrite: false }))
  particles.userData.isHologramBody = true
  robot.add(particles)

  const outline = new THREE.Group()
  outline.name = 'hologramWireframe'
  outline.add(makeTube([[0, 2.62, 0], [0.28, 2.36, 0.02], [0.32, 2.05, 0.02], [0.18, 1.78, 0.02], [0, 1.68, 0.02], [-0.18, 1.78, 0.02], [-0.32, 2.05, 0.02], [-0.28, 2.36, 0.02], [0, 2.62, 0]], 0x22d3ee, 0.01, 0.42))
  outline.add(makeLine([[-0.52, 1.58, 0.04], [0.52, 1.58, 0.04], [0.42, 0.25, 0.04], [0, -0.1, 0.04], [-0.42, 0.25, 0.04], [-0.52, 1.58, 0.04]], 0x22d3ee, 0.38))
  outline.add(makeTube([[-0.55, 1.45, 0], [-1.05, 0.75, 0.1], [-1.25, 0.1, 0.22]], 0x22d3ee, 0.012, 0.48))
  outline.add(makeTube([[0.55, 1.45, 0], [1.05, 0.75, 0.1], [1.25, 0.1, 0.22]], 0x22d3ee, 0.012, 0.48))
  outline.add(makeTube([[-0.25, -0.1, 0], [-0.34, -0.75, 0.08], [-0.38, -1.25, 0.16]], 0x22d3ee, 0.012, 0.48))
  outline.add(makeTube([[0.25, -0.1, 0], [0.34, -0.75, 0.08], [0.38, -1.25, 0.16]], 0x22d3ee, 0.012, 0.48))
  robot.add(outline)

  const headPivot = new THREE.Group()
  headPivot.name = 'headPivot'
  headPivot.position.set(0, 2.14, 0.03)
  const visor = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.09, 0.035), standardGlow(0x22d3ee, 1.8))
  visor.position.set(0, 0.02, 0.31)
  headPivot.add(visor)
  const headHalo = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.006, 8, 120), glowMaterial(0x22d3ee, 0.42))
  headHalo.rotation.x = Math.PI / 2
  headPivot.add(headHalo)
  robot.add(headPivot)

  const chestCore = new THREE.Mesh(new THREE.OctahedronGeometry(0.2, 1), standardGlow(0x22d3ee, 1.7))
  chestCore.position.set(0, 1.16, 0.32)
  robot.add(chestCore)
  const coreGlow = new THREE.Mesh(new THREE.SphereGeometry(0.58, 32, 32), glowMaterial(0x22d3ee, 0.14))
  coreGlow.position.copy(chestCore.position)
  robot.add(coreGlow)

  const rings = []
  for (let i = 0; i < 5; i += 1) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.72 + i * 0.28, 0.005, 8, 140), glowMaterial(i % 2 ? 0x34d399 : 0x22d3ee, 0.26 - i * 0.03))
    ring.position.y = 0.66 + i * 0.25
    ring.rotation.x = Math.PI / 2
    ring.userData.rotationSpeed = i % 2 === 0 ? 0.004 : -0.0032
    rings.push(ring)
    robot.add(ring)
  }

  const rightHand = new THREE.Object3D()
  rightHand.name = 'rightHand'
  rightHand.position.set(1.25, 0.1, 0.22)
  robot.add(rightHand)
  const rightArmAim = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0.55, 1.45, 0), rightHand.position.clone()]), new THREE.LineBasicMaterial({ color: 0x67e8f9, transparent: true, opacity: 0.38, blending: THREE.AdditiveBlending }))
  robot.add(rightArmAim)

  robot.userData.parts = { headPivot, chestCore, rightHand, rightArmAim, rings, particles, original: geometry.getAttribute('original'), phase: geometry.getAttribute('phase') }
  return robot
}

function createModule(node, interactiveNodes) {
  const group = new THREE.Group()
  group.position.set(...node.position)
  group.userData = { target: node.target, label: node.label }
  const panel = new THREE.Mesh(new THREE.PlaneGeometry(1.25, 0.74), new THREE.MeshBasicMaterial({ color: node.color, transparent: true, opacity: 0.1, side: THREE.DoubleSide, depthWrite: false }))
  const frame = new THREE.Mesh(new THREE.TorusGeometry(0.46, 0.008, 8, 96), glowMaterial(node.color, 0.52))
  frame.scale.y = 0.62
  frame.position.z = 0.03
  const core = new THREE.Mesh(new THREE.SphereGeometry(0.12, 32, 32), standardGlow(node.color, 1.7))
  core.position.z = 0.08
  core.userData = { target: node.target, label: node.label, rootGroup: group }
  const hit = new THREE.Mesh(new THREE.SphereGeometry(0.45, 24, 24), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }))
  hit.userData = core.userData
  const label = textSprite(node.label)
  label.position.set(0, 0.55, 0.08)
  group.add(panel, frame, core, hit, label)
  interactiveNodes.push(core, hit)
  return group
}

function createDigitalWorld(interactiveNodes) {
  const group = new THREE.Group()
  const count = 620
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i += 1) {
    positions[i * 3] = (Math.random() - 0.5) * 14
    positions[i * 3 + 1] = (Math.random() - 0.5) * 8.5
    positions[i * 3 + 2] = (Math.random() - 0.5) * 9.5 - 1
  }
  const particleGeometry = new THREE.BufferGeometry()
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  group.add(new THREE.Points(particleGeometry, new THREE.PointsMaterial({ color: 0x7dd3fc, size: 0.018, transparent: true, opacity: 0.72, blending: THREE.AdditiveBlending })))
  const linePositions = []
  for (let i = 0; i < count; i += 3) {
    const a = i * 3
    const b = ((i + 29) % count) * 3
    linePositions.push(positions[a], positions[a + 1], positions[a + 2], positions[b], positions[b + 1], positions[b + 2])
  }
  const lineGeometry = new THREE.BufferGeometry()
  lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3))
  group.add(new THREE.LineSegments(lineGeometry, new THREE.LineBasicMaterial({ color: 0x0ea5e9, transparent: true, opacity: 0.12 })))
  ;['SYSTEM OVERVIEW', 'AI CORE', 'JAVA 8', 'OPEN API', 'GATEWAY', 'REDIS', 'MYSQL', 'TRACE', 'MQ', 'FINTECH'].forEach((text, i) => {
    const label = textSprite(text, '#67e8f9')
    const a = (i / 10) * Math.PI * 2
    label.position.set(Math.cos(a) * 5.25, 0.15 + (i % 4) * 0.82, Math.sin(a) * 2.25 - 2)
    label.scale.set(1.15, 0.34, 1)
    label.material.opacity = 0.45
    group.add(label)
  })
  MODULES.forEach(node => group.add(createModule(node, interactiveNodes)))
  return group
}

function createPlatform() {
  const group = new THREE.Group()
  for (let i = 0; i < 7; i += 1) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.2 + i * 0.68, 0.006, 8, 180), glowMaterial(i % 2 ? 0x34d399 : 0x22d3ee, 0.3 - i * 0.03))
    ring.rotation.x = Math.PI / 2
    ring.position.y = -1.82
    ring.userData.rotationSpeed = i % 2 === 0 ? 0.002 : -0.0015
    group.add(ring)
  }
  const grid = new THREE.GridHelper(16, 64, 0x0ea5e9, 0x0f3b5f)
  grid.position.y = -1.84
  grid.material.transparent = true
  grid.material.opacity = 0.22
  group.add(grid)
  return group
}

function triggerDomEffect(label) {
  document.querySelector('.module-jump-effect')?.remove()
  const overlay = document.createElement('div')
  overlay.className = 'module-jump-effect'
  overlay.innerHTML = `<div class="jump-ring"></div><div class="jump-copy"><span>HOLOGRAM ACCESSING MODULE</span><strong>${label}</strong></div>`
  document.body.appendChild(overlay)
  window.setTimeout(() => overlay.remove(), 1200)
  const status = document.getElementById('welcome-text')
  if (status) status.textContent = `Hologram AI is opening ${label} module...`
}

function updateHologramParticles(robot, elapsed, actionStrength) {
  const { particles, original, phase } = robot.userData.parts
  const position = particles.geometry.getAttribute('position')
  for (let i = 0; i < position.count; i += 1) {
    const ox = original.getX(i)
    const oy = original.getY(i)
    const oz = original.getZ(i)
    const p = phase.getX(i)
    const shimmer = Math.sin(elapsed * 2.8 + p) * 0.018
    const dissolve = Math.sin(elapsed * 5.0 + p * 1.7) * 0.012
    position.setXYZ(i, ox + shimmer + actionStrength * 0.025, oy + dissolve, oz + Math.cos(elapsed * 2.2 + p) * 0.016)
  }
  position.needsUpdate = true
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
  const rimLeft = new THREE.PointLight(0x22d3ee, 3.6, 12)
  rimLeft.position.set(-4.2, 2, 2.4)
  const rimRight = new THREE.PointLight(0x8b5cf6, 2.5, 12)
  rimRight.position.set(4.4, 1.8, 2.3)
  scene.add(key, rimLeft, rimRight)

  const interactiveNodes = []
  const digitalWorld = createDigitalWorld(interactiveNodes)
  scene.add(digitalWorld)
  const world = new THREE.Group()
  world.position.set(0.45, -0.05, 0)
  scene.add(world)
  const robot = createHologramAI()
  const platform = createPlatform()
  world.add(robot, platform)
  const beam = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]), new THREE.LineBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0, blending: THREE.AdditiveBlending }))
  world.add(beam)

  const raycaster = new THREE.Raycaster()
  const pointer = new THREE.Vector2(99, 99)
  let mouseX = 0
  let mouseY = 0
  let hovered = null
  let action = null
  const robotHome = new THREE.Vector3(0, -0.68, 0.18)
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
    robotGoal.set(local.x * 0.28, -0.68, Math.min(0.64, local.z + 0.25))
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
    const elapsed = clock.elapsedTime
    const target = sceneTargets[document.body.dataset.scene || 'home'] || sceneTargets.home
    world.rotation.x += (target.rx + mouseY * 0.028 - world.rotation.x) * 0.03
    world.rotation.y += (target.ry + mouseX * 0.04 - world.rotation.y) * 0.03
    world.position.x += (target.px - world.position.x) * 0.025
    world.position.y += (target.py - world.position.y) * 0.025
    camera.position.z += (target.camZ - camera.position.z) * 0.025
    scaleTarget.set(target.scale, target.scale, target.scale)
    world.scale.lerp(scaleTarget, 0.03)

    const actionAge = action ? (performance.now() - action.startedAt) / 1000 : 0
    const actionStrength = action ? Math.min(1, actionAge) : 0
    if (!action) {
      robotGoal.copy(robotHome)
      robot.position.x += (Math.sin(elapsed * 0.38) * 0.26 - robot.position.x) * 0.012
      robot.position.z += (robotHome.z + Math.cos(elapsed * 0.42) * 0.08 - robot.position.z) * 0.015
      robot.userData.parts.headPivot.rotation.y = Math.sin(elapsed * 0.8) * 0.22
    } else {
      robot.position.lerp(robotGoal, 0.045)
      const direction = action.local.x > robot.position.x ? -0.2 : 0.2
      robot.rotation.y += (direction - robot.rotation.y) * 0.05
      robot.userData.parts.headPivot.rotation.y += (direction * -0.9 - robot.userData.parts.headPivot.rotation.y) * 0.05
      if (actionAge > 1.05 && !action.opened) {
        action.opened = true
        beam.material.opacity = 0.9
        window.dispatchEvent(new CustomEvent('portfolio:open-module', { detail: { target: action.node.userData.target, label: action.node.userData.label } }))
        window.setTimeout(() => { beam.material.opacity = 0; action = null }, 950)
      }
    }

    robot.position.y += (-0.68 + Math.sin(elapsed * 1.4) * 0.04 - robot.position.y) * 0.08
    robot.userData.parts.chestCore.rotation.y += 0.03
    robot.userData.parts.rings.forEach(ring => { ring.rotation.z += ring.userData.rotationSpeed })
    robot.userData.parts.rightArmAim.geometry.setFromPoints([new THREE.Vector3(0.55, 1.45, 0), robot.userData.parts.rightHand.position.clone()])
    updateHologramParticles(robot, elapsed, actionStrength)

    if (action) {
      robot.userData.parts.rightHand.position.lerp(new THREE.Vector3(1.44, 0.48, 0.28), 0.08)
    } else {
      robot.userData.parts.rightHand.position.lerp(new THREE.Vector3(1.25, 0.1, 0.22), 0.06)
    }
    if (action && actionAge > 0.72) {
      const handWorld = new THREE.Vector3()
      robot.userData.parts.rightHand.getWorldPosition(handWorld)
      const nodeWorld = new THREE.Vector3()
      action.node.getWorldPosition(nodeWorld)
      beam.geometry.setFromPoints([world.worldToLocal(handWorld.clone()), world.worldToLocal(nodeWorld.clone())])
      beam.material.opacity = Math.min(0.92, Math.max(0, (actionAge - 0.72) * 2))
    }

    platform.children.forEach(child => { if (child.userData?.rotationSpeed) child.rotation.z += child.userData.rotationSpeed })
    digitalWorld.rotation.y = elapsed * 0.012
    digitalWorld.children.forEach((child, i) => {
      if (child.userData?.target) {
        child.position.y += Math.sin(elapsed * 1.4 + i) * 0.0009
        child.rotation.y = -world.rotation.y * 0.5 + Math.sin(elapsed * 0.4 + i) * 0.05
      }
    })

    raycaster.setFromCamera(pointer, camera)
    const hit = raycaster.intersectObjects(interactiveNodes, false)[0]
    hovered = hit?.object || null
    renderer.domElement.style.cursor = hovered ? 'pointer' : 'default'
    interactiveNodes.forEach(node => {
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
