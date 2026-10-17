# dsh-plugin-claude-mobile

> Claude 风格的 **手机版布局优化 + 竖列设置面板** —— DeepSeek Harness（dsh）插件

---

## 它解决什么问题

DSH 的手机版把桌面侧栏原样搬了过来：侧栏只有 **56px 宽**，图标被裁掉一半，还跟主内容区抢宽度。

这个插件把它改成移动端标准形态：

| 修复前 | 修复后 |
|---|---|
| 侧栏 56px 竖条，图标被裁 | **底部标签栏**，图标完整、一行横排、铺满整宽 |
| 图标挤在 56px 里 | 每个触摸目标 ≥ 42×42，拇指可达 |
| 主内容区被侧栏吃掉宽度 | 内容区全宽，底部自动避让安全区 |
| 冷灰蓝配色 | **Claude 暖象牙 + 赤陶橙**（取自 claude.ai 设计规范，可关） |

另外附带一个 **8 项竖列设置面板**，挂在下述两个地方：

- **DSH 原生设置面板**里出现一个「Claude 手机版」分区（走官方 `settings.section` slot）
- 右下角一个**悬浮设置键**，点击直接打开同一套设置（手机上单手可达）

---

## 安装

```bash
# 从 git 源安装（推荐）
dsh plugin --profile web add "github:XiaoBaiLovesStirring/dsh-plugin-claude-mobile#main"

# 或从本地目录安装（开发时用）
cd /path/to/dsh-plugin-claude-mobile
dsh plugin --profile web add "$PWD"
```

装完**重启** `dsh web`。验证是否挂上：

```bash
dsh web --dump-config | grep claude-mobile
# 应该看到：
# # == dsh-plugin-claude-mobile
# - id: dsh-plugin-claude-mobile
```

卸载：

```bash
dsh plugin --profile web remove dsh-plugin-claude-mobile
```

---

## 设置项

全部竖列（一行一项），改完即时生效，存在浏览器 `localStorage`：

| 设置项 | 选项 | 说明 |
|---|---|---|
| **手机端导航** | 底部标签栏 / 侧边图标栏 / 不做修改 | 手机上侧栏的形态。默认把 56px 图标条改成底部标签栏 |
| **配色方案** | Claude 暖色 / 系统原生 | Claude 暖色取自 claude.ai 的设计规范 |
| **外观模式** | 跟随系统 / 浅色 / 深色 | |
| **界面缩放** | 小 / 标准 / 大 / 特大 | |
| **紧凑模式** | 关 / 开 | 压缩行距，同屏显示更多内容 |
| **手机上隐藏右侧栏** | 隐藏 / 保留 | 窄屏下把右侧详情栏收起 |
| **手机判定宽度** | 1100 / 900 / 768 / 600 px | 视口窄于该值时启用手机端布局 |
| **悬浮设置键** | 显示 / 隐藏 | 右下角常驻设置按钮 |

触屏上**不用装插件也能改**：设置面板里每一项都有说明文字，直接点选项即可。

---

## 它是怎么实现的

**浏览器半部**（`lib/client.js`，纯 JS，零构建）：

1. 往 `<html>` 上投影一组 `data-dcm-*` 属性（主题 / 模式 / 布局 / 缩放 / 阈值判定），
   全部样式由 CSS 属性选择器驱动 —— 所以切换设置不需要重渲染 React 树。
2. 注入一段样式表，用 **`[class*="_sidebarCol"]` 这类子串匹配**定位 DSH 的布局容器。
   DSH 的 class 名是 CSS Modules（形如 `pI_x6G_sidebarCol` = hash + 语义名），
   取语义后缀匹配，**换版本重新构建也不会失效**。
3. 用官方 `settings.section` slot 挂一个 React 设置页：
   ```js
   ctx.slots.inject('settings.section', () =>
     ctx.slots.register({ name: 'settings.section', id: 'claude-mobile',
                          order: 90, label: () => 'Claude 手机版' }, SettingsPage))
   ```
4. 右下角悬浮键 + 面板是原生 DOM 实现，**不依赖 React** —— 
   即使某天 slot 契约变了，设置入口依然能用。

所有副作用都注册在 `ctx.effect()` 里并带清理函数，插件卸载后 `<html>` 属性、
样式表、悬浮键会被完整回收。

---

## 兼容性

| 项 | 值 |
|---|---|
| 开发基线 | dsh **0.1.0-rc.7** |
| 实测版本 | dsh **0.2.0-rc.2** |
| Node | `^22.19 \|\| >=24` |
| 平台 | Web（`platform: "web"`） |

移动端断点默认 **900px**，可在设置里改。桌面端（>900px）布局不做任何改动，
只保留 Claude 配色和悬浮设置键。

---

## 目录结构

```
dsh-plugin-claude-mobile/
├── package.json          插件清单（dsh.bundle + dsh.client）
├── cordis.patch.yml      bundle 的装载补丁
├── lib/
│   ├── index.js          host 半部（空实现）
│   └── client.js         浏览器半部：样式 + 设置面板（全部逻辑）
├── README.md
└── LICENSE
```

---

## 许可

MIT
