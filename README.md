# 卡片橱窗小程序模板

一个开箱能跑的微信小程序模板：**首页分类筛选 + 卡片列表 + 详情页 + 关于页**。

改一个数据文件就能换成你自己的内容 —— 作品集、商品目录、课程列表、社团活动、菜单……都是这套结构。

基于 Taro 4.1.9 + React 18 + TypeScript + Sass，一套代码可以同时编译成微信小程序和网页（H5）。

---

## 先看它长什么样

```
┌─────────────────────────┐
│  深色头图                │
│  你的名字 · 作品集        │      ← 首页：头图 + 分类 + 卡片列表
│  作品橱窗                │
│  [小程序] [前端] [课程]   │
├─────────────────────────┤
│ 全部  校园工具  学习助手  │      ← 点标签筛选
├─────────────────────────┤
│ ┌───┐ 校园二手书流转  ›  │
│ │ 书 │ 开学季教材互换平台  │      ← 点卡片进详情
│ └───┘ [教材互换][扫码上架]│
├─────────────────────────┤
│ ┌───┐ 空教室查询      ›  │
│ │ 室 │ 自习找座不再碰运气  │
│ └───┘ [空教室][课程表]    │
└─────────────────────────┘
```

详情页是「图标抬头 → 亮点编号列表 → 内容模块双列 → 适用场景 → 详细信息 → 底部固定操作条」，关于页是「头像卡 → 自我介绍 → 三项能力 → 联系方式（点击复制）」。

---

## 三步跑起来

### 第 0 步：装环境（只需做一次）

**1. Node.js** —— 版本必须 ≥ 18，推荐 20 或 22

打开终端，输入：

```bash
node -v
```

