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

function getModuleData(moduleName) {
  const key = String(moduleName || '').toLowerCase()
  if (key === 'about') {
    return {
      title: 'About / 个人概述',
      kicker: 'SYSTEM PROFILE',
      body: `9年+ Java 后端开发经验，参与并负责过多式联运数字一单制平台、证券开放 API 平台、银行资金链路、C2M 电商平台、实时行情接入、物业 SaaS 等核心系统建设。`,
      cards: [
        ['核心定位', '资深 Java 后端工程师 / 项目 Owner / 后端技术负责人方向'],
        ['工程优势', '0-1 系统建设、复杂业务建模、核心链路设计、数据库建模、服务治理和生产稳定性优化'],
        ['业务领域', '金融科技、证券开放 API、银行资金链路、多式联运、C2M 电商、实时行情']
      ]
    }
  }
  if (key === 'skills') {
    return {
      title: 'Skills / 技术能力',
      kicker: 'SKILL MATRIX',
      body: '围绕高并发访问、分布式一致性、接口治理、缓存治理、消息可靠性、幂等控制、异步补偿和性能优化进行系统设计。',
      cards: skills.map(skill => [skill.name, `${skill.group} · ${skill.level}%`])
    }
  }
  if (key === 'experience') {
    return {
      title: 'Experience / 工作经历',
      kicker: 'CAREER TIMELINE',
      body: '从业务系统开发到核心后端工程师，再到项目 Owner，持续沉淀系统设计、稳定性治理和跨团队交付能力。',
      cards: experiences.map(item => [item.company, `${item.period}｜${item.role}\n${item.summary}`])
    }
  }
  if (key === 'projects') {
    return {
      title: 'Projects / 项目星图',
      kicker: 'PROJECT CONSTELLATION',
      body: '每个项目对应一个业务复杂度与工程能力的综合节点，突出架构设计、链路稳定性、性能优化和业务落地。',
      cards: projects.map(project => [project.name, `${project.type}\n${project.highlight}\n${project.desc}`])
    }
  }
  if (key === 'github') {
    return {
      title: 'GitHub / 技术足迹',
      kicker: 'PUBLIC TECH SIGNAL',
      body: '公开技术足迹可以作为可信度资产，后续可接入真实 GitHub Contributions、项目 README 和技术博客。',
      cards: [
        ['GitHub', profile.githubUrl],
        ['用户名', profile.githubUser],
        ['当前状态', '已预留热力图视觉占位，可继续接入真实贡献数据']
      ]
    }
  }
  return {
    title: 'Contact / 联系我',
    kicker: 'DIRECT CHANNEL',
    body: '欢迎交流 Java 后端、微服务架构、高并发交易链路、稳定性治理、开放 API、金融科技和 AI Coding。',
    cards: [
      ['邮箱', profile.email],
      ['GitHub', profile.githubUrl],
      ['简历', '可在线查看或下载完整 Markdown 简历']
    ]
  }
}

function setupModuleOverlay() {
  const modal = document.createElement('div')
  modal.className = 'portfolio-module-modal'
  modal.setAttribute('aria-hidden', 'true')
  modal.innerHTML = `
    <div class="portfolio-module-backdrop" data-close-module></div>
    <section class="portfolio-module-panel" role="dialog" aria-modal="true" aria-label="Portfolio module detail">
      <button class="portfolio-module-close" type="button" data-close-module>×</button>
      <div class="portfolio-module-kicker"></div>
      <h2 class="portfolio-module-title"></h2>
      <p class="portfolio-module-body"></p>
      <div class="portfolio-module-grid"></div>
    </section>
  `
  document.body.appendChild(modal)

  const openModule = (name) => {
    const data = getModuleData(name)
    modal.querySelector('.portfolio-module-kicker').textContent = data.kicker
    modal.querySelector('.portfolio-module-title').textContent = data.title
    modal.querySelector('.portfolio-module-body').textContent = data.body
    modal.querySelector('.portfolio-module-grid').innerHTML = data.cards.map(([title, desc]) => `
      <article class="portfolio-module-card">
        <strong>${escapeHtml(title)}</strong>
        <p>${escapeHtml(desc).replaceAll('\n', '<br>')}</p>
      </article>
    `).join('')
    modal.classList.add('open')
    modal.setAttribute('aria-hidden', 'false')
    document.body.classList.add('module-open')
  }

  const closeModule = () => {
    modal.classList.remove('open')
    modal.setAttribute('aria-hidden', 'true')
    document.body.classList.remove('module-open')
  }

  modal.addEventListener('click', (event) => {
    if (event.target.closest('[data-close-module]')) closeModule()
  })
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeModule()
  })
  window.addEventListener('portfolio:open-module', (event) => openModule(event.detail?.target || event.detail?.label || 'about'))
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
  setupModuleOverlay()
  setupTerminal()
}

boot()
