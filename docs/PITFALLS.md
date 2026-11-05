# 新手踩坑对照表

这份文档按「你会看到什么错误」来查。左边找到你的报错原文，右边看原因和修法。

**先记住一条**：80% 的问题出在"目录选错"和"依赖没装完"这两件事上，遇到问题先确认这两个。

---

## 一、编译阶段的报错

### 1. `Sources changed during compilation, please rebuild`

```
⚠️ 编译失败：Sources changed during compilation
```

**原因**：不是你代码写错了。Taro 第一次编译会在项目里生成 `.swc` 缓存目录，文件监听器把它当成"源码在编译过程中被修改了"，于是主动中止，防止产物不一致。

**怎么修**：**原样再跑一次** `npm run dev:weapp`，第二次必定成功。之后只要别删 `.swc` 目录就不会再触发。

判断方法：如果是这个原因，报错里不会有任何 `Module not found` 或语法错误信息，只有这一行。

---

### 2. `Module not found: Can't resolve 'xxx'`

```
Module not found: Error: Can't resolve '../../data/products'
```

**原因**：多半是三种之一 —— ① 引用的文件被删了或改名了；② 路径大小写不对（Windows 不区分，但打包器区分）；③ 依赖没装完。

**怎么修**：

1. 检查 `src/` 下真的有这个文件，文件名大小写完全一致
2. 引用自己写的文件用相对路径 `../../data/items`，不要用 `@/data/items`（本项目没配别名）
3. 如果报的是 `@tarojs/xxx` 这类包名，删掉 `node_modules` 重装：

```bash
rm -rf node_modules package-lock.json
npm install
```

---

### 3. `Error: error:0308010C:digital envelope routines::unsupported`

**原因**：Node 版本太高（18 以前的老项目会这样），OpenSSL 3 不再支持旧的哈希算法。

**怎么修**：本项目用的 Taro 4 已适配，正常不会出现。真遇到了先确认 Node 版本：

```bash
node -v
```

低于 18 就升级；如果确实是高版本还报这个，临时绕过：

```bash
# Windows PowerShell
$env:NODE_OPTIONS="--openssl-legacy-provider"
npm run dev:weapp
```

---

### 4. `Node.js version XX is not supported`

**原因**：Taro 4 要求 Node ≥ 18。

