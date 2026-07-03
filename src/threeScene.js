import * as THREE from 'three'
import { skills, projects, experiences } from './config.js'

const CORE_MODULES = [
  { label: 'About', target: 'about', position: [-1.35, 0.95, 0.55], color: 0x7dd3fc, size: 0.18 },
  { label: 'Skills', target: 'skills', position: [1.35, 0.85, 0.35], color: 0x34d399, size: 0.18 },
  { label: 'Projects', target: 'projects', position: [1.68, -0.55, 0.2], color: 0xf472b6, size: 0.2 },
  { label: 'Experience', target: 'experience', position: [-1.72, -0.45, 0.12], color: 0xfacc15, size: 0.2 },
  { label: 'GitHub', target: 'github', position: [-0.72, -1.32, 0.55], color: 0xa78bfa, size: 0.16 },
  { label: 'Contact', target: 'contact', position: [0.82, -1.38, 0.65], color: 0x67e8f9, size: 0.16 }
]

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

function createRadialTexture(stops, size = 256) {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  stops.forEach(([offset, color]) => gradient.addColorStop(offset, color))
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

function createStarTexture() {
  return createRadialTexture([
    [0, 'rgba(255,255,255,1)'],
    [0.08, 'rgba(255,250,220,.95)'],
    [0.22, 'rgba(125,211,252,.66)'],
    [0.52, 'rgba(59,130,246,.18)'],
    [1, 'rgba(10,20,40,0)']
  ], 128)
}

function createNebulaTexture(colorA = 'rgba(125,211,252,.26)', colorB = 'rgba(167,139,250,.16)') {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, 512, 512)
  for (let i = 0; i < 16; i += 1) {
    const x = 128 + Math.random() * 256
    const y = 128 + Math.random() * 256
    const r = 90 + Math.random() * 190
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, r)
    gradient.addColorStop(0, i % 2 ? colorA : colorB)
    gradient.addColorStop(0.55, 'rgba(30,64,175,.05)')
    gradient.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 512, 512)
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

function createLabelTexture(text, color = '#e6f6ff') {
  const canvas = document.createElement('canvas')
  canvas.width = 560
  canvas.height = 164
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, 560, 164)
  const gradient = ctx.createLinearGradient(0, 0, 560, 0)
  gradient.addColorStop(0, 'rgba(2,6,23,0)')
  gradient.addColorStop(0.18, 'rgba(2,6,23,.66)')
  gradient.addColorStop(0.82, 'rgba(14,165,233,.22)')
  gradient.addColorStop(1, 'rgba(2,6,23,0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 38, 560, 88)
  ctx.strokeStyle = 'rgba(125,211,252,.34)'
  ctx.strokeRect(44, 40, 472, 84)
  ctx.shadowColor = 'rgba(34,211,238,.9)'
  ctx.shadowBlur = 15
  ctx.fillStyle = color
  ctx.font = '800 42px Inter, Arial, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, 280, 84)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

function makeLabel(text, color) {
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: createLabelTexture(text, color), transparent: true, depthWrite: false }))
  sprite.scale.set(1.25, 0.36, 1)
  return sprite
}

function createBackgroundStars() {
  const group = new THREE.Group()
  const layers = [
    { count: 2200, radiusMin: 14, radiusMax: 54, size: 0.015, opacity: 0.48 },
    { count: 1300, radiusMin: 8, radiusMax: 36, size: 0.024, opacity: 0.62 },
    { count: 320, radiusMin: 6, radiusMax: 30, size: 0.045, opacity: 0.68 }
  ]
  layers.forEach((layer, layerIndex) => {
    const positions = new Float32Array(layer.count * 3)
    const colors = new Float32Array(layer.count * 3)
    const color = new THREE.Color()
    for (let i = 0; i < layer.count; i += 1) {
      const radius = layer.radiusMin + Math.random() * (layer.radiusMax - layer.radiusMin)
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      positions[i * 3] = Math.sin(phi) * Math.cos(theta) * radius
      positions[i * 3 + 1] = Math.cos(phi) * radius
      positions[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * radius - 7
      color.setHSL(0.54 + Math.random() * 0.2, 0.34 + Math.random() * 0.46, 0.5 + Math.random() * 0.34)
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b
    }
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    const material = new THREE.PointsMaterial({ size: layer.size, vertexColors: true, transparent: true, opacity: layer.opacity, depthWrite: false, blending: THREE.AdditiveBlending })
    const stars = new THREE.Points(geometry, material)
    stars.userData.parallax = 0.0015 + layerIndex * 0.001
    group.add(stars)
  })
  return group
}

function createNebulaClouds() {
  const group = new THREE.Group()
  const textures = [
    createNebulaTexture('rgba(56,189,248,.22)', 'rgba(129,140,248,.16)'),
    createNebulaTexture('rgba(244,114,182,.18)', 'rgba(34,211,238,.16)'),
    createNebulaTexture('rgba(52,211,153,.14)', 'rgba(14,165,233,.16)')
  ]
  for (let i = 0; i < 38; i += 1) {
    const texture = textures[i % textures.length]
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: 0.1 + Math.random() * 0.14, blending: THREE.AdditiveBlending, depthWrite: false })
    const sprite = new THREE.Sprite(material)
    const radius = 8 + Math.random() * 24
    const angle = Math.random() * Math.PI * 2
    sprite.position.set(Math.cos(angle) * radius, (Math.random() - 0.5) * 14, Math.sin(angle) * radius - 14)
    const scale = 5 + Math.random() * 13
    sprite.scale.set(scale * (1.2 + Math.random()), scale, 1)
    sprite.userData.drift = 0.001 + Math.random() * 0.002
    group.add(sprite)
  }
  return group
}

