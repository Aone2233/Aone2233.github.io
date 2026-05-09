---
layout: post
title: "清华毕设 LaTeX 模板与 AI 辅助写作入门"
date: 2026-05-09 00:00:00 +0800
categories: [工具, AI, LaTeX]
description: "从 ThuThesis 模板、TeX Live、VS Code 编译到 OpenCode 与 DeepSeek 辅助写作的完整入门流程"
keywords: ThuThesis, LaTeX, VS Code, OpenCode, DeepSeek, GitHub Pages
sequence: true
flow: true
mathjax: true
mindmap: true
mindmap2: true
comment: true
---

> 目标读者：第一次用 LaTeX 写清华本科综合论文训练、硕士论文或博士论文的同学。  
> 推荐路线：本地 TeX Live + VS Code + LaTeX Workshop + ThuThesis 发布版模板，再用 OpenCode 配合 OpenCode Go 或 DeepSeek API 辅助写作、排错和改稿。  
> 本文核查时间：2026-05-09。

## 先看一个标准项目结构

用 ThuThesis 写论文时，不建议把所有内容都塞进一个 `.tex` 文件。更稳妥的做法是把主文件、章节、图片和参考文献分开管理。一个典型的 ThuThesis 项目可以这样组织：

```text
my-thesis/
├── main.tex
├── thuthesis.cls
├── thusetup-bachelor.tex
├── data/
│   ├── chap01-bachelor.tex
│   ├── chap02-bachelor.tex
│   └── ...
├── ref/refs.bib
├── figures/
├── latexmkrc
└── .vscode/settings.json
```

这种结构的核心思想是：`main.tex` 只负责组织论文，章节放在 `data/`，图片放在 `figures/`，参考文献放在 `ref/refs.bib`，编译由 `xelatex`、`bibtex` 或 `latexmk` 统一处理。

![LaTeX + AI 工作流总览](/images/posts/workflow-overview.svg)

## 一、为什么建议本地写 LaTeX

ThuThesis 官方也提供 Overleaf 模板，但本地写作更适合毕设后期：

- 编译时间不受在线平台限制。
- 本地文件、图片、参考文献、仿真数据更容易管理。
- VS Code 可以直接定位 LaTeX 报错行。
- OpenCode 这类 CLI agent 可以在项目目录中读文件、改文件、跑编译、根据日志修错。

如果只是试用模板，Overleaf 可以快速上手；如果已经进入正式写作，建议尽早切到本地。

## 二、推荐工具栈

| 环节 | 推荐工具 | 作用 |
|---|---|---|
| 模板 | ThuThesis 发布版 | 清华学位论文 LaTeX 模板 |
| TeX 发行版 | TeX Live | 提供 `xelatex`、`bibtex`、`latexmk`、宏包 |
| 编辑器 | VS Code | 写 `.tex`、看 PDF、管理项目 |
| VS Code 插件 | LaTeX Workshop | 编译、预览、定位报错、清理辅助文件 |
| 版本管理 | Git | 记录每次修改，防止毕业论文误改不可恢复 |
| AI CLI | OpenCode | 在终端里让 AI 读项目、改 LaTeX、跑命令 |
| 模型来源 A | OpenCode Go | 省配置，适合想直接订阅使用的同学 |
| 模型来源 B | DeepSeek API | 用自己的 DeepSeek API key，选择 `deepseek-v4-pro` |
| 增强插件 | oh-my-openagent | 给 OpenCode 增加多 agent、规划、检索、诊断能力 |

## 三、安装基础环境

### 1. 安装 Git

Windows 用户直接安装 Git for Windows：

```powershell
git --version
```

能看到版本号即可。

### 2. 安装 TeX Live

Windows 推荐使用官方 `install-tl-windows.exe` 或清华 TUNA 镜像。安装时注意两点：

- 安装目录尽量使用纯英文路径，例如 `C:\texlive\2026`。
- 安装完成后重新打开终端，确认 `xelatex` 和 `latexmk` 能被识别。

