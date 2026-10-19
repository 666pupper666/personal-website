# 个人作品集网站

中文个人作品集网站，包含可操作的前台和本地演示管理后台。前台展示个人信息、技能、项目和博客；后台 `/admin` 可以修改这些内容。数据保存在浏览器 `localStorage` 中，刷新页面后仍然保留。

项目按照根目录的 `PRD.md`、`TECH_DESIGN.md` 和 `AGENTS.md` 开发，三份原始文档均已保留，未修改或覆盖。

## 技术栈

- React 18 + TypeScript
- Vite 5
- React Router 6
- 纯 CSS（深色主题、星空背景、响应式布局）
- localStorage（无后端、无数据库、无第三方收费服务、无 API 密钥）

## 视觉风格

深色暖中性底（`#0b0a09`）+ 单一黄铜色点缀（`#d6b07a`），不使用高饱和的蓝紫渐变；星空背景保留，但星点和雾光都调成暖白，保证长时间阅读不刺眼。

所有颜色集中在 `src/styles/global.css` 顶部的 `:root` 变量中。调整主色只需修改 `--accent`、`--accent-rgb`（带透明度的点缀色）和 `--gradient`（按钮与标题渐变）三个变量，其余组件会自动跟随。`index.html` 的 `theme-color` 和 `public/favicon.svg` 需要同步修改。`PRD.md` 第 5 节原本写的「蓝紫色点缀」已按需求替换为这套暖配色，三份原始文档本身没有改动。

## 本地运行

环境要求：Node.js 18 或更高版本（已在 Node.js 24 下验证），npm 9 或更高版本。

```bash
npm install
npm run dev
```

浏览器打开终端提示的地址，默认是 <http://localhost:5173>。

其他命令：

```bash
npm run build     # 类型检查并构建生产文件到 dist/
npm run preview   # 本地预览构建结果
npm run typecheck # 只运行 TypeScript 类型检查
```

## 页面路由

| 路由 | 说明 |
| --- | --- |
| `/` | 首页：个人介绍、技能、项目、博客列表 |
| `/posts/:id` | 博客文章详情；文章不存在时显示提示 |
| `/admin` | 本地演示管理页面 |
| 其他地址 | 404 页面 |

导航中的「关于我」「技能」「项目」「博客」会滚动到首页对应区块；从文章详情或后台点击时，会先返回首页再定位。

## 管理后台

访问 `/admin` 即可进入，不需要账号。页面顶部明确标注「本地演示 · 无账号登录」，这不是安全认证。

- **个人信息**：姓名、个人定位、一句话介绍、个人简介、学习方向。保存后首页立即更新。
- **技能**：新增、编辑、删除；前台按「分类」分组展示。
- **项目**：新增、编辑、删除；技术标签用中文或英文逗号分隔；链接只允许 `http://` 或 `https://`，可以留空。
- **博客**：新增、编辑、删除；日期格式为 `YYYY-MM-DD`；正文按空行分段，以纯文本渲染。
- **数据备份**：导出 JSON、导入 JSON、恢复示例数据、查看当前数据大小。

删除、导入覆盖、恢复示例数据都会弹出确认框。每次保存、导入、导出、删除都有成功或失败提示。

### 表单校验

- 必填字段为空、超出长度限制时，会在字段下方显示中文错误，并阻止保存。
- 项目链接必须是有效的 `http` / `https` 地址。
- 标签最多 8 个，每个不超过 20 个字符，自动去重。
- 博客日期必须是真实存在的日期。
- 导入文件会额外校验 `version`、数据结构、字段类型、ID 唯一性、数组数量、链接协议和日期。

### JSON 导入导出

导出会下载 `personal-website-backup-<日期>-<时间>.json`，内容是可读格式的完整 `SiteData`。导入文件大小限制为 1 MB，导入前会展示其中包含的技能、项目、文章数量并要求确认覆盖。格式错误的文件会在页面内列出具体问题，不会写入本地数据。

数据结构示例：

