import * as THREE from 'three'

const NODE_DEFS = [
  { label: 'About', target: 'about', position: [-3.25, 2.15, -0.6], color: 0x22d3ee },
  { label: 'Skills', target: 'skills', position: [3.1, 2.05, -0.55], color: 0x34d399 },
  { label: 'Experience', target: 'experience', position: [-3.8, 0.35, -0.2], color: 0xfacc15 },
  { label: 'Projects', target: 'projects', position: [3.85, 0.35, -0.2], color: 0xf472b6 },
  { label: 'GitHub', target: 'github', position: [-2.55, -1.45, 0.08], color: 0x8b5cf6 },
  { label: 'Contact', target: 'contact', position: [2.65, -1.45, 0.08], color: 0x67e8f9 }
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

function makeCanvasTexture(draw, width = 512, height = 256) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  draw(ctx, width, height)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

function makeTextSprite(text, color = '#e6f6ff', width = 640, height = 250) {
  const texture = makeCanvasTexture((ctx, w, h) => {
    ctx.clearRect(0, 0, w, h)
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
  }, width, height)
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false }))
  sprite.scale.set(1.45, 0.56, 1)
  return sprite
}

function makeTube(points, color, radius = 0.025, opacity = 0.9) {
  const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)))
  const geometry = new THREE.TubeGeometry(curve, 64, radius, 12, false)
  const material = new THREE.MeshBasicMaterial({ color, transparent: true, opacity, blending: THREE.AdditiveBlending })
  return new THREE.Mesh(geometry, material)
}

function makeGlowSphere(radius, color, opacity = 0.22) {
  return new THREE.Mesh(
    new THREE.SphereGeometry(radius, 32, 32),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false })
  )
}

