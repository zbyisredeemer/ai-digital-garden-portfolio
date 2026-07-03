# AI Digital Garden Portfolio

一个面向 Java 后端工程师的「AI 科技树个人作品集」模板，已按张本瑜的简历信息和个人站审美方向定制。

## 特点

- AI Welcome 小人
- 科技之树 + 半个地球 + 三维网络空间主视觉
- 点击节点跳转不同场景
- 命令行 Terminal 彩蛋入口
- Home / About / Skills / Experience / Projects / GitHub / Contact 清晰导航，高亮当前区块
- Resume 下载入口
- 邮件联系表单，提交后拉起本地邮件客户端
- GitHub 年度热力图视觉化占位
- 适配 Vercel 部署

## 本地运行

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
npm run preview
```

## 部署到 Vercel

1. 将仓库推送到 GitHub。
2. 登录 Vercel。
3. Import Project，选择该 GitHub 仓库。
4. Framework Preset 选择 Vite。
5. Build Command 使用 `npm run build`。
6. Output Directory 使用 `dist`。

## 修改个人信息

主要改这个文件：

```text
src/config.js
```

可修改：

- 姓名 / 职位 / 邮箱 / GitHub 用户名
- Skills 技能树
- Experience 工作经历
- Projects 项目星图

简历文件在：

```text
public/resume-zhang-benyu.md
```

## 注意

当前 GitHub 热力图是前端视觉化占位，没有调用 GitHub API。后续可以接入 GitHub GraphQL API、ghchart 服务，或者使用 GitHub Actions 定期生成静态贡献图。
