import * as THREE from 'three'

const NODE_DEFS = [
  { label: 'About', target: 'about', position: [-2.55, 1.12, 0.28], color: 0x22d3ee },
  { label: 'Skills', target: 'skills', position: [2.55, 1.12, 0.28], color: 0x34d399 },
  { label: 'Experience', target: 'experience', position: [-3.15, 2.2, 0.1], color: 0xfacc15 },
  { label: 'Projects', target: 'projects', position: [3.15, 2.2, 0.1], color: 0xf472b6 },
  { label: 'GitHub', target: 'github', position: [-2.1, 3.28, -0.08], color: 0x8b5cf6 },
  { label: 'Contact', target: 'contact', position: [2.1, 3.28, -0.08], color: 0x67e8f9 }
]

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

function makeTextSprite(text, color = '#e6f6ff') {
  const texture = makeCanvasTexture((ctx, width, height) => {
    ctx.clearRect(0, 0, width, height)
    const gradient = ctx.createLinearGradient(0, 0, width, height)
    gradient.addColorStop(0, 'rgba(2, 6, 23, .92)')
    gradient.addColorStop(1, 'rgba(14, 165, 233, .52)')
    ctx.fillStyle = gradient
    ctx.strokeStyle = 'rgba(125, 211, 252, .85)'
    ctx.lineWidth = 4
    roundRect(ctx, 22, 42, width - 44, height - 84, 48)
    ctx.fill()
    ctx.stroke()
    ctx.shadowColor = 'rgba(34, 211, 238, .9)'
    ctx.shadowBlur = 18
    ctx.fillStyle = color
    ctx.font = '700 58px Inter, Arial, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, width / 2, height / 2)
  })
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false }))
  sprite.scale.set(1.35, 0.56, 1)
  return sprite
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

function makeTube(points, color, radius = 0.025, opacity = 0.9) {
  const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)))
  const geometry = new THREE.TubeGeometry(curve, 56, radius, 12, false)
  const material = new THREE.MeshBasicMaterial({ color, transparent: true, opacity })
  return new THREE.Mesh(geometry, material)
}

function makeGlowSphere(radius, color, opacity = 0.22) {
  return new THREE.Mesh(
    new THREE.SphereGeometry(radius, 32, 32),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false })
  )
}

function createEarth() {
  const group = new THREE.Group()
  group.position.set(0, -2.02, 0)

  const earthMaterial = new THREE.MeshStandardMaterial({
    color: 0x0ea5e9,
    roughness: 0.68,
    metalness: 0.08,
    emissive: 0x075985,
    emissiveIntensity: 0.42
  })
  const hemisphere = new THREE.Mesh(new THREE.SphereGeometry(2.22, 96, 48, 0, Math.PI * 2, 0, Math.PI * 0.66), earthMaterial)
  hemisphere.rotation.x = -0.18
  group.add(hemisphere)

  const wire = new THREE.Mesh(
    new THREE.SphereGeometry(2.245, 48, 24, 0, Math.PI * 2, 0, Math.PI * 0.66),
    new THREE.MeshBasicMaterial({ color: 0x7dd3fc, wireframe: true, transparent: true, opacity: 0.16 })
  )
  wire.rotation.x = -0.18
  group.add(wire)

  const horizon = new THREE.Mesh(
    new THREE.TorusGeometry(2.22, 0.018, 12, 128),
    new THREE.MeshBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.52 })
  )
  horizon.rotation.x = Math.PI / 2
  horizon.position.y = -0.92
  group.add(horizon)

  const cityMaterial = new THREE.MeshBasicMaterial({ color: 0xfacc15 })
  const cityPositions = [[0.78, 1.2, 1.72], [1.05, 0.78, 1.76], [0.62, 0.42, 1.96]]
  cityPositions.forEach(pos => {
    const dot = new THREE.Mesh(new THREE.SphereGeometry(0.045, 16, 16), cityMaterial)
    dot.position.set(...pos)
    group.add(dot)
    const glow = makeGlowSphere(0.16, 0xfacc15, 0.18)
    glow.position.copy(dot.position)
    group.add(glow)
  })

  const aura = makeGlowSphere(2.34, 0x22d3ee, 0.11)
  aura.scale.y = 0.72
  group.add(aura)
  return group
}