function createRobot() {
  const group = new THREE.Group()
  group.name = 'FullBodyTechRobot'
  group.position.set(0, -0.62, 0.15)

  const armor = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.26, metalness: 0.72, emissive: 0x0f172a, emissiveIntensity: 0.16 })
  const black = new THREE.MeshStandardMaterial({ color: 0x020617, roughness: 0.38, metalness: 0.86, emissive: 0x0f172a, emissiveIntensity: 0.22 })
  const cyan = new THREE.MeshStandardMaterial({ color: 0x22d3ee, roughness: 0.1, metalness: 0.45, emissive: 0x22d3ee, emissiveIntensity: 1.5 })
  const skin = new THREE.MeshStandardMaterial({ color: 0xe6f6ff, roughness: 0.34, metalness: 0.18, emissive: 0x67e8f9, emissiveIntensity: 0.18 })

  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.98, 1.26, 0.5), armor)
  torso.position.y = 1.05
  torso.name = 'torso'
  group.add(torso)

  const abdomen = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.72, 0.42), black)
  abdomen.position.set(0, 0.36, 0.02)
  group.add(abdomen)

  const chestPlate = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.52, 0.065), black)
  chestPlate.position.set(0, 1.18, 0.295)
  group.add(chestPlate)

  const core = new THREE.Mesh(new THREE.OctahedronGeometry(0.18, 1), cyan)
  core.position.set(0, 1.2, 0.38)
  core.name = 'core'
  group.add(core)
  const coreAura = makeGlowSphere(0.5, 0x22d3ee, 0.14)
  coreAura.position.copy(core.position)
  group.add(coreAura)

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.17, 0.22, 24), black)
  neck.position.y = 1.82
  group.add(neck)

  const headPivot = new THREE.Group()
  headPivot.position.y = 2.15
  headPivot.name = 'headPivot'
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.34, 42, 42), skin)
  head.scale.set(1.05, 1.18, 0.92)
  headPivot.add(head)
  const visor = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.11, 0.04), cyan)
  visor.position.set(0, 0.03, 0.31)
  headPivot.add(visor)
  const earL = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.12, 32), cyan)
  earL.position.set(-0.38, 0.04, 0)
  earL.rotation.z = Math.PI / 2
  const earR = earL.clone()
  earR.position.x = 0.38
  headPivot.add(earL, earR)
  group.add(headPivot)

  const shoulderGeo = new THREE.SphereGeometry(0.2, 32, 32)
  const leftShoulder = new THREE.Mesh(shoulderGeo, armor)
  leftShoulder.position.set(-0.7, 1.55, 0)
  const rightShoulder = leftShoulder.clone()
  rightShoulder.position.x = 0.7
  group.add(leftShoulder, rightShoulder)

  const upperArmGeo = new THREE.CylinderGeometry(0.08, 0.1, 0.82, 22)
  const leftArmPivot = new THREE.Group()
  leftArmPivot.position.set(-0.73, 1.42, 0)
  leftArmPivot.name = 'leftArmPivot'
  const leftArm = new THREE.Mesh(upperArmGeo, armor)
  leftArm.position.y = -0.4
  leftArmPivot.add(leftArm)
  const rightArmPivot = new THREE.Group()
  rightArmPivot.position.set(0.73, 1.42, 0)
  rightArmPivot.name = 'rightArmPivot'
  const rightArm = new THREE.Mesh(upperArmGeo, armor)
  rightArm.position.y = -0.4
  rightArmPivot.add(rightArm)
  group.add(leftArmPivot, rightArmPivot)

  const forearmGeo = new THREE.CylinderGeometry(0.075, 0.09, 0.74, 22)
  const leftForearm = new THREE.Mesh(forearmGeo, black)
  leftForearm.position.set(-1.02, 0.58, 0.08)
  leftForearm.rotation.z = -0.22
  leftForearm.name = 'leftForearm'
  const rightForearm = new THREE.Mesh(forearmGeo, black)
  rightForearm.position.set(1.02, 0.58, 0.08)
  rightForearm.rotation.z = 0.22
  rightForearm.name = 'rightForearm'
  group.add(leftForearm, rightForearm)

  const leftHand = new THREE.Mesh(new THREE.SphereGeometry(0.13, 24, 24), cyan)
  leftHand.position.set(-1.12, 0.18, 0.2)
  const rightHand = new THREE.Mesh(new THREE.SphereGeometry(0.13, 24, 24), cyan)
  rightHand.position.set(1.12, 0.18, 0.2)
  rightHand.name = 'rightHand'
  group.add(leftHand, rightHand)

  const hip = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.5, 0.24, 32), black)
  hip.position.y = -0.12
  group.add(hip)

  const legGeo = new THREE.CylinderGeometry(0.12, 0.15, 0.92, 24)
  const leftLegPivot = new THREE.Group()
  leftLegPivot.position.set(-0.27, -0.22, 0)
  leftLegPivot.name = 'leftLegPivot'
  const leftLeg = new THREE.Mesh(legGeo, armor)
  leftLeg.position.y = -0.42
  leftLegPivot.add(leftLeg)
  const rightLegPivot = new THREE.Group()
  rightLegPivot.position.set(0.27, -0.22, 0)
  rightLegPivot.name = 'rightLegPivot'
  const rightLeg = new THREE.Mesh(legGeo, armor)
  rightLeg.position.y = -0.42
  rightLegPivot.add(rightLeg)
  group.add(leftLegPivot, rightLegPivot)

  const footGeo = new THREE.BoxGeometry(0.38, 0.16, 0.62)
  const leftFoot = new THREE.Mesh(footGeo, black)
  leftFoot.position.set(-0.27, -1.18, 0.22)
  leftFoot.name = 'leftFoot'
  const rightFoot = new THREE.Mesh(footGeo, black)
  rightFoot.position.set(0.27, -1.18, 0.22)
  rightFoot.name = 'rightFoot'
  group.add(leftFoot, rightFoot)

  const orbitMat = new THREE.MeshBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.22, blending: THREE.AdditiveBlending })
  ;[0.9, 1.22, 1.55].forEach((r, i) => {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(r, 0.005, 8, 128), orbitMat.clone())
    ring.position.y = 0.88 + i * 0.28
    ring.rotation.x = Math.PI / 2
    ring.userData.rotationSpeed = i % 2 === 0 ? 0.004 : -0.003
    group.add(ring)
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
  group.add(particles)

  group.userData.parts = { headPivot, leftArmPivot, rightArmPivot, leftLegPivot, rightLegPivot, rightForearm, rightHand, core }
  return group
}

