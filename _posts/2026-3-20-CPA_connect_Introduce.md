---
layout: post
title: "如何连接CPA到Codex以及Cherry Studio"
categories: 技术教学
description: 介绍一下获取到CPA的链接和密钥之后如何使用的问题
keywords: GitHub Pages, Blog, Aone2233
sequence: true
flow: true
mathjax: true
mindmap: true
mindmap2: true
comment: true
---

很多人第一次拿到 API 信息时，都会有点不知道从哪下手：

- `Base URL` 是什么？
- `API Key` 应该填在哪里？
- 为什么别人能在客户端里直接用 ChatGPT，我却配置失败？
- `Codex` 和 `Cherry Studio` 到底怎么接入？

如果你也有类似疑问，这篇文章就是写给你的。

这篇教程会用尽量简单的方式，带你一步一步搞清楚：

- 拿到 `Base URL` 和 `API Key` 之后到底能做什么
- 如何判断接口是否兼容 OpenAI 格式
- 如何在 **Codex** 中配置
- 如何在 **Cherry Studio** 中配置
- 配置失败时应该怎么排查

> 适合人群：  
> 第一次接触 API 接入的小白用户、想把 ChatGPT 模型接入本地客户端的用户、需要快速写内部教程或博客的人。

---

## 一、先弄明白：Base URL 和 API Key 是什么？

通常你拿到的接口信息会长这样：

```text
Base URL: https://api.example.com/v1
API Key: sk-xxxxxxxxxxxxxxxx
Model: gpt-5.2
```

这里面最关键的是三样东西：

### 1）Base URL：接口地址

你可以把它理解成：

> 你的客户端要把请求发到哪里去

例如：

```text
https://api.example.com/v1
```

这个地址不是给你打开网页聊天用的，而是给软件、客户端、脚本程序发送请求用的。

---

### 2）API Key：调用凭证

你可以把它理解成：

> 你的钥匙，证明“你有权限调用这个接口”

例如：

```text
sk-xxxxxxxxxxxxxxxx
```

客户端在请求模型时，会自动把这个 Key 带上。

---

### 3）Model：模型名称

这表示你要调用哪个模型，比如：

- `gpt-5`
- `gpt-5.1`
- `gpt-5.2`
- `gpt-5.2-codex`

你可以把它理解成：

> 告诉系统你要使用哪个 AI 模型

---

## 二、拿到这些参数之后，能做什么？

简单来说，你可以把这组参数接入到支持 **OpenAI 兼容接口** 的工具里。

常见工具包括：

- Cherry Studio
- 各类桌面 AI 客户端
- 开发工具
- 命令行工具
- 脚本程序
- 浏览器插件
- Codex 类工具

只要一个工具支持填写以下内容，通常就能接入：

- Base URL
- API Key
- 模型名称

所以你可以这样理解：

> 拿到 Base URL 和 Key，不是“只能看”，而是已经具备了调用 ChatGPT 模型的条件。

---

## 三、先判断一下：你的接口是不是 OpenAI 兼容？

这一步很重要。

因为大多数第三方客户端，包括 **Cherry Studio** 和很多 **Codex 类工具**，底层都是按照 OpenAI 的接口格式发请求的。

> 当然CPA已经采用了OpenAI兼容的格式，所以以下仅作为科普

如果你的服务端兼容 OpenAI 接口，那么配置起来会非常顺利。

---

### 一个典型的 OpenAI 兼容调用示例

```bash
curl https://api.example.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk-xxxxxxxxxxxxxxxx" \
  -d '{
    "model": "gpt-4o",
    "messages": [
      {"role": "user", "content": "你好，请回复测试成功"}
    ]
  }'
```

如果你的服务端支持这种调用方式，通常就说明它是兼容 OpenAI 风格的。

---

## 四、推荐先做一步：用 curl 测试接口是否可用

很多小白一开始就直接打开 Cherry Studio 或 Codex 一顿配置，结果报错之后完全不知道是哪里出问题。

更推荐的做法是：

> 先测试接口本身是否可用，再接客户端。

这样你可以更容易判断问题出在：

- Key 不对
- URL 不对
- 模型名不对
- 客户端配置不对
- 服务端兼容性有问题

---

### 测试命令示例

```bash
curl https://api.example.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk-xxxxxxxxxxxxxxxx" \
  -d '{
    "model": "gpt-4o",
    "messages": [
      {"role": "user", "content": "请回复：测试成功"}
    ]
  }'
```

如果返回了类似下面的内容：

```json
{
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": "测试成功"
      }
    }
  ]
}
```

那就说明至少这三项是没问题的：

- Base URL
- API Key
- 模型名

你就可以继续去配置客户端了。

---