function createTechTree(interactiveNodes) {
  const group = new THREE.Group()
  group.position.set(0, -0.38, 0.18)

  const trunk = makeTube([[0, -1.4, 0], [0.04, -0.25, 0.05], [-0.05, 1.1, 0.05], [0, 2.25, 0]], 0x34d399, 0.06, 1)
  group.add(trunk)

  const coreGlow = makeGlowSphere(0.38, 0x22d3ee, 0.18)
  coreGlow.position.set(0, 0.1, 0)
  group.add(coreGlow)

  const branchMaterialColor = 0x22d3ee
  NODE_DEFS.forEach(node => {
    const [x, y, z] = node.position
    const midY = Math.max(0.3, y - 0.48)
    group.add(makeTube([[0, Math.min(y - 0.7, 1.86), 0], [x * 0.36, midY, z + 0.12], [x, y, z]], branchMaterialColor, 0.028, 0.88))

    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.14, 32, 32),
      new THREE.MeshStandardMaterial({ color: node.color, emissive: node.color, emissiveIntensity: 1.35, roughness: 0.28, metalness: 0.3 })
    )
    sphere.position.set(x, y, z)
    sphere.userData = { target: node.target, label: node.label }
    interactiveNodes.push(sphere)
    group.add(sphere)

    const halo = makeGlowSphere(0.34, node.color, 0.18)
    halo.position.copy(sphere.position)
    group.add(halo)

    const label = makeTextSprite(node.label)
    label.position.set(x, y + 0.3, z + 0.08)
    group.add(label)
  })

  const rootColor = 0x34d399
  const roots = [
    [[0, -1.45, 0], [-0.45, -1.72, 0.35], [-1.35, -2.12, 0.5], [-2.05, -2.45, 0.15]],
    [[0, -1.45, 0], [0.48, -1.74, 0.35], [1.38, -2.12, 0.5], [2.05, -2.45, 0.12]],
    [[0, -1.46, 0], [-0.25, -1.95, 0.8], [-0.88, -2.45, 1.35], [-1.4, -2.78, 1.15]],
    [[0, -1.46, 0], [0.25, -1.95, 0.8], [0.88, -2.45, 1.35], [1.4, -2.78, 1.15]],
    [[0, -1.48, 0], [-0.1, -1.95, -0.3], [-0.72, -2.4, -0.88], [-1.55, -2.68, -0.75]],
    [[0, -1.48, 0], [0.1, -1.95, -0.3], [0.72, -2.4, -0.88], [1.55, -2.68, -0.75]]
  ]
  roots.forEach((points, index) => {
    const root = makeTube(points, rootColor, index < 2 ? 0.035 : 0.022, 0.82)
    group.add(root)
  })

  const orbitMaterial = new THREE.MeshBasicMaterial({ color: 0x7dd3fc, transparent: true, opacity: 0.16 })
  ;[1.8, 2.35, 2.85].forEach((r, index) => {
    const orbit = new THREE.Mesh(new THREE.TorusGeometry(r, 0.006, 8, 144), orbitMaterial.clone())
    orbit.rotation.x = Math.PI * 0.62
    orbit.rotation.z = index * 0.72
    orbit.position.y = 2.0 + index * 0.18
    group.add(orbit)
  })

  return group
}