function createFloatingModule(node, interactiveNodes) {
  const group = new THREE.Group()
  group.position.set(...node.position)
  group.userData = { target: node.target, label: node.label }

  const panel = new THREE.Mesh(
    new THREE.PlaneGeometry(1.25, 0.74),
    new THREE.MeshBasicMaterial({ color: node.color, transparent: true, opacity: 0.12, side: THREE.DoubleSide, depthWrite: false })
  )
  group.add(panel)

  const frame = new THREE.Mesh(new THREE.TorusGeometry(0.46, 0.008, 8, 96), new THREE.MeshBasicMaterial({ color: node.color, transparent: true, opacity: 0.52, blending: THREE.AdditiveBlending }))
  frame.scale.y = 0.62
  frame.position.z = 0.03
  group.add(frame)

  const core = new THREE.Mesh(new THREE.SphereGeometry(0.12, 32, 32), new THREE.MeshStandardMaterial({ color: node.color, emissive: node.color, emissiveIntensity: 1.7, roughness: 0.2, metalness: 0.35 }))
  core.position.z = 0.08
  core.userData = { target: node.target, label: node.label, rootGroup: group }
  group.add(core)
  interactiveNodes.push(core)

  const hit = new THREE.Mesh(new THREE.SphereGeometry(0.42, 24, 24), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }))
  hit.userData = { target: node.target, label: node.label, rootGroup: group }
  group.add(hit)
  interactiveNodes.push(hit)

  const label = makeTextSprite(node.label)
  label.position.set(0, 0.55, 0.08)
  group.add(label)

  const glow = makeGlowSphere(0.55, node.color, 0.12)
  group.add(glow)
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
  const particles = new THREE.Points(particleGeometry, new THREE.PointsMaterial({ color: 0x7dd3fc, size: 0.022, transparent: true, opacity: 0.78, blending: THREE.AdditiveBlending }))
  group.add(particles)

  const linePositions = []
  for (let i = 0; i < pointCount; i += 3) {
    const a = i * 3
    const j = (i + 23) % pointCount
    const b = j * 3
    linePositions.push(positions[a], positions[a + 1], positions[a + 2], positions[b], positions[b + 1], positions[b + 2])
  }
  const lineGeometry = new THREE.BufferGeometry()
  lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3))
  const lines = new THREE.LineSegments(lineGeometry, new THREE.LineBasicMaterial({ color: 0x0ea5e9, transparent: true, opacity: 0.13 }))
  group.add(lines)

  const panelTexts = ['SYSTEM OVERVIEW', 'AI CORE', 'JAVA 8', 'OPEN API', 'GATEWAY', 'REDIS', 'MYSQL', 'TRACE', 'MQ', 'FINTECH']
  panelTexts.forEach((text, index) => {
    const label = makeTextSprite(text, '#67e8f9', 620, 190)
    const angle = (index / panelTexts.length) * Math.PI * 2
    label.position.set(Math.cos(angle) * 5.25, 0.15 + (index % 4) * 0.82, Math.sin(angle) * 2.25 - 2.0)
    label.scale.set(1.15, 0.34, 1)
    label.material.opacity = 0.55
    group.add(label)
  })

  NODE_DEFS.forEach(node => group.add(createFloatingModule(node, interactiveNodes)))
  return group
}