验证命令：

```powershell
xelatex --version
latexmk -version
bibtex --version
```

如果提示 `command not found` 或 “不是内部或外部命令”，通常是 PATH 没配置好，重新安装或手动把 TeX Live 的 `bin\windows` 目录加入用户 PATH。

### 3. 安装 VS Code 和插件

在 VS Code 扩展商店安装：

- `LaTeX Workshop`
- `GitLens`，可选，用于查看 Git 修改历史
- `Remote - WSL`，可选，如果你把项目放在 WSL 里

LaTeX Workshop 编译命令默认就支持 `latexmk`，但 ThuThesis 建议显式用 `xelatex`。可以在项目根目录建立 `.vscode/settings.json`。

下面是一份适合 ThuThesis 的最小配置：

```json
{
  "latex-workshop.latex.tools": [
    {
      "name": "latexmk_xelatex",
      "command": "latexmk",
      "cwd": "%DIR%",
      "args": [
        "-xelatex",
        "-synctex=1",
        "-interaction=nonstopmode",
        "-file-line-error",
        "%DOCFILE%"
      ]
    },
    {
      "name": "xelatex",
      "command": "xelatex",
      "cwd": "%DIR%",
      "args": [
        "-synctex=1",
        "-interaction=nonstopmode",
        "-file-line-error",
        "%DOCFILE%"
      ]
    },
    {
      "name": "bibtex",
      "command": "bibtex",
      "cwd": "%DIR%",
      "args": ["%DOCFILE%"]
    }
  ],
  "latex-workshop.latex.recipes": [
    {
      "name": "latexmk (xelatex)",
      "tools": ["latexmk_xelatex"]
    },
    {
      "name": "xelatex -> bibtex -> xelatex -> xelatex",
      "tools": ["xelatex", "bibtex", "xelatex", "xelatex"]
    }
  ],
  "latex-workshop.latex.recipe.default": "first",
  "latex-workshop.latex.clean.enabled": true,
  "latex-workshop.latex.autoClean.run": "onBuilt",
  "latex-workshop.latex.clean.fileTypes": [
    "*.aux",
    "*.bbl",
    "*.blg",
    "*.fdb_latexmk",
    "*.fls",
    "*.lof",
    "*.log",
    "*.lot",
    "*.out",
    "*.synctex.gz",
    "*.toc",
    "*.xdv",
    "bu.aux"
  ]
}
```

## 四、获取 ThuThesis 模板

ThuThesis 官方建议新手优先下载发布版，而不是直接用 GitHub `master` 开发版。

推荐顺序：

1. 打开 ThuThesis GitHub Releases。
2. 下载最新发布版压缩包。
3. 解压到自己的论文项目目录。
4. 把 `thuthesis-example.tex` 复制或重命名为有意义的主文件名，例如 `main.tex` 或 `thesis.tex`。
5. 不要一开始就删示例章节，先保证模板能编译出 PDF。

推荐目录：

![推荐项目目录](/images/posts/project-layout.svg)

可以这样组织：

```text
my-thesis/
├── main.tex
├── thuthesis.cls
├── thusetup-bachelor.tex
├── latexmkrc
├── data/
│   ├── abstract-bachelor.tex
│   ├── chap01-bachelor.tex
│   └── chap02-bachelor.tex
├── figures/
│   └── experiment-setup.pdf
├── ref/
│   └── refs.bib
└── .vscode/
    └── settings.json
```

章节文件顶部建议加 root 注释，方便 VS Code 判断从哪个主文件编译：

```tex
% !TEX root = ../main.tex
```

主文件一般类似这样：

```tex
% !TEX encoding = UTF-8

\documentclass[
  degree=bachelor,
  system=windows,
  fontset=windows,
  cjk-font=windows
]{thuthesis}

\input{thusetup-bachelor}

\begin{document}

\maketitle
\copyrightpage

\frontmatter
\input{data/abstract-bachelor}
\tableofcontents
\listoffigures
\listoftables

\mainmatter
\input{data/chap01-bachelor}
\input{data/chap02-bachelor}

\bibliography{ref/refs}

\appendix
\input{data/appendix-bachelor}

\backmatter
\input{data/acknowledgements-bachelor}
\statement[page-style=plain]
\input{data/resume-bachelor}

\end{document}
```

