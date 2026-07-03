import * as THREE from 'three'

const MODULES = [
  { label: 'About', target: 'about', position: [-3.45, 2.05, -0.75], color: 0x22d3ee },
  { label: 'Skills', target: 'skills', position: [3.35, 2.0, -0.75], color: 0x34d399 },
  { label: 'Experience', target: 'experience', position: [-4.0, 0.2, -0.25], color: 0xfacc15 },
  { label: 'Projects', target: 'projects', position: [4.0, 0.2, -0.25], color: 0xf472b6 },
  { label: 'GitHub', target: 'github', position: [-2.65, -1.55, 0.1], color: 0x8b5cf6 },
  { label: 'Contact', target: 'contact', position: [2.75, -1.55, 0.1], color: 0x67e8f9 }
]

function makeMaterial(color, emissive = 0x000000, intensity = 0, metalness = 0.65, roughness = 0.32) {
  return new THREE.MeshStandardMaterial({ color, emissive, emissiveIntensity: intensity, metalness, roughness })
}

function makeGlow(color, opacity = 0.18) {
  return new THREE.MeshBasicMaterial({ color, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false })
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
  gradient.addColorStop(0, 'rgba(2, 6, 23, .94)')
  gradient.addColorStop(1, 'rgba(14, 165, 233, .46)')
  ctx.fillStyle = gradient
  ctx.strokeStyle = 'rgba(125, 211, 252, .9)'
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

function addBox(parent, name, size, pos, mat, radiusGlow = false) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), mat)
  mesh.name = name
  mesh.position.set(...pos)
  parent.add(mesh)
  if (radiusGlow) {
    const glow = new THREE.Mesh(new THREE.SphereGeometry(radiusGlow, 32, 32), makeGlow(0x22d3ee, 0.12))
    glow.position.copy(mesh.position)
    parent.add(glow)
  }
  return mesh
}

function addCylinder(parent, name, radiusTop, radiusBottom, height, pos, rot, mat) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radiusTop, radiusBottom, height, 28), mat)
  mesh.name = name
  mesh.position.set(...pos)
  mesh.rotation.set(...rot)
  parent.add(mesh)
  return mesh
}