function createGalaxyGlow() {
  const group = new THREE.Group()
  const coreTexture = createRadialTexture([
    [0, 'rgba(255,255,255,.9)'],
    [0.12, 'rgba(250,204,21,.48)'],
    [0.35, 'rgba(125,211,252,.18)'],
    [1, 'rgba(0,0,0,0)']
  ], 256)
  const core = new THREE.Sprite(new THREE.SpriteMaterial({ map: coreTexture, transparent: true, opacity: 0.58, blending: THREE.AdditiveBlending, depthWrite: false }))
  core.scale.set(2.2, 2.2, 1)
  group.add(core)

  const hazeTexture = createNebulaTexture('rgba(125,211,252,.18)', 'rgba(250,204,21,.12)')
  for (let i = 0; i < 7; i += 1) {
    const haze = new THREE.Sprite(new THREE.SpriteMaterial({ map: hazeTexture, transparent: true, opacity: 0.12, blending: THREE.AdditiveBlending, depthWrite: false }))
    haze.position.set((Math.random() - 0.5) * 2.4, (Math.random() - 0.5) * 1.6, (Math.random() - 0.5) * 1.4)
    haze.scale.set(3.2 + Math.random() * 2.6, 2.0 + Math.random() * 1.8, 1)
    haze.rotation.z = Math.random() * Math.PI
    haze.userData.drift = 0.0008 + Math.random() * 0.0015
    group.add(haze)
  }
  return group
}

function spiralPosition(index, total, radiusBase, radiusStep, zWave = 0.45, yWave = 0.9) {
  const arm = index % 4
  const turn = Math.floor(index / 4)
  const radius = radiusBase + turn * radiusStep + Math.random() * 0.22
  const angle = arm * Math.PI * 0.5 + radius * 0.78 + (Math.random() - 0.5) * 0.22
  return [
    Math.cos(angle) * radius,
    Math.sin(angle * 0.7) * yWave + (Math.random() - 0.5) * 0.24,
    Math.sin(angle) * radius * 0.68 + Math.cos(index * 1.7) * zWave
  ]
}

function createPortfolioStars() {
  const core = CORE_MODULES.map((node, index) => ({
    ...node,
    position: spiralPosition(index, CORE_MODULES.length, 1.25, 0.28, 0.35, 0.7),
    size: node.size + 0.02
  }))
  const skillStars = skills.slice(0, 14).map((skill, index) => ({
    label: skill.name,
    target: 'skills',
    position: spiralPosition(index + 6, 14, 2.2, 0.3, 0.55, 1.0),
    color: 0x34d399,
    size: 0.085,
    sub: skill.group
  }))
  const projectStars = projects.slice(0, 6).map((project, index) => ({
    label: project.name.replace(/｜.*/, '').slice(0, 12),
    target: 'projects',
    position: spiralPosition(index + 21, 6, 3.25, 0.45, 0.75, 1.15),
    color: 0xf472b6,
    size: 0.105,
    sub: project.type
  }))
  const expStars = experiences.slice(0, 5).map((exp, index) => ({
    label: exp.company.replace(/（.*?）/g, '').slice(0, 10),
    target: 'experience',
    position: spiralPosition(index + 31, 5, 4.25, 0.42, 0.9, 1.05),
    color: 0xfacc15,
    size: 0.09,
    sub: exp.period
  }))
  return [...core, ...skillStars, ...projectStars, ...expStars]
}

