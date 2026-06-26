# 部署文档

本文档说明如何构建和部署 `sindyfish-inner-court` React/Vite 静态网站。

## 环境要求

- Node.js: `^20.19.0 || >=22.12.0`
- npm: 使用随 Node.js 附带的版本即可
- 项目包管理器: npm

建议在部署环境中使用和本地一致的 Node 主版本。当前项目基于 Vite 8，低于上述 Node 版本可能无法构建。

## 常用命令

```bash
npm ci
npm run build
npm run preview
```

命令说明：

- `npm ci`: 根据 `package-lock.json` 安装依赖，适合 CI/CD 和生产构建环境
- `npm run build`: 生成生产静态文件
- `npm run preview`: 本地预览生产构建结果

生产构建输出目录为：

```text
dist/
```

部署时只需要发布 `dist/` 目录。

## 本地验证流程

```bash
npm ci
npm run build
npm run preview
```

默认预览服务会监听本机地址。打开终端输出中的 `Local` 地址，确认页面、滚动动画、图片资源和预约弹窗正常。

## 静态托管部署

适用于任何支持静态文件托管的平台。

构建配置：

- Install command: `npm ci`
- Build command: `npm run build`
- Publish directory: `dist`

如果平台需要 Node 版本，请设置为：

```text
22.12.0 或更高
```

## Vercel

推荐配置：

- Framework Preset: `Vite`
- Install Command: `npm ci`
- Build Command: `npm run build`
- Output Directory: `dist`

如果 Vercel 自动识别为 Vite 项目，通常只需要确认 Node 版本满足要求。

## Netlify

推荐配置：

```toml
[build]
  command = "npm run build"
  publish = "dist"
```

在 Netlify UI 中也可以设置：

- Build command: `npm run build`
- Publish directory: `dist`
- Node version: `22.12.0` 或更高

## Nginx

先构建：

```bash
npm ci
npm run build
```

将 `dist/` 内容复制到服务器静态目录，例如：

```text
/var/www/sindyfish
```

示例 Nginx 配置：

```nginx
server {
    listen 80;
    server_name example.com;

    root /var/www/sindyfish;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|webp|svg|ico)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

当前网站是单页前端应用，`try_files ... /index.html` 可以避免刷新或直接访问路径时出现 404。

## GitHub Pages

如果部署到用户/组织根域名仓库，例如 `username.github.io`，直接构建并发布 `dist/` 即可。

如果部署到子路径仓库，例如：

```text
https://username.github.io/sindyfish/
```

需要在 `vite.config.js` 中设置 `base`：

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/sindyfish/',
  plugins: [react()],
});
```

然后重新构建：

```bash
npm run build
```

## 图片和静态资源

项目中的主要图片位于：

```text
src/assets/img/
```

Vite 构建时会将被代码引用的图片打包到 `dist/assets/`，并生成带 hash 的文件名。不要手动改 `dist/` 中的文件名；修改图片应在 `src/assets/img/` 中完成，然后重新运行：

```bash
npm run build
```

## 上线前检查

上线前至少确认：

- `npm run build` 成功
- `dist/` 中包含 `index.html` 和 `assets/`
- 页面首屏背景图显示正常
- 滚动到末尾时 `background-2.png` 能正常淡入
- 预约弹窗可以打开、关闭、校验表单
- 浏览器控制台无明显资源 404

## 常见问题

### 构建时报 Node 版本错误

升级 Node 到 `22.12.0` 或更高，或使用 Node `20.19.0` 以上版本。

### 部署后图片 404

确认部署的是完整 `dist/` 目录，不是只上传了 `dist/index.html`。

### GitHub Pages 子路径资源加载失败

检查 `vite.config.js` 中的 `base` 是否等于仓库路径，例如 `/sindyfish/`。

### 直接访问子路径返回 404

如果部署平台支持重写规则，请把所有路径重写到 `index.html`。Nginx 可使用：

```nginx
try_files $uri $uri/ /index.html;
```
