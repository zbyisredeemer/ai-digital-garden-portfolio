export const profile = {
  name: '张本瑜',
  englishName: 'Benyu Zhang',
  title: '资深 Java 后端工程师',
  tagline: '9年+ Java 后端开发经验｜0-1 系统建设｜微服务架构｜高并发交易链路｜稳定性治理',
  location: '北京 / 远程协作',
  email: 'zhangbenyu_java@163.com',
  githubUser: 'zbyisredeemer',
  githubUrl: 'https://github.com/zbyisredeemer',
  avatar: '/avatar.svg',
  resumeUrl: '/resume-zhang-benyu.md',
  resumeOnlineUrl: '/resume.html'
}

export const skills = [
  { name: 'Java 8', group: 'Backend', level: 95 },
  { name: 'Spring Boot', group: 'Backend', level: 94 },
  { name: 'Spring Cloud', group: 'Microservices', level: 90 },
  { name: 'Spring Cloud Gateway', group: 'Gateway', level: 90 },
  { name: 'MySQL / Oracle', group: 'Database', level: 88 },
  { name: 'Redis', group: 'Cache', level: 88 },
  { name: 'RabbitMQ / RocketMQ', group: 'Messaging', level: 86 },
  { name: 'XXL-JOB / Scheduled', group: 'Task', level: 84 },
  { name: 'Elasticsearch', group: 'Search', level: 78 },
  { name: 'API Gateway / Auth', group: 'Governance', level: 90 },
  { name: 'Idempotency / Compensation', group: 'Stability', level: 88 },
  { name: 'High Concurrency', group: 'Architecture', level: 86 },
  { name: 'FinTech / Securities', group: 'Domain', level: 90 },
  { name: 'AI Engineering Workflow', group: 'Productivity', level: 80 }
]

export const experiences = [
  {
    company: '嘉瑜科技有限公司',
    period: '2025.05 - 至今',
    role: '资深 Java 开发工程师 / 项目 Owner',
    location: '证券开放 API / eDDA / 暗盘行情',
    summary: '参与证券开放 API 平台、银行 eDDA 资金链路、辉立暗盘行情接入等核心系统建设，聚焦接口治理、资金状态流转、异常补偿、幂等控制和实时行情推送。',
    points: ['负责接口版本规范、网关路由、应用鉴权、权限控制和调用审计', '负责绑卡、入金、出金状态流转、异步回调、异常补偿和对账处理', '完成 PMP 行情源连接、订阅管理、行情解析、快照维护和 WebSocket 推送']
  },
  {
    company: '亚信货云（北京）科技有限公司',
    period: '2023.06 - 2025.04',
    role: '资深 Java 开发工程师 / 项目 Owner',
    location: '多式联运 / 供应链金融 / 区块链存证',
    summary: '主导项目从 0 到 1 建设，负责服务拆分、架构设计、数据库建模、核心模块开发及上线推进，推动电子提单、供应链金融和区块链存证能力落地。',
    points: ['负责后端整体技术方案制定，推动分层架构、业务服务和区块链适配层落地', '参与需求拆解、迭代排期、技术评审及 Code Review', '负责上线宣讲、跨团队协作和外部系统对接']
  },
  {
    company: '必要工业科技有限公司',
    period: '2021.04 - 2023.06',
    role: '高级 Java 开发工程师',
    location: 'C2M 电商 / 统一业务网关 / 交易链路',
    summary: '负责商城统一业务网关设计与开发，参与核心交易链路、商品详情、搜索索引同步、自营业务、订单履约和结算等模块建设。',
    points: ['收敛 App / Web / 小程序三端业务入口，降低多端重复开发成本', '主导接口重构和业务抽象，提高新业务接入效率', '参与大促高峰下缓存治理、ES 同步、订单库存一致性和接口性能优化']
  },
  {
    company: '厦门市美亚柏科信息股份有限公司（北京分公司）',
    period: '2019.03 - 2021.04',
    role: 'Java 开发工程师',
    location: 'Spring Cloud / 微服务落地 / 稳定交付',
    summary: '参与项目技术选型和 Spring Cloud 技术体系落地，负责接口开发、数据库设计、服务拆分、系统联调和上线问题排查。',
    points: ['参与核心业务系统设计与开发', '制定开发标准与代码规范，提升研发协同效率和代码质量', '参与上线部署、问题排查和系统稳定性优化']
  },
  {
    company: '北京合生活科技有限公司',
    period: '2016.07 - 2019.01',
    role: 'Java 开发工程师',
    location: '智慧物业 SaaS / IoT 接入',
    summary: '参与智慧物业 SaaS 平台核心业务开发，负责门禁、缴费、梯控、工单、第三方 IoT 服务对接和社区服务能力扩展。',
    points: ['参与门禁、缴费、梯控、工单等核心业务模块建设', '对接第三方 IoT 服务，支持多类设备接入', '参与合优家陪护类 APP 的功能开发和业务落地']
  }
]

