import * as THREE from 'three'
import { skills, projects, experiences } from './config.js'

const CORE_MODULES = [
  { label: 'About', target: 'about', position: [-2.8, 1.55, 1.2], color: 0x7dd3fc, size: 0.18 },
  { label: 'Skills', target: 'skills', position: [2.55, 1.38, 0.8], color: 0x34d399, size: 0.18 },
  { label: 'Projects', target: 'projects', position: [3.25, -0.85, 0.35], color: 0xf472b6, size: 0.2 },
  { label: 'Experience', target: 'experience', position: [-3.4, -0.65, 0.25], color: 0xfacc15, size: 0.2 },
  { label: 'GitHub', target: 'github', position: [-1.15, -2.2, 0.85], color: 0xa78bfa, size: 0.16 },
  { label: 'Contact', target: 'contact', position: [1.55, -2.18, 1.05], color: 0x67e8f9, size: 0.16 }
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
    { count: 1800, radiusMin: 18, radiusMax: 46, size: 0.018, opacity: 0.55 },
    { count: 1000, radiusMin: 8, radiusMax: 26, size: 0.026, opacity: 0.7 },
    { count: 260, radiusMin: 10, radiusMax: 32, size: 0.055, opacity: 0.78 }
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
      positions[i * 3 + 1] = Math.cos(phi) * radius * 0.72
      positions[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * radius - 7
      color.setHSL(0.55 + Math.random() * 0.18, 0.45 + Math.random() * 0.42, 0.58 + Math.random() * 0.32)
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b
    }
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    const material = new THREE.PointsMaterial({ size: layer.size, vertexColors: true, transparent: true, opacity: layer.opacity, depthWrite: false, blending: THREE.AdditiveBlending })
    const stars = new THREE.Points(geometry, material)
    stars.userData.parallax = 0.002 + layerIndex * 0.001
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
  for (let i = 0; i < 34; i += 1) {
    const texture = textures[i % textures.length]
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: 0.13 + Math.random() * 0.13, blending: THREE.AdditiveBlending, depthWrite: false })
    const sprite = new THREE.Sprite(material)
    const radius = 7 + Math.random() * 22
    const angle = Math.random() * Math.PI * 2
    sprite.position.set(Math.cos(angle) * radius, (Math.random() - 0.5) * 9, Math.sin(angle) * radius - 12)
    const scale = 5 + Math.random() * 12
    sprite.scale.set(scale * (1.2 + Math.random()), scale, 1)
    sprite.userData.drift = 0.001 + Math.random() * 0.002
    group.add(sprite)
  }
  return group
}

function createGalaxyDisk() {
  const group = new THREE.Group()
  const configs = [
    { count: 5200, size: 0.032, opacity: 0.82, spread: 0.54 },
    { count: 2200, size: 0.018, opacity: 0.52, spread: 1.05 },
    { count: 900, size: 0.052, opacity: 0.65, spread: 0.36 }
  ]
  configs.forEach((config) => {
    const positions = new Float32Array(config.count * 3)
    const colors = new Float32Array(config.count * 3)
    const color = new THREE.Color()
    for (let i = 0; i < config.count; i += 1) {
      const arm = i % 5
      const radius = Math.pow(Math.random(), 0.58) * 5.4
      const angle = radius * 1.95 + arm * Math.PI * 0.4 + (Math.random() - 0.5) * config.spread
      const lane = (Math.random() - 0.5) * config.spread * 0.6
      positions[i * 3] = Math.cos(angle) * radius + Math.cos(angle + Math.PI / 2) * lane
      positions[i * 3 + 1] = (Math.random() - 0.5) * (0.16 + radius * 0.035)
      positions[i * 3 + 2] = Math.sin(angle) * radius + Math.sin(angle + Math.PI / 2) * lane
      const hue = radius < 1.2 ? 0.13 + Math.random() * 0.08 : 0.56 + Math.random() * 0.22
      color.setHSL(hue, 0.7, 0.52 + Math.random() * 0.34)
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b
    }
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    const material = new THREE.PointsMaterial({ size: config.size, vertexColors: true, transparent: true, opacity: config.opacity, depthWrite: false, blending: THREE.AdditiveBlending })
    group.add(new THREE.Points(geometry, material))
  })
  const coreTexture = createRadialTexture([
    [0, 'rgba(255,255,255,.92)'],
    [0.16, 'rgba(250,204,21,.55)'],
    [0.42, 'rgba(125,211,252,.24)'],
    [1, 'rgba(0,0,0,0)']
  ], 256)
  const core = new THREE.Sprite(new THREE.SpriteMaterial({ map: coreTexture, transparent: true, opacity: 0.75, blending: THREE.AdditiveBlending, depthWrite: false }))
  core.scale.set(3.4, 3.4, 1)
  group.add(core)
  group.rotation.x = -0.7
  return group
}

