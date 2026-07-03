import * as THREE from 'three'

const NODE_DEFS = [
  { label: 'About', target: 'about', position: [0, 2.28, 0.68], color: 0x22d3ee },
  { label: 'Skills', target: 'skills', position: [0, 1.2, 0.82], color: 0x34d399 },
  { label: 'Experience', target: 'experience', position: [-1.36, 1.1, 0.48], color: 0xfacc15 },
  { label: 'Projects', target: 'projects', position: [1.36, 1.1, 0.48], color: 0xf472b6 },
  { label: 'GitHub', target: 'github', position: [-0.58, 0.18, 0.66], color: 0x8b5cf6 },
  { label: 'Contact', target: 'contact', position: [1.48, 0.55, 0.58], color: 0x67e8f9 }
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

function makeTextSprite(text, color = '#e6f6ff', width = 512, height = 220) {
  const texture = makeCanvasTexture((ctx, w, h) => {
    ctx.clearRect(0, 0, w, h)
    const gradient = ctx.createLinearGradient(0, 0, w, h)
    gradient.addColorStop(0, 'rgba(2, 6, 23, .94)')
    gradient.addColorStop(1, 'rgba(14, 165, 233, .55)')
    ctx.fillStyle = gradient
    ctx.strokeStyle = 'rgba(125, 211, 252, .88)'
    ctx.lineWidth = 4
    roundRect(ctx, 22, 42, w - 44, h - 84, 44)
    ctx.fill()
    ctx.stroke()
    ctx.shadowColor = 'rgba(34, 211, 238, .92)'
    ctx.shadowBlur = 18
    ctx.fillStyle = color
    ctx.font = '800 54px Inter, Arial, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, w / 2, h / 2)
  }, width, height)
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false }))
  sprite.scale.set(1.18, 0.5, 1)
  return sprite
}

function makeTube(points, color, radius = 0.025, opacity = 0.9) {
  const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)))
  const geometry = new THREE.TubeGeometry(curve, 72, radius, 12, false)
  const material = new THREE.MeshBasicMaterial({ color, transparent: true, opacity, blending: THREE.AdditiveBlending })
  return new THREE.Mesh(geometry, material)
}

function makeGlowSphere(radius, color, opacity = 0.22) {
  return new THREE.Mesh(
    new THREE.SphereGeometry(radius, 32, 32),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false })
  )
}

