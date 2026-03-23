# 依赖项和组件使用情况分析

## 1. 依赖项使用情况

| 依赖项 | 类型 | 使用状态 | 使用位置 |
|-------|------|----------|----------|
| @mdx-js/loader | dependencies | 未使用 | 仅在package.json中 |
| @mdx-js/react | dependencies | 未使用 | 仅在package.json中 |
| @next/mdx | dependencies | 使用 | next.config.ts |
| @vercel/og | dependencies | 使用 | app/api/og/route.tsx |
| @vercel/speed-insights | dependencies | 使用 | app/layout.tsx |
| algoliasearch | dependencies | 使用 | components/search/SearchModal.tsx, components/blog/BlogSearch.tsx, lib/algolia-sync.ts |
| class-variance-authority | dependencies | 使用 | components/common/ui/tabs.tsx, components/common/ui/button.tsx, components/common/ui/badge.tsx |
| clsx | dependencies | 使用 | lib/utils.ts |
| dotenv | dependencies | 使用 | scripts/sync-algolia.ts |
| emoji-picker-react | dependencies | 使用 | components/common/emoji/EmojiPickerButton.tsx |
| framer-motion | dependencies | 未使用 | 仅在package.json中 |
| github-slugger | dependencies | 使用 | components/common/mdx/MdxContent.tsx |
| gray-matter | dependencies | 使用 | scripts/unify-mdx-format.js, lib/md-utils.server.ts, lib/algolia-sync.ts |
| instantsearch.js | dependencies | 使用 | components/blog/BlogSearch.tsx |
| lucide-react | dependencies | 使用 | 多个文件，包括app/blogs/[id]/page.client.tsx, components/common/mdx/MdxContent.tsx等 |
| next | dependencies | 使用 | 多个文件，包括app/layout.tsx, app/api/*等 |
| pangu | dependencies | 使用 | components/common/mdx/MdxContent.tsx |
| radix-ui | dependencies | 使用 | 多个UI组件文件，包括components/common/ui/* |
| react | dependencies | 使用 | 多个文件，所有React组件 |
| react-dom | dependencies | 使用 | 多个文件，所有React组件 |
| react-instantsearch | dependencies | 使用 | components/search/SearchModal.tsx, components/blog/BlogSearch.tsx |
| react-markdown | dependencies | 使用 | components/common/mdx/MdxContent.tsx |
| react-medium-image-zoom | dependencies | 使用 | components/common/mdx/MdxContent.tsx |
| react-syntax-highlighter | dependencies | 使用 | components/common/mdx/CodeBlock.tsx |
| rehype-sanitize | dependencies | 使用 | components/common/mdx/MdxContent.tsx |
| remark-gfm | dependencies | 使用 | components/common/mdx/MdxContent.tsx |
| swr | dependencies | 使用 | app/talks/page.tsx, docs/talks-package/page.tsx |
| tailwind-merge | dependencies | 使用 | lib/utils.ts |
| @next/bundle-analyzer | devDependencies | 未使用 | 仅在package.json中 |
| @tailwindcss/postcss | devDependencies | 使用 | postcss.config.mjs |
| @types/node | devDependencies | 使用 | 多个TypeScript文件 |
| @types/prismjs | devDependencies | 未使用 | 仅在package.json中 |
| @types/react | devDependencies | 使用 | 多个TypeScript文件 |
| @types/react-dom | devDependencies | 使用 | 多个TypeScript文件 |
| @types/react-syntax-highlighter | devDependencies | 使用 | components/common/mdx/CodeBlock.tsx |
| eslint | devDependencies | 使用 | eslint.config.mjs |
| eslint-config-next | devDependencies | 使用 | eslint.config.mjs |
| file-loader | devDependencies | 未使用 | 仅在package.json中 |
| shadcn | devDependencies | 未使用 | 仅在package.json中 |
| tailwindcss | devDependencies | 使用 | tailwind.config.js |
| tw-animate-css | devDependencies | 未使用 | 仅在package.json中 |
| typescript | devDependencies | 使用 | 多个TypeScript文件 |

## 2. 组件使用情况

| 组件 | 路径 | 使用状态 | 使用位置 |
|------|------|----------|----------|
| BlogsClientComponent | components/blog/BlogsClientComponent.tsx | 使用 | app/blogs/page.tsx, components/blog/BlogsServerComponent.tsx |
| TalkCard | components/talks/TalkCard.tsx | 使用 | app/talks/page.tsx |
| ContentRenderer | components/talks/ContentRenderer.tsx | 使用 | components/talks/TalkCard.tsx |
| CodeBlock (talks) | components/talks/CodeBlock.tsx | 使用 | components/talks/ContentRenderer.tsx |
| Giscus | components/common/giscus/Giscus.tsx | 使用 | components/common/giscus/BlogGiscus.tsx |
| MdxContent | components/common/mdx/MdxContent.tsx | 使用 | app/blogs/[id]/page.client.tsx |
| CodeBlock (mdx) | components/common/mdx/CodeBlock.tsx | 使用 | components/common/mdx/MdxContent.tsx |
| SearchModal | components/search/SearchModal.tsx | 使用 | components/unused/FloatingSidebar.tsx |
| FloatingSidebar | components/unused/FloatingSidebar.tsx | 使用 | app/blogs/BlogsClientComponent.tsx |
| BlogSearch | components/blog/BlogSearch.tsx | 未使用 | 仅在组件文件中 |
| Navbar | components/common/Navbar.tsx | 使用 | app/layout.tsx |
| Reactions | components/blog/Reactions.tsx | 使用 | app/blogs/[id]/page.client.tsx |
| ErrorBoundaryWrapper | components/common/ErrorBoundaryWrapper.tsx | 使用 | app/layout.tsx |
| ErrorBoundary | components/common/ErrorBoundary.tsx | 使用 | components/common/ErrorBoundaryWrapper.tsx |
| Modal | components/common/Modal.tsx | 使用 | components/unused/FloatingSidebar.tsx |
| Guestbook | components/home/Guestbook.tsx | 使用 | components/blog/BlogsClientComponent.tsx |
| FunZone | components/home/FunZone.tsx | 使用 | components/blog/BlogsClientComponent.tsx |
| SEOHead | components/unused/SEOHead.tsx | 未使用 | 仅在组件文件中 |
| BlogPost | components/blog/BlogPost.tsx | 未使用 | 仅在组件文件中 |
| Footer | components/common/footer/Footer.tsx | 使用 | app/layout.tsx |
| BlogHero | components/blog/BlogHero.tsx | 使用 | components/blog/BlogsClientComponent.tsx |
| LinkCard | components/unused/LinkCard.tsx | 未使用 | 仅在组件文件中 |
| StatsBar | components/home/StatsBar.tsx | 使用 | components/blog/BlogsClientComponent.tsx |
| NowSection | components/home/NowSection.tsx | 使用 | components/blog/BlogsClientComponent.tsx |
| Textarea | components/common/ui/textarea.tsx | 未使用 | 仅在组件文件中 |
| Tabs | components/common/ui/tabs.tsx | 未使用 | 仅在组件文件中 |
| Table | components/unused/table.tsx | 未使用 | 仅在组件文件中 |
| Switch | components/common/ui/switch.tsx | 未使用 | 仅在组件文件中 |
| Select | components/common/ui/select.tsx | 未使用 | 仅在组件文件中 |
| Label | components/common/ui/label.tsx | 未使用 | 仅在组件文件中 |
| Input | components/common/ui/input.tsx | 未使用 | 仅在组件文件中 |
| Card | components/common/ui/card.tsx | 未使用 | 仅在组件文件中 |
| Button | components/common/ui/button.tsx | 未使用 | 仅在组件文件中 |
| AlertDialog | components/unused/alert-dialog.tsx | 未使用 | 仅在组件文件中 |
| Badge | components/common/ui/badge.tsx | 未使用 | 仅在组件文件中 |
| EmojiPickerButton | components/common/emoji/EmojiPickerButton.tsx | 使用 | components/home/Guestbook.tsx |
| ServiceWorkerRegister | components/common/ServiceWorkerRegister.tsx | 使用 | app/layout.tsx |
| Umami | components/common/analytics/Umami.tsx | 使用 | app/layout.tsx |
| PushNotificationSubscribe | components/common/PushNotificationSubscribe.tsx | 未使用 | 仅在组件文件中 |
| LoadingStates | components/common/LoadingStates.tsx | 未使用 | 仅在组件文件中 |
| LoadingBar | components/common/LoadingBar.tsx | 未使用 | 仅在组件文件中 |
| NavTabs | components/unused/NavTabs.tsx | 未使用 | 仅在组件文件中 |
| BlogsServerComponent | components/blog/BlogsServerComponent.tsx | 未使用 | 仅在组件文件中 |
| BlogsHero | components/unused/BlogsHero.tsx | 未使用 | 仅在组件文件中 |
| BlogSectionHeader | components/blog/BlogSectionHeader.tsx | 未使用 | 仅在组件文件中 |
| BlogList | components/blog/BlogList.tsx | 未使用 | 仅在组件文件中 |
| BlogCard | components/blog/BlogCard.tsx | 未使用 | 仅在组件文件中 |

## 3. 分析总结

### 未使用的依赖项：
- @mdx-js/loader
- @mdx-js/react
- framer-motion
- @next/bundle-analyzer
- @types/prismjs
- file-loader
- shadcn
- tw-animate-css

### 未使用的组件：
- BlogSearch
- SEOHead
- BlogPost
- LinkCard
- Textarea
- Tabs
- Table
- Switch
- Select
- Label
- Input
- Card
- Button
- AlertDialog
- Badge
- PushNotificationSubscribe
- LoadingStates
- LoadingBar
- NavTabs
- BlogsServerComponent
- BlogsHero
- BlogSectionHeader
- BlogList
- BlogCard

### 建议：
1. 移除未使用的依赖项，减少打包体积
2. 移除未使用的组件，保持代码库整洁
3. 对于有使用但使用率低的组件，考虑是否真的需要