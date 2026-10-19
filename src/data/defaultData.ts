import type { SiteData } from '../types';
import { DATA_VERSION } from './limits';

/**
 * 初始内容。
 * 个人信息、教育背景、项目与获奖来自本人简历，做了精简表述，
 * 未补充简历之外的内容，也未写入论文全名和联系方式。
 * 所有字段仍可在 /admin 中修改。
 */
const defaultData: SiteData = {
  version: DATA_VERSION,
  profile: {
    name: '张毅博',
    tagline: '计算机科学与技术本科生 · 水下视觉与机器学习',
    intro:
      '大连海事大学计算机科学与技术专业 2023 级本科生，关注水下图像增强与视觉感知，以第一作者在 IEEE Transactions on Consumer Electronics 发表论文。',
    about:
      '我是张毅博，大连海事大学计算机科学与技术专业 2023 级本科生，GPA 3.78/5.0，专业总评排名 6/70，已通过 CET-4 和 CET-6。\n\n主要研究方向是水下图像增强与视觉感知，以第一作者在 IEEE Transactions on Consumer Electronics 发表论文，并参与相关专利。另参与光辐射测量与 AI 融合实验，使用随机森林回归完成参数预测建模。\n\n作为项目负责人参与「禹迹守望」船舶行为与险情检测系统，项目获校级大学生创新创业训练计划立项。在校期间获得一等奖学金、招商轮船二等奖学金和「三好学生」等荣誉，担任班长，曾担任升旗仪式护旗手并获评省级优秀志愿者。',
    learning:
      '课程重点包括数据结构、算法设计与分析、数据库原理等；科研上关注水下图像增强、计算机视觉与机器学习，以及算法在边缘设备上的部署效率。',
  },
  skills: [
    {
      id: 'skill-underwater-enhance',
      name: '水下图像增强',
      category: '图像处理与视觉',
      description: '处理水下图像的偏色与亮度问题，并尽量保留结构细节。',
    },
    {
      id: 'skill-computer-vision',
      name: '计算机视觉',
      category: '图像处理与视觉',
      description: '面向船上场景的视频流行为与险情目标检测。',
    },
    {
      id: 'skill-random-forest',
      name: '随机森林回归',
      category: '机器学习与数据',
      description: '用于光辐射参数预测建模，实验中 R² 超过 0.95。',
    },
    {
      id: 'skill-feature-engineering',
      name: '特征工程',
      category: '机器学习与数据',
      description: '多维测量数据的预处理与特征整理。',
    },
    {
      id: 'skill-paper-patent',
      name: '论文与专利',
      category: '科研与工程',
      description: '以第一作者在 IEEE Transactions on Consumer Electronics 发表论文，并参与相关专利。',
    },
    {
      id: 'skill-algorithm-deploy',
      name: '算法实现与部署',
      category: '科研与工程',
      description: '研究方案设计、算法实现与轻量化部署。',
    },
  ],
  projects: [
    {
      id: 'project-underwater-enhance',
      name: '感知一致的水下图像增强方法',
      description:
        '面向水下农业的视觉感知需求，研究图像偏色、亮度不均与细节退化问题，提出一种感知一致的水下图像增强方法。负责方案设计与算法实现，并完成轻量化部署，成果以第一作者发表于 IEEE Transactions on Consumer Electronics。',
      tags: ['2024.06–2025.12', '第一作者', 'IEEE TCE', '水下图像增强'],
      link: '',
    },
    {
      id: 'project-radiometric-ai',
      name: '光辐射测量与 AI 融合实验',
      description:
        '围绕光辐射测量的参数建模与信息反演，参与设计自动化测量平台，负责数据预处理与特征工程，采用随机森林回归完成参数预测，实验中 R² 超过 0.95。',
      tags: ['2025.09–2025.11', '随机森林', '回归建模'],
      link: '',
    },
    {
      id: 'project-yuji-shouwang',
      name: '禹迹守望：船舶行为与险情检测',
      description:
        '基于计算机视觉与深度学习的船上行为与险情检测系统，面向驾驶台、机舱与甲板场景进行动态监测和预警。负责整体设计、数据采集清洗与预处理，并参与项目答辩，项目获校级大学生创新创业训练计划立项。',
      tags: ['2024.11–2025.12', '项目负责人', '目标检测', '校级大创'],
      link: '',
    },
  ],
  posts: [
    {
      id: 'post-demo-build-portfolio',
      title: '示例文章：我是如何搭建这个作品集网站的',
      summary: '一篇用于演示博客列表与文章详情页的示例文章，说明本站的技术选型和数据结构。',
      content:
        '这是一篇示例文章，用来演示博客列表、文章详情页和标签的展示效果。它的内容不代表真实的项目经历，你可以删除它，或者在本地演示后台中改写。\n\n本站使用 React、TypeScript 和 Vite 搭建，页面路由由 React Router 管理。首页展示个人信息、技能、项目和博客列表，文章详情页通过 /posts/:id 访问，管理页面位于 /admin。\n\n所有内容保存在浏览器本地的 localStorage 中。第一次访问时会加载初始数据，之后在后台保存的修改会立即在前台生效，刷新页面后依然保留。\n\n需要说明的是，这种存储方式只对当前浏览器和当前网站地址有效。更换浏览器、清理站点数据或使用无痕模式，都会读到新的初始数据。它适合课程演示，不适合作为真实的多设备内容管理系统。\n\n封面、配图和更丰富的排版可以在后续版本中补充。当前版本刻意保持简单，让内容结构清楚、页面加载轻快。',
      date: '2026-10-19',
      tags: ['示例文章', '前端'],
    },
    {
      id: 'post-demo-localstorage',
      title: '示例文章：使用 localStorage 做本地演示的三个注意点',
      summary: '本地存储方便演示，但也有容量、作用域和数据损坏的风险，这篇示例文章记录了基本处理方式。',
      content:
        '这是一篇示例文章，用于说明本站的数据保存方式，不构成技术结论或个人经验分享。\n\n第一，localStorage 有容量限制。不同浏览器的上限并不完全相同，通常只有几 MB。因此本站在导入数据时会限制文件大小，并在保存失败时给出提示。\n\n第二，localStorage 按「浏览器 + 网站地址」隔离。在本地开发地址保存的内容，部署到线上域名后不会自动带过去，需要用导出和导入功能迁移数据。\n\n第三，本地数据可能损坏或被手动修改。本站读取数据时会先校验结构、字段类型和长度；如果发现异常，会展示提示并保留原始数据，不会在未确认的情况下覆盖它。\n\n如果之后需要多设备同步或真实账号体系，应当引入服务端存储和身份认证。当前版本明确标注为「本地演示管理」，不提供安全登录。',
      date: '2026-10-12',
      tags: ['示例文章', 'localStorage'],
    },
  ],
  updatedAt: new Date().toISOString(),
};

/** 返回一份全新的默认数据副本，避免调用方修改共享对象 */
export function createDefaultData(): SiteData {
  return {
    ...defaultData,
    profile: { ...defaultData.profile },
    skills: defaultData.skills.map((skill) => ({ ...skill })),
    projects: defaultData.projects.map((project) => ({
      ...project,
      tags: [...project.tags],
    })),
    posts: defaultData.posts.map((post) => ({ ...post, tags: [...post.tags] })),
    updatedAt: new Date().toISOString(),
  };
}
