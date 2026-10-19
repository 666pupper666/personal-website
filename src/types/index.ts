/** 个人信息 */
export interface Profile {
  /** 姓名或昵称 */
  name: string;
  /** 个人定位，例如「前端开发学习者」 */
  tagline: string;
  /** 一句话介绍 */
  intro: string;
  /** 个人简介 */
  about: string;
  /** 学习方向 */
  learning: string;
}

/** 技能 */
export interface Skill {
  id: string;
  name: string;
  category: string;
  description: string;
}

/** 项目 */
export interface Project {
  id: string;
  name: string;
  description: string;
  tags: string[];
  /** 项目链接，允许为空；非空时只允许 http / https */
  link: string;
}

/** 博客文章 */
export interface Post {
  id: string;
  title: string;
  summary: string;
  /** 纯文本正文，按空行分段渲染，不解析 HTML */
  content: string;
  /** 日期，格式 YYYY-MM-DD */
  date: string;
  tags: string[];
}

/** 全站统一数据结构 */
export interface SiteData {
  version: number;
  profile: Profile;
  skills: Skill[];
  projects: Project[];
  posts: Post[];
  updatedAt: string;
}