export const projects = [
  {
    name: '多式联运数字一单制平台',
    type: 'Electronic Bill / Supply Chain Finance / Fabric',
    desc: '以电子提单、可信物流凭证、金融风控为核心，基于区块链构建多式联运协作平台，支撑物流数据可信流转和供应链金融场景落地。',
    stack: ['Java', 'Spring Cloud', 'MySQL', 'Redis', 'RocketMQ', 'Redisson', 'Fabric'],
    highlight: '0-1 平台建设 + 链上链下混合存储 + MQ 异步上链 + 状态机补偿'
  },
  {
    name: '证券开放 API 平台建设与网关治理',
    type: 'Open API / Auth / Gateway',
    desc: '建设统一证券开放 API 平台，提供应用管理、接口权限、签名鉴权、版本路由、调用审计、限流控制和日志追踪能力。',
    stack: ['Java 8', 'Spring Boot', 'Spring Cloud Gateway', 'Nacos', 'Redis', 'MySQL', 'JWT'],
    highlight: '统一网关治理 + AK/SK + Token 双重安全 + Scope 权限模型 + 调用链路可追踪'
  },
  {
    name: '银行 eDDA 资金链路系统',
    type: 'Bind / Deposit / Withdraw / Reconciliation',
    desc: '支持用户在线绑卡、入金、出金，覆盖银行接口调用、同步响应、异步回调、状态流转、补偿重试、异常码处理和数据对账。',
    stack: ['Java 8', 'Spring Boot', 'MySQL', 'RabbitMQ', 'XXL-JOB', 'JPA', 'MyBatis'],
    highlight: '状态机驱动资金流转 + 同步/异步/对账三层确认 + 幂等保护 + 补偿任务兜底'
  },
  {
    name: '必要商城统一业务网关与交易链路优化',
    type: 'C2M Commerce / Gateway / Performance',
    desc: '围绕 C2M 电商平台三端业务入口，负责统一业务网关、商品详情接口重构、搜索索引同步、自营业务、订单履约和结算模块建设。',
    stack: ['Java', 'Spring', 'MySQL', 'Redis', 'Elasticsearch', 'RocketMQ'],
    highlight: '三端统一接入 + 模板方法/策略模式重构 + ES 增量同步 + 缓存治理 + 订单库存一致性'
  },
  {
    name: '辉立暗盘行情接入与实时推送系统',
    type: 'Realtime Market Data / WebSocket',
    desc: '通过 Java 服务接入辉立 PMP 行情源，完成连接、登录、股票订阅、行情接收、数据解析、快照维护、增量处理和 WebSocket 推送。',
    stack: ['Java 8', 'Spring Boot', 'WebSocket', 'PMP SDK', 'Scheduled', 'Logback', 'Linux'],
    highlight: '行情服务独立化 + 动态订阅 + 快照增量处理 + 连接生命周期管理 + 日志校验'
  },
  {
    name: '合生活智慧物业 SaaS 平台',
    type: 'Property SaaS / IoT / Community Service',
    desc: '参与智慧物业 SaaS 平台核心业务开发，覆盖门禁、缴费、梯控、工单、IoT 设备接入和社区服务能力扩展。',
    stack: ['Java', 'MySQL', 'Redis', 'MQ', 'IoT Integration'],
    highlight: '门禁/梯控/缴费/工单核心模块 + 第三方 IoT 接入 + 适配器模式降低设备接入复杂度'
  }
]
