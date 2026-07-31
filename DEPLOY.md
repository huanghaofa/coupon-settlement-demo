# 部署检查清单

1. 上传 `index.html`、`assets/`、`config/`、`js/`、`mock/`、`annotations/`。
2. Web 服务器默认首页设置为 `index.html`。
3. 确认以下地址返回 200：
   - `/index.html`
   - `/config/nav.json`
   - `/mock/data.js`
   - `/js/pages/report.js`
   - `/js/pages/rules.js`
4. 打开首页，验证左侧两个菜单均可切换。
5. 若作为生产功能使用，发布前必须完成真实接口、权限、脱敏和审计接入。
