import * as THREE from 'three'
import { skills, projects, experiences, profile } from './config.js'

const CORE_MODULES = [
  { label: 'About', target: 'about', position: [-2.6, 1.45, 0.8], color: 0x7dd3fc, size: 0.18 },
  { label: 'Skills', target: 'skills', position: [2.35, 1.28, 0.55], color: 0x34d399, size: 0.18 },
  { label: 'Projects', target: 'projects', position: [2.9, -0.8, 0.25], color: 0xf472b6, size: 0.2 },
  { label: 'Experience', target: 'experience', position: [-3.15, -0.6, 0.15], color: 0xfacc15, size: 0.2 },
  { label: 'GitHub', target: 'github', position: [-1.0, -2.05, 0.6], color: 0xa78bfa, size: 0.16 },
  { label: 'Contact', target: 'contact', position: [1.35, -2.05, 0.75], color: 0x67e8f9, size: 0.16 }
]

function createStarTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 128
  canvas.height = 128
  const ctx = canvas.getContext('2d')
  const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 60)
  gradient.addColorStop(0, 'rgba(255,255,255,1)')
  gradient.addColorStop(0.12, 'rgba(236,253,245,.95)')
  gradient.addColorStop(0.35, 'rgba(125,211,252,.5)')
  gradient.addColorStop(1, 'rgba(125,211,252,0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 128, 128)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

function createLabelTexture(text, color = '#e6f6ff') {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 160
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, 512, 160)
  const gradient = ctx.createLinearGradient(0, 0, 512, 0)
  gradient.addColorStop(0, 'rgba(2,6,23,0)')
  gradient.addColorStop(0.18, 'rgba(2,6,23,.62)')
  gradient.addColorStop(0.82, 'rgba(14,165,233,.24)')
  gradient.addColorStop(1, 'rgba(2,6,23,0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 38, 512, 84)
  ctx.strokeStyle = 'rgba(125,211,252,.35)'
  ctx.strokeRect(38, 40, 436, 80)
  ctx.shadowColor = 'rgba(34,211,238,.9)'
  ctx.shadowBlur = 14
  ctx.fillStyle = color
  ctx.font = '800 44px Inter, Arial, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, 256, 82)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

function makeLabel(text, color) {
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: createLabelTexture(text, color), transparent: true, depthWrite: false }))
  sprite.scale.set(1.18, 0.36, 1)
  return sprite
}