function createRobot(interactiveNodes) {
  const group = new THREE.Group()
  group.name = 'TechRobotNavigator'
  group.position.set(0, -0.85, 0)

  const armor = new THREE.MeshStandardMaterial({
    color: 0x101827,
    roughness: 0.36,
    metalness: 0.78,
    emissive: 0x082f49,
    emissiveIntensity: 0.22
  })
  const armorDark = new THREE.MeshStandardMaterial({
    color: 0x020617,
    roughness: 0.48,
    metalness: 0.82,
    emissive: 0x0f172a,
    emissiveIntensity: 0.18
  })
  const cyan = new THREE.MeshStandardMaterial({
    color: 0x22d3ee,
    roughness: 0.12,
    metalness: 0.35,
    emissive: 0x22d3ee,
    emissiveIntensity: 1.35
  })
  const white = new THREE.MeshStandardMaterial({
    color: 0xe6f6ff,
    roughness: 0.34,
    metalness: 0.2,
    emissive: 0x67e8f9,
    emissiveIntensity: 0.16
  })

  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.95, 1.26, 0.48), armor)
  torso.position.y = 1.08
  group.add(torso)

  const chestPlate = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.56, 0.06), armorDark)
  chestPlate.position.set(0, 1.2, 0.285)
  group.add(chestPlate)

  const core = new THREE.Mesh(new THREE.OctahedronGeometry(0.18, 1), cyan)
  core.position.set(0, 1.2, 0.36)
  group.add(core)
  const coreAura = makeGlowSphere(0.46, 0x22d3ee, 0.14)
  coreAura.position.copy(core.position)
  group.add(coreAura)

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.18, 0.18, 24), armorDark)
  neck.position.y = 1.83
  group.add(neck)

  const head = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.52, 0.54), white)
  head.position.y = 2.18
  group.add(head)

  const visor = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.11, 0.04), cyan)
  visor.position.set(0, 2.2, 0.296)
  group.add(visor)

  const antenna = makeTube([[0.18, 2.42, 0], [0.28, 2.65, 0.04], [0.42, 2.76, 0.08]], 0x22d3ee, 0.011, 0.9)
  group.add(antenna)
  const antennaTip = new THREE.Mesh(new THREE.SphereGeometry(0.045, 16, 16), cyan)
  antennaTip.position.set(0.42, 2.76, 0.08)
  group.add(antennaTip)

  const shoulderGeo = new THREE.SphereGeometry(0.2, 32, 32)
  const leftShoulder = new THREE.Mesh(shoulderGeo, armor)
  leftShoulder.position.set(-0.68, 1.58, 0)
  const rightShoulder = leftShoulder.clone()
  rightShoulder.position.x = 0.68
  group.add(leftShoulder, rightShoulder)

  const armGeo = new THREE.CylinderGeometry(0.08, 0.1, 0.86, 20)
  const leftArm = new THREE.Mesh(armGeo, armor)
  leftArm.position.set(-1.0, 1.15, 0.04)
  leftArm.rotation.z = -0.42
  const rightArm = new THREE.Mesh(armGeo, armor)
  rightArm.position.set(1.0, 1.15, 0.04)
  rightArm.rotation.z = 0.42
  group.add(leftArm, rightArm)

  const forearmGeo = new THREE.CylinderGeometry(0.075, 0.09, 0.76, 20)
  const leftForearm = new THREE.Mesh(forearmGeo, armorDark)
  leftForearm.position.set(-1.28, 0.68, 0.12)
  leftForearm.rotation.z = -0.2
  const rightForearm = new THREE.Mesh(forearmGeo, armorDark)
  rightForearm.position.set(1.28, 0.68, 0.12)
  rightForearm.rotation.z = 0.2
  group.add(leftForearm, rightForearm)

  const handGeo = new THREE.SphereGeometry(0.13, 24, 24)
  const leftHand = new THREE.Mesh(handGeo, cyan)
  leftHand.position.set(-1.36, 0.3, 0.22)
  const rightHand = new THREE.Mesh(handGeo, cyan)
  rightHand.position.set(1.48, 0.55, 0.3)
  group.add(leftHand, rightHand)

  const waist = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.48, 0.24, 32), armorDark)
  waist.position.y = 0.34
  group.add(waist)

  const legGeo = new THREE.CylinderGeometry(0.12, 0.15, 0.92, 24)
  const leftLeg = new THREE.Mesh(legGeo, armor)
  leftLeg.position.set(-0.25, -0.22, 0)
  const rightLeg = new THREE.Mesh(legGeo, armor)
  rightLeg.position.set(0.25, -0.22, 0)
  group.add(leftLeg, rightLeg)

  const footGeo = new THREE.BoxGeometry(0.36, 0.16, 0.58)
  const leftFoot = new THREE.Mesh(footGeo, armorDark)
  leftFoot.position.set(-0.25, -0.75, 0.16)
  const rightFoot = new THREE.Mesh(footGeo, armorDark)
  rightFoot.position.set(0.25, -0.75, 0.16)
  group.add(leftFoot, rightFoot)

  const connectionColor = 0x22d3ee
  NODE_DEFS.forEach((node) => {
    const nodePos = new THREE.Vector3(...node.position)
    group.add(makeTube([[0, 1.2, 0.38], [nodePos.x * 0.45, (nodePos.y + 1.2) / 2, nodePos.z + 0.16], node.position], connectionColor, 0.012, 0.66))

    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.105, 32, 32),
      new THREE.MeshStandardMaterial({ color: node.color, emissive: node.color, emissiveIntensity: 1.8, roughness: 0.2, metalness: 0.35 })
    )
    sphere.position.copy(nodePos)
    sphere.userData = { target: node.target, label: node.label, baseScale: 1 }
    interactiveNodes.push(sphere)
    group.add(sphere)

    const halo = makeGlowSphere(0.3, node.color, 0.18)
    halo.position.copy(nodePos)
    group.add(halo)

    const label = makeTextSprite(node.label)
    label.position.set(node.position[0], node.position[1] + 0.28, node.position[2] + 0.18)
    label.userData.followNode = sphere
    group.add(label)
  })

  const orbitMat = new THREE.MeshBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.26 })
  ;[0.92, 1.18, 1.46].forEach((r, index) => {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(r, 0.005, 8, 128), orbitMat.clone())
    ring.rotation.x = Math.PI / 2
    ring.position.y = 1.1 + index * 0.22
    ring.userData.rotationSpeed = 0.004 + index * 0.0015
    group.add(ring)
  })

  const particleGeo = new THREE.BufferGeometry()
  const particleCount = 140
  const positions = new Float32Array(particleCount * 3)
  for (let i = 0; i < particleCount; i += 1) {
    const radius = 0.85 + Math.random() * 1.25
    const angle = Math.random() * Math.PI * 2
    positions[i * 3] = Math.cos(angle) * radius
    positions[i * 3 + 1] = Math.random() * 3.35 - 0.72
    positions[i * 3 + 2] = Math.sin(angle) * radius * 0.74 + 0.05
  }
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  const particles = new THREE.Points(particleGeo, new THREE.PointsMaterial({ color: 0x7dd3fc, size: 0.022, transparent: true, opacity: 0.78, blending: THREE.AdditiveBlending }))
  particles.userData.isRobotParticles = true
  group.add(particles)

  return group
}