注意：

- Windows 本地 TeX Live 通常用 `system=windows`、`fontset=windows`。
- 如果在 WSL/Linux 里编译，要根据实际字体改成对应配置，不要盲目照抄 Windows 字体设置。
- 图片文件名尽量用英文和短横线，例如 `particle-collision.pdf`，避免中文路径导致工具链兼容问题。

## 五、推荐编译方法

### 方法 A：latexmk，一条命令完成多轮编译

在主文件所在目录执行：

```powershell
latexmk -xelatex main.tex
```

如果主文件不是 `main.tex`，把命令里的文件名换成自己的主文件名：

```powershell
latexmk -xelatex thesis.tex
```

`latexmk` 会自动判断是否需要多跑几轮 `xelatex` 和 `bibtex`。这是日常写作最推荐的方式。

### 方法 B：手动四步编译，用于排查问题

当 `latexmk` 报错但你想看每一步具体哪里坏了，可以手动执行：

```powershell
xelatex main.tex
bibtex main
xelatex main.tex
xelatex main.tex
```

其中 `bibtex main` 不带 `.tex` 后缀。

### 编译流程图

![ThuThesis 编译流程](/images/posts/compile-loop.svg)

### 常用清理命令

```powershell
latexmk -c main.tex
```

只清中间文件，不删 PDF。

```powershell
latexmk -C main.tex
```

清中间文件和 PDF，慎用。

## 六、在 VS Code 里编译

1. 用 VS Code 打开整个论文文件夹，不要只打开单个 `.tex` 文件。
2. 打开主文件 `main.tex`。
3. 按 `Ctrl + Alt + B`，或点击左侧 TeX 图标里的 Build。
4. 默认选择 `latexmk (xelatex)`。
5. 出错时看三个位置：
   - VS Code 的 Problems 面板。
   - LaTeX Workshop 的 Output 面板。
   - 主文件同目录下的 `.log` 文件。

遇到报错时不要只看最后一行。LaTeX 的真正错误通常出现在第一处 `! LaTeX Error`、`Undefined control sequence`、`Missing $ inserted` 或 `File ... not found` 附近。

## 七、安装 OpenCode

OpenCode 官方说明中，Windows 可以直接安装，但更推荐用 WSL 获得更好的终端和文件系统兼容性。

### WSL 推荐路线

```bash
curl -fsSL https://opencode.ai/install | bash
opencode --version
```

进入论文目录后运行：

```bash
cd ~/code/my-thesis
opencode
```

首次进入项目后执行：

```text
/init
```

它会读取项目结构并生成 `AGENTS.md`，把论文项目约定写进去。建议把这个文件纳入 Git。

### Windows 直接安装路线

如果暂时不用 WSL，也可以用 npm：

```powershell
npm install -g opencode-ai
opencode --version
```

如果 VS Code 和 TeX Live 都装在 Windows，本地直接运行也可以。但如果论文放在 WSL 文件系统里，就尽量在 WSL 里运行 OpenCode；如果论文放在 Windows 盘里，就尽量不要一会儿用 Windows TeX Live、一会儿用 WSL TeX Live 混着编译。

## 八、两种 AI 模型配置路线

### 路线 A：OpenCode Go 订阅

适合不想分别管理多个 API key 的同学。

在 OpenCode TUI 里执行：

```text
/connect
```

选择 `OpenCode Go`，登录并完成订阅或 API key 配置。然后执行：

```text
/models
```

选择适合代码和 LaTeX 修改的模型。模型列表以 OpenCode 当时显示为准，不要凭印象手写模型 ID。

### 路线 B：DeepSeek API + `deepseek-v4-pro`

