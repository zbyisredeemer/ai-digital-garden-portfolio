import { profile, skills, experiences, projects } from './config.js'
import './styles.css'

const $ = (selector, scope = document) => scope.querySelector(selector)
const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector))
const escapeHtml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;')

function typeWelcome() {
  const el = $('#welcome-text')
  const text = `Welcome, I am ${profile.englishName}'s AI Guide.`
  let index = 0
  const tick = () => {
    el.textContent = text.slice(0, index)
    index += 1
    if (index <= text.length) window.setTimeout(tick, 42)
  }
  tick()
}

function setupCanvas() {
  const canvas = $('#space-canvas')
  const ctx = canvas.getContext('2d')
  const particles = []
  const maxParticles = window.innerWidth < 768 ? 60 : 120

  function resize() {
    canvas.width = window.innerWidth * window.devicePixelRatio
    canvas.height = window.innerHeight * window.devicePixelRatio
    canvas.style.width = `${window.innerWidth}px`
    canvas.style.height = `${window.innerHeight}px`
    ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0)
  }

  function init() {
    particles.length = 0
    for (let i = 0; i < maxParticles; i += 1) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.8 + 0.6,
        alpha: Math.random() * 0.65 + 0.15
      })
    }
  }

  function draw() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
    ctx.fillStyle = 'rgba(6, 17, 31, 0.36)'
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)

    particles.forEach((p, i) => {
      p.x += p.vx
      p.y += p.vy
      if (p.x < 0 || p.x > window.innerWidth) p.vx *= -1
      if (p.y < 0 || p.y > window.innerHeight) p.vy *= -1

      ctx.beginPath()
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(125, 211, 252, ${p.alpha})`
      ctx.fill()

      for (let j = i + 1; j < particles.length; j += 1) {
        const q = particles[j]
        const dx = p.x - q.x
        const dy = p.y - q.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 115) {
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(q.x, q.y)
          ctx.strokeStyle = `rgba(14, 165, 233, ${0.14 * (1 - dist / 115)})`
          ctx.lineWidth = 1
          ctx.stroke()
        }
      }
    })

    requestAnimationFrame(draw)
  }

  resize()
  init()
  draw()
  window.addEventListener('resize', () => {
    resize()
    init()
  })
}

function setupCursor() {
  const dot = $('#cursor-dot')
  const ring = $('#cursor-ring')
  let x = window.innerWidth / 2
  let y = window.innerHeight / 2
  let ringX = x
  let ringY = y

  document.addEventListener('mousemove', (e) => {
    x = e.clientX
    y = e.clientY
    dot.style.transform = `translate(${x}px, ${y}px)`
  })

  function animate() {
    ringX += (x - ringX) * 0.17
    ringY += (y - ringY) * 0.17
    ring.style.transform = `translate(${ringX}px, ${ringY}px)`
    requestAnimationFrame(animate)
  }
  animate()

  $$('a, button, input, textarea').forEach((el) => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-active'))
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-active'))
  })
}

function renderSkills() {
  const container = $('#skill-constellation')
  container.innerHTML = skills.map((skill, index) => {
    const angle = (index / skills.length) * Math.PI * 2
    const radius = index % 2 === 0 ? 40 : 78
    const x = 50 + Math.cos(angle) * radius * 0.35
    const y = 50 + Math.sin(angle) * radius * 0.28
    return `
      <button class="skill-node" style="--x:${x}%;--y:${y}%;--level:${skill.level}%" type="button">
        <strong>${skill.name}</strong>
        <span>${skill.group}</span>
      </button>
    `
  }).join('')
}

function renderExperience() {
  const container = $('#timeline')
  container.innerHTML = experiences.map((item, index) => `
    <article class="timeline-item" style="--delay:${index * 120}ms">
      <div class="timeline-dot"></div>
      <div class="timeline-content glass-card">
        <div class="timeline-meta"><span>${item.period}</span><span>${item.location}</span></div>
        <h3>${item.company}</h3>
        <strong>${item.role}</strong>
        <p>${item.summary}</p>
        <ul>${item.points.map(point => `<li>${point}</li>`).join('')}</ul>
      </div>
    </article>
  `).join('')
}

function renderProjects() {
  const container = $('#project-grid')
  container.innerHTML = projects.map((project, index) => `
    <article class="project-card glass-card" style="--delay:${index * 80}ms">
      <div class="planet planet-${(index % 6) + 1}"></div>
      <div class="project-type">${project.type}</div>
      <h3>${project.name}</h3>
      <p>${project.desc}</p>
      <div class="stack">${project.stack.map(s => `<span>${s}</span>`).join('')}</div>
      <div class="highlight">${project.highlight}</div>
    </article>
  `).join('')
}

function renderHeatmap() {
  const container = $('#heatmap')
  const cells = Array.from({ length: 52 * 7 }, (_, i) => {
    const seed = Math.sin(i * 12.9898) * 43758.5453
    const value = Math.abs(seed - Math.floor(seed))
    const level = value > 0.78 ? 4 : value > 0.56 ? 3 : value > 0.35 ? 2 : value > 0.18 ? 1 : 0
    return `<span class="heat-cell level-${level}" title="Contribution activity level ${level}"></span>`
  })
  container.innerHTML = `<div class="heat-grid">${cells.join('')}</div><p class="heat-note">视觉化热力图占位；真实贡献数据可后续接 GitHub API 或 ghchart 服务。</p>`
}

function setupNavigation() {
  const navLinks = $$('.nav-link')
  const sections = $$('.section')
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id
        navLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${id}`))
        document.body.dataset.scene = entry.target.dataset.scene || id
      }
    })
  }, { threshold: 0.42 })

  sections.forEach((section) => observer.observe(section))

  $$('.tree-node').forEach((button) => {
    button.addEventListener('click', () => {
      const target = button.dataset.target
      const el = document.getElementById(target)
      document.body.classList.add('warp')
      window.setTimeout(() => document.body.classList.remove('warp'), 780)
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  })
}

function setupReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('visible')
    })
  }, { threshold: 0.16 })

  $$('.reveal').forEach((el) => observer.observe(el))
}

