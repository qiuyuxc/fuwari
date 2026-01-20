import type {
	ExpressiveCodeConfig,
	GitHubEditConfig,
	ImageFallbackConfig,
	LicenseConfig,
	NavBarConfig,
	ProfileConfig,
	SiteConfig,
	UmamiConfig,
} from "./types/config";
import { LinkPreset } from "./types/config";

// 网站配置
export const siteConfig: SiteConfig = {
	title: "QuiYu Blog", // 网站标题
	subtitle: "个人随笔与技术分享", // 网站副标题
	description:
		"记录个人随笔与技术实践的独立站点，主要分享折腾过程中的想法与经验.", // 网站描述
	keywords: ["Firefly",
		"Fuwari",
		"Astro",
		"ACGN",
		"博客",
		"技术博客",
		"静态博客",
		], // 关键词
	lang: "zh_CN", // 网站语言，支持 'en', 'zh_CN', 'zh_TW', 'ja', 'ko', 'es', 'th'
	themeColor: {
		hue: 250, // 主题色的色相值，范围 0-360，例如红色：0，青色：200，粉色：345
		fixed: false, // 是否固定主题色，不让用户更改
		forceDarkMode: false // 开启默认暗黑模式
	},
	banner: {
		enable: false, // 是否启用横幅
		src: "/xinghui.avif", // 横幅图片的路径，相对 /src 目录。若路径以 '/' 开头，则相对 /public 目录
		position: "center", // 横幅图片的显示位置，支持 'top', 'center', 'bottom'
		credit: {
			enable: true, // 是否显示横幅图片的版权
			text: "Pixiv @chokei", // 版权文本
			url: "https://www.pixiv.net/artworks/122782209", // 版权链接（可选）
		},
	},
	background: {
		enable: true, // 是否启用背景图片
		src: "", // 背景图片的 URL（支持 HTTPS）
		position: "center", // 背景位置，支持 'top', 'center', 'bottom'
		size: "cover", // 背景大小，支持 'cover', 'contain', 'auto'
		repeat: "no-repeat", // 背景重复方式，支持 'no-repeat', 'repeat', 'repeat-x', 'repeat-y'
		attachment: "fixed", // 背景附件方式，支持 'fixed', 'scroll', 'local'
		opacity: 1, // 背景透明度，范围 0-1
	},
	toc: {
		enable: true, // 是否启用文章目录（右侧）
		depth: 2, // 显示的标题深度，范围 1 到 3
	},
	notice: {
		enable: false, // 是否显示通知
		content: "本站图片资源已全面切换至 B 站图床。如出现加载异常等问题，请联系我们反馈。", // 通知内容
		level: "warning", // 通知级别，支持 'warning', 'info', 'error'
	},
	favicon: [
		// 网站图标，若为空则使用默认的
		{
			src: "/home.png", // 网站图标路径，相对 /src 目录，若以 '/' 开头则相对 /public 目录
		},
	],
	officialSites: [
		{ url: "https://blog.quiyu.cn", alias: "CN" }, // 官方站点链接
		{ url: "https://www.quiyun.com", alias: "Global" }, // 全球站点链接
	],
	server: [
		{ url: "", text: "Blog" }, // 服务器信息，站点的 URL
	//	{ url: "https://cloud.umami.is", text: "Umami" }, // Umami 分析服务的 URL
	//	{ url: "https://im.c-u.xyz/api/random", text: "RandomPic" }, // 随机图片服务的 URL
	],
};

// 导航栏配置
export const navBarConfig: NavBarConfig = {
	links: [
		LinkPreset.Home, // 首页链接
		LinkPreset.Archive, // 归档链接
		{
			name: "友链", // 友链页面
			url: "/friends/", // 内部链接，不需要基路径，自动添加
			external: false, // 是否为外部链接，外部链接会在新标签页打开
		},
		{
			name: "图床", // 赞助页面
			url: "https://im.quiyu.cn", // 内部链接，不需要基路径，自动添加
			external: true, // 是否为外部链接
		},
		{
			name: "统计", // 网站统计链接
			url: "https://cloud.umami.is/share/n1v9LfSuJEOe7HoO", // 内部链接，不需要基路径，自动添加
			external: true, // 外部链接，打开新标签页
		},
		{
			name: "监控", // 监控链接
			url: "https://star.quiyu.cn", // 内部链接，不需要基路径，自动添加
			external: true, // 外部链接，打开新标签页
		},
	],
};

// 个人信息配置
export const profileConfig: ProfileConfig = {
	avatar: "/home.png", // 个人头像
	name: "紜清", // 个人名称
	bio: "Je pense, donc je suis", // 个人简介
	links: [
		{
			name: "Bilibli", // B站链接
			icon: "fa6-brands:bilibili", // 图标
			url: "https://space.bilibili.com", // 链接
		},
		{
			name: "GitHub", // GitHub链接
			icon: "fa6-brands:github", // 图标
			url: "https://github.com/qiuyuxc", // 链接
		},
	],
};

// 许可证配置
export const licenseConfig: LicenseConfig = {
	enable: true, // 是否启用许可证
	name: "CC BY-NC-SA 4.0", // 许可证名称
	url: "https://creativecommons.org/licenses/by-nc-sa/4.0/", // 许可证链接
};

// 图片回退配置
export const imageFallbackConfig: ImageFallbackConfig = {
	enable: false, // 是否启用图片回退功能
	originalDomain: "https://im.c-u.xyz/api/random", // 原始图片域名
	fallbackDomain: "https://im.c-u.xyz/api/random", // 回退图片域名
};

// Umami 配置
export const umamiConfig: UmamiConfig = {
	enable: true, // 是否启用 Umami 分析
	baseUrl: "https://cloud.umami.is/analytics/us", // Umami 服务的基础 URL
	shareId: "n1v9LfSuJEOe7HoO", // Umami 共享 ID
	timezone: "Asia/Shanghai", // 时区
};

// 代码高亮配置
export const expressiveCodeConfig: ExpressiveCodeConfig = {
	theme: "github-dark", // 代码高亮主题
};

// GitHub 编辑配置
export const gitHubEditConfig: GitHubEditConfig = {
	enable: true, // 是否启用 GitHub 编辑
	baseUrl: "https://github.com/qiuyuxc/fuwari/blob/main/src/content/posts", // GitHub 编辑的基础 URL
};

// todoConfig 已移除