function createPlatform() {
  const group = new THREE.Group()
  const ringMat = new THREE.MeshBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.32, blending: THREE.AdditiveBlending })
  ;[1.45, 2.2, 3.0, 3.8].forEach((r, index) => {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(r, 0.006, 8, 160), ringMat.clone())
    ring.rotation.x = Math.PI / 2
    ring.position.y = -1.68
    ring.userData.rotationSpeed = index % 2 === 0 ? 0.002 : -0.0016
    group.add(ring)
  })
  const grid = new THREE.GridHelper(14, 56, 0x0ea5e9, 0x0f3b5f)
  grid.position.y = -1.7
  grid.material.transparent = true
  grid.material.opacity = 0.24
  group.add(grid)
  return group
}

function createDigitalWorld() {
  const group = new THREE.Group()
  const pointCount = 330
  const positions = new Float32Array(pointCount * 3)
  for (let i = 0; i < pointCount; i += 1) {
    positions[i * 3] = (Math.random() - 0.5) * 13
    positions[i * 3 + 1] = (Math.random() - 0.5) * 8
    positions[i * 3 + 2] = (Math.random() - 0.5) * 9 - 0.8
  }
  const particleGeometry = new THREE.BufferGeometry()
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  const particles = new THREE.Points(particleGeometry, new THREE.PointsMaterial({ color: 0x7dd3fc, size: 0.022, transparent: true, opacity: 0.76, blending: THREE.AdditiveBlending }))
  group.add(particles)

  const linePositions = []
  for (let i = 0; i < pointCount; i += 3) {
    const a = i * 3
    const j = (i + 19) % pointCount
    const b = j * 3
    linePositions.push(positions[a], positions[a + 1], positions[a + 2], positions[b], positions[b + 1], positions[b + 2])
  }
  const lineGeometry = new THREE.BufferGeometry()
  lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3))
  const lines = new THREE.LineSegments(lineGeometry, new THREE.LineBasicMaterial({ color: 0x0ea5e9, transparent: true, opacity: 0.14 }))
  group.add(lines)

  const panelTexts = ['OPEN API', 'JAVA 8', 'MQ', 'REDIS', 'MYSQL', 'TRACE', 'GATEWAY', 'FINTECH']
  panelTexts.forEach((text, index) => {
    const label = makeTextSprite(text, '#67e8f9', 512, 180)
    const angle = (index / panelTexts.length) * Math.PI * 2
    label.position.set(Math.cos(angle) * 4.9, 0.4 + (index % 3) * 0.75, Math.sin(angle) * 2.2 - 1.9)
    label.scale.set(1.05, 0.34, 1)
    label.material.opacity = 0.58
    group.add(label)
  })

  group.userData.particles = particles
  group.userData.lines = lines
  return group
}

function triggerDomEffect(label) {
  const old = document.querySelector('.module-jump-effect')
  old?.remove()
  const overlay = document.createElement('div')
  overlay.className = 'module-jump-effect'
  overlay.innerHTML = `<div class="jump-ring"></div><div class="jump-copy"><span>ACCESSING MODULE</span><strong>${label}</strong></div>`
  document.body.appendChild(overlay)
  window.setTimeout(() => overlay.remove(), 1100)
  const status = document.getElementById('welcome-text')
  if (status) status.textContent = `Accessing ${label} module...`
}

