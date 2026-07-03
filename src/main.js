import { initThreeScene } from './threeScene.js'
import { profile, skills, experiences, projects } from './config.js'
import './styles.css'
import './three-overrides.css'
import './galaxy-overrides.css'

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
  const text = 'Move through the galaxy. Click a star to open a portfolio module.'
  let index = 0
  const tick = () => {
    el.textContent = text.slice(0, index)
    index += 1
    if (index <= text.length) window.setTimeout(tick, 28)
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

function getModuleData(moduleName) {
  const key = String(moduleName || '').toLowerCase()
  if (key === 'about') {
    return {
      title: 'About / 个人概述',
      kicker: 'GALAXY CORE',
      body: '9年+ Java 后端开发经验，参与并负责过多式联运数字一单制平台、证券开放 API 平台、银行资金链路、C2M 电商平台、实时行情接入、物业 SaaS 等核心系统建设。',
      cards: [
        ['核心定位', '资深 Java 后端工程师 / 项目 Owner / 后端技术负责人方向'],
        ['工程优势', '0-1 系统建设、复杂业务建模、核心链路设计、数据库建模、服务治理和生产稳定性优化'],
        ['业务领域', '金融科技、证券开放 API、银行资金链路、多式联运、C2M 电商、实时行情']
      ]
    }
  }
  if (key === 'skills') {
    return {
      title: 'Skills / 技能星云',
      kicker: 'SKILL CONSTELLATION',
      body: '这些星点代表后端工程能力、分布式系统能力、数据库缓存能力、链路稳定性能力和 AI 工程化能力。',
      cards: skills.map(skill => [skill.name, `${skill.group} · ${skill.level}%`])
    }
  }
  if (key === 'experience') {
    return {
      title: 'Experience / 经历星轨',
      kicker: 'CAREER ORBIT',
      body: '从业务系统开发到核心后端工程师，再到项目 Owner，持续沉淀系统设计、稳定性治理和跨团队交付能力。',
      cards: experiences.map(item => [item.company, `${item.period}｜${item.role}\n${item.summary}`])
    }
  }
  if (key === 'projects') {
    return {
      title: 'Projects / 项目星系',
      kicker: 'PROJECT GALAXY',
      body: '每个项目对应一个业务复杂度与工程能力的综合节点，突出架构设计、链路稳定性、性能优化和业务落地。',
      cards: projects.map(project => [project.name, `${project.type}\n${project.highlight}\n${project.desc}`])
    }
  }
  if (key === 'github') {
    return {
      title: 'GitHub / 技术足迹',
      kicker: 'PUBLIC SIGNAL',
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
  window.addEventListener('portfolio:close-module', closeModule)
}

function setupGalaxyNav() {
  const nav = document.createElement('aside')
  nav.className = 'galaxy-nav'
  nav.innerHTML = `
    <button class="galaxy-star-toggle" type="button" aria-label="打开星图导航" aria-expanded="false"><span>✦</span></button>
    <div class="galaxy-nav-panel">
      <div class="galaxy-nav-title">
        <strong>Benyu Zhang Galaxy</strong>
        <span>点击星点或选择模块查看简历。</span>
      </div>
      <div class="galaxy-nav-actions">
        <button type="button" data-module="about">About <span>01</span></button>
        <button type="button" data-module="skills">Skills <span>02</span></button>
        <button type="button" data-module="experience">Experience <span>03</span></button>
        <button type="button" data-module="projects">Projects <span>04</span></button>
        <button type="button" data-module="github">GitHub <span>05</span></button>
        <button type="button" data-module="contact">Contact <span>06</span></button>
        <a href="/resume.html" target="_blank" rel="noreferrer">View Resume <span>↗</span></a>
        <a href="/resume-zhang-benyu.md" download>Download MD <span>↓</span></a>
      </div>
    </div>
  `
  document.body.appendChild(nav)

  const toggle = nav.querySelector('.galaxy-star-toggle')
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open')
    toggle.setAttribute('aria-expanded', String(open))
  })
  nav.querySelectorAll('[data-module]').forEach((button) => {
    button.addEventListener('click', () => {
      nav.classList.remove('open')
      toggle.setAttribute('aria-expanded', 'false')
      window.dispatchEvent(new CustomEvent('portfolio:open-module', { detail: { target: button.dataset.module } }))
    })
  })
  document.addEventListener('click', (event) => {
    if (!nav.contains(event.target)) {
      nav.classList.remove('open')
      toggle.setAttribute('aria-expanded', 'false')
    }
  })

  const hint = document.createElement('div')
  hint.className = 'galaxy-hint'
  hint.textContent = '移动鼠标观察宇宙视角，点击发光星点打开技能、项目、经历等模块。左上角小星星是收起的导航。'
  document.body.appendChild(hint)
}

const terminalCommands = {
  help: 'Available commands: about, skills, projects, experience, github, resume, download, contact, clear',
  about: `${profile.name} - ${profile.title}.`,
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
  modal.addEventListener('click', (event) => { if (event.target === modal) close() })
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') close() })
  $('#terminal-form')?.addEventListener('submit', (event) => {
    event.preventDefault()
    print(input.value)
    input.value = ''
  })
  $$('.terminal-quick-actions button').forEach((button) => button.addEventListener('click', () => print(button.dataset.command)))
}

function boot() {
  initThreeScene()
  typeWelcome()
  setupCursor()
  setupModuleOverlay()
  setupGalaxyNav()
  setupTerminal()
}

boot()