function createPlatform() {
  const group = new THREE.Group()
  const ringMat = new THREE.MeshBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.32, blending: THREE.AdditiveBlending })
  ;[1.45, 2.3, 3.15, 4.05, 5.1].forEach((r, i) => {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(r, 0.006, 8, 180), ringMat.clone())
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

  const robot = createRobot()
  const platform = createPlatform()
  world.add(robot, platform)

  const beamGeometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()])
  const beam = new THREE.Line(beamGeometry, new THREE.LineBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0, blending: THREE.AdditiveBlending }))
  world.add(beam)

  const raycaster = new THREE.Raycaster()
  const pointer = new THREE.Vector2(99, 99)
  let mouseX = 0
  let mouseY = 0
  let hovered = null
  let action = null
  const robotHome = new THREE.Vector3(0, -0.62, 0.15)
  const robotGoal = robotHome.clone()

  function getPointer(event) {
    const rect = renderer.domElement.getBoundingClientRect()
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
  }

  function onMove(event) {
    mouseX = (event.clientX / window.innerWidth - 0.5) * 2
    mouseY = (event.clientY / window.innerHeight - 0.5) * 2
    getPointer(event)
  }

  function onClick(event) {
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

  function resize() {
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
    const elapsed = clock.getElapsedTime()
    const sceneName = document.body.dataset.scene || 'home'
    const target = sceneTargets[sceneName] || sceneTargets.home

    world.rotation.x += (target.rx + mouseY * 0.028 - world.rotation.x) * 0.03
    world.rotation.y += (target.ry + mouseX * 0.04 - world.rotation.y) * 0.03
    world.position.x += (target.px - world.position.x) * 0.025
    world.position.y += (target.py - world.position.y) * 0.025
    camera.position.z += (target.camZ - camera.position.z) * 0.025
    scaleTarget.set(target.scale, target.scale, target.scale)
    world.scale.lerp(scaleTarget, 0.03)

    const parts = robot.userData.parts
    const walk = Math.sin(elapsed * 4.2)
    const thinking = Math.sin(elapsed * 0.8)
    const actionAge = action ? (performance.now() - action.startedAt) / 1000 : 0
    const acting = Boolean(action)

    if (!acting) {
      robotGoal.copy(robotHome)
      robot.position.x += (Math.sin(elapsed * 0.38) * 0.35 - robot.position.x) * 0.01
      robot.position.z += (robotHome.z + Math.cos(elapsed * 0.42) * 0.08 - robot.position.z) * 0.015
      parts.headPivot.rotation.y = thinking * 0.22
    } else {
      robot.position.lerp(robotGoal, 0.045)
      const direction = action.local.x > robot.position.x ? -0.22 : 0.22
      robot.rotation.y += (direction - robot.rotation.y) * 0.05
      parts.headPivot.rotation.y += (direction * -0.9 - parts.headPivot.rotation.y) * 0.05
      if (actionAge > 1.05 && !action.opened) {
        action.opened = true
        beam.material.opacity = 0.85
        window.dispatchEvent(new CustomEvent('portfolio:open-module', { detail: { target: action.node.userData.target, label: action.node.userData.label } }))
        window.setTimeout(() => {
          beam.material.opacity = 0
          action = null
        }, 950)
      }
    }

    const gait = acting ? Math.sin(elapsed * 8.5) : walk
    parts.leftLegPivot.rotation.x = gait * 0.34
    parts.rightLegPivot.rotation.x = -gait * 0.34
    parts.leftArmPivot.rotation.x = -gait * 0.28
    parts.rightArmPivot.rotation.x = acting ? -1.05 : gait * 0.22
    parts.rightForearm.rotation.z = acting ? -0.58 : 0.22
    parts.rightHand.position.y = acting ? 0.56 : 0.18
    parts.rightHand.position.x = acting ? 1.32 : 1.12
    robot.position.y += (-0.62 + Math.abs(gait) * 0.035 - robot.position.y) * 0.12
    parts.core.rotation.y += 0.025

    if (acting && actionAge > 0.75) {
      const handWorld = new THREE.Vector3()
      parts.rightHand.getWorldPosition(handWorld)
      const nodeWorld = new THREE.Vector3()
      action.node.getWorldPosition(nodeWorld)
      const a = world.worldToLocal(handWorld.clone())
      const b = world.worldToLocal(nodeWorld.clone())
      beam.geometry.setFromPoints([a, b])
      beam.material.opacity = Math.min(0.9, Math.max(0, (actionAge - 0.75) * 2))
    }

    robot.children.forEach((child) => {
      if (child.userData?.rotationSpeed) child.rotation.z += child.userData.rotationSpeed
      if (child.userData?.isRobotParticles) child.rotation.y += 0.006
    })
    platform.children.forEach((child) => {
      if (child.userData?.rotationSpeed) child.rotation.z += child.userData.rotationSpeed
    })
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
      if (rootGroup) rootGroup.scale.lerp(new THREE.Vector3(hovered === node ? 1.16 : 1, hovered === node ? 1.16 : 1, hovered === node ? 1.16 : 1), 0.12)
    })

    renderer.render(scene, camera)
    requestAnimationFrame(animate)
  }
  animate()

  return {
    destroy() {
      renderer.domElement.removeEventListener('pointermove', onMove)
      renderer.domElement.removeEventListener('click', onClick)
      window.removeEventListener('resize', resize)
      root.innerHTML = ''
    }
  }
}
