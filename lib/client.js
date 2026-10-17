/**
 * dsh-plugin-claude-mobile —— 浏览器半部
 *
 * 职责：
 *   1. 修复 DSH 手机版布局（侧栏 56px 图标条 → 底部标签栏）
 *   2. 把配色换成 Claude 网页版的暖象牙 + 赤陶橙
 *   3. 往设置面板挂一个自己的分区（settings.section），设置项竖列排布
 *   4. 额外提供一个右下角悬浮设置键（手机上单手可达）
 *
 * 形态与 DSH 官方客户端产物一致：window.__ModuleLoader__ 的懒 CJS 模块表。
 * 依赖的 react / react-dom 由运行时注入，不需要打包。
 */

window.__ModuleLoader__.load({
	id: "dsh-plugin-claude-mobile",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });

		let React = null;
		try {
			React = require("react");
		} catch (e) {
			React = null;
		}
		const h = React ? React.createElement : null;

		/* ============================================================
		 * 一、样式
		 * ========================================================== */

		const STYLE = `
/* ==========================================================================
   Claude 手机版 · DeepSeek Harness
   1) Claude 暖色令牌  2) 手机端布局修复  3) 设置面板 / 悬浮键
   ========================================================================== */

/* ---------- 1. Claude 暖色令牌 ---------- */
html[data-dcm-theme="claude"]{
  --dcm-bg:#faf9f5;
  --dcm-bg-alt:#f0eee6;
  --dcm-surface:#ffffff;
  --dcm-text:#1f1e1d;
  --dcm-text-dim:#6b6a64;
  --dcm-border:#e5e3da;
  --dcm-accent:#d97757;
  --dcm-accent-soft:#f5e9e2;
  --dcm-hover:#eae7dd;
  --dcm-shadow:0 1px 2px rgba(0,0,0,.04),0 8px 28px rgba(0,0,0,.07);
  color-scheme:light;
}
html[data-dcm-theme="claude"][data-dcm-resolved="dark"]{
  --dcm-bg:#1f1e1d;
  --dcm-bg-alt:#191817;
  --dcm-surface:#262624;
  --dcm-text:#f5f4ef;
  --dcm-text-dim:#a3a39d;
  --dcm-border:#3a3a36;
  --dcm-accent:#d97757;
  --dcm-accent-soft:#3b2e27;
  --dcm-hover:#2e2d2a;
  --dcm-shadow:0 1px 2px rgba(0,0,0,.3),0 8px 28px rgba(0,0,0,.4);
  color-scheme:dark;
}

/* 大面：底色与文字 */
html[data-dcm-theme="claude"] body{
  background:var(--dcm-bg) !important;
  color:var(--dcm-text) !important;
}
html[data-dcm-theme="claude"] [class*="_frame"]{
  background:var(--dcm-bg) !important;
}
html[data-dcm-theme="claude"] [class*="_centerCol"]{
  background:var(--dcm-bg) !important;
}
html[data-dcm-theme="claude"] [class*="_sidebarCol"]{
  background:var(--dcm-bg-alt) !important;
  border-color:var(--dcm-border) !important;
}
html[data-dcm-theme="claude"] [class*="_rightbarCol"]{
  background:var(--dcm-bg-alt) !important;
  border-color:var(--dcm-border) !important;
}

/* ---------- 2. 手机端布局修复 ---------- */

/* 压缩态：行距与内边距 */
html[data-dcm-compact="1"] [class*="_centerCol"] *{
  line-height:1.45 !important;
}

/* 界面缩放 */
html[data-dcm-font="sm"]  #root{ zoom:.94; }
html[data-dcm-font="lg"]  #root{ zoom:1.07; }
html[data-dcm-font="xl"]  #root{ zoom:1.14; }

/* 手机上隐藏右侧栏 */
@media (max-width:900px){
  html[data-dcm-hideright="1"] [class*="_rightbarCol"]{
    display:none !important;
  }
}

/* ---- 底部标签栏模式（手机默认） ---- */
@media (max-width:900px){
  html[data-dcm-mobile="1"][data-dcm-layout="bottom"] [class*="_frame"]{
    flex-direction:column !important;
  }

  /* 56px 图标条 → 底部通栏 */
  html[data-dcm-mobile="1"][data-dcm-layout="bottom"] [class*="_sidebarCol"]{
    position:fixed !important;
    left:0 !important;
    right:0 !important;
    bottom:0 !important;
    top:auto !important;
    width:100% !important;
    min-width:0 !important;
    max-width:100vw !important;
    height:auto !important;
    min-height:0 !important;
    max-height:62px !important;
    box-sizing:border-box !important;
    z-index:900 !important;
    display:flex !important;
    flex-direction:row !important;
    align-items:center !important;
    justify-content:space-around !important;
    gap:0 !important;
    padding:6px 4px !important;
    padding-bottom:calc(6px + env(safe-area-inset-bottom,0px)) !important;
    background:var(--dcm-bg-alt,#f0eee6) !important;
    border:none !important;
    border-top:1px solid var(--dcm-border,#e5e3da) !important;
    box-shadow:0 -3px 16px rgba(0,0,0,.07) !important;
    overflow:visible !important;
  }

  /* 图标条里的每一个 flex 容器都改横排，且一律不换行 */
  html[data-dcm-mobile="1"][data-dcm-layout="bottom"] [class*="_sidebarCol"],
  html[data-dcm-mobile="1"][data-dcm-layout="bottom"] [class*="_sidebarCol"] *{
    flex-direction:row !important;
    flex-wrap:nowrap !important;
  }
  /* 真正的内容容器（sidebarCol > display:contents > root）铺满整条 */
  html[data-dcm-mobile="1"][data-dcm-layout="bottom"] [class*="_sidebarCol"] > * > *{
    width:100% !important;
    max-width:100% !important;
    height:auto !important;
    min-height:0 !important;
    max-height:52px !important;
    box-sizing:border-box !important;
    justify-content:space-evenly !important;
    align-items:center !important;
    gap:0 !important;
    padding:0 !important;
    border:none !important;
    overflow:visible !important;
  }
  /* 中间层容器：不撑高、不占位 */
  html[data-dcm-mobile="1"][data-dcm-layout="bottom"] [class*="_sidebarCol"] > * > * > *{
    width:auto !important;
    min-width:0 !important;
    height:auto !important;
    min-height:0 !important;
    max-height:44px !important;
    padding:0 !important;
    border:none !important;
    background:transparent !important;
    overflow:visible !important;
  }

  /* 触摸目标：不小于 42×42 */
  html[data-dcm-mobile="1"][data-dcm-layout="bottom"] [class*="_sidebarCol"] button,
  html[data-dcm-mobile="1"][data-dcm-layout="bottom"] [class*="_sidebarCol"] [role="button"],
  html[data-dcm-mobile="1"][data-dcm-layout="bottom"] [class*="_sidebarCol"] a{
    flex:0 0 auto !important;
    width:auto !important;
    min-width:42px !important;
    height:42px !important;
    min-height:42px !important;
    max-height:42px !important;
    display:flex !important;
    justify-content:center !important;
    align-items:center !important;
    gap:4px !important;
    padding:0 4px !important;
    border-radius:10px !important;
    background:transparent !important;
    overflow:visible !important;
    -webkit-tap-highlight-color:transparent;
  }
  /* 图标本身别再被裁 */
  html[data-dcm-mobile="1"][data-dcm-layout="bottom"] [class*="_sidebarCol"] svg{
    width:21px !important;
    height:21px !important;
    min-width:21px !important;
    flex:0 0 auto !important;
    overflow:visible !important;
  }
  /* 图标条里被隐藏的文字标签，在底部栏重新显示 */
  html[data-dcm-mobile="1"][data-dcm-layout="bottom"] [class*="_sidebarCol"] [class*="label"],
  html[data-dcm-mobile="1"][data-dcm-layout="bottom"] [class*="_sidebarCol"] span{
    font-size:10.5px !important;
    line-height:1.15 !important;
    white-space:nowrap !important;
  }

  /* 主内容区避让底部栏 */
  html[data-dcm-mobile="1"][data-dcm-layout="bottom"] [class*="_centerCol"]{
    width:100% !important;
    flex:1 1 auto !important;
    padding-bottom:calc(62px + env(safe-area-inset-bottom,0px)) !important;
  }

  /* 输入框别被 iOS 自动放大 */
  html[data-dcm-mobile="1"] textarea,
  html[data-dcm-mobile="1"] input[type="text"],
  html[data-dcm-mobile="1"] [contenteditable="true"]{
    font-size:16px !important;
  }
}

/* ---- 侧边图标栏模式：只修图标被裁的问题 ---- */
@media (max-width:900px){
  html[data-dcm-mobile="1"][data-dcm-layout="rail"] [class*="_sidebarCol"]{
    min-width:60px !important;
    padding-left:2px !important;
    padding-right:2px !important;
  }
  html[data-dcm-mobile="1"][data-dcm-layout="rail"] [class*="_sidebarCol"] button,
  html[data-dcm-mobile="1"][data-dcm-layout="rail"] [class*="_sidebarCol"] [role="button"]{
    min-width:44px !important;
    min-height:44px !important;
    justify-content:center !important;
  }
  html[data-dcm-mobile="1"][data-dcm-layout="rail"] [class*="_sidebarCol"] svg{
    min-width:20px !important;
    min-height:20px !important;
    overflow:visible !important;
  }
}

/* ---------- 3. 设置面板与悬浮键 ---------- */
.dcm-fab{
  position:fixed;
  right:16px;
  bottom:calc(74px + env(safe-area-inset-bottom,0px));
  z-index:950;
  width:46px;
  height:46px;
  display:flex;
  align-items:center;
  justify-content:center;
  border:none;
  border-radius:50%;
  cursor:pointer;
  background:#d97757;
  color:#fff;
  box-shadow:0 4px 18px rgba(217,119,87,.42);
  transition:transform .16s ease,box-shadow .16s ease;
  -webkit-tap-highlight-color:transparent;
}
.dcm-fab:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(217,119,87,.5)}
.dcm-fab:active{transform:scale(.94)}
@media (min-width:901px){
  .dcm-fab{bottom:calc(24px + env(safe-area-inset-bottom,0px))}
}

.dcm-overlay{
  position:fixed;
  inset:0;
  z-index:9990;
  display:flex;
  justify-content:center;
  align-items:flex-end;
  background:rgba(20,20,19,.42);
  -webkit-backdrop-filter:blur(2px);
  backdrop-filter:blur(2px);
  animation:dcm-fade .16s ease;
}
@media (min-width:901px){
  .dcm-overlay{align-items:center}
}
@keyframes dcm-fade{from{opacity:0}to{opacity:1}}
@keyframes dcm-rise{from{transform:translateY(18px);opacity:0}to{transform:translateY(0);opacity:1}}

.dcm-sheet{
  width:100%;
  max-width:520px;
  max-height:88vh;
  max-height:88dvh;
  display:flex;
  flex-direction:column;
  background:#faf9f5;
  color:#1f1e1d;
  border-radius:18px 18px 0 0;
  box-shadow:0 -8px 40px rgba(0,0,0,.24);
  overflow:hidden;
  font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif;
  animation:dcm-rise .2s cubic-bezier(.22,.68,.36,1);
}
@media (min-width:901px){
  .dcm-sheet{border-radius:16px;box-shadow:0 20px 60px rgba(0,0,0,.3)}
}
html[data-dcm-resolved="dark"] .dcm-sheet{
  background:#262624;
  color:#f5f4ef;
  box-shadow:0 -8px 40px rgba(0,0,0,.6);
}

.dcm-sheet-head{
  display:flex;
  align-items:flex-start;
  justify-content:space-between;
  gap:12px;
  padding:18px 18px 12px;
  border-bottom:1px solid #e5e3da;
  flex:0 0 auto;
}
html[data-dcm-resolved="dark"] .dcm-sheet-head{border-color:#3a3a36}
.dcm-sheet-title{
  font-family:Georgia,"Times New Roman","Songti SC","Noto Serif SC",serif;
  font-size:18px;
  font-weight:500;
  letter-spacing:.2px;
}
.dcm-sheet-sub{
  margin-top:3px;
  font-size:12.5px;
  color:#6b6a64;
  line-height:1.5;
}
html[data-dcm-resolved="dark"] .dcm-sheet-sub{color:#a3a39d}
.dcm-x{
  flex:0 0 auto;
  width:32px;
  height:32px;
  display:flex;
  align-items:center;
  justify-content:center;
  border:none;
  border-radius:9px;
  cursor:pointer;
  background:transparent;
  color:#6b6a64;
  font-size:15px;
  line-height:1;
}
.dcm-x:hover{background:#eae7dd;color:#1f1e1d}
html[data-dcm-resolved="dark"] .dcm-x:hover{background:#2e2d2a;color:#f5f4ef}

/* 横滑区：全部设置项竖着列下来 */
.dcm-body{
  flex:1 1 auto;
  overflow-y:auto;
  -webkit-overflow-scrolling:touch;
  padding:4px 0;
}
.dcm-row{
  display:flex;
  flex-direction:column;
  gap:9px;
  padding:15px 18px;
  border-bottom:1px solid #efece2;
}
html[data-dcm-resolved="dark"] .dcm-row{border-color:#33322f}
.dcm-row:last-child{border-bottom:none}
.dcm-row-label{
  font-size:14px;
  font-weight:600;
  letter-spacing:.1px;
}
.dcm-row-hint{
  margin-top:-3px;
  font-size:12px;
  line-height:1.5;
  color:#6b6a64;
}
html[data-dcm-resolved="dark"] .dcm-row-hint{color:#a3a39d}

.dcm-seg{
  display:flex;
  flex-wrap:wrap;
  gap:7px;
}
.dcm-seg button{
  flex:0 1 auto;
  min-width:0;
  padding:9px 14px;
  font-size:13px;
  border:1px solid #e5e3da;
  border-radius:9px;
  background:#fff;
  color:#1f1e1d;
  cursor:pointer;
  transition:.14s;
  -webkit-tap-highlight-color:transparent;
}
html[data-dcm-resolved="dark"] .dcm-seg button{
  background:#1f1e1d;
  color:#f5f4ef;
  border-color:#3a3a36;
}
.dcm-seg button:hover{border-color:#d97757}
.dcm-seg button.on{
  background:#f5e9e2;
  border-color:#d97757;
  color:#b8593a;
  font-weight:600;
}
html[data-dcm-resolved="dark"] .dcm-seg button.on{
  background:#3b2e27;
  color:#e0946b;
}

.dcm-foot{
  flex:0 0 auto;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:12px;
  padding:12px 18px calc(14px + env(safe-area-inset-bottom,0px));
  border-top:1px solid #e5e3da;
  background:#f0eee6;
}
html[data-dcm-resolved="dark"] .dcm-foot{background:#191817;border-color:#3a3a36}
.dcm-reset{
  padding:8px 14px;
  font-size:13px;
  border:1px solid #e5e3da;
  border-radius:9px;
  background:transparent;
  color:#6b6a64;
  cursor:pointer;
}
.dcm-reset:hover{border-color:#d97757;color:#d97757}
.dcm-version{
  font-size:11.5px;
  color:#8f8c83;
  font-variant-numeric:tabular-nums;
}

/* 内嵌进 DSH 原生设置面板时的样式（settings.section） */
.dcm-root{
  font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif;
}
.dcm-lead{
  margin:0 0 4px;
  padding:14px 0 6px;
  font-size:13px;
  line-height:1.65;
  color:#6b6a64;
}
html[data-dcm-resolved="dark"] .dcm-lead{color:#a3a39d}
.dcm-root .dcm-row{
  padding-left:0;
  padding-right:0;
}
`;

		/* ============================================================
		 * 二、设置存储
		 * ========================================================== */

		const STORE_KEY = "dsh.claude-mobile.settings";

		const DEFAULTS = {
			theme: "claude",       // claude | native
			mode: "auto",          // auto | light | dark
			layout: "bottom",      // bottom | rail | off
			font: "md",            // sm | md | lg | xl
			compact: false,
			hideRight: true,
			threshold: 900,        // 小于该宽度判定为「手机」
			fab: true,
		};

		let current = load();

		function load() {
			try {
				const raw = localStorage.getItem(STORE_KEY);
				const parsed = raw ? JSON.parse(raw) : null;
				return Object.assign({}, DEFAULTS, parsed && typeof parsed === "object" ? parsed : {});
			} catch (e) {
				return Object.assign({}, DEFAULTS);
			}
		}

		function save() {
			try {
				localStorage.setItem(STORE_KEY, JSON.stringify(current));
			} catch (e) { /* 忽略配额/隐私模式错误 */ }
		}

		const listeners = new Set();

		function getSettings() {
			return current;
		}

		function subscribe(fn) {
			listeners.add(fn);
			return function () { listeners.delete(fn); };
		}

		function setSetting(key, value) {
			if (current[key] === value) return;
			current = Object.assign({}, current, { [key]: value });
			save();
			applyRoot(current);
			listeners.forEach(function (fn) {
				try { fn(current); } catch (e) { /* 单个订阅者出错不影响其他 */ }
			});
		}

		function resetSettings() {
			current = Object.assign({}, DEFAULTS);
			save();
			applyRoot(current);
			listeners.forEach(function (fn) {
				try { fn(current); } catch (e) {}
			});
		}

		/* ============================================================
		 * 三、根属性投影（CSS 全靠它驱动）
		 * ========================================================== */

		let mql = null;

		function prefersDark() {
			try {
				return !!(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
			} catch (e) {
				return false;
			}
		}

		function resolveMode(s) {
			if (s.mode === "light" || s.mode === "dark") return s.mode;
			return prefersDark() ? "dark" : "light";
		}

		function isMobile(s) {
			return window.innerWidth < (s.threshold || 900);
		}

		function applyRoot(s) {
			const html = document.documentElement;
			html.setAttribute("data-dcm-theme", s.theme === "claude" ? "claude" : "native");
			html.setAttribute("data-dcm-resolved", resolveMode(s));
			html.setAttribute("data-dcm-font", s.font);
			html.setAttribute("data-dcm-compact", s.compact ? "1" : "0");
			html.setAttribute("data-dcm-hideright", s.hideRight ? "1" : "0");
			html.setAttribute("data-dcm-layout", s.layout);
			html.setAttribute("data-dcm-mobile", isMobile(s) ? "1" : "0");
		}

		function clearRoot() {
			const html = document.documentElement;
			[
				"data-dcm-theme", "data-dcm-resolved", "data-dcm-font",
				"data-dcm-compact", "data-dcm-hideright", "data-dcm-layout",
				"data-dcm-mobile",
			].forEach(function (a) { html.removeAttribute(a); });
		}

		/* ============================================================
		 * 四、设置项定义（竖列，一行一项）
		 * ========================================================== */

		const ITEMS = [
			{
				key: "layout",
				label: "手机端导航",
				hint: "DSH 手机上侧栏只有 56px 宽，图标会被裁掉。改成底部标签栏后图标完整、拇指可达。",
				options: [["bottom", "底部标签栏"], ["rail", "侧边图标栏"], ["off", "不做修改"]],
			},
			{
				key: "theme",
				label: "配色方案",
				hint: "Claude 暖色取自 claude.ai 的设计规范：象牙白底 + 赤陶橙强调色。",
				options: [["claude", "Claude 暖色"], ["native", "系统原生"]],
			},
			{
				key: "mode",
				label: "外观模式",
				options: [["auto", "跟随系统"], ["light", "浅色"], ["dark", "深色"]],
			},
			{
				key: "font",
				label: "界面缩放",
				options: [["sm", "小"], ["md", "标准"], ["lg", "大"], ["xl", "特大"]],
			},
			{
				key: "compact",
				label: "紧凑模式",
				hint: "压缩行距，同屏显示更多内容。",
				options: [[false, "关"], [true, "开"]],
			},
			{
				key: "hideRight",
				label: "手机上隐藏右侧栏",
				hint: "窄屏下把右侧详情栏收起，给对话区让出宽度。",
				options: [[true, "隐藏"], [false, "保留"]],
			},
			{
				key: "threshold",
				label: "手机判定宽度",
				hint: "视口窄于该宽度时启用手机端布局。",
				options: [[1100, "1100px"], [900, "900px"], [768, "768px"], [600, "600px"]],
			},
			{
				key: "fab",
				label: "悬浮设置键",
				hint: "右下角常驻的设置按钮，手机上单手可达。",
				options: [[true, "显示"], [false, "隐藏"]],
			},
		];

		/* ============================================================
		 * 五、React 版设置页（挂到 DSH 原生设置面板）
		 * ========================================================== */

		function SettingRow(item, s) {
			return h(
				"div",
				{ className: "dcm-row", key: item.key },
				h("div", { className: "dcm-row-label" }, item.label),
				item.hint ? h("div", { className: "dcm-row-hint" }, item.hint) : null,
				h(
					"div",
					{ className: "dcm-seg" },
					item.options.map(function (opt) {
						const value = opt[0];
						const text = opt[1];
						return h(
							"button",
							{
								key: String(value),
								type: "button",
								className: s[item.key] === value ? "on" : "",
								onClick: function () { setSetting(item.key, value); },
							},
							text
						);
					})
				)
			);
		}

		function SettingsPage() {
			const [, bump] = React.useState(0);
			React.useEffect(function () {
				return subscribe(function () { bump(function (n) { return n + 1; }); });
			}, []);
			const s = getSettings();
			return h(
				"div",
				{ className: "dcm-root" },
				h(
					"p",
					{ className: "dcm-lead" },
					"把 Claude 网页版那套排版带到 DSH 上：手机上侧栏不再是 56px 的图标条，而是底部标签栏；配色换成 claude.ai 的暖象牙 + 赤陶橙。"
				),
				ITEMS.map(function (item) { return SettingRow(item, s); }),
				h(
					"div",
					{ className: "dcm-row" },
					h(
						"button",
						{ className: "dcm-reset", type: "button", onClick: resetSettings },
						"恢复默认"
					)
				)
			);
		}

		/* ============================================================
		 * 六、模板生成（悬浮键面板与原生面板共用一套结构）
		 * ========================================================== */

		function rowsHtml() {
			const s = getSettings();
			return ITEMS.map(function (item) {
				const segs = item.options.map(function (opt) {
					const on = s[item.key] === opt[0] ? " on" : "";
					return '<button type="button" class="dcm-seg-btn' + on + '" data-key="' +
						item.key + '" data-value="' + String(opt[0]) + '">' + opt[1] + "</button>";
				}).join("");
				return '<div class="dcm-row">' +
					'<div class="dcm-row-label">' + item.label + "</div>" +
					(item.hint ? '<div class="dcm-row-hint">' + item.hint + "</div>" : "") +
					'<div class="dcm-seg">' + segs + "</div>" +
					"</div>";
			}).join("");
		}

		let overlayEl = null;

		function closeOverlay() {
			if (overlayEl && overlayEl.parentNode) overlayEl.parentNode.removeChild(overlayEl);
			overlayEl = null;
		}

		function openOverlay() {
			if (overlayEl) return;
			overlayEl = document.createElement("div");
			overlayEl.className = "dcm-overlay";
			overlayEl.innerHTML =
				'<div class="dcm-sheet" role="dialog" aria-modal="true" aria-label="Claude 手机版设置">' +
					'<div class="dcm-sheet-head">' +
						'<div>' +
							'<div class="dcm-sheet-title">Claude 手机版</div>' +
							'<div class="dcm-sheet-sub">移动端布局与外观优化</div>' +
						"</div>" +
						'<button type="button" class="dcm-x" data-close="1" aria-label="关闭">✕</button>' +
					"</div>" +
					'<div class="dcm-body">' + rowsHtml() + "</div>" +
					'<div class="dcm-foot">' +
						'<button type="button" class="dcm-reset" data-reset="1">恢复默认</button>' +
						'<span class="dcm-version">claude-mobile v1.0.0</span>' +
					"</div>" +
				"</div>";

			overlayEl.addEventListener("click", function (ev) {
				const t = ev.target;
				if (t === overlayEl || (t && t.getAttribute && t.getAttribute("data-close"))) {
					closeOverlay();
					return;
				}
				if (t && t.getAttribute && t.getAttribute("data-reset")) {
					resetSettings();
					refreshOverlay();
					return;
				}
				const key = t && t.getAttribute ? t.getAttribute("data-key") : null;
				if (key) {
					let value = t.getAttribute("data-value");
					if (value === "true") value = true;
					else if (value === "false") value = false;
					else if (/^\d+$/.test(value)) value = Number(value);
					setSetting(key, value);
					refreshOverlay();
				}
			});

			document.body.appendChild(overlayEl);
		}

		function refreshOverlay() {
			if (!overlayEl) return;
			const body = overlayEl.querySelector(".dcm-body");
			if (body) body.innerHTML = rowsHtml();
		}

		/* ============================================================
		 * 七、apply
		 * ========================================================== */

		const VERSION = "1.0.0";

		function apply(ctx) {
			/* 7.1 样式 + 根属性 */
			ctx.effect(function () {
				const style = document.createElement("style");
				style.setAttribute("data-dsh-plugin", "claude-mobile");
				style.textContent = STYLE;
				document.head.appendChild(style);

				applyRoot(current);

				const offSettings = subscribe(function (s) { applyRoot(s); });

				function onResize() { applyRoot(current); }
				window.addEventListener("resize", onResize);
				window.addEventListener("orientationchange", onResize);

				// 跟随系统深浅色
				let offMql = null;
				try {
					mql = window.matchMedia("(prefers-color-scheme: dark)");
					const handler = function () { applyRoot(current); };
					if (mql.addEventListener) mql.addEventListener("change", handler);
					else if (mql.addListener) mql.addListener(handler);
					offMql = function () {
						if (mql.removeEventListener) mql.removeEventListener("change", handler);
						else if (mql.removeListener) mql.removeListener(handler);
					};
				} catch (e) { /* 无 matchMedia 时跳过 */ }

				return function () {
					offSettings();
					if (offMql) offMql();
					window.removeEventListener("resize", onResize);
					window.removeEventListener("orientationchange", onResize);
					style.remove();
					clearRoot();
				};
			}, "claude-mobile: styles");

			/* 7.2 悬浮设置键 */
			ctx.effect(function () {
				const fab = document.createElement("button");
				fab.type = "button";
				fab.className = "dcm-fab";
				fab.setAttribute("aria-label", "Claude 手机版设置");
				fab.innerHTML =
					'<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
					'stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
					'<circle cx="12" cy="12" r="3"/>' +
					'<path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>' +
					"</svg>";
				fab.onclick = openOverlay;
				document.body.appendChild(fab);

				function syncFab(s) {
					fab.style.display = s.fab ? "flex" : "none";
				}
				syncFab(current);
				const offFab = subscribe(syncFab);

				function onKey(ev) {
					if (ev.key === "Escape") closeOverlay();
				}
				document.addEventListener("keydown", onKey);

				return function () {
					offFab();
					document.removeEventListener("keydown", onKey);
					closeOverlay();
					fab.remove();
				};
			}, "claude-mobile: floating settings button");

			/* 7.3 挂进 DSH 原生设置面板 */
			try {
				if (!React || !ctx.slots) throw new Error("no slots or react");

				const register = function () {
					return ctx.slots.register(
						{
							name: "settings.section",
							id: "claude-mobile",
							order: 90,
							label: function () { return "Claude 手机版"; },
						},
						SettingsPage
					);
				};

				if (typeof ctx.slots.inject === "function") {
					ctx.slots.inject("settings.section", register);
				} else if (typeof ctx.slots.register === "function") {
					register();
				}
			} catch (e) {
				console.warn("[claude-mobile] 未能注册设置分区，悬浮设置键仍可用：", e);
			}
		}

		exports.apply = apply;
		exports.name = "claude-mobile";
		exports.version = VERSION;

		return module.exports;
	},
});
