/** 当前数据结构版本，结构变化时递增 */
export const DATA_VERSION = 1;

/** 各字段的长度和数量限制，表单校验与导入校验共用 */
export const LIMITS = {
  profile: {
    name: 40,
    tagline: 60,
    intro: 120,
    about: 1000,
    learning: 600,
  },
  skill: {
    name: 40,
    category: 30,
    description: 300,
    maxCount: 100,
  },
  project: {
    name: 60,
    description: 400,
    link: 300,
    maxCount: 100,
  },
  post: {
    title: 80,
    summary: 200,
    content: 20000,
    maxCount: 200,
  },
  tags: {
    maxCount: 8,
    maxLength: 20,
  },
  importFileSize: 1024 * 1024,
} as const;

/** 站点基础信息 */
export const SITE = {
  title: '我的作品集',
  storageKey: 'personal-website:site-data:v1',
} as const;
