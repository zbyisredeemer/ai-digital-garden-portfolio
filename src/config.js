export const profile = {
  name: '张本瑜',
  englishName: 'Zhang Benyu',
  title: '资深 Java 后端工程师',
  tagline: '9年+ Java后端开发经验｜金融科技｜微服务 / 分布式 / 高并发｜开放 API',
  location: '北京 / 远程协作',
  email: 'zhangbenyu_java@163.com',
  githubUser: 'zbyisredeemer',
  githubUrl: 'https://github.com/zbyisredeemer',
  avatar: 'https://avatars.githubusercontent.com/u/46104333?v=4',
  resumeUrl: '/resume-zhang-benyu.md'
}

export const skills = [
  { name: 'Java', group: 'Core', level: 95 },
  { name: 'Spring Boot', group: 'Backend', level: 94 },
  { name: 'Spring Cloud Alibaba', group: 'Microservices', level: 90 },
  { name: 'MyBatis / JPA', group: 'Persistence', level: 86 },
  { name: 'MySQL / Oracle', group: 'Database', level: 88 },
  { name: 'Redis', group: 'Cache', level: 86 },
  { name: 'RabbitMQ / RocketMQ', group: 'Messaging', level: 84 },
  { name: 'Nacos / Feign / Gateway', group: 'Governance', level: 88 },
  { name: 'Distributed Transaction', group: 'Architecture', level: 82 },
  { name: 'XXL-JOB / Scheduler', group: 'Task', level: 82 },
  { name: 'Observability', group: 'Ops', level: 78 },
  { name: 'FinTech / Securities', group: 'Domain', level: 90 },
  { name: 'Open API Platform', group: 'Domain', level: 88 },
  { name: 'AI Coding Workflow', group: 'Productivity', level: 80 }
]

export const experiences = [
  {
    company: '亚信货云 / 金融科技方向',
    period: '2023 - Now',
    role: '高级 Java 后端工程师 / 核心模块 Owner',
    location: '北京 / 青岛 / 香港业务协作',
    summary: '负责证券开放 API、银行 eDDA 资金链路、多式联运数字一单制等核心系统建设，聚焦系统设计、链路稳定性、网关治理与性能优化。',
    points: ['0-1 建设 Spring Cloud Alibaba 微服务体系', '沉淀资金链路补偿、幂等、对账与监控方案', '参与多团队协作、上线排障和核心链路治理']
  },
  {
    company: '必要工业科技 / 必要商城',
    period: '2020 - 2023',
    role: '资深 Java 工程师',
    location: '北京',
    summary: '参与统一业务网关、交易链路优化、数据交互规范建设，将单体网关逐步演进为更可治理的分布式集群。',
    points: ['网关路由、鉴权、限流与灰度治理', '交易链路性能优化，吞吐量提升约 3 倍', '沉淀接口标准、业务隔离与稳定性策略']
  },
  {
    company: '合生活 / 美亚柏科等早期经历',
    period: '2016 - 2020',
    role: 'Java 后端开发工程师',
    location: '北京 / 厦门',
    summary: '从业务系统开发逐步成长为核心后端工程师，积累 Spring、MyBatis、Oracle、Redis、MQ、权限与工作流等基础工程能力。',
    points: ['负责智慧物业、业务系统、数据接口等后端模块', '参与权限、流程、报表、接口对接和生产问题排查', '建立面向业务闭环的工程交付意识']
  }
]

export const projects = [
  {
    name: '证券开放 API 平台建设与网关治理',
    type: 'Open API Gateway',
    desc: '面向券商开放能力建设，统一 API 路由、鉴权、版本治理、限流、日志追踪和服务隔离，为后续接口迭代提供稳定入口。',
    stack: ['Spring Cloud Gateway', 'Nacos', 'Redis', 'MySQL', 'OpenAPI', 'Rate Limit'],
    highlight: '接口标准化 + 网关优雅路由 + 版本演进能力'
  },
  {
    name: '银行 eDDA 绑卡、入金、出金资金链路系统',
    type: 'FinTech Payment Flow',
    desc: '围绕 BOC / DBS 等银行链路构建绑卡、入金、出金、回执、对账、补偿和异常处理机制，重点保障资金链路稳定性。',
    stack: ['Spring Boot', 'RabbitMQ', 'Redis', 'MySQL', 'XXL-JOB', 'State Machine'],
    highlight: '幂等、补偿、对账、事务边界和异常恢复'
  },
  {
    name: '多式联运数字一单制平台',
    type: '0-1 Digital Platform',
    desc: '从 0 到 1 搭建微服务平台，支撑多式联运数字化业务流转，涉及服务拆分、注册治理、链路监控和核心流程建设。',
    stack: ['Spring Cloud Alibaba', 'Nacos', 'Feign', 'Redis', 'RocketMQ', 'SkyWalking'],
    highlight: '0-1 架构设计 + 微服务拆分 + 重点示范工程交付'
  },
  {
    name: '必要商城统一业务网关与交易链路优化',
    type: 'Commerce Gateway',
    desc: '围绕统一网关、交易链路、服务治理和接口规范进行重构优化，提升系统吞吐、可维护性与业务承载能力。',
    stack: ['Java', 'Dubbo', 'Redis', 'MySQL', 'Gateway', 'ElasticSearch'],
    highlight: '单体网关向分布式治理演进，吞吐提升约 3 倍'
  },
  {
    name: '辉立暗盘行情接入与实时推送系统',
    type: 'Realtime Market Data',
    desc: '接入辉立暗盘行情，完成行情接收、处理、日志验证与 WebSocket 推送，支持本地模拟与线上行情一致性验证。',
    stack: ['Spring Boot', 'WebSocket', 'Scheduler', 'Logback', 'Market Data'],
    highlight: '实时行情链路验证 + 生产日志可追溯'
  },
  {
    name: 'IP 归属统一查询服务',
    type: 'Internal Tool',
    desc: '统一封装第三方 IP 归属 API 与本地缓存，提供单 IP、批量 IP、指定来源查询能力，降低重复接入成本。',
    stack: ['Spring Boot', 'MyBatis-Plus', 'MySQL', 'HttpClient', 'Swagger'],
    highlight: '责任链查询 + 6个月缓存 + 统一内部 API'
  }
]