```json
{
  "version": 1,
  "profile": {
    "name": "我的名字",
    "tagline": "前端开发学习者",
    "intro": "一句话介绍",
    "about": "个人简介",
    "learning": "学习方向"
  },
  "skills": [
    { "id": "skill-react", "name": "React", "category": "前端框架", "description": "技能说明" }
  ],
  "projects": [
    { "id": "project-demo", "name": "项目名称", "description": "项目简介", "tags": ["React"], "link": "" }
  ],
  "posts": [
    {
      "id": "post-demo",
      "title": "文章标题",
      "summary": "文章摘要",
      "content": "正文内容。空行会分段。",
      "date": "2026-10-19",
      "tags": ["示例文章"]
    }
  ],
  "updatedAt": "2026-10-19T02:00:00.000Z"
}
```

ID 只能包含字母、数字、下划线和短横线，长度 1–64。

## 数据存储与限制

- 存储键名：`personal-website:site-data:v1`，同时保存 `version: 1`。
- 首次访问会加载 `src/data/defaultData.ts` 中的示例数据。
- 所有读写都经过 `src/api/siteData.ts`，组件不直接操作 localStorage。
- 同一浏览器的其他标签页保存后，当前页面会通过 `storage` 事件同步。
- 读取到的数据会先校验。若数据损坏，页面展示提示并暂时使用示例数据，**不会静默覆盖原始数据**；只有用户明确保存、导入或恢复示例数据时才会替换。
- 数据仅保存在当前浏览器、当前网站地址下，**不能跨浏览器或跨设备同步**。清理浏览器数据、使用无痕模式、更换域名后内容不会保留。
- `localStorage` 容量有限（不同浏览器通常只有几 MB），保存失败时会提示。重要内容请及时导出备份。
- 本地开发地址与线上域名属于不同的存储作用域，部署后需要重新编辑或通过 JSON 导入迁移内容。

后台是本地的内容编辑器，**不是真实账号系统**，也不提供服务端鉴权、多用户协作或评论功能。

## 部署

构建命令统一为 `npm run build`，输出目录为 `dist`。项目已经配置 SPA 路由回退，直接访问 `/admin` 或 `/posts/:id` 不会 404。

### Vercel

1. 将项目推送到 Git 仓库，在 Vercel 导入该仓库。
2. Framework Preset 选择 **Vite**（Build Command：`npm run build`，Output Directory：`dist`）。
3. 根目录的 `vercel.json` 已包含重写规则：

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

4. 部署完成后直接打开 `https://你的域名/admin` 验证。

### Cloudflare Pages

1. 在 Cloudflare Pages 连接仓库。
2. 构建命令填 `npm run build`，构建输出目录填 `dist`。
3. `public/_redirects` 会被复制到 `dist/_redirects`，内容为：

```
/*    /index.html   200
```

Cloudflare Pages 会据此把所有路径回退到 `index.html`。也可以在 Pages 项目的设置中启用 Single Page Application 回退。

### 其他静态托管

只要把 `dist` 目录作为静态站点发布，并把未知路径重写到 `index.html` 即可。若平台不支持回退配置，直接访问 `/admin` 会返回 404。

> 不能直接双击 `dist/index.html` 以 `file://` 方式打开，SPA 路由和本地存储都需要通过 HTTP 服务访问。

## 项目结构

```
.
├── PRD.md                  # 产品需求文档（保留原始文档）
├── TECH_DESIGN.md          # 技术设计文档（保留原始文档）
├── AGENTS.md               # AI 开发规范（保留原始文档）
├── public/
│   ├── favicon.svg
│   └── _redirects          # Cloudflare Pages SPA 回退
├── src/
│   ├── api/
│   │   ├── siteData.ts     # 统一 localStorage 读写、导入解析
│   │   └── validate.ts     # 数据校验与规范化
│   ├── components/
│   │   ├── admin/Field.tsx # 表单输入组件
│   │   ├── Footer.tsx
│   │   ├── Navbar.tsx
│   │   ├── ScrollManager.tsx
│   │   ├── SectionHeading.tsx
│   │   ├── StarryBackground.tsx
│   │   └── StorageNotice.tsx
│   ├── context/
│   │   ├── ConfirmContext.tsx  # Promise 式确认弹窗
│   │   ├── SiteDataContext.tsx # 全站数据状态与跨标签页同步
│   │   └── ToastContext.tsx    # 成功/失败提示
│   ├── data/
│   │   ├── defaultData.ts  # 初始示例数据
│   │   └── limits.ts       # 数据版本与长度限制
│   ├── hooks/usePageTitle.ts
│   ├── pages/
│   │   ├── admin/          # 个人信息、技能、项目、博客、数据备份面板
│   │   ├── AdminPage.tsx
│   │   ├── HomePage.tsx
│   │   ├── NotFoundPage.tsx
│   │   └── PostDetailPage.tsx
│   ├── styles/global.css
│   ├── types/index.ts
│   ├── utils/
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig*.json
├── vite.config.ts
└── vercel.json
```

