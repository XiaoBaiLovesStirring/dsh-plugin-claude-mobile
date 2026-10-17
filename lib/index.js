/**
 * Host 半部：本插件不需要任何 host 侧行为。
 *
 * 全部逻辑都在浏览器半部（`./client`）：移动端布局修复与设置面板。
 * 这里保留一个空的 apply，让 bundle 在 host 侧也能被正常装载与卸载。
 */

export const name = 'claude-mobile'

/** Host 侧无操作。 */
export function apply() {}