function createProceduralRobot() {
  const robot = new THREE.Group()
  robot.name = 'ProceduralAIRobot'
  robot.position.set(0, -0.62, 0.18)

  const white = makeMaterial(0xf8fafc, 0x0ea5e9, 0.08, 0.78, 0.22)
  const pearl = makeMaterial(0xdbeafe, 0x22d3ee, 0.1, 0.72, 0.26)
  const black = makeMaterial(0x020617, 0x0f172a, 0.28, 0.9, 0.34)
  const cyan = makeMaterial(0x22d3ee, 0x22d3ee, 1.65, 0.38, 0.12)
  const blue = makeMaterial(0x0ea5e9, 0x22d3ee, 1.0, 0.45, 0.16)

  const spine = new THREE.Group()
  robot.add(spine)

  addBox(spine, 'abdomen', [0.56, 0.78, 0.38], [0, 0.35, 0.02], black)
  addBox(spine, 'torso-main', [1.0, 1.18, 0.46], [0, 1.1, 0], white)
  addBox(spine, 'chest-dark', [0.68, 0.48, 0.06], [0, 1.2, 0.28], black)

  const chestCore = new THREE.Mesh(new THREE.OctahedronGeometry(0.18, 1), cyan)
  chestCore.position.set(0, 1.2, 0.36)
  chestCore.name = 'chestCore'
  spine.add(chestCore)
  const chestGlow = new THREE.Mesh(new THREE.SphereGeometry(0.52, 32, 32), makeGlow(0x22d3ee, 0.16))
  chestGlow.position.copy(chestCore.position)
  spine.add(chestGlow)

  const headPivot = new THREE.Group()
  headPivot.name = 'headPivot'
  headPivot.position.set(0, 2.12, 0)
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.36, 48, 48), pearl)
  head.scale.set(1.02, 1.16, 0.9)
  headPivot.add(head)
  addBox(headPivot, 'visor', [0.5, 0.1, 0.04], [0, 0.03, 0.31], cyan)
  const leftEye = new THREE.Mesh(new THREE.SphereGeometry(0.045, 24, 24), cyan)
  leftEye.position.set(-0.12, 0.055, 0.335)
  const rightEye = leftEye.clone()
  rightEye.position.x = 0.12
  headPivot.add(leftEye, rightEye)
  addCylinder(headPivot, 'left-ear', 0.13, 0.13, 0.12, [-0.39, 0.04, 0], [0, 0, Math.PI / 2], cyan)
  addCylinder(headPivot, 'right-ear', 0.13, 0.13, 0.12, [0.39, 0.04, 0], [0, 0, Math.PI / 2], cyan)
  robot.add(headPivot)

  const leftArmPivot = new THREE.Group()
  leftArmPivot.name = 'leftArmPivot'
  leftArmPivot.position.set(-0.72, 1.45, 0)
  const rightArmPivot = new THREE.Group()
  rightArmPivot.name = 'rightArmPivot'
  rightArmPivot.position.set(0.72, 1.45, 0)
  robot.add(leftArmPivot, rightArmPivot)
  addCylinder(leftArmPivot, 'left-upper-arm', 0.09, 0.11, 0.78, [0, -0.42, 0], [0, 0, -0.08], white)
  addCylinder(rightArmPivot, 'right-upper-arm', 0.09, 0.11, 0.78, [0, -0.42, 0], [0, 0, 0.08], white)
  addCylinder(robot, 'left-forearm', 0.075, 0.1, 0.72, [-1.02, 0.55, 0.08], [0, 0, -0.22], black)
  const rightForearm = addCylinder(robot, 'right-forearm', 0.075, 0.1, 0.72, [1.02, 0.55, 0.08], [0, 0, 0.22], black)

  const rightHand = new THREE.Group()
  rightHand.name = 'rightHand'
  rightHand.position.set(1.13, 0.17, 0.21)
  robot.add(rightHand)
  const palm = new THREE.Mesh(new THREE.SphereGeometry(0.12, 24, 24), cyan)
  rightHand.add(palm)
  for (let i = 0; i < 5; i += 1) {
    const finger = addCylinder(rightHand, `finger-${i}`, 0.012, 0.018, 0.26, [-0.08 + i * 0.04, -0.12, 0.08], [Math.PI / 2.8, 0, 0], pearl)
    finger.userData.baseX = finger.position.x
  }
  const leftHand = rightHand.clone()
  leftHand.name = 'leftHand'
  leftHand.position.set(-1.13, 0.17, 0.21)
  leftHand.scale.x = -1
  robot.add(leftHand)

  addCylinder(robot, 'hip', 0.42, 0.5, 0.24, [0, -0.13, 0], [0, 0, 0], black)
  const leftLegPivot = new THREE.Group()
  leftLegPivot.name = 'leftLegPivot'
  leftLegPivot.position.set(-0.27, -0.22, 0)
  const rightLegPivot = new THREE.Group()
  rightLegPivot.name = 'rightLegPivot'
  rightLegPivot.position.set(0.27, -0.22, 0)
  robot.add(leftLegPivot, rightLegPivot)
  addCylinder(leftLegPivot, 'left-thigh', 0.13, 0.16, 0.86, [0, -0.42, 0], [0, 0, 0], white)
  addCylinder(rightLegPivot, 'right-thigh', 0.13, 0.16, 0.86, [0, -0.42, 0], [0, 0, 0], white)
  addBox(robot, 'left-foot', [0.4, 0.16, 0.62], [-0.27, -1.18, 0.24], black)
  addBox(robot, 'right-foot', [0.4, 0.16, 0.62], [0.27, -1.18, 0.24], black)

  const stripPositions = [[-0.35, 1.55, 0.29], [0.35, 1.55, 0.29], [-0.28, 0.62, 0.25], [0.28, 0.62, 0.25]]
  stripPositions.forEach((p, i) => addBox(robot, `light-strip-${i}`, [0.06, 0.32, 0.025], p, blue))

  for (let i = 0; i < 4; i += 1) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.86 + i * 0.24, 0.005, 8, 120), makeGlow(0x22d3ee, 0.22 - i * 0.035))
    ring.rotation.x = Math.PI / 2
    ring.position.y = 0.72 + i * 0.25
    ring.userData.rotationSpeed = i % 2 === 0 ? 0.004 : -0.003
    robot.add(ring)
  }

  const particleGeo = new THREE.BufferGeometry()
  const count = 220
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i += 1) {
    const r = 0.75 + Math.random() * 1.75
    const a = Math.random() * Math.PI * 2
    positions[i * 3] = Math.cos(a) * r
    positions[i * 3 + 1] = Math.random() * 3.6 - 1.12
    positions[i * 3 + 2] = Math.sin(a) * r * 0.76 + 0.1
  }
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  const particles = new THREE.Points(particleGeo, new THREE.PointsMaterial({ color: 0x7dd3fc, size: 0.022, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending }))
  particles.userData.isRobotParticles = true
  robot.add(particles)

  robot.userData.parts = { headPivot, leftArmPivot, rightArmPivot, leftLegPivot, rightLegPivot, rightForearm, rightHand, chestCore }
  return robot
}