![curl 测试接口成功返回结果](https://dav.orderly2233.org/d/images/a51472a0929823c62a9a8a0de2460d54.png?sign=FNCaNlzPhnCqFr95peXLV5yY0ANN9bJaZXNultmovkY=:0)

---

## 五、如何在 Codex 中调用 ChatGPT 模型？

这里先说明一下：

不同版本的 Codex、不同平台上的 Codex 类工具，配置入口可能不完全一样。  
但它们本质上都离不开三个参数：

- `Base URL`
- `API Key`
- `Model`

一般有两种常见配置方式：

1. 使用环境变量
2. 使用配置文件

---

### 方式一：通过环境变量配置 Codex

这是最常见、也最适合开发者的一种方式。

你可以设置如下环境变量：

```bash
OPENAI_API_KEY=你的Key
OPENAI_BASE_URL=你的BaseURL
```

例如：

```bash
export OPENAI_API_KEY="sk-xxxxxxxxxxxxxxxx"
export OPENAI_BASE_URL="https://api.example.com/v1"
```

如果你使用的是 Windows PowerShell，可以这样写：

```powershell
$env:OPENAI_API_KEY="sk-xxxxxxxxxxxxxxxx"
$env:OPENAI_BASE_URL="https://api.example.com/v1"
```

配置完成后，重新启动你的 Codex 工具即可。

![Codex 环境变量配置示例](https://dav.orderly2233.org/d/images/00319f52780e5bc467b662253548eb17.png?sign=WEh1zNTtKcqoTgCJXQ8UsE9yzIKrT1skxLKhwjsFn-k=:0)

---

### 方式二：通过配置文件配置 Codex

有些 Codex 工具支持通过直接填写`Base URL`和`API Key`来指定接口信息。

比如[CC Switch](https://github.com/farion1231/cc-switch)

如果采用的客户端没有屏幕，可以采用cli版本：[CC-Switch CLI](https://github.com/SaladDay/cc-switch-cli) 

这里以具备图像版本的CC Switch为例：

在进入主界面后选择Codex，然后点击右上角的+号按钮可以添加

![CC-Switch配置示例](https://dav.orderly2233.org/d/images/PixPin_2026-03-19_20-44-31.png?sign=UUn-UyI-SNELgwThUBpjwkHlDpAEJ3lCA-7uMZFR_bc=:0)

之后需要填写如下几个绿色框中的内容即可，按照给的信息填写后点击右下角的添加即可：

![CC Switch添加codex供应商](https://dav.orderly2233.org/d/images/PixPin_2026-03-19_20-47-34.png?sign=RH6G3tQ3EGIrUWeMYddwPsJAU1_PFJ0OZ40apR1a85U=:0)

我们在这里的添加内容实际上相当于在codex的官方配置文件中添加如下内容：

config.toml (TOML)：

```toml
model_provider = "custom"
model = "gpt-5.4"

base_url = "https://api.example.com/v1"
```

auth.json (JSON) ：

```json
{
  "OPENAI_API_KEY": "sk-xxxxxxxxxxxxxxxx"
}
```

不同工具的配置格式会有差异，但本质上填的内容都一样。

你只需要记住一句话：

> Codex 配置的核心，不是死记格式，而是把 Base URL、Key 和模型名填对。

---

![CC Switch填写示例](https://dav.orderly2233.org/d/images/PixPin_2026-03-19_20-55-35.png?sign=H86pJwSS2dePlIACxIALFGkgGIdk0rTIPgge1yJ_Wzg=:0)

---

## 六、Codex 配置时最容易踩的坑

### 1）Base URL 填得太长

很多人会把完整接口路径填进去，比如：

```text
https://api.example.com/v1/chat/completions
```

这通常是不对的。

更常见的正确写法是：

```text
https://api.example.com/v1
```

也就是说：

- `/chat/completions` 这种路径，通常由客户端自动拼接
- 你自己只需要填写“基础地址”

---

### 2）模型名称写错

例如服务端支持的是：

```text
gpt-4o-mini
```

你却写成：

```text
gpt4o-mini
```

或者：

```text
GPT-4o-mini
```

那就会直接调用失败。

建议做法是：

> 模型名尽量复制粘贴，不要手敲。

---

### 3）客户端和服务端支持的接口格式不一致

有些客户端默认用的是新版接口，有些后端只兼容旧版 `chat/completions`。

这时候你看起来什么都填对了，但依然用不了。

如果出现这种情况，建议：

- 查看工具文档
- 查看服务商文档
- 优先用 `curl` 测试基础接口
- 看日志里的报错信息

---

## 七、如何在 Cherry Studio 中调用 ChatGPT 模型？

如果你不想折腾命令行，或者更喜欢图形界面，那么我更推荐你先从 [Cherry Studio](https://www.cherry-ai.com/download) 开始。

它是一个比较适合普通用户使用的桌面 AI 对话客户端，支持接入多种模型服务，也支持自定义 OpenAI 兼容接口。

你可以把它理解成：

> 把你的 Base URL 和 Key 填进去，它就能像 ChatGPT 一样直接聊天。

附：Cherry Studio同样支持[安卓手机端](https://github.com/CherryHQ/cherry-studio-app)

---

### Cherry Studio 配置步骤

#### 第一步：打开设置页面

启动 Cherry Studio 后，找到：

- **设置**
- **模型服务商**
- **添加服务商**
- 或 **OpenAI Compatible / 自定义 OpenAI**

不同版本的界面名称可能略有区别，但一般都能找到类似入口。

---

![Cherry Studio 设置入口](https://dav.orderly2233.org/d/images/PixPin_2026-03-19_20-57-53.png?sign=T31En7FYC1leKUO_F9dIN1YXzNebYKpzoz--HnLzQ9k=:0)

---

### 第二步：添加自定义服务商

接下来，你需要填写以下几个字段。

#### 1）名称

这个只是给你自己区分用的，可以随便起。

例如：

```text
CPA-ChatGPT
```

#### 2）API Key

填写你拿到的 Key：

```text
sk-xxxxxxxxxxxxxxxx
```

#### 3）Base URL

填写你的接口地址：

```text
https://api.example.com/v1
```

#### 4）模型名称

填写可用模型，例如：

```text
gpt-4o
```

如果你有多个模型，也可以后续继续添加，比如：

- `gpt-4o-mini`
- `gpt-4.1`
- `gpt-4.1-mini`

当然你也可以选择自动获取模型，cherry studio也支持这个操作，在填写API密钥和地址后点击绿色“管理”按钮：

![Cherry Studio 自动获取模型列表](https://dav.orderly2233.org/d/images/PixPin_2026-03-19_21-00-52.png?sign=vnjsQFvvHNWOX8Q8ULGY03by4SXg3jm3XXrgo9xS3us=:0)

然后点击下图箭头指向的按钮即可将所有可用模型自动添加到列表当中

![Cherry Studio 自动获取模型列表](https://dav.orderly2233.org/d/images/PixPin_2026-03-19_21-03-04.png?sign=h0KQWPdfeGg5hdcD9EQ65hgqDSV6ylX6rA2bRoNERCw=:0)

---

### 第三步：保存并测试

保存之后，你可以：

- 刷新模型
- 测试连接
- 新建聊天窗口直接测试

建议你直接发送一句简单的话：

```text
你好，请回复“连接成功”
```

如果能正常返回，就说明配置已经成功了。

---

![Cherry Studio 测试对话成功](https://dav.orderly2233.org/d/images/PixPin_2026-03-19_21-05-48.png?sign=G6rKwlknnoNRuHDCCMZivTYFew6GbCiwryCSLLQiWEo=:0)

---

## 八、Cherry Studio 常见报错怎么排查？

对于新手来说，最常见的问题其实就那几类。

---

### 1）401 Unauthorized

这通常表示认证失败。

你需要优先检查：

- API Key 是否填错
- 前后是否有空格
- Key 是否已经失效
- 服务端是否采用了特殊认证方式

---

### 2）404 Not Found

这通常表示地址不对。

常见原因有：

- Base URL 少了 `/v1`
- Base URL 多写了 `/chat/completions`
- 域名写错
- 客户端请求路径和后端不兼容

错误示例：

```text
https://api.example.com/v1/chat/completions
```

更常见的正确示例：

```text
https://api.example.com/v1
```

---

### 3）模型不存在

这种情况一般说明：

- 模型名称写错了
- 你没有该模型权限
- 服务商根本没开放这个模型

建议直接去看服务商提供的模型列表，最好复制粘贴。

---

### 4）可以连接，但回答不出来

这通常说明：

- Key 是有效的
- URL 也是通的
- 但接口格式兼容性可能有问题

比如：

- 客户端使用的是新版协议
- 后端只支持旧版 `chat/completions`
- 流式输出格式不匹配

如果遇到这种情况，建议回到最基础的 `curl` 测试。

---

## 九、第一次使用时的几个建议

### 1）优先用小模型测试

如果服务商提供多个模型，建议优先选择：

- `gpt-5`
- `gpt-5.2`

原因很简单：

- 更快
- 更省
- 更适合测试配置是否正确

等确认没问题后，再切换到更强的模型。

---

### 2）建议先在 Cherry Studio 里跑通

如果你是纯小白，我更建议先用 Cherry Studio。

因为它：

- 图形界面更直观
- 操作门槛更低
- 更适合做首次连接测试

等你熟悉了 Base URL、Key、模型这些概念之后，再去折腾 Codex、命令行和自动化工具，会轻松很多。

---

### 3）不要泄露 API Key

这一点非常重要。

API Key 相当于你的使用权限，如果泄露出去，别人可能会直接消耗你的额度。

所以一定注意：

- 不要把 Key 发到公开群里
- 不要在截图中完整展示 Key
- 不要上传到 GitHub 公开仓库
- 如果怀疑泄露，及时更换

---

## 十、总结

其实拿到 CPA 的 `Base URL` 和 `API Key` 之后，核心就只有三件事：

1. **Base URL：请求发到哪里**
2. **API Key：你是谁**
3. **Model：你要用哪个模型**

不管是在 **Codex** 还是 **Cherry Studio** 中，配置逻辑都差不多：

- 填地址
- 填密钥
- 选模型

如果配置失败，也建议按这个顺序排查：

1. Key 对不对  
2. Base URL 对不对  
3. 模型名对不对  
4. 接口是不是 OpenAI 兼容  
5. 客户端和服务端的接口格式是不是一致  

只要这几项没问题，大多数情况下都能顺利接入。