function createBackgroundStars() {
  const count = 2400
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const color = new THREE.Color()
  for (let i = 0; i < count; i += 1) {
    const r = 5 + Math.random() * 15
    const theta = Math.random() * Math.PI * 2
    const y = (Math.random() - 0.5) * 10
    positions[i * 3] = Math.cos(theta) * r
    positions[i * 3 + 1] = y
    positions[i * 3 + 2] = Math.sin(theta) * r - 5
    color.setHSL(0.55 + Math.random() * 0.16, 0.55, 0.68 + Math.random() * 0.24)
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  const material = new THREE.PointsMaterial({ size: 0.018, vertexColors: true, transparent: true, opacity: 0.78, depthWrite: false, blending: THREE.AdditiveBlending })
  const stars = new THREE.Points(geometry, material)
  stars.userData.kind = 'backgroundStars'
  return stars
}

function createGalaxyDisk() {
  const count = 3800
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const color = new THREE.Color()
  for (let i = 0; i < count; i += 1) {
    const arm = i % 4
    const radius = Math.pow(Math.random(), 0.65) * 4.8
    const angle = radius * 1.85 + arm * Math.PI * 0.5 + (Math.random() - 0.5) * 0.42
    const spread = (Math.random() - 0.5) * 0.42
    positions[i * 3] = Math.cos(angle) * radius + Math.cos(angle + Math.PI / 2) * spread
    positions[i * 3 + 1] = (Math.random() - 0.5) * 0.22
    positions[i * 3 + 2] = Math.sin(angle) * radius + Math.sin(angle + Math.PI / 2) * spread
    color.setHSL(0.58 + Math.random() * 0.18, 0.75, 0.56 + Math.random() * 0.28)
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  const material = new THREE.PointsMaterial({ size: 0.035, vertexColors: true, transparent: true, opacity: 0.85, depthWrite: false, blending: THREE.AdditiveBlending })
  const galaxy = new THREE.Points(geometry, material)
  galaxy.rotation.x = -0.72
  galaxy.userData.kind = 'galaxyDisk'
  return galaxy
}

function createSkillAndProjectStars() {
  const skillStars = skills.slice(0, 14).map((skill, index) => {
    const angle = (index / 14) * Math.PI * 2
    const radius = 3.8 + (index % 3) * 0.42
    return {
      label: skill.name,
      target: 'skills',
      position: [Math.cos(angle) * radius, Math.sin(angle * 1.15) * 0.9 + 0.15, Math.sin(angle) * radius * 0.6 - 0.2],
      color: 0x34d399,
      size: 0.085,
      sub: skill.group
    }
  })
  const projectStars = projects.slice(0, 6).map((project, index) => {
    const angle = (index / 6) * Math.PI * 2 + 0.38
    const radius = 5.0
    return {
      label: project.name.replace(/｜.*/, '').slice(0, 12),
      target: 'projects',
      position: [Math.cos(angle) * radius, Math.sin(angle * 0.8) * 1.0 - 0.2, Math.sin(angle) * radius * 0.58 - 0.45],
      color: 0xf472b6,
      size: 0.105,
      sub: project.type
    }
  })
  const expStars = experiences.slice(0, 5).map((exp, index) => {
    const x = -4.8 + index * 2.35
    return {
      label: exp.company.replace(/（.*?）/g, '').slice(0, 10),
      target: 'experience',
      position: [x, -2.85 + Math.sin(index) * 0.25, -0.15 + index * 0.12],
      color: 0xfacc15,
      size: 0.09,
      sub: exp.period
    }
  })
  return [...CORE_MODULES, ...skillStars, ...projectStars, ...expStars]
}

function createStarNode(node, texture, interactive) {
  const group = new THREE.Group()
  group.position.set(...node.position)
  group.userData = { target: node.target, label: node.label }

  const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, color: node.color, transparent: true, opacity: 0.88, blending: THREE.AdditiveBlending, depthWrite: false }))
  glow.scale.setScalar(node.size * 8)
  group.add(glow)

  const core = new THREE.Mesh(new THREE.SphereGeometry(node.size, 24, 24), new THREE.MeshBasicMaterial({ color: node.color, transparent: true, opacity: 0.92, blending: THREE.AdditiveBlending }))
  core.userData = { target: node.target, label: node.label, rootGroup: group }
  group.add(core)

  const ring = new THREE.Mesh(new THREE.TorusGeometry(node.size * 2.1, node.size * 0.035, 8, 84), new THREE.MeshBasicMaterial({ color: node.color, transparent: true, opacity: 0.42, blending: THREE.AdditiveBlending }))
  ring.rotation.x = Math.PI / 2
  ring.userData.spin = 0.004 + Math.random() * 0.004
  group.add(ring)

  if (node.size > 0.1) {
    const label = makeLabel(node.label, '#e6f6ff')
    label.position.set(0, node.size * 4.3, 0.08)
    group.add(label)
  }

  const hit = new THREE.Mesh(new THREE.SphereGeometry(node.size * 3.4, 16, 16), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }))
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
  const material = new THREE.LineBasicMaterial({ color: 0x7dd3fc, transparent: true, opacity: 0.16, blending: THREE.AdditiveBlending })
  return new THREE.LineSegments(geometry, material)
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
  scene.fog = new THREE.FogExp2(0x05060a, 0.052)

  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100)
  camera.position.set(0, 2.1, 9.6)

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8))
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.outputColorSpace = THREE.SRGBColorSpace
  root.appendChild(renderer.domElement)

  scene.add(new THREE.AmbientLight(0x9bdcff, 0.48))
  const blueLight = new THREE.PointLight(0x7dd3fc, 2.8, 20)
  blueLight.position.set(-3.6, 2.6, 4)
  const pinkLight = new THREE.PointLight(0xf472b6, 1.8, 18)
  pinkLight.position.set(4.4, -0.2, 3)
  scene.add(blueLight, pinkLight)

  const universe = new THREE.Group()
  scene.add(universe)
  const backgroundStars = createBackgroundStars()
  const galaxyDisk = createGalaxyDisk()
  universe.add(backgroundStars, galaxyDisk)

  const starTexture = createStarTexture()
  const interactive = []
  const starNodes = createSkillAndProjectStars()
  const constellationGroup = new THREE.Group()
  starNodes.forEach(node => constellationGroup.add(createStarNode(node, starTexture, interactive)))
  constellationGroup.add(createConstellationLines(starNodes))
  constellationGroup.rotation.x = -0.18
  constellationGroup.rotation.z = 0.06
  universe.add(constellationGroup)

  const raycaster = new THREE.Raycaster()
  const pointer = new THREE.Vector2(99, 99)
  let mouseX = 0
  let mouseY = 0
  let hovered = null
  let focus = null
  let focusStart = 0

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
    const hit = raycaster.intersectObjects(interactive, false)[0]
    if (!hit?.object?.userData?.target) return
    focus = hit.object
    focusStart = performance.now()
    triggerGalaxyOpen(focus.userData.label)
    window.setTimeout(() => {
      window.dispatchEvent(new CustomEvent('portfolio:open-module', { detail: { target: focus.userData.target, label: focus.userData.label } }))
    }, 520)
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
  const baseCamera = new THREE.Vector3(0, 2.1, 9.6)
  const targetCamera = baseCamera.clone()

  function animate() {
    const elapsed = clock.elapsedTime
    universe.rotation.y = elapsed * 0.018 + mouseX * 0.08
    universe.rotation.x = mouseY * 0.035
    galaxyDisk.rotation.z = elapsed * 0.035
    backgroundStars.rotation.y = -elapsed * 0.006

    constellationGroup.children.forEach((child, index) => {
      if (child.userData?.target) {
        child.position.y += Math.sin(elapsed * 1.25 + index) * 0.0009
      }
      child.children?.forEach((sub) => {
        if (sub.userData?.spin) sub.rotation.z += sub.userData.spin
      })
    })

    raycaster.setFromCamera(pointer, camera)
    const hit = raycaster.intersectObjects(interactive, false)[0]
    hovered = hit?.object || null
    renderer.domElement.style.cursor = hovered ? 'pointer' : 'default'
    interactive.forEach((node) => {
      const rootGroup = node.userData.rootGroup
      if (rootGroup) {
        const active = hovered === node || focus === node
        const scale = active ? 1.34 : 1
        rootGroup.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.12)
      }
    })

    if (focus) {
      const focusWorld = new THREE.Vector3()
      focus.getWorldPosition(focusWorld)
      targetCamera.set(focusWorld.x * 0.25, 1.8 + focusWorld.y * 0.12, 7.2)
      const age = (performance.now() - focusStart) / 1000
      if (age > 1.8) focus = null
    } else {
      targetCamera.copy(baseCamera)
      targetCamera.x += mouseX * 0.35
      targetCamera.y += mouseY * 0.18
    }
    camera.position.lerp(targetCamera, 0.045)
    camera.lookAt(0, 0, 0)

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
