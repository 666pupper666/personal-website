# 技术设计文档

## 1. 技术栈
- React + TypeScript + Vite。
- 使用 CSS 实现响应式布局和深色主题。
- 使用 React Router 管理页面路由。
- 第一版使用 localStorage，不接后端和数据库。

## 2. 页面路由
- /：个人网站首页。
- /posts/:id：博客详情。
- /admin：本地演示管理页面。

## 3. 项目结构
- src/pages/：首页、文章详情、后台页面。
- src/components/：导航、卡片、表单等组件。
- src/data/：初始示例数据。
- src/api/：统一数据读取和保存接口。
- src/types/：TypeScript 数据类型。
- src/styles/：全局样式。
- public/：静态资源。

## 4. 数据模型
Profile：姓名、个人定位、简介、学习方向。
Skill：唯一 ID、名称、分类、说明。
Project：唯一 ID、名称、简介、技术标签、链接。
Post：唯一 ID、标题、摘要、正文、日期、标签。

全部数据使用统一的 SiteData 结构，包含版本号。

## 5. 数据存储
- 通过统一接口读取、保存 localStorage。
- 首次访问使用默认数据。
- 保存成功后更新界面，不要求用户手动刷新。
- 数据损坏时提示用户，不静默覆盖原数据。
- 导入 JSON 时校验结构、字段类型和长度。
- 导入覆盖现有数据前要求确认。

## 6. 安全与边界
- 不在前端存储 API 密钥或真实密码。
- 后台是本地内容编辑器，不提供安全认证。
- 用户内容以文本渲染，不直接插入不可信 HTML。
- 外部链接只允许 http 或 https。
- 本地数据不能跨浏览器和设备共享。

## 7. 部署
- npm run dev：本地开发。
- npm run build：生成生产文件。
- 构建输出目录为 dist。
- 部署平台选择 Vercel 或 Cloudflare Pages。
- 配置 SPA 回退，确保直接访问 /admin 和文章详情不报 404。
