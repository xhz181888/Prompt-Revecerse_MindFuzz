# 🧠 PROMPT REVERSE MindFuzz

![Version](https://img.shields.io/badge/version-1.0.0-indigo?style=flat-square)
![AI Model](https://img.shields.io/badge/AI-Gemini%203%20Pro%20%7C%20Flash-purple?style=flat-square)
![Framework](https://img.shields.io/badge/React-v19-blue?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

> **Visual to Text Engine** —— 让 AI 读懂你的视觉灵感。

**MindFuzz** 是一款极简设计、高级交互的视觉反推工具。它利用 Google 最先进的 **Gemini Multimodal AI**（多模态模型），深度分析图像和视频内容，反推出可用于 Midjourney、Veo、Sora 或 Stable Diffusion 的高精度提示词。

---

## ✨ 核心功能 (Features)

### 1. 🎥 深度视频反推 (Deep Video Analysis)
超越普通的帧分析，MindFuzz 能理解视频的时间维度：
*   **镜头语言**：精准识别推拉摇移 (Pan, Tilt, Zoom, Dolly) 等运镜方式。
*   **节奏与时长**：分析是慢动作 (Slow Motion)、延时摄影 (Timelapse) 还是快速剪辑。
*   **氛围感知**：捕捉光影变化、听觉氛围暗示及字幕文本内容。

### 2. 🧠 双核 AI 引擎 (Dual AI Kernels)
内置模型切换控制台，满足不同场景需求：
*   ⚡ **Gemini 2.5 Flash**：极速响应，低延迟，适合快速批量反推。
*   🧠 **Gemini 3 Pro (Preview)**：最强推理大脑，拥有更深度的逻辑理解和细节捕捉能力。

### 3. 🌍 智能双语输出 (Bilingual Output)
*   **English**：生成的标准提示词，直接用于生图/生视频工具。
*   **中文**：优化后的中文翻译，帮助用户理解 AI 的视角。

### 4. 🎨 多风格滤镜 (Style Lens)
提供四种预设分析视角，引导 AI 生成特定风格的术语：
*   📷 **写实 (Photorealistic)**：侧重摄影参数、光线、材质。
*   ⚡ **动漫 (Anime)**：侧重二次元画风、线条、色彩。
*   🎨 **抽象 (Creative)**：侧重概念、意境、艺术流派。
*   🖥️ **极简 (Minimalist)**：侧重构图、留白、设计感。

### 5. 🔧 上下文细节润色 (Contextual Refinement)
不满意？不需要重新生成。在结果页直接通过自然语言（如“把光线调暗一点”、“增加赛博朋克元素”）与 AI 对话，基于原图进行微调。

### 6. 🛡️ 本地化隐私安全 (Privacy First)
无需后端服务器中转。支持直接在浏览器端配置 API Key，Key 仅加密存储于本地 LocalStorage，确保您的 API 使用安全。

---

## 🛠️ 技术栈 (Tech Stack)

*   **核心框架**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
*   **构建工具**: [Vite](https://vitejs.dev/)
*   **UI 框架**: [Tailwind CSS](https://tailwindcss.com/) (Zinc Dark Mode Theme)
*   **AI SDK**: [Google GenAI SDK](https://www.npmjs.com/package/@google/genai) (`@google/genai`)
*   **图标库**: [Lucide React](https://lucide.dev/)

---

## 🚀 本地部署指南 (Local Deployment)

只需几步即可在您的电脑上运行 MindFuzz。

### 1. 环境准备
请确保您的电脑已安装 **Node.js** (推荐 v18 或更高版本)。
检查方法：在终端输入 `node -v`。

### 2. 获取代码与安装依赖

```bash
# 1. 克隆项目 (或者下载 ZIP 解压)
git clone https://github.com/your-username/prompt-reverse-mindfuzz.git

# 2. 进入项目目录
cd prompt-reverse-mindfuzz

# 3. 安装依赖包
npm install

```
3. 启动项目
```bash
npm run dev
```
终端将显示访问地址（通常是 http://localhost:5173），按住 Ctrl 点击链接即可在浏览器打开。
🔑 配置 API Key
本项目依赖 Google Gemini API 运行。
获取 Key：访问 Google AI Studio 免费申请 API Key。
设置 Key：
打开 MindFuzz 网页。
点击右上角的 设置 (Settings/Gear) 图标。
在弹窗中粘贴您的 API Key 并点击保存。
注：Key 存储在您浏览器的本地缓存中，不会上传至任何第三方服务器。
📂 项目结构 (Project Structure)
```TEXT
src/
├── services/
│   └── geminiService.ts    # AI 核心逻辑：提示词工程、模型调用、Schema定义
├── components/
│   ├── ControlPanel.tsx    # 控制台：整合模型选择与风格选择
│   ├── FileUpload.tsx      # 文件上传组件：含拖拽逻辑与扫描动效
│   ├── PromptDisplay.tsx   # 结果展示：含双语Tab切换与润色输入框
│   ├── ModelSelector.tsx   # 模型切换器 (Flash vs Pro)
│   ├── StyleSelector.tsx   # 风格选择器
│   ├── SettingsModal.tsx   # API Key 设置弹窗
│   └── Header.tsx          # 顶部导航
├── types.ts                # TypeScript 类型定义
├── utils.ts                # 工具函数：Base64转换、文件校验
└── App.tsx                 # 主应用入口：状态管理与页面编排

```
🤝 贡献 (Contributing)
欢迎提交 Pull Request 或 Issue！
如果你有更好的提示词策略 (Prompt Engineering) 或新的功能想法，请随时分享。
📄 许可证 (License)
本项目采用 MIT License 开源。
