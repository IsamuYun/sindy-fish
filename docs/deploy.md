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

## GitHub Pages（GitHub Actions 自动发布）

仓库里已经有现成的工作流：`.github/workflows/deploy-pages.yml`。

**一次性设置**：GitHub 仓库 → Settings → Pages → Build and deployment → Source 选择
**GitHub Actions**（不要选 “Deploy from a branch”）。

之后：

- 推送到 `main` 会自动构建并发布，站点地址为
  `https://<用户名>.github.io/<仓库名>/`（本仓库即 `https://isamuyun.github.io/sindy-fish/`）；
- 提 PR 只会跑构建校验，不会发布；
- 也可以在 Actions 页面手动触发（`workflow_dispatch`），用于随时刷新预览。

发布完成后，Actions 运行页面的 `github-pages` environment 上会显示可点击的站点链接。

### base 路径是怎么处理的

Pages 的站点在子路径下（`/<仓库名>/`），所以 `vite.config.js` 的 `base` 做成了可注入：

```js
base: process.env.BASE_PATH || '/',
```

工作流在构建时传入 `BASE_PATH: /${{ github.event.repository.name }}/`，仓库改名或被 fork 都不用改配置。
本地开发、Vercel / Netlify / Nginx 等根路径部署不设这个变量，`base` 仍然是 `/`。

需要在本地复现 Pages 上的构建结果：

```bash
BASE_PATH=/sindy-fish/ npm run build
npm run preview
```

页面里所有指向静态文件的链接（例如两个 slide 页）都通过 `import.meta.env.BASE_URL` 拼接，
所以子路径部署时不需要额外改动。

### 手动发布（不用 Actions）

```bash
BASE_PATH=/<仓库名>/ npm run build
```

然后把 `dist/` 的内容发布到 `gh-pages` 分支或其他静态托管即可。
如果部署到用户/组织根域名仓库（`username.github.io`），不需要设置 `BASE_PATH`。

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

检查构建时是否传入了 `BASE_PATH=/<仓库名>/`（Actions 里由工作流自动注入）。
`dist/index.html` 里的 `assets/` 链接应当以 `/<仓库名>/` 开头。

### Actions 报错 “Pages site not found” / 部署步骤失败

仓库 Settings → Pages 的 Source 没有设为 **GitHub Actions**，或该仓库是私有仓库且账号套餐
不支持私有仓库的 Pages。

### 直接访问子路径返回 404

如果部署平台支持重写规则，请把所有路径重写到 `index.html`。Nginx 可使用：

```nginx
try_files $uri $uri/ /index.html;
```