function createModule(node, interactiveNodes) {
  const group = new THREE.Group()
  group.position.set(...node.position)
  group.userData = { target: node.target, label: node.label }
  const panel = new THREE.Mesh(new THREE.PlaneGeometry(1.25, 0.74), new THREE.MeshBasicMaterial({ color: node.color, transparent: true, opacity: 0.12, side: THREE.DoubleSide, depthWrite: false }))
  const frame = new THREE.Mesh(new THREE.TorusGeometry(0.46, 0.008, 8, 96), makeGlow(node.color, 0.52))
  frame.scale.y = 0.62
  frame.position.z = 0.03
  const core = new THREE.Mesh(new THREE.SphereGeometry(0.12, 32, 32), makeMaterial(node.color, node.color, 1.7, 0.35, 0.16))
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
  const count = 520
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i += 1) {
    positions[i * 3] = (Math.random() - 0.5) * 14
    positions[i * 3 + 1] = (Math.random() - 0.5) * 8.5
    positions[i * 3 + 2] = (Math.random() - 0.5) * 9.5 - 1
  }
  const particleGeometry = new THREE.BufferGeometry()
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  group.add(new THREE.Points(particleGeometry, new THREE.PointsMaterial({ color: 0x7dd3fc, size: 0.022, transparent: true, opacity: 0.76, blending: THREE.AdditiveBlending })))
  const linePositions = []
  for (let i = 0; i < count; i += 3) {
    const a = i * 3
    const b = ((i + 29) % count) * 3
    linePositions.push(positions[a], positions[a + 1], positions[a + 2], positions[b], positions[b + 1], positions[b + 2])
  }
  const lineGeometry = new THREE.BufferGeometry()
  lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3))
  group.add(new THREE.LineSegments(lineGeometry, new THREE.LineBasicMaterial({ color: 0x0ea5e9, transparent: true, opacity: 0.13 })))
  ;['SYSTEM OVERVIEW', 'AI CORE', 'JAVA 8', 'OPEN API', 'GATEWAY', 'REDIS', 'MYSQL', 'TRACE', 'MQ', 'FINTECH'].forEach((text, i) => {
    const label = textSprite(text, '#67e8f9')
    const a = (i / 10) * Math.PI * 2
    label.position.set(Math.cos(a) * 5.25, 0.15 + (i % 4) * 0.82, Math.sin(a) * 2.25 - 2)
    label.scale.set(1.15, 0.34, 1)
    label.material.opacity = 0.5
    group.add(label)
  })
  MODULES.forEach(node => group.add(createModule(node, interactiveNodes)))
  return group
}

function createPlatform() {
  const group = new THREE.Group()
  for (let i = 0; i < 6; i += 1) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.4 + i * 0.72, 0.006, 8, 180), makeGlow(0x22d3ee, 0.32 - i * 0.035))
    ring.rotation.x = Math.PI / 2
    ring.position.y = -1.82
    ring.userData.rotationSpeed = i % 2 === 0 ? 0.002 : -0.0015
    group.add(ring)
  }
  const grid = new THREE.GridHelper(16, 64, 0x0ea5e9, 0x0f3b5f)
  grid.position.y = -1.84
  grid.material.transparent = true
  grid.material.opacity = 0.24
  group.add(grid)
  return group
}

function triggerDomEffect(label) {
  document.querySelector('.module-jump-effect')?.remove()
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

  scene.add(new THREE.AmbientLight(0x9bdcff, 0.52))
  const key = new THREE.DirectionalLight(0xffffff, 1.45)
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
  const robot = createProceduralRobot()
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
  const robotHome = new THREE.Vector3(0, -0.62, 0.18)
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
    const elapsed = clock.elapsedTime
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
    parts.rightHand.position.set(action ? 1.32 : 1.13, action ? 0.56 : 0.17, 0.21)
    parts.chestCore.rotation.y += 0.025
    robot.position.y += (-0.62 + Math.abs(gait) * 0.035 - robot.position.y) * 0.12
    robot.children.forEach(child => {
      if (child.userData?.rotationSpeed) child.rotation.z += child.userData.rotationSpeed
      if (child.userData?.isRobotParticles) child.rotation.y += 0.006
    })

    if (action && actionAge > 0.75) {
      const handWorld = new THREE.Vector3()
      parts.rightHand.getWorldPosition(handWorld)
      const nodeWorld = new THREE.Vector3()
      action.node.getWorldPosition(nodeWorld)
      beam.geometry.setFromPoints([world.worldToLocal(handWorld.clone()), world.worldToLocal(nodeWorld.clone())])
      beam.material.opacity = Math.min(0.9, Math.max(0, (actionAge - 0.75) * 2))
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