function createAIGuide() {
  const group = new THREE.Group()
  group.position.set(-3.65, -1.35, 1.12)
  group.rotation.y = 0.32

  const cyan = 0x22d3ee
  const white = 0xe6f6ff
  const suit = new THREE.MeshStandardMaterial({ color: 0x0f172a, emissive: 0x0ea5e9, emissiveIntensity: 0.28, roughness: 0.4, metalness: 0.45 })
  const glow = new THREE.MeshStandardMaterial({ color: cyan, emissive: cyan, emissiveIntensity: 1.4, roughness: 0.2, metalness: 0.2 })
  const face = new THREE.MeshStandardMaterial({ color: white, emissive: cyan, emissiveIntensity: 0.2, roughness: 0.5 })

  const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.48, 1.12, 36), suit)
  torso.position.y = 0.55
  group.add(torso)

  const chestCore = new THREE.Mesh(new THREE.OctahedronGeometry(0.16, 1), glow)
  chestCore.position.set(0, 0.78, 0.42)
  group.add(chestCore)

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.33, 32, 32), face)
  head.scale.y = 1.08
  head.position.y = 1.33
  group.add(head)

  const visor = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.09, 0.035), glow)
  visor.position.set(0, 1.36, 0.31)
  group.add(visor)

  const shoulderGeo = new THREE.SphereGeometry(0.16, 24, 24)
  const leftShoulder = new THREE.Mesh(shoulderGeo, suit)
  leftShoulder.position.set(-0.42, 0.98, 0)
  const rightShoulder = leftShoulder.clone()
  rightShoulder.position.x = 0.42
  group.add(leftShoulder, rightShoulder)

  const armGeo = new THREE.CylinderGeometry(0.055, 0.065, 0.78, 16)
  const leftArm = new THREE.Mesh(armGeo, suit)
  leftArm.position.set(-0.58, 0.58, 0.02)
  leftArm.rotation.z = -0.18
  const rightArm = new THREE.Mesh(armGeo, suit)
  rightArm.position.set(0.6, 0.68, 0.02)
  rightArm.rotation.z = -0.55
  group.add(leftArm, rightArm)

  const palm = new THREE.Mesh(new THREE.SphereGeometry(0.085, 20, 20), glow)
  palm.position.set(0.82, 0.38, 0.1)
  group.add(palm)

  const ringMat = new THREE.MeshBasicMaterial({ color: cyan, transparent: true, opacity: 0.5 })
  ;[0.72, 0.96, 1.2].forEach((r, i) => {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(r, 0.006, 8, 128), ringMat.clone())
    ring.rotation.x = Math.PI / 2
    ring.position.y = 0.48 + i * 0.15
    ring.userData.rotationSpeed = 0.004 + i * 0.002
    group.add(ring)
  })

  const particleGeo = new THREE.BufferGeometry()
  const count = 90
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i += 1) {
    const radius = 0.65 + Math.random() * 0.82
    const angle = Math.random() * Math.PI * 2
    const height = Math.random() * 2.05 - 0.2
    positions[i * 3] = Math.cos(angle) * radius
    positions[i * 3 + 1] = height
    positions[i * 3 + 2] = Math.sin(angle) * radius
  }
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  const particles = new THREE.Points(particleGeo, new THREE.PointsMaterial({ color: cyan, size: 0.025, transparent: true, opacity: 0.75, blending: THREE.AdditiveBlending }))
  particles.userData.isAIParticles = true
  group.add(particles)

  const label = makeTextSprite('AI GUIDE', '#a7f3d0')
  label.position.set(0.1, 1.95, 0)
  label.scale.set(1.05, 0.42, 1)
  group.add(label)

  return group
}

function createNetworkField() {
  const group = new THREE.Group()
  const pointCount = 260
  const positions = new Float32Array(pointCount * 3)
  for (let i = 0; i < pointCount; i += 1) {
    positions[i * 3] = (Math.random() - 0.5) * 12
    positions[i * 3 + 1] = (Math.random() - 0.5) * 8
    positions[i * 3 + 2] = (Math.random() - 0.5) * 8 - 1
  }
  const particleGeometry = new THREE.BufferGeometry()
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  const particles = new THREE.Points(particleGeometry, new THREE.PointsMaterial({ color: 0x7dd3fc, size: 0.025, transparent: true, opacity: 0.76, blending: THREE.AdditiveBlending }))
  group.add(particles)

  const linePositions = []
  for (let i = 0; i < pointCount; i += 1) {
    if (i % 3 !== 0) continue
    const ix = i * 3
    const j = (i + 17) % pointCount
    const jx = j * 3
    linePositions.push(positions[ix], positions[ix + 1], positions[ix + 2], positions[jx], positions[jx + 1], positions[jx + 2])
  }
  const lineGeometry = new THREE.BufferGeometry()
  lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3))
  const lines = new THREE.LineSegments(lineGeometry, new THREE.LineBasicMaterial({ color: 0x0ea5e9, transparent: true, opacity: 0.14 }))
  group.add(lines)
  group.userData.particles = particles
  return group
}