function createStarNode(node, texture, interactive) {
  const group = new THREE.Group()
  group.position.set(...node.position)
  group.userData = { target: node.target, label: node.label }

  const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, color: node.color, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false }))
  glow.scale.setScalar(node.size * 9)
  group.add(glow)

  const core = new THREE.Mesh(new THREE.SphereGeometry(node.size, 24, 24), new THREE.MeshBasicMaterial({ color: node.color, transparent: true, opacity: 0.92, blending: THREE.AdditiveBlending }))
  core.userData = { target: node.target, label: node.label, rootGroup: group }
  group.add(core)

  const ring = new THREE.Mesh(new THREE.TorusGeometry(node.size * 2.2, node.size * 0.035, 8, 96), new THREE.MeshBasicMaterial({ color: node.color, transparent: true, opacity: 0.42, blending: THREE.AdditiveBlending }))
  ring.rotation.x = Math.PI / 2
  ring.userData.spin = 0.004 + Math.random() * 0.004
  group.add(ring)

  if (node.size > 0.1) {
    const label = makeLabel(node.label, '#e6f6ff')
    label.position.set(0, node.size * 4.4, 0.1)
    group.add(label)
  }

  const hit = new THREE.Mesh(new THREE.SphereGeometry(node.size * 3.6, 16, 16), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }))
  hit.userData = core.userData
  group.add(hit)
  interactive.push(core, hit)
  return group
}

function createConstellationLines(nodes) {
  const points = []
  const bright = nodes.slice(0, 6)
  bright.forEach((module, index) => {
    const next = bright[(index + 1) % bright.length]
    points.push(new THREE.Vector3(...module.position), new THREE.Vector3(...next.position))
  })
  nodes.slice(6).forEach((node, index) => {
    const anchor = bright[index % bright.length]
    if (index % 2 === 0) points.push(new THREE.Vector3(...node.position), new THREE.Vector3(...anchor.position))
  })
  const geometry = new THREE.BufferGeometry().setFromPoints(points)
  return new THREE.LineSegments(geometry, new THREE.LineBasicMaterial({ color: 0x7dd3fc, transparent: true, opacity: 0.14, blending: THREE.AdditiveBlending }))
}

function triggerGalaxyOpen(label) {
  document.querySelector('.module-jump-effect')?.remove()
  const overlay = document.createElement('div')
  overlay.className = 'module-jump-effect galaxy-open-effect'
  overlay.innerHTML = `<div class="jump-ring"></div><div class="jump-copy"><span>OPENING STAR NODE</span><strong>${label}</strong></div>`
  document.body.appendChild(overlay)
  window.setTimeout(() => overlay.remove(), 1150)
  const status = document.getElementById('welcome-text')
  if (status) status.textContent = `Opening ${label} star node...`
}

