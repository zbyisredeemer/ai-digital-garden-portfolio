import { profile, skills, experiences, projects } from './config.js'
import './styles.css'
import './three-overrides.css'
import './galaxy-overrides.css'
import './bechir-overrides.css'

const $ = (selector, scope = document) => scope.querySelector(selector)
const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector))
const escapeHtml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;')

function getModuleData(moduleName) {
  const key = String(moduleName || '').toLowerCase()
  if (key === 'about') {
    return {
      title: 'About / 个人概述',
      kicker: 'PROFILE',
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
      title: 'Skills / 技术能力',
      kicker: 'STACK',
      body: '围绕高并发访问、分布式一致性、接口治理、缓存治理、消息可靠性、幂等控制、异步补偿和性能优化进行系统设计。',
      cards: skills.map(skill => [skill.name, `${skill.group} · ${skill.level}%`])
    }
  }
  if (key === 'experience') {
    return {
      title: 'Experience / 工作经历',
      kicker: 'CAREER',
      body: '从业务系统开发到核心后端工程师，再到项目 Owner，持续沉淀系统设计、稳定性治理和跨团队交付能力。',
      cards: experiences.map(item => [item.company, `${item.period}｜${item.role}\n${item.summary}`])
    }
  }
  if (key === 'projects') {
    return {
      title: 'Projects / 代表项目',
      kicker: 'WORKS',
      body: '每个项目对应一个业务复杂度与工程能力的综合节点，突出架构设计、链路稳定性、性能优化和业务落地。',
      cards: projects.map(project => [project.name, `${project.type}\n${project.highlight}\n${project.desc}`])
    }
  }
  if (key === 'github') {
    return {
      title: 'GitHub / 技术足迹',
      kicker: 'SIGNAL',
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
    kicker: 'CONTACT',
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

function cardTags(project) {
  return project.stack?.slice(0, 4).map(tag => `<span>${escapeHtml(tag)}</span>`).join('') || ''
}

function setupBechirPortfolio() {
  const page = document.createElement('div')
  page.className = 'bechir-page'
  page.innerHTML = `
    <div class="bechir-orb" aria-hidden="true"></div>
    <nav class="bechir-nav">
      <a class="bechir-brand" href="#top" aria-label="Benyu Zhang Home">
        <span class="bechir-brand-mark">BZ</span>
        <span>Benyu Zhang</span>
      </a>
      <div class="bechir-links">
        <button type="button" data-module="about">About</button>
        <button type="button" data-module="skills">Skills</button>
        <button type="button" data-module="experience">Experience</button>
        <button type="button" data-module="projects">Projects</button>
        <button type="button" data-module="contact">Contact</button>
        <a href="/resume.html" target="_blank" rel="noreferrer">Resume</a>
      </div>
    </nav>

    <section class="bechir-hero" id="top">
      <div>
        <div class="bechir-kicker">Portfolio / Senior Java Engineer</div>
        <h1 class="bechir-title"><span>Benyu</span><span><em>Zhang</em></span></h1>
        <p class="bechir-subtitle">I build backend systems for securities, banking payment flows, open APIs, real-time market data and business-critical platforms.</p>
        <div class="bechir-actions">
          <button class="bechir-button primary" type="button" data-module="projects">Explore Projects →</button>
          <button class="bechir-button" type="button" data-module="skills">View Stack</button>
          <a class="bechir-button" href="mailto:${profile.email}">Contact</a>
        </div>
      </div>
      <div class="bechir-stage" aria-hidden="true">
        <div class="bechir-card-stack">
          ${projects.slice(0, 3).map((project, index) => `
            <article class="bechir-showcase-card">
              <div class="bechir-card-index">0${index + 1}</div>
              <h3>${escapeHtml(project.name)}</h3>
              <p>${escapeHtml(project.highlight || project.desc)}</p>
              <div class="bechir-tags">${cardTags(project)}</div>
            </article>
          `).join('')}
        </div>
      </div>
    </section>

    <section class="bechir-section" id="work">
      <div class="bechir-section-head">
        <h2>Selected<br>Works</h2>
        <small>Project Cases</small>
      </div>
      <div class="bechir-grid">
        ${projects.slice(0, 6).map((project) => `
          <article class="bechir-tile" data-module="projects">
            <strong>${escapeHtml(project.name)}</strong>
            <p>${escapeHtml(project.desc)}</p>
            <div class="bechir-meta">${project.stack.slice(0, 3).map(tag => `<span>${escapeHtml(tag)}</span>`).join('')}</div>
          </article>
        `).join('')}
      </div>
    </section>

    <section class="bechir-section" id="stack">
      <div class="bechir-section-head">
        <h2>Stack &<br>Systems</h2>
        <small>Engineering Field</small>
      </div>
      <div class="bechir-grid">
        ${skills.slice(0, 9).map((skill) => `
          <article class="bechir-tile" data-module="skills">
            <strong>${escapeHtml(skill.name)}</strong>
            <p>${escapeHtml(skill.group)} · ${skill.level}%</p>
            <div class="bechir-meta"><span>${escapeHtml(skill.group)}</span></div>
          </article>
        `).join('')}
      </div>
    </section>

    <section class="bechir-section" id="career">
      <div class="bechir-section-head">
        <h2>Career<br>Orbit</h2>
        <small>Experience</small>
      </div>
      <div class="bechir-grid">
        ${experiences.slice(0, 6).map((item) => `
          <article class="bechir-tile" data-module="experience">
            <strong>${escapeHtml(item.company)}</strong>
            <p>${escapeHtml(item.period)}｜${escapeHtml(item.role)}<br>${escapeHtml(item.summary)}</p>
          </article>
        `).join('')}
      </div>
    </section>

    <footer class="bechir-footer">
      <span>© ${new Date().getFullYear()} Benyu Zhang</span>
      <span>${profile.email}</span>
      <span>${profile.githubUrl}</span>
    </footer>
  `
  document.body.appendChild(page)

  page.querySelectorAll('[data-module]').forEach((item) => {
    item.addEventListener('click', () => {
      window.dispatchEvent(new CustomEvent('portfolio:open-module', { detail: { target: item.dataset.module } }))
    })
  })

  const stack = page.querySelector('.bechir-card-stack')
  page.addEventListener('pointermove', (event) => {
    if (!stack) return
    const x = (event.clientX / window.innerWidth - 0.5) * 2
    const y = (event.clientY / window.innerHeight - 0.5) * 2
    stack.style.transform = `rotateY(${x * 8}deg) rotateX(${-y * 6}deg)`
  })
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

  $('#terminal-form')?.addEventListener('submit', (event) => {
    event.preventDefault()
    print(input.value)
    input.value = ''
  })
  $$('.terminal-quick-actions button').forEach((button) => button.addEventListener('click', () => print(button.dataset.command)))
}

function boot() {
  setupModuleOverlay()
  setupBechirPortfolio()
  setupTerminal()
}

boot()
