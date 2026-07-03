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

const moduleText = {
  about: {
    title: 'About / 个人概述',
    kicker: 'PROFILE',
    body: '9年+ Java 后端开发经验，参与并负责过多式联运数字一单制平台、证券开放 API 平台、银行资金链路、C2M 电商平台、实时行情接入、物业 SaaS 等核心系统建设。',
    cards: [
      ['核心定位', '资深 Java 后端工程师 / 项目 Owner / 后端技术负责人方向'],
      ['工程优势', '0-1 系统建设、复杂业务建模、核心链路设计、数据库建模、服务治理和生产稳定性优化'],
      ['业务领域', '金融科技、证券开放 API、银行资金链路、多式联运、C2M 电商、实时行情']
    ]
  },
  skills: {
    title: 'Skills / 技术能力',
    kicker: 'TECH STACK',
    body: '围绕高并发访问、分布式一致性、接口治理、缓存治理、消息可靠性、幂等控制、异步补偿和性能优化进行系统设计。',
    cards: skills.map(skill => [skill.name, `${skill.group} · ${skill.level}%`])
  },
  experience: {
    title: 'Experience / 工作经历',
    kicker: 'BUILD TIMELINE',
    body: '从业务系统开发到核心后端工程师，再到项目 Owner，持续沉淀系统设计、稳定性治理和跨团队交付能力。',
    cards: experiences.map(item => [item.company, `${item.period}｜${item.role}\n${item.summary}`])
  },
  projects: {
    title: 'Projects / 代表项目',
    kicker: 'PROJECT SNAPSHOT',
    body: '每个项目对应一个业务复杂度与工程能力的综合节点，突出架构设计、链路稳定性、性能优化和业务落地。',
    cards: projects.map(project => [project.name, `${project.type}\n${project.highlight}\n${project.desc}`])
  },
  github: {
    title: 'GitHub / 技术足迹',
    kicker: 'PUBLIC SIGNAL',
    body: '公开技术足迹可以作为可信度资产，后续可接入真实 GitHub Contributions、项目 README 和技术博客。',
    cards: [
      ['GitHub', profile.githubUrl],
      ['用户名', profile.githubUser],
      ['当前状态', '已预留热力图视觉占位，可继续接入真实贡献数据']
    ]
  },
  contact: {
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

function getModuleData(moduleName) {
  return moduleText[String(moduleName || '').toLowerCase()] || moduleText.about
}

function setupModuleOverlay() {
  const modal = document.createElement('div')
  modal.className = 'portfolio-module-modal space-modal'
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

const stackIcons = [
  ['☕', 'Java'], ['SB', 'Spring'], ['SQL', 'MySQL'], ['ORA', 'Oracle'], ['R', 'Redis'], ['MQ', 'RabbitMQ'],
  ['API', 'Gateway'], ['JOB', 'XXL-JOB'], ['ES', 'Elastic'], ['🐳', 'Docker'], ['Git', 'Git'], ['🐧', 'Linux']
]

function renderTechIcons() {
  return stackIcons.map(([icon, label]) => `<button class="space-tech" type="button" data-module="skills" title="${escapeHtml(label)}"><span>${escapeHtml(icon)}</span></button>`).join('')
}

function renderProjectCards() {
  return projects.slice(0, 5).map((project, index) => `
    <article class="orbit-project-card card-${index + 1}" data-module="projects">
      <small>${escapeHtml(project.type)}</small>
      <h3>${escapeHtml(project.name)}</h3>
      <p>${escapeHtml(project.desc)}</p>
      <a>View</a>
    </article>
  `).join('')
}

function renderTimelineTabs() {
  return projects.slice(0, 9).map((project, index) => `<button class="timeline-chip ${index === 0 ? 'active' : ''}" type="button" data-project-index="${index}">${escapeHtml(project.name.slice(0, 18))}</button>`).join('')
}

function timelineSnapshot(index = 0) {
  const project = projects[index] || projects[0]
  if (!project) return ''
  return `
    <article class="impact-card">
      <h3>${escapeHtml(project.name)} Impact Snapshot</h3>
      <small>${escapeHtml(project.type)}</small>
      <p>${escapeHtml(project.desc)}</p>
      <div class="impact-stats">
        <div><span>STACK ITEMS</span><strong>${project.stack?.length || 6}</strong></div>
        <div><span>CORE FOCUS</span><strong>${project.highlight ? '1' : '3'}</strong></div>
        <div><span>ROADMAP ITEMS</span><strong>3</strong></div>
      </div>
      <div class="impact-tags">${(project.stack || []).slice(0, 7).map(tag => `<span>${escapeHtml(tag)}</span>`).join('')}</div>
      <hr>
      <h4>Technology Detail</h4>
      <p>${escapeHtml(project.highlight || 'Core stack used to design, implement, secure, deploy, and evolve this project.')}</p>
      <h4>Project Links</h4>
      <button type="button" data-module="github">GitHub Repo</button>
    </article>
  `
}

function setupSpacePortfolio() {
  const page = document.createElement('div')
  page.className = 'space-page'
  page.innerHTML = `
    <div class="star-layer star-a" aria-hidden="true"></div>
    <div class="star-layer star-b" aria-hidden="true"></div>
    <div class="saturn-scene" aria-hidden="true">
      <div class="saturn-glow"></div>
      <div class="saturn-ring ring-back"></div>
      <div class="saturn-body"></div>
      <div class="saturn-ring ring-front"></div>
    </div>

    <button class="recruiter-toggle" type="button" aria-pressed="false"><span></span><strong>Recruiter Mode: Off</strong></button>

    <aside class="rocket-nav" aria-label="Rocket navigation">
      <div class="rocket-nose"></div>
      <div class="rocket-body">
        <button type="button" data-scroll="home" class="active">⌂</button>
        <button type="button" data-scroll="projects">▦</button>
        <button type="button" data-scroll="timeline">♙</button>
        <button type="button" data-scroll="contact">✉</button>
      </div>
      <div class="rocket-fins"><span></span><span></span></div>
      <div class="rocket-flame"><i></i><b></b></div>
      <div class="rocket-sparks"><span></span><span></span><span></span><span></span></div>
    </aside>

    <main class="space-main">
      <section class="space-hero" id="home">
        <div class="hero-left">
          <h1 class="space-title">Hi, I'm <span>Benyu</span><br>Java Backend<br>Developer <em>_</em></h1>
          <div class="profile-block">
            <img src="${profile.avatar}" alt="${profile.englishName}">
            <h2>${profile.englishName}</h2>
            <p>${profile.title}</p>
          </div>
          <div class="tech-grid">${renderTechIcons()}</div>
          <section class="music-widget">
            <div class="music-label">♪ NOW LISTENING</div>
            <article class="music-card">
              <div class="album-art"><span></span></div>
              <div class="track-info">
                <h3>Code Flow Sonata</h3>
                <p>Backend Engineering · System Design</p>
                <div class="track-tags"><span>JAVA</span><span>FINTECH</span></div>
              </div>
              <div class="paused-dot">PAUSED</div>
              <div class="progress"><span></span></div>
              <div class="music-controls"><button>◀</button><button class="play">▶</button><button>▶▶</button><button>♥</button></div>
            </article>
          </section>
        </div>
      </section>

      <section class="space-projects" id="projects">
        <h2>Projects</h2>
        <div class="floating-projects">${renderProjectCards()}</div>
      </section>

      <section class="build-timeline" id="timeline">
        <h2>Build Timeline</h2>
        <div class="timeline-chips">${renderTimelineTabs()}</div>
        <div class="timeline-snapshot">${timelineSnapshot(0)}</div>
      </section>

      <section class="personal-section">
        <div class="interest-cards">
          <article><small>OPEN API</small><h3>Gateway Governance</h3><p>Version routing, auth, rate limit, idempotency and stable external access.</p><strong>Engineering System</strong></article>
          <article class="active"><small>FINTECH</small><h3>Banking Flow</h3><p>eDDA, deposit, withdrawal, callback, reconciliation and compensation.</p><strong>Core Business</strong></article>
          <article><small>REALTIME</small><h3>Market Data</h3><p>Dark market quotes, subscription sync, receiver service and push pipeline.</p><strong>Streaming</strong></article>
        </div>
      </section>

      <section class="resume-section" id="contact">
        <div class="terminal-download"><strong><span>$</span> ./download_resume.sh</strong><p>Click to download my resume.</p></div>
        <a href="/resume-zhang-benyu.md" download class="download-hit">Download Resume</a>
      </section>

      <footer class="space-footer">
        <div>
          <strong>${profile.englishName}</strong>
          <p>Senior Java backend engineer focused on modern backend systems and real-world business reliability.</p>
        </div>
        <div><h4>QUICK LINKS</h4><a href="#home">Home</a><a href="#projects">Projects</a><a href="/resume.html">Resume</a><a href="mailto:${profile.email}">Contact</a></div>
        <div><h4>GET IN TOUCH</h4><p>${profile.email}</p><div class="socials"><a href="${profile.githubUrl}">GH</a><a href="mailto:${profile.email}">@</a><a href="/resume.html">CV</a></div></div>
      </footer>
    </main>
  `
  document.body.appendChild(page)

  page.querySelectorAll('[data-module]').forEach((item) => {
    item.addEventListener('click', () => window.dispatchEvent(new CustomEvent('portfolio:open-module', { detail: { target: item.dataset.module } })))
  })

  page.querySelectorAll('[data-scroll]').forEach((item) => {
    item.addEventListener('click', () => document.getElementById(item.dataset.scroll)?.scrollIntoView({ behavior: 'smooth' }))
  })

  const recruiter = page.querySelector('.recruiter-toggle')
  recruiter?.addEventListener('click', () => {
    const active = document.body.classList.toggle('recruiter-on')
    recruiter.setAttribute('aria-pressed', String(active))
    recruiter.querySelector('strong').textContent = `Recruiter Mode: ${active ? 'On' : 'Off'}`
  })

  const snapshot = page.querySelector('.timeline-snapshot')
  page.querySelectorAll('[data-project-index]').forEach((tab) => {
    tab.addEventListener('click', () => {
      page.querySelectorAll('[data-project-index]').forEach(t => t.classList.remove('active'))
      tab.classList.add('active')
      snapshot.innerHTML = timelineSnapshot(Number(tab.dataset.projectIndex))
      snapshot.querySelectorAll('[data-module]').forEach((item) => item.addEventListener('click', () => window.dispatchEvent(new CustomEvent('portfolio:open-module', { detail: { target: item.dataset.module } }))))
    })
  })

  let scrollTimer = null
  window.addEventListener('scroll', () => {
    document.body.classList.add('scrolling-rocket')
    const progress = window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
    document.documentElement.style.setProperty('--rocket-progress', String(progress))
    window.clearTimeout(scrollTimer)
    scrollTimer = window.setTimeout(() => document.body.classList.remove('scrolling-rocket'), 160)
  }, { passive: true })
}

function boot() {
  setupModuleOverlay()
  setupSpacePortfolio()
}

boot()