export function initThreeScene({ rootSelector = '#three-scene-root' } = {}) {
  const root = document.querySelector(rootSelector)
  if (!root) return null

  const scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2(0x05060a, 0.018)

  const camera = new THREE.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.1, 120)
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8))
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.outputColorSpace = THREE.SRGBColorSpace
  root.appendChild(renderer.domElement)

  scene.add(new THREE.AmbientLight(0x9bdcff, 0.45))
  const blueLight = new THREE.PointLight(0x7dd3fc, 2.8, 28)
  blueLight.position.set(-5, 4, 5)
  const pinkLight = new THREE.PointLight(0xf472b6, 2.0, 22)
  pinkLight.position.set(5, -1, 4)
  scene.add(blueLight, pinkLight)

  const universe = new THREE.Group()
  scene.add(universe)
  const backgroundStars = createBackgroundStars()
  const nebulaClouds = createNebulaClouds()
  const galaxyGlow = createGalaxyGlow()
  universe.add(nebulaClouds, backgroundStars, galaxyGlow)

  const starTexture = createStarTexture()
  const interactive = []
  const starNodes = createPortfolioStars()
  const constellationGroup = new THREE.Group()
  starNodes.forEach(node => constellationGroup.add(createStarNode(node, starTexture, interactive)))
  constellationGroup.add(createConstellationLines(starNodes))
  constellationGroup.rotation.x = -0.18
  constellationGroup.rotation.z = 0.06
  universe.add(constellationGroup)

  const raycaster = new THREE.Raycaster()
  const pointer = new THREE.Vector2(99, 99)
  const controls = {
    yaw: 0,
    pitch: 0.18,
    distance: 10.5,
    targetYaw: 0,
    targetPitch: 0.18,
    targetDistance: 10.5,
    dragging: false,
    moved: false,
    lastX: 0,
    lastY: 0
  }
  let hovered = null
  let focus = null
  let focusStart = 0

  const updatePointer = (event) => {
    const rect = renderer.domElement.getBoundingClientRect()
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
  }

  const tryOpenStar = (event) => {
    updatePointer(event)
    raycaster.setFromCamera(pointer, camera)
    const hit = raycaster.intersectObjects(interactive, false)[0]
    if (!hit?.object?.userData?.target) return
    focus = hit.object
    focusStart = performance.now()
    triggerGalaxyOpen(focus.userData.label)
    window.setTimeout(() => {
      window.dispatchEvent(new CustomEvent('portfolio:open-module', { detail: { target: focus.userData.target, label: focus.userData.label } }))
    }, 520)
  }

  const onPointerDown = (event) => {
    controls.dragging = true
    controls.moved = false
    controls.lastX = event.clientX
    controls.lastY = event.clientY
    renderer.domElement.setPointerCapture?.(event.pointerId)
  }
  const onPointerMove = (event) => {
    updatePointer(event)
    if (!controls.dragging) return
    const dx = event.clientX - controls.lastX
    const dy = event.clientY - controls.lastY
    if (Math.abs(dx) + Math.abs(dy) > 3) controls.moved = true
    controls.targetYaw -= dx * 0.006
    controls.targetPitch = clamp(controls.targetPitch - dy * 0.004, -1.15, 1.15)
    controls.lastX = event.clientX
    controls.lastY = event.clientY
  }
  const onPointerUp = (event) => {
    if (!controls.moved) tryOpenStar(event)
    controls.dragging = false
    renderer.domElement.releasePointerCapture?.(event.pointerId)
  }
  const onWheel = (event) => {
    event.preventDefault()
    controls.targetDistance = clamp(controls.targetDistance + event.deltaY * 0.006, 4.8, 24)
  }

  renderer.domElement.addEventListener('pointerdown', onPointerDown)
  renderer.domElement.addEventListener('pointermove', onPointerMove)
  renderer.domElement.addEventListener('pointerup', onPointerUp)
  renderer.domElement.addEventListener('wheel', onWheel, { passive: false })

  const resize = () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  }
  window.addEventListener('resize', resize)

  const clock = new THREE.Clock()
  function animate() {
    const elapsed = clock.elapsedTime
    if (!controls.dragging && !focus) controls.targetYaw += 0.0008
    controls.yaw += (controls.targetYaw - controls.yaw) * 0.08
    controls.pitch += (controls.targetPitch - controls.pitch) * 0.08
    controls.distance += (controls.targetDistance - controls.distance) * 0.08

    if (focus) {
      controls.targetDistance = clamp(controls.targetDistance, 4.8, 8.5)
      const age = (performance.now() - focusStart) / 1000
      if (age > 1.8) focus = null
    }

    const radius = controls.distance
    camera.position.set(
      Math.sin(controls.yaw) * Math.cos(controls.pitch) * radius,
      Math.sin(controls.pitch) * radius,
      Math.cos(controls.yaw) * Math.cos(controls.pitch) * radius
    )
    camera.lookAt(0, 0, 0)

    backgroundStars.children.forEach((layer, index) => { layer.rotation.y = -elapsed * layer.userData.parallax * 8 + controls.yaw * (0.05 + index * 0.02) })
    nebulaClouds.children.forEach((cloud, index) => {
      cloud.rotation.z = elapsed * cloud.userData.drift + index * 0.1
      cloud.material.opacity = 0.1 + Math.sin(elapsed * 0.3 + index) * 0.03
    })
    galaxyGlow.children.forEach((glow, index) => {
      glow.rotation.z = elapsed * (glow.userData.drift || 0.001) + index * 0.05
    })

    constellationGroup.rotation.y = elapsed * 0.035
    constellationGroup.children.forEach((child, index) => {
      if (child.userData?.target) child.position.y += Math.sin(elapsed * 1.2 + index) * 0.0008
      child.children?.forEach((sub) => { if (sub.userData?.spin) sub.rotation.z += sub.userData.spin })
    })

    raycaster.setFromCamera(pointer, camera)
    const hit = raycaster.intersectObjects(interactive, false)[0]
    hovered = hit?.object || null
    renderer.domElement.style.cursor = hovered ? 'pointer' : controls.dragging ? 'grabbing' : 'grab'
    interactive.forEach((node) => {
      const rootGroup = node.userData.rootGroup
      if (rootGroup) {
        const active = hovered === node || focus === node
        const scale = active ? 1.38 : 1
        rootGroup.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.12)
      }
    })

    renderer.render(scene, camera)
    requestAnimationFrame(animate)
  }
  animate()

  return {
    destroy() {
      renderer.domElement.removeEventListener('pointerdown', onPointerDown)
      renderer.domElement.removeEventListener('pointermove', onPointerMove)
      renderer.domElement.removeEventListener('pointerup', onPointerUp)
      renderer.domElement.removeEventListener('wheel', onWheel)
      window.removeEventListener('resize', resize)
      root.innerHTML = ''
    }
  }
}