function setupContactForm() {
  $('#contact-form').addEventListener('submit', (event) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const name = form.get('name') || 'Portfolio visitor'
    const email = form.get('email') || ''
    const message = form.get('message') || ''
    const subject = encodeURIComponent(`Portfolio Contact from ${name}`)
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`
  })
}

const terminalCommands = {
  help: 'Available commands: about, skills, projects, experience, github, resume, download, contact, clear',
  about: `${profile.name} - ${profile.title}. Focus: Java backend, microservices, high-concurrency transaction flow and stability governance.`,
  skills: skills.map(s => `${s.name}(${s.group})`).join(' · '),
  projects: projects.map(p => `- ${p.name}`).join('\n'),
  experience: experiences.map(e => `${e.period} | ${e.company} | ${e.role}`).join('\n'),
  github: profile.githubUrl,
  resume: 'Opening online resume viewer...',
  download: 'Opening full Markdown resume download...',
  contact: `mailto:${profile.email}`
}

function setupTerminal() {
  const modal = $('#terminal-modal')
  const output = $('#terminal-output')
  const input = $('#terminal-command')

  const open = () => {
    modal.classList.add('open')
    modal.setAttribute('aria-hidden', 'false')
    window.setTimeout(() => input.focus(), 80)
  }

  const close = () => {
    modal.classList.remove('open')
    modal.setAttribute('aria-hidden', 'true')
  }

  function print(command) {
    const normalized = command.trim().toLowerCase()
    if (!normalized) return
    if (normalized === 'clear') {
      output.innerHTML = ''
      return
    }
    const response = terminalCommands[normalized] || `Command not found: ${normalized}. Try "help".`
    output.insertAdjacentHTML('beforeend', `<p class="command-line">&gt; ${escapeHtml(normalized)}</p><pre>${escapeHtml(response)}</pre>`)
    output.scrollTop = output.scrollHeight
    if (normalized === 'resume') window.open(profile.resumeOnlineUrl, '_blank')
    if (normalized === 'download') window.open(profile.resumeUrl, '_blank')
    if (normalized === 'github') window.open(profile.githubUrl, '_blank')
    if (normalized === 'contact') window.location.href = `mailto:${profile.email}`
  }

  $('#open-terminal').addEventListener('click', open)
  $('#close-terminal').addEventListener('click', close)
  modal.addEventListener('click', (event) => {
    if (event.target === modal) close()
  })
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') close()
  })
  $('#terminal-form').addEventListener('submit', (event) => {
    event.preventDefault()
    print(input.value)
    input.value = ''
  })
  $$('.terminal-quick-actions button').forEach((button) => {
    button.addEventListener('click', () => print(button.dataset.command))
  })
}

function boot() {
  typeWelcome()
  setupCanvas()
  setupCursor()
  renderSkills()
  renderExperience()
  renderProjects()
  renderHeatmap()
  setupNavigation()
  setupReveal()
  setupContactForm()
  setupTerminal()
}

boot()