## 初始内容说明

- 个人信息、教育背景、项目与获奖信息来自本人提供的简历，并做了精简表述：页面不展示论文全名和算法细节，只保留研究方向、角色与结果。
- 姓名显示为「张毅博」，可在后台修改。
- 三个项目分别是：感知一致的水下图像增强方法（第一作者，IEEE TCE）、光辐射测量与 AI 融合实验、禹迹守望船舶行为与险情检测；标签按简历整理，简历未提供项目链接，因此链接留空。
- 简历中的电话、邮箱和详细住址没有写入站点，避免公开页面暴露联系方式；如确需展示，可再扩展个人信息字段。
- 两篇博客均以「示例文章：」开头，内容用于演示功能，并明确标注为示例；没有根据简历虚构文章。
- 如果浏览器中已经保存过旧版本的数据，页面会优先显示本地数据。这时需要在后台「数据备份」中恢复默认数据，或清除该站点的 localStorage，才能看到新的初始内容。

## 安全与边界

- 不接入付费服务、第三方接口或统计脚本，不需要 API 密钥。
- 不使用 `dangerouslySetInnerHTML`，用户输入全部作为文本渲染。
- 项目链接只允许 `http` / `https` 协议，打开时使用 `rel="noopener noreferrer"`。
- 不保存真实密码，不包含账号系统；后台入口不构成安全认证。
- `.gitignore` 已排除 `node_modules`、`dist` 和 `.env*`，避免提交依赖、构建产物或密钥。

## 已执行的测试

以下检查均在本机实际执行（Windows、Node.js v24.17.0、npm 11.13.0、Chromium 浏览器）：

- [x] `npm run build` 通过（`tsc -b` 类型检查 + Vite 构建），生成 `dist`。
- [x] 前台首页可打开，导航、区块定位和文章入口可操作。
- [x] 手机宽度 375×812 下首页和后台无页面横向滚动（后台标签栏自身可横向滚动）。
- [x] 个人信息编辑：清空姓名时显示「姓名不能为空」并阻止保存；保存后前台立即更新。
- [x] 刷新页面后个人信息仍然保留（localStorage 持久化）。
- [x] 技能新增、编辑、删除及删除确认框均正常。
- [x] 项目新增、编辑、删除正常；`javascript:` 链接被拒绝并显示错误，改为 `https://` 后保存成功。
- [x] 博客新增、编辑、删除正常；日期清空时提示「日期不能为空」。
- [x] 新增文章后可打开详情页，正文按空行分段；访问不存在的文章显示 404 提示。
- [x] 导出 JSON 实际生成下载文件；导入合法备份出现覆盖确认并可成功写入。
- [x] 导入损坏的 JSON 时显示具体错误，未覆盖现有数据。
- [x] 本地数据损坏时页面显示提示并暂时展示示例数据，原始数据未被覆盖。
- [x] 后台标签支持左右方向键切换，删除确认框默认聚焦取消按钮并支持 Esc 关闭。
- [x] 上述页面交互过程中未捕获到运行时错误或未处理的 Promise 拒绝。
- [x] `npm run preview` 生产预览下直接访问 `/admin` 和 `/posts/:id` 均正常返回页面。
- [x] 桌面与手机导航菜单可打开、关闭，移动端菜单链接可定位到对应区块。

> 说明：Vercel 和 Cloudflare Pages 的路由回退配置已写入项目并检查内容，但未实际发布到这两个平台，因此不声称线上部署已通过。此清单只勾选实际执行过的检查。