适合希望自己按 API 用量付费、并明确使用 DeepSeek 模型的同学。

步骤：

1. 到 DeepSeek 平台创建 API key。
2. 启动 OpenCode。
3. 执行 `/connect`。
4. 搜索并选择 `DeepSeek` provider。
5. 粘贴 DeepSeek API key。
6. 执行 `/models`，选择 `DeepSeek-V4-Pro`。

DeepSeek 官方文档中，OpenAI 兼容接口参数为：

```text
base_url = https://api.deepseek.com
model    = deepseek-v4-pro
```

如果想先单独验证 API key，可以用：

```bash
export DEEPSEEK_API_KEY="sk-..."

curl https://api.deepseek.com/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${DEEPSEEK_API_KEY}" \
  -d '{
        "model": "deepseek-v4-pro",
        "messages": [
          {"role": "system", "content": "You are a helpful assistant."},
          {"role": "user", "content": "Hello!"}
        ],
        "thinking": {"type": "enabled"},
        "reasoning_effort": "high",
        "stream": false
      }'
```

写论文、改 LaTeX、排查编译错误属于 coding/math 类任务，DeepSeek 官方建议这类任务把 `temperature` 设低。OpenCode 内置 provider 通常会处理默认参数；如果你自己写脚本调用 API，可以把 `temperature` 设为 `0.0` 或接近 `0`。

## 九、安装 oh-my-openagent

`oh-my-openagent` 是 OpenCode 的增强插件。它的仓库说明里提到：项目曾叫 `oh-my-opencode`，过渡期间 npm 包名和部分配置文件仍可能出现旧名称。因此看到 `oh-my-opencode` 不一定是错，但新配置里优先使用 `oh-my-openagent`。

先安装 Bun：

```bash
curl -fsSL https://bun.sh/install | bash
bun --version
```

然后安装插件：

```bash
bunx oh-my-openagent install
```

如果希望少交互，可以按自己的订阅情况选择参数。只使用 OpenCode Go 的例子：

```bash
bunx oh-my-openagent install \
  --no-tui \
  --claude=no \
  --openai=no \
  --gemini=no \
  --copilot=no \
  --opencode-go=yes
```

只使用 DeepSeek API 时，建议先把 DeepSeek 作为 OpenCode provider 配好，再运行插件安装和诊断：

```bash
bunx oh-my-openagent doctor
```

如果 `doctor` 报插件未注册，检查 `~/.config/opencode/opencode.json` 里是否有：

```json
{
  "plugin": ["oh-my-openagent"]
}
```

## 十、用 AI 写 LaTeX 的正确姿势

不要让 AI “直接帮我写论文”。这类请求上下文太空，结果也很难用。更有效的方式是把任务拆成可验证的小步骤。

### 推荐提示词 1：让 AI 先读结构

```text
请先只读项目，不要修改文件。
目标是理解这份 ThuThesis 论文结构：
- 主文件是谁
- 章节文件在哪里
- 参考文献在哪里
- 当前 VS Code/latexmk 编译配置是什么
最后用简体中文总结目录结构和推荐编译命令。
```

### 推荐提示词 2：改一节内容

```text
请修改 @data/chap02-bachelor.tex 的“实验方法”小节。
要求：
1. 保持 ThuThesis 和 LaTeX 语法正确。
2. 不改其他章节。
3. 不编造文献。
4. 修改后运行 latexmk -xelatex main.tex。
5. 如果编译失败，先根据 log 修复，再报告改了哪些文件和是否编译通过。
```

### 推荐提示词 3：排查编译失败

```text
现在 latexmk 编译失败。
请读取 main.log 和相关 .tex 文件，只定位第一处根因。
不要大范围重写。
修复后重新运行 latexmk -xelatex main.tex，并说明错误原因。
```

### 推荐提示词 4：参考文献整理

```text
请检查 ref/refs.bib：
1. 找出重复 key。
2. 找出正文中引用但 bib 文件中不存在的 key。
3. 找出 bib 中存在但正文未引用的条目。
先只给报告，不要删除任何文献。
```