显示 `v18.x` 以上就行。如果提示"不是内部或外部命令"，去 [nodejs.org](https://nodejs.org/) 下载 LTS 版装上，装完**重开终端**再试。

**2. 微信开发者工具** —— 做小程序必须有

去 [微信官方下载页](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html) 下"稳定版 Windows 64"，装好后用微信扫码登录。

> 还没装也不影响：本模板支持 H5 模式，浏览器里就能先看效果（见下面第 3 步 B 方案）。

### 第 1 步：拿到代码

```bash
git clone <这个仓库的地址>
cd taro-showcase-starter
```

没有 git 就点页面右上角 **Code → Download ZIP**，解压后进目录。

### 第 2 步：装依赖

```bash
npm install
```

第一次要下 300MB 左右，**慢是正常的**，国内建议先换镜像：

```bash
npm config set registry https://registry.npmmirror.com
```

装完看到 `added xxx packages` 就是成功了。

### 第 3 步：跑起来

**A 方案：看微信小程序（最终形态）**

```bash
npm run dev:weapp
```

终端出现 `编译成功` 后**别关这个窗口**（它在监听文件变化，改代码自动重编）。然后：

1. 打开微信开发者工具 → 导入项目
2. 目录选**本项目下的 `dist` 文件夹**（不是项目根目录，这点最容易错）
3. AppID 那里点「测试号」即可，不用注册
4. 点确定，模拟器里就能看到了

**B 方案：先在浏览器看（没装开发者工具时用）**

```bash
npm run dev:h5
```

然后浏览器打开 `http://localhost:10086`。

> 两个方案可以**同时开**。小程序产物输出到 `dist`，网页产物输出到 `dist-h5`，互不覆盖 —— 这样你可以一个屏幕看模拟器，一个屏幕看浏览器，改样式时对照着调。

---

## 换成你自己的内容

**只需要改两个文件，页面代码一行都不用动。**

### `src/data/items.ts` —— 所有卡片内容

```ts
export const items: ShowcaseItem[] = [
  {
    id: 'second-hand-book',      // 唯一标识，别和别的重复
    title: '校园二手书流转',      // 卡片大标题
    subtitle: '开学季教材互换平台', // 标题下面那行小字
    category: '校园工具',         // 必须和文件底部 categories 里的某一项一致
    badge: '书',                 // 图标里的 1-2 个字
    from: '#2b6cff',             // 图标渐变色·起点
    to: '#0f3fb8',               // 图标渐变色·终点
    tags: ['教材互换', '扫码上架'], // 卡片上的小标签，2-3 个最好看
    summary: '详情页开头的介绍段落……',
    highlights: ['第一条亮点', '第二条亮点'],   // 建议 3-4 条
    sections: [                               // 建议正好 4 个，双列排版刚好铺满
      { title: '扫码上架', desc: '扫 ISBN 自动识别' }
    ],
    usages: ['开学季', '教材回收'],            // 适用场景，短词
    details: [                                // 详细信息，3-4 行
      { label: '技术栈', value: 'Taro + React' }
    ]
  }
]
```

文件里每个字段都有注释，照着改就行。**六个示例全部是虚构的学生项目，没有一条是真实信息，放心覆盖。**

改完保存，终端会自动重编，模拟器立刻更新。想加第七个，直接往数组里再写一个对象。

### `src/data/site.ts` —— 关于页的你的信息

名字、身份、城市、自我介绍、三项能力、联系方式。联系方式填 `待填写` 时点击会提示"尚未填写"，不会报错。

### 想换配色？

打开 `src/styles/variables.scss`，七个颜色变量控制全局：

```scss
$navy: #0e1c33;      // 头图背景（深色）
$primary: #1f5eff;   // 主色，按钮和强调
$bg: #f4f6fa;        // 页面底色
$gold: #c8a15a;      // 点缀色
```

改完所有页面一起变。

---

## 项目结构

```
├── config/                  # Taro 构建配置（一般不用动）
│   ├── index.ts             # 主配置：设计稿宽度、输出目录
│   ├── dev.ts               # 开发模式配置
│   └── prod.ts              # 生产模式配置
├── src/
│   ├── app.ts               # 应用入口
│   ├── app.config.ts        # 全局配置：页面注册、导航栏颜色
│   ├── app.scss             # 全局样式
│   ├── data/
│   │   ├── items.ts         # ★ 所有卡片内容，改这里
│   │   └── site.ts          # ★ 关于页信息，改这里
│   ├── pages/
│   │   ├── index/           # 首页：头图 + 分类 + 列表
│   │   ├── detail/          # 详情页
│   │   └── about/           # 关于页
│   └── styles/
│       └── variables.scss   # ★ 配色变量，改这里
├── dist/                    # 小程序构建产物（自动生成，已 gitignore）
├── dist-h5/                 # 网页构建产物（自动生成，已 gitignore）
├── project.config.json      # 微信开发者工具配置
└── types/                   # TypeScript 类型声明
```

---

## 加一个新页面

比如加个"联系我"页：

```bash
npm run new
```

按提示选 `页面`，输入路径 `contact`。然后在 `src/app.config.ts` 的 `pages` 数组里加一行：

```ts
pages: [
  'pages/index/index',
  'pages/detail/index',
  'pages/about/index',
  'pages/contact/index'   // 新加的
]
```

用 `Taro.navigateTo({ url: '/pages/contact/index' })` 跳过去。

---

## 遇到报错看这里

先把这份看完：[docs/PITFALLS.md](docs/PITFALLS.md) —— 收录了 10 个新手一定会撞上的坑，每个都有"报错原文 → 原因 → 怎么修"。目录像这样：

| 报错 | 一句话原因 |
|---|---|
| `Sources changed during compilation` | 首次编译产生的缓存被当成源码变动，重跑一次就好 |
| `'padStart' does not exist` | 小程序不支持这个 API，用 `slice(-2)` 替代 |
| 模拟器一片空白 | 导入时选了项目根目录，要选 `dist` |
| `npm install` 卡住不动 | 没换国内镜像 |
| Sass 一堆 `@import` 警告 | 只是警告，不影响运行 |

---

## 说明

- 模板代码可自由用于个人项目、课程作业、比赛作品和商业项目，不需要署名。
- 示例文案（六个学生项目、自我介绍）均为虚构，请替换后再发布。
- AppID 默认是 `touristappid`（游客模式），只能本地开发预览。要真机扫码或上传体验版，得去 [微信公众平台](https://mp.weixin.qq.com/) 注册小程序拿到自己的 AppID，改到 `project.config.json` 里。
- Taro 4 官方文档：[docs.taro.zone](https://docs.taro.zone/docs/)