**怎么修**：去 [nodejs.org](https://nodejs.org/) 装 LTS 版，装完**关掉终端重新开**（这是关键，很多人装完没重开，还是旧版本）。

用 nvm 的话：

```bash
nvm install 20
nvm use 20
```

---

## 二、模拟器里的问题

### 5. 微信开发者工具打开后一片空白 / 报"未找到 app.json"

**这是最高频的错，99% 是目录选错了。**

**原因**：`npm run dev:weapp` 的产物在项目里的 `dist` 目录，但导入项目时选了项目根目录。

**怎么修**：

1. 先确认终端里已经出现"编译成功"，且 `dist` 目录真的存在
2. 重新导入：微信开发者工具 → 项目 → 导入项目 → 目录选到 **`你的项目路径/dist`**
3. 实在不确定，看 `dist` 里有没有 `app.json`，有就说明产物正常，是导入路径的锅

---

### 6. 改了 `items.ts`，模拟器没变化

**原因**：`npm run dev:weapp` 的监听进程被关掉了，或者改的是 `dist` 里的文件（改产物没用，下次编译会被覆盖）。

**怎么修**：

1. 确认跑 `dev` 的终端窗口还开着，且没报错
2. 只改 `src/` 下的文件，永远不要手动改 `dist/`
3. 实在不刷新，在开发者工具里点「编译」按钮，或 Ctrl+B

---

### 7. `TypeError: xxx.padStart is not a function`

**原因**：`String.prototype.padStart` / `padEnd` 属于较新的 API，部分微信基础库版本不支持，编译降级后可能丢失。

**怎么修**：用 `slice(-2)` 取末两位，效果完全等价：

```ts
// ❌ 可能报错
String(index + 1).padStart(2, '0')

// ✅ 稳定
`0${index + 1}`.slice(-2)
```

本模板的详情页和关于页已经用后一种写法。

---

### 8. 页面上写了 `<div>` `<span>`，但什么都不显示

**原因**：小程序里没有 HTML 标签，必须用 Taro 提供的组件。

**怎么修**：做以下替换 ——

| 别写 | 改成 |
|---|---|
| `div` | `View` |
| `span` / `p` / `h1` | `Text` |
| `img` | `Image` |
| `input` | `Input` |
| `button` | `Button` |
| `a` | `Navigator` |

注意首字母大写，并且要从 `@tarojs/components` 导入：

```tsx
import { View, Text, Image } from '@tarojs/components'
```

判断方法：编译不报错但页面空白，打开调试器看结构里有没有 `wx-view`，没有就是这个问题。

---

### 9. 样式不生效，尤其是 `position: sticky`、`display: grid`

**原因**：小程序渲染层不是完整浏览器，部分 CSS 特性支持有限。

**怎么修**：

- `position: sticky` 在部分基础库不稳，改用 `position: fixed` 或用 `ScrollView` 的 `stickyHeader`
- `display: grid` 在老基础库不支持，改用 `flex` + `flex-wrap`
- 选择器别用 `*`、`:hover`、`>` 这类，小程序对复杂选择器支持差
- 样式文件必须是 `.scss` 或 `.css`，且在页面 `.tsx` 里 `import './index.scss'`

本项目所有布局都用 `flex`，就是为了避开这些坑。

---

## 三、装依赖的问题

### 10. `npm install` 卡住不动 / `ECONNRESET` / `ETIMEDOUT`

**原因**：默认 npm 源在国外，国内网络容易断。

**怎么修**：

```bash
npm config set registry https://registry.npmmirror.com
npm install
```

如果之前装了一半失败过，先清干净再装：

```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

还有一条：**项目路径里不要有中文和空格**。像 `D:\我的项目\小程序` 这种路径，npm 装包时偶尔会报找不到模块。放到 `D:\Projects\xxx` 这种纯英文路径最稳。

---

### 11. 装依赖时报 `gyp ERR!` / `node-gyp` 相关错误

**原因**：某个包需要本地编译，机器上缺 C++ 编译工具。本项目**不需要**编译原生模块，遇到通常是包版本解析到了错误的依赖。

**怎么修**：删掉锁文件重装（同第 10 条的清理命令）。如果反复出现，检查是不是 Node 版本装了两个（系统一个、nvm 一个），用 `where node` 看路径是否唯一。

---

## 四、发布相关

### 12. 真机预览扫不出码 / 提示没有权限

**原因**：`project.config.json` 里的 `appid` 是 `touristappid`（游客模式），只能本地预览，不能真机调试、不能上传。

**怎么修**：

1. 去 [微信公众平台](https://mp.weixin.qq.com/) 注册小程序（个人主体免费，几分钟）
2. 拿到 AppID，填到 `project.config.json`：

```json
{
  "appid": "wx你的appid"
}
```

3. 重新打开开发者工具
4. 要在手机上预览，还需要在该页面把开发者加为项目成员

---

### 13. 上传时提示 `不在以下 request 合法域名列表中`

**原因**：小程序默认只允许请求已备案并配置过的域名。开发阶段调接口会撞这个。

**怎么修**：

- **开发时**：开发者工具右上角 详情 → 本地设置 → 勾选「不校验合法域名」
- **上线前**：必须去公众平台把接口域名加到「服务器域名」白名单，且域名要 HTTPS + 已备案

注意：勾选"不校验"只在开发者工具里有效，真机上照样会拦。

---

## 五、H5 预览的问题

### 14. `npm run dev:h5` 启动就崩溃：`finalInputFileSystem._writeVirtualFile is not a function`

```
TypeError: finalInputFileSystem._writeVirtualFile is not a function
    at VirtualModulesPlugin.writeModule (webpack-virtual-modules/src/index.ts:200:26)
    at TaroPrebundle (webpack5-prebundle/src/index.ts:144:23)
```

**原因**：Taro 为了加快开发服务器启动，会自动预打包依赖（prebundle），这一步用到了 `webpack-virtual-modules`。在部分环境（Windows + Node 20/22）下这个组合会抛异常，直接进程退出。注意 `npm run build:h5` 不会触发，只有 `dev` 会 —— 所以很容易误判成"代码有问题"。

**怎么修**：在 `config/index.ts` 里关掉预打包。本模板已经关了，如果你是自己新建的 Taro 项目，找到 `compiler` 这一行改成对象写法：

```ts
compiler: {
  type: 'webpack5',
  prebundle: {
    enable: false
  }
}
```

代价是开发服务器首次启动慢几秒，但不会再崩。

**为什么不是别的原因**：报错栈里出现 `webpack-virtual-modules` 和 `webpack5-prebundle` 这两个包名，就一定是这个原因，不用去查自己的业务代码。

---

## 还没解决？

按这个顺序排查，能解决绝大多数问题：

1. **`node -v`** 是不是 ≥ 18
2. **路径**是不是纯英文、无空格
3. **`dist` 目录**有没有生成，里面有没有 `app.json`
4. **依赖**是不是装完了，`node_modules` 里有没有 `@tarojs` 目录
5. 把报错的**最后 20 行**（不是第一行）拿去搜，Taro 的关键错误信息通常在末尾

如果确认是模板本身的问题，欢迎开 issue，请附上：Node 版本、完整报错、`package.json` 内容。
