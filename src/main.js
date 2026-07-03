import { initThreeScene } from './threeScene.js'
import { profile, skills, experiences, projects } from './config.js'
import './styles.css'
import './three-overrides.css'

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
  if (!el) return
  const text = `Welcome, I am ${profile.englishName}'s AI Guide.`
  let index = 0
  const tick = () => {
    el.textContent = text.slice(0, index)
    index += 1
    if (index <= text.length) window.setTimeout(tick, 42)
  }
  tick()
}

function setupCursor() {
  const dot = $('#cursor-dot')
  const ring = $('#cursor-ring')
  if (!dot || !ring) return
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
  if (!container) return
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
  if (!container) return
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
  if (!container) return
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
  if (!container) return
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
  const formEl = $('#contact-form')
  if (!formEl) return
  formEl.addEventListener('submit', (event) => {
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
  if (!modal || !output || !input) return

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

  $('#open-terminal')?.addEventListener('click', open)
  $('#close-terminal')?.addEventListener('click', close)
  modal.addEventListener('click', (event) => {
    if (event.target === modal) close()
  })
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') close()
  })
  $('#terminal-form')?.addEventListener('submit', (event) => {
    event.preventDefault()
    print(input.value)
    input.value = ''
  })
  $$('.terminal-quick-actions button').forEach((button) => {
    button.addEventListener('click', () => print(button.dataset.command))
  })
}

function boot() {
  initThreeScene()
  typeWelcome()
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