export function initThreeScene({ rootSelector = '#three-scene-root' } = {}) {
  const root = document.querySelector(rootSelector)
  if (!root) return null

  const scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2(0x020617, 0.045)

  const camera = new THREE.PerspectiveCamera(46, window.innerWidth / window.innerHeight, 0.1, 80)
  camera.position.set(0, 1.25, 8.4)

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8))
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.outputColorSpace = THREE.SRGBColorSpace
  root.appendChild(renderer.domElement)

  const ambient = new THREE.AmbientLight(0x9bdcff, 0.55)
  const key = new THREE.DirectionalLight(0xffffff, 1.25)
  key.position.set(3.8, 5.5, 4)
  const rim = new THREE.PointLight(0x22d3ee, 2.8, 12)
  rim.position.set(-3.6, 1.6, 2.2)
  scene.add(ambient, key, rim)

  const network = createNetworkField()
  scene.add(network)

  const world = new THREE.Group()
  world.position.set(0.75, -0.1, 0)
  scene.add(world)

  const interactiveNodes = []
  const earth = createEarth()
  const tree = createTechTree(interactiveNodes)
  const guide = createAIGuide()
  world.add(earth, tree, guide)

  const grid = new THREE.GridHelper(16, 48, 0x0ea5e9, 0x0f3b5f)
  grid.position.y = -3.22
  grid.material.transparent = true
  grid.material.opacity = 0.26
  world.add(grid)

  const raycaster = new THREE.Raycaster()
  const pointer = new THREE.Vector2(99, 99)
  let mouseX = 0
  let mouseY = 0
  let hovered = null

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
    document.body.classList.add('warp')
    window.setTimeout(() => document.body.classList.remove('warp'), 760)
    document.getElementById(hit.object.userData.target)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
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
  const sceneTargets = {
    home: { x: -0.06, y: -0.12, z: 0, scale: 1, px: 0.75 },
    about: { x: 0.05, y: 0.08, z: 0, scale: 1.02, px: 1.2 },
    skills: { x: 0.08, y: 0.28, z: 0.02, scale: 1.06, px: 0.45 },
    experience: { x: 0.16, y: -0.26, z: 0, scale: 0.98, px: 1.12 },
    projects: { x: 0.04, y: 0.34, z: 0.01, scale: 1.08, px: 0.38 },
    github: { x: -0.04, y: -0.08, z: 0, scale: 1.02, px: 1.0 },
    contact: { x: 0.12, y: -0.18, z: 0, scale: 0.96, px: 0.64 }
  }

  function animate() {
    const elapsed = clock.getElapsedTime()
    const sceneName = document.body.dataset.scene || 'home'
    const target = sceneTargets[sceneName] || sceneTargets.home

    world.rotation.x += (target.x + mouseY * 0.035 - world.rotation.x) * 0.035
    world.rotation.y += (target.y + mouseX * 0.05 - world.rotation.y) * 0.035
    world.rotation.z += (target.z - world.rotation.z) * 0.035
    world.scale.lerp(new THREE.Vector3(target.scale, target.scale, target.scale), 0.035)
    world.position.x += (target.px - world.position.x) * 0.03

    earth.rotation.y = elapsed * 0.12
    tree.children.forEach((child) => {
      if (child.geometry?.type === 'TorusGeometry') child.rotation.z += 0.0015
      if (child.userData?.target) {
        const isHovered = hovered === child
        child.scale.setScalar(isHovered ? 1.35 : 1 + Math.sin(elapsed * 2.4 + child.position.x) * 0.08)
      }
    })
    guide.position.y = -1.35 + Math.sin(elapsed * 1.4) * 0.08
    guide.children.forEach((child) => {
      if (child.userData?.rotationSpeed) child.rotation.z += child.userData.rotationSpeed
      if (child.userData?.isAIParticles) child.rotation.y += 0.006
    })
    network.rotation.y = elapsed * 0.018
    network.rotation.x = Math.sin(elapsed * 0.12) * 0.04

    raycaster.setFromCamera(pointer, camera)
    const hit = raycaster.intersectObjects(interactiveNodes, false)[0]
    hovered = hit?.object || null
    renderer.domElement.style.cursor = hovered ? 'pointer' : 'default'

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