## 十一、Git 使用习惯

论文项目必须用 Git。最低要求：

```bash
git init
git add .
git commit -m "initial thuthesis template"
```

每次完成一个明确改动后提交：

```bash
git status
git diff
git add data/chap02-bachelor.tex
git commit -m "revise methods chapter"
```

建议忽略 LaTeX 中间文件，但保留最终 PDF：

```gitignore
*.aux
*.bbl
*.blg
*.fdb_latexmk
*.fls
*.lof
*.log
*.lot
*.out
*.synctex.gz
*.toc
*.xdv
```

## 十二、常见问题

### 1. VS Code 找不到根文件

症状：打开章节文件后编译失败，提示找不到 `thuthesis.cls` 或图片路径。

处理：

- 用 VS Code 打开整个论文文件夹。
- 在章节文件顶部加：

```tex
% !TEX root = ../main.tex
```

### 2. 中文字体报错

症状：`fontset`、`SimSun`、`Microsoft YaHei`、`Fandol` 相关错误。

处理：

- Windows 本地编译：优先 `fontset=windows`。
- Linux/WSL 编译：不要假设有 Windows 字体，要安装对应中文字体或改模板字体配置。
- 不要在 Windows 和 WSL 之间混用同一套字体配置。

### 3. 参考文献不显示

处理顺序：

1. 确认正文里有 `\cite{key}`。
2. 确认 `ref/refs.bib` 中有同名 key。
3. 确认主文件里有 `\bibliography{ref/refs}`。
4. 用 `latexmk -xelatex main.tex` 重新编译。
5. 如果手动编译，必须跑 `bibtex main` 后再跑两次 `xelatex`。

### 4. 图片不显示

建议：

- 图片放在 `figures/`。
- 文件名用英文。
- LaTeX 里不要写绝对路径。
- 优先使用 `.pdf`、`.png`、`.jpg`。

示例：

```tex
\begin{figure}[htbp]
  \centering
  \includegraphics[width=0.8\linewidth]{figures/experiment-setup.pdf}
  \caption{实验系统示意图}
  \label{fig:experiment-setup}
\end{figure}
```

### 5. AI 改完后不知道是否真的可用

每次让 AI 修改论文，都要求它给出三类证据：

- 修改了哪些文件。
- 编译命令是什么。
- 编译是否通过；如果失败，第一处错误是什么。

不要接受“应该可以”这种回答。

## 十三、推荐的最终工作流

1. 下载 ThuThesis 发布版。
2. 本地安装 TeX Live、VS Code、LaTeX Workshop。
3. 保证原始模板能编译。
4. 建 Git 仓库并提交初始版本。
5. 拆分章节、图片、参考文献。
6. 安装 OpenCode。
7. 选择 OpenCode Go 或 DeepSeek API。
8. 可选安装 oh-my-openagent。
9. 每次 AI 修改后都运行 `latexmk -xelatex main.tex`。
10. 每完成一部分就 Git commit。

## 参考资料

- ThuThesis GitHub：<https://github.com/tuna/thuthesis>
- ThuThesis 新手指南：<https://github.com/tuna/thuthesis/wiki/新手指南>
- TeX Live on Windows：<https://tug.org/texlive/windows.html>
- LaTeX Workshop Compile：<https://github.com/James-Yu/LaTeX-Workshop/wiki/Compile>
- OpenCode Docs：<https://dev.opencode.ai/docs/>
- OpenCode Providers：<https://dev.opencode.ai/docs/providers>
- OpenCode Windows WSL：<https://dev.opencode.ai/docs/windows-wsl>
- DeepSeek API：<https://api-docs.deepseek.com/>
- DeepSeek OpenCode 集成：<https://api-docs.deepseek.com/quick_start/agent_integrations/opencode>
- oh-my-openagent：<https://github.com/code-yeongyu/oh-my-openagent>
- Bun Installation：<https://bun.sh/docs/installation>