function createPortfolioStars() {
  const skillStars = skills.slice(0, 14).map((skill, index) => {
    const angle = (index / 14) * Math.PI * 2
    const radius = 3.9 + (index % 3) * 0.5
    return { label: skill.name, target: 'skills', position: [Math.cos(angle) * radius, Math.sin(angle * 1.1) * 0.95 + 0.2, Math.sin(angle) * radius * 0.75 - 0.15], color: 0x34d399, size: 0.085, sub: skill.group }
  })
  const projectStars = projects.slice(0, 6).map((project, index) => {
    const angle = (index / 6) * Math.PI * 2 + 0.38
    const radius = 5.15
    return { label: project.name.replace(/｜.*/, '').slice(0, 12), target: 'projects', position: [Math.cos(angle) * radius, Math.sin(angle * 0.8) * 1.1 - 0.15, Math.sin(angle) * radius * 0.72 - 0.45], color: 0xf472b6, size: 0.105, sub: project.type }
  })
  const expStars = experiences.slice(0, 5).map((exp, index) => {
    const x = -4.8 + index * 2.35
    return { label: exp.company.replace(/（.*?）/g, '').slice(0, 10), target: 'experience', position: [x, -2.85 + Math.sin(index) * 0.25, -0.1 + index * 0.26], color: 0xfacc15, size: 0.09, sub: exp.period }
  })
  return [...CORE_MODULES, ...skillStars, ...projectStars, ...expStars]
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
  CORE_MODULES.forEach((module, index) => {
    const next = CORE_MODULES[(index + 1) % CORE_MODULES.length]
    points.push(new THREE.Vector3(...module.position), new THREE.Vector3(...next.position))
  })
  nodes.filter(n => n.target === 'skills').slice(0, 12).forEach((node, index, arr) => {
    const next = arr[(index + 1) % arr.length]
    points.push(new THREE.Vector3(...node.position), new THREE.Vector3(...next.position))
  })
  nodes.filter(n => n.target === 'projects').slice(0, 6).forEach((node) => {
    points.push(new THREE.Vector3(...node.position), new THREE.Vector3(...CORE_MODULES[2].position))
  })
  const geometry = new THREE.BufferGeometry().setFromPoints(points)
  return new THREE.LineSegments(geometry, new THREE.LineBasicMaterial({ color: 0x7dd3fc, transparent: true, opacity: 0.16, blending: THREE.AdditiveBlending }))
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
  const galaxyDisk = createGalaxyDisk()
  universe.add(nebulaClouds, backgroundStars, galaxyDisk)

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
      const focusWorld = new THREE.Vector3()
      focus.getWorldPosition(focusWorld)
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

    galaxyDisk.rotation.z = elapsed * 0.035
    backgroundStars.children.forEach((layer, index) => { layer.rotation.y = -elapsed * layer.userData.parallax * 8 + controls.yaw * (0.05 + index * 0.02) })
    nebulaClouds.children.forEach((cloud, index) => {
      cloud.rotation.z = elapsed * cloud.userData.drift + index * 0.1
      cloud.material.opacity = 0.12 + Math.sin(elapsed * 0.3 + index) * 0.035
    })

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