export function initThreeScene({ rootSelector = '#three-scene-root' } = {}) {
  const root = document.querySelector(rootSelector)
  if (!root) return null

  const scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2(0x020617, 0.045)

  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 80)
  camera.position.set(0, 1.1, 7.8)

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8))
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.outputColorSpace = THREE.SRGBColorSpace
  root.appendChild(renderer.domElement)

  const ambient = new THREE.AmbientLight(0x9bdcff, 0.48)
  const key = new THREE.DirectionalLight(0xffffff, 1.32)
  key.position.set(3.8, 5.5, 4)
  const rimLeft = new THREE.PointLight(0x22d3ee, 3.2, 12)
  rimLeft.position.set(-4.2, 2.0, 2.4)
  const rimRight = new THREE.PointLight(0x34d399, 2.2, 12)
  rimRight.position.set(4.2, 1.5, 2.2)
  scene.add(ambient, key, rimLeft, rimRight)

  const digitalWorld = createDigitalWorld()
  scene.add(digitalWorld)

  const world = new THREE.Group()
  world.position.set(0.82, -0.15, 0)
  scene.add(world)

  const interactiveNodes = []
  const robot = createRobot(interactiveNodes)
  const platform = createPlatform()
  world.add(robot, platform)

  const raycaster = new THREE.Raycaster()
  const pointer = new THREE.Vector2(99, 99)
  let mouseX = 0
  let mouseY = 0
  let hovered = null
  const bursts = []

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

  function makeBurst(position, color) {
    const group = new THREE.Group()
    group.position.copy(position)
    const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending })
    ;[0.28, 0.46, 0.68].forEach((radius, index) => {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.012, 8, 100), mat.clone())
      ring.rotation.x = Math.PI / 2 + index * 0.36
      ring.rotation.y = index * 0.42
      group.add(ring)
    })
    group.userData.life = 1
    group.userData.initialScale = 0.2
    robot.add(group)
    bursts.push(group)
  }

  function onClick(event) {
    getPointer(event)
    raycaster.setFromCamera(pointer, camera)
    const hit = raycaster.intersectObjects(interactiveNodes, false)[0]
    if (!hit?.object?.userData?.target) return
    const { target, label } = hit.object.userData
    triggerDomEffect(label)
    makeBurst(hit.object.position, hit.object.material.color.getHex())
    document.body.classList.add('warp')
    window.setTimeout(() => document.body.classList.remove('warp'), 760)
    window.setTimeout(() => document.getElementById(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 360)
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
  const targetScale = new THREE.Vector3(1, 1, 1)
  const sceneTargets = {
    home: { rx: -0.03, ry: -0.18, scale: 1, px: 0.82, py: -0.15, camZ: 7.8 },
    about: { rx: 0.04, ry: 0.16, scale: 1.04, px: 1.18, py: -0.08, camZ: 7.3 },
    skills: { rx: 0.08, ry: -0.04, scale: 1.12, px: 0.35, py: -0.04, camZ: 6.9 },
    experience: { rx: 0.12, ry: -0.42, scale: 1.02, px: 1.05, py: -0.18, camZ: 7.6 },
    projects: { rx: 0.08, ry: 0.36, scale: 1.1, px: 0.36, py: -0.02, camZ: 7.0 },
    github: { rx: -0.02, ry: -0.26, scale: 1.05, px: 0.92, py: -0.12, camZ: 7.4 },
    contact: { rx: 0.08, ry: 0.24, scale: 1.02, px: 0.58, py: -0.12, camZ: 7.5 }
  }

  function animate() {
    const elapsed = clock.getElapsedTime()
    const sceneName = document.body.dataset.scene || 'home'
    const target = sceneTargets[sceneName] || sceneTargets.home

    world.rotation.x += (target.rx + mouseY * 0.035 - world.rotation.x) * 0.035
    world.rotation.y += (target.ry + mouseX * 0.05 - world.rotation.y) * 0.035
    world.position.x += (target.px - world.position.x) * 0.03
    world.position.y += (target.py - world.position.y) * 0.03
    camera.position.z += (target.camZ - camera.position.z) * 0.025
    targetScale.set(target.scale, target.scale, target.scale)
    world.scale.lerp(targetScale, 0.035)

    robot.position.y = -0.85 + Math.sin(elapsed * 1.35) * 0.045
    robot.rotation.y += Math.sin(elapsed * 0.5) * 0.0008
    robot.children.forEach((child) => {
      if (child.userData?.rotationSpeed) child.rotation.z += child.userData.rotationSpeed
      if (child.userData?.isRobotParticles) child.rotation.y += 0.006
      if (child.userData?.target) {
        const isHovered = hovered === child
        const pulse = 1 + Math.sin(elapsed * 2.8 + child.position.x) * 0.08
        child.scale.setScalar(isHovered ? 1.55 : pulse)
      }
    })
    platform.children.forEach((child) => {
      if (child.userData?.rotationSpeed) child.rotation.z += child.userData.rotationSpeed
    })
    digitalWorld.rotation.y = elapsed * 0.016
    digitalWorld.rotation.x = Math.sin(elapsed * 0.12) * 0.035

    for (let i = bursts.length - 1; i >= 0; i -= 1) {
      const burst = bursts[i]
      burst.userData.life -= 0.025
      burst.scale.setScalar(0.2 + (1 - burst.userData.life) * 2.4)
      burst.children.forEach((ring) => {
        ring.material.opacity = Math.max(0, burst.userData.life)
        ring.rotation.z += 0.02
      })
      if (burst.userData.life <= 0) {
        robot.remove(burst)
        bursts.splice(i, 1)
      }
    }

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
