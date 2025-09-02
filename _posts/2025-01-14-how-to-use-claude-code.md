---
layout: post
title: "Claude Code 跨平台使用指南"
categories: [工具, AI]
description: "详细介绍如何在 Linux、Windows 和 macOS 上安装和使用 Claude Code"
keywords: Claude Code, AI助手, 跨平台, 开发工具
sequence: true
flow: true
mathjax: true
mindmap: true
mindmap2: true
comment: true
---

> Claude Code 是 Anthropic 推出的官方命令行工具，让开发者可以直接在终端中与 Claude AI 协作进行编程工作。本文详细介绍如何在不同操作系统上安装和使用 Claude Code。

## Claude Code 简介

Claude Code 是一个强大的 AI 驱动的代码助手，可以帮助开发者：
- 理解和分析现有代码库
- 编写新的代码功能
- 调试和修复错误
- 重构和优化代码
- 生成测试用例
- 创建技术文档

## 系统要求

在开始安装之前，请确保您的系统满足以下要求：
- **操作系统**：macOS 10.15+、Ubuntu 20.04+/Debian 10+、Windows 10+
- **硬件要求**：4GB+ 内存
- **软件要求**：Node.js 18+ (如使用 npm 安装)
- **网络连接**：稳定的互联网连接
- **账户要求**：Anthropic Console 账户或 Claude Pro/Max 订阅

## Linux 系统安装

### 方法一：原生安装器 (推荐)

```bash
# 安装稳定版本 (默认)
curl -fsSL https://claude.ai/install.sh | bash

# 安装最新版本
curl -fsSL https://claude.ai/install.sh | bash -s latest

# 安装指定版本
curl -fsSL https://claude.ai/install.sh | bash -s 1.0.58
```

### 方法二：使用 npm

**Ubuntu/Debian 系统：**

```bash
# 更新包管理器
sudo apt update

# 安装 Node.js (如果未安装)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 通过 npm 全局安装 Claude Code (重要：不要使用 sudo)
npm install -g @anthropic-ai/claude-code

# 验证安装
claude doctor
```

**CentOS/RHEL/Fedora 系统：**

```bash
# 安装 Node.js
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo dnf install -y nodejs npm

# 安装 Claude Code (不要使用 sudo)
npm install -g @anthropic-ai/claude-code

# 验证安装
claude doctor
```

**Arch Linux：**

```bash
# 安装 Node.js
sudo pacman -S nodejs npm

# 安装 Claude Code (不要使用 sudo)
npm install -g @anthropic-ai/claude-code

# 验证安装
claude doctor
```

### Alpine Linux 特殊说明

```bash
# 安装必要的依赖
apk add libgcc libstdc++ ripgrep

# 设置环境变量
export USE_BUILTIN_RIPGREP=0

# 然后进行正常安装
curl -fsSL https://claude.ai/install.sh | bash
```

## Windows 系统安装

### 方法一：原生安装器 (推荐)

```powershell
# 安装稳定版本 (默认)
irm https://claude.ai/install.ps1 | iex

# 安装最新版本
& ([scriptblock]::Create((irm https://claude.ai/install.ps1))) latest

# 安装指定版本
& ([scriptblock]::Create((irm https://claude.ai/install.ps1))) 1.0.58
```

### 方法二：使用 npm

```powershell
# 1. 安装 Node.js
# 从 https://nodejs.org/zh-cn/ 下载并安装 LTS 版本

# 2. 打开 PowerShell 或命令提示符 (不要使用管理员权限)
npm install -g @anthropic-ai/claude-code

# 3. 验证安装
claude doctor
```

### 方法三：WSL (Windows Subsystem for Linux)

如果您使用 WSL，可以按照 Linux 的安装方法进行：

```bash
# 在 WSL 中运行
curl -fsSL https://claude.ai/install.sh | bash
```

### 方法四：使用包管理器

**使用 Chocolatey：**

```powershell
# 1. 安装 Chocolatey (如果未安装)
Set-ExecutionPolicy Bypass -Scope Process -Force
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# 2. 安装 Node.js
choco install nodejs

# 3. 安装 Claude Code
npm install -g @anthropic-ai/claude-code
```

**使用 Scoop：**

```powershell
# 1. 安装 Scoop (如果未安装)
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
irm get.scoop.sh | iex

# 2. 安装 Node.js
scoop install nodejs

# 3. 安装 Claude Code
npm install -g @anthropic-ai/claude-code
```

## macOS 系统安装

### 方法一：原生安装器 (推荐)

```bash
# 安装稳定版本 (默认)
curl -fsSL https://claude.ai/install.sh | bash

# 安装最新版本
curl -fsSL https://claude.ai/install.sh | bash -s latest

# 安装指定版本
curl -fsSL https://claude.ai/install.sh | bash -s 1.0.58
```

### 方法二：使用 npm

**使用 Homebrew：**

```bash
# 1. 安装 Homebrew (如果未安装)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 2. 安装 Node.js
brew install node

# 3. 安装 Claude Code (不要使用 sudo)
npm install -g @anthropic-ai/claude-code

# 4. 验证安装
claude doctor
```

**使用官方安装包：**

```bash
# 1. 从 https://nodejs.org/zh-cn/ 下载 macOS 安装包
# 2. 双击 .pkg 文件安装 Node.js
# 3. 打开终端，安装 Claude Code
npm install -g @anthropic-ai/claude-code

# 4. 验证安装
claude doctor
```

## 初始配置

### 1. 账户认证

Claude Code 提供三种认证方式：

**方式一：Anthropic Console (默认)**
- 需要在 console.anthropic.com 有活跃的付费账户
- 会自动创建 "Claude Code" 工作区用于使用跟踪

**方式二：Claude App (Pro/Max 订阅)**
- 统一订阅包括 Claude Code 和网页界面
- 提供更高的性价比

**方式三：企业平台**
- Amazon Bedrock
- Google Vertex AI

首次启动时会自动引导您完成认证：

```bash
cd your-project-directory
claude
```

### 2. 验证安装

```bash
claude doctor
```

## 基本使用方法

### 1. 启动 Claude Code

```bash
claude                              # 启动交互模式
claude "explain this project"       # 带初始提示启动
claude -p "explain this function"   # 单次查询
claude -c                           # 继续最近对话
claude -r "session-id" "Finish PR"  # 恢复指定会话
```

### 2. 核心功能和使用技巧

**文件处理：**
```bash
cat logs.txt | claude -p "分析这些日志"
```

**项目初始化：**
- 使用 `/init` 创建 CLAUDE.md 配置文件
- 拖拽文件时按住 Shift 键引用
- 支持 Ctrl+V 粘贴图片

**常用操作：**
```bash
claude update                    # 手动更新
export DISABLE_AUTOUPDATER=1    # 禁用自动更新
```

### 3. 交互模式和斜杠命令

进入交互模式后，您可以：
- 直接与 Claude 对话进行代码开发
- 使用自然语言描述需求
- Claude 可直接编辑文件、运行命令、创建提交

**常用斜杠命令：**
- `/help` - 显示所有可用命令
- `/init` - 创建项目配置和 CLAUDE.md 文件
- `/agents` - 创建子代理，Claude 会引导您完成过程
- `/model` - 切换不同的 Claude 模型
- `/login` - 重新登录或切换账户
- `/clear` - 清除对话历史（推荐经常使用以节省 tokens）
- `/compact` - 上下文管理
- `/terminal-setup` - 配置终端功能（如 Shift+Enter 换行）

**对话示例：**
```
You: 帮我创建一个 React 登录组件
Claude: 我来帮您创建一个 React 登录组件...

You: 这个项目用了什么依赖？
Claude: 让我查看您的 package.json 文件...
```

## 高级功能

### 1. 自定义斜杠命令

创建自定义命令：

```bash
mkdir -p .claude/commands
# 创建 .claude/commands/deploy.md
```

### 2. 工作模式

**自动模式 (Auto Mode)：**
- Claude 自动工作并编辑文件，无需等待许可
- 适合快速开发和迭代

**计划模式 (Plan Mode)：**
- Claude 先制定详细策略再开始编码
- 适合复杂项目和架构设计

**权限管理：**
```bash
claude --dangerously-skip-permissions
```

### 3. MCP 服务器配置

```bash
claude mcp
```

## 故障排除

### 常见问题

**安装失败：**
```bash
npm cache clean --force
npm install -g @anthropic-ai/claude-code
claude doctor
```

**权限错误 (Linux/macOS)：**
```bash
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

**网络问题：**
```bash
npm config set registry https://registry.npmmirror.com
# 或使用: curl -fsSL https://claude.ai/install.sh | bash
```

**认证问题：**
- 确保有 console.anthropic.com 付费账户或 Claude Pro/Max 订阅
- 使用 `/login` 重新认证

### 诊断命令

```bash
claude doctor                  # 检查状态
claude --version              # 查看版本
claude "Hello, are you working?" # 测试连接
```

## 最佳实践

### 1. 项目配置优化

- 使用 `/init` 命令创建 CLAUDE.md 配置文件作为项目指南
- 创建 `.claudeignore` 文件忽略不需要分析的文件
- 保持项目结构清晰，便于 Claude 理解

### 2. 高效使用技巧

- **经常使用 `/clear`**：每次开始新任务时清除对话历史，节省 tokens
- **提供具体上下文**：详细描述问题和需求
- **利用拖拽功能**：按住 Shift 拖拽文件到终端
- **使用管道**：`cat file.log | claude -p "分析错误"`
- **善用权限跳过**：`claude --dangerously-skip-permissions` 提升工作流效率

### 3. 开发流程建议

- 让 Claude 直接编辑文件和创建提交
- 利用自动模式快速迭代
- 使用计划模式处理复杂架构设计
- 创建自定义斜杠命令自动化常用操作

### 4. 安全考虑

- 不要在命令行中包含敏感信息
- 使用环境变量存储 API 密钥
- 定期检查 Claude 的文件修改权限
- 在共享代码前审查 Claude 的更改

## 结语

Claude Code 是 Anthropic 推出的革命性 AI 编程助手，将强大的 Claude Opus 4.1 模型直接集成到终端中。通过自然语言交互，开发者可以更高效地完成代码开发、调试、重构和文档编写等任务。

**核心优势：**
- **深度代码库理解**：能够理解整个项目结构和上下文
- **直接文件操作**：可以直接编辑文件、运行命令、创建提交
- **自然语言交互**：用简单的中文或英文描述需求即可
- **自动更新维护**：工具自动保持最新状态
- **跨平台支持**：支持 Linux、Windows、macOS 等主流操作系统

通过本指南，您已经掌握了 Claude Code 的安装、配置和使用方法。建议从简单的项目开始实践，逐步探索更多高级功能。记住经常使用 `/clear` 命令和 `claude doctor` 进行诊断，这将帮助您获得更好的使用体验。

Claude Code 正在快速发展中，更多功能和改进会持续推出。如遇问题可查阅官方文档：https://docs.anthropic.com/en/docs/claude-code