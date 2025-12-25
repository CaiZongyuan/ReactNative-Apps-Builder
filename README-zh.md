# 使用 React Native 和 InstantDB 构建你自己的应用构建器

一个基于 AI 的应用构建器，可以通过自然语言提示生成 React Native 应用程序。使用 React Native、Expo、[InstantDB](https://dub.sh/instantdb) 和 OpenAI 构建，展示了现代移动开发的最佳实践。

## 功能特性

- 🤖 **AI 驱动生成**：使用 OpenAI 从自然语言提示生成 React Native 应用
- 📱 **原生移动应用**：构建可在 iOS 和 Android 上运行的真实 React Native 应用
- 🔄 **实时更新**：InstantDB 提供构建和数据的实时同步
- 👤 **用户认证**：安全的用户认证和构建所有权管理
- 📝 **构建管理**：创建、查看和管理多个应用构建
- 🎨 **实时预览**：在部署前预览生成的应用
- 🚀 **Expo Router**：基于文件的路由和受保护的路由

## 学习来源

本项目是基于 Simon Grimm 的优秀教程构建的：

**[使用 React Native 和 InstantDB 构建你自己的应用构建器](https://youtu.be/HRACNTmikZI)**

> **注意**：这是一个基于上述教程的个人学习项目。原项目和教程由 [Simon Grimm](https://galaxies.dev) 创作。

## 快速开始

### 前置要求

- [Bun](https://bun.sh/)（推荐）或 Node.js
- [Expo CLI](https://docs.expo.dev/get-started/set-up-your-environment/)
- [InstantDB](https://dub.sh/instantdb) 账户
- OpenAI API 密钥

为了获得最佳开发体验，建议安装：

- [Android Studio](https://developer.android.com/studio) 用于 Android 开发
- [Xcode](https://developer.apple.com/xcode/)（仅限 Mac）用于 iOS 开发

### InstantDB 配置

1. **创建组织**：首先在 [InstantDB 控制台](https://instantdb.com/)中创建一个组织

2. **获取凭证信息**：

   - **平台个人访问令牌**：点击左上角用户头像 → **User Settings** → 创建新的个人访问令牌

   - **组织凭证**：进入你新创建的组织，找到：
     - `EXPO_PUBLIC_INSTANT_APP_ID` - 应用的 ID
     - `INSTANT_APP_ADMIN_TOKEN` - 用于服务端操作的管理员令牌
     - `INSTANT_ORG_ID` - 你的组织 ID

   - **AI API 密钥**：从服务提供商获取你的 GLM API 密钥

3. **配置环境变量**：在根目录创建 `.env` 文件：

```env
EXPO_PUBLIC_INSTANT_APP_ID=your-instant-app-id
INSTANT_APP_ADMIN_TOKEN=your-admin-token
INSTANT_ORG_ID=your-org-id
INSTANT_PLATFORM_PERSONAL_ACCESS_TOKEN=your-platform-token
GLM_API_KEY=your-glm-api-key
```

4. **使用 InstantDB CLI 认证**：

   ```bash
   bunx instant-cli login
   ```

5. **推送 Schema 到云端**：初始化并将你的 schema 推送到 InstantDB：

   ```bash
   bunx instant-cli init
   ```

   这会将你的 `instant.schema.ts` 和其他项目设置推送到云端。

### 安装步骤

1. **克隆仓库**

   ```bash
   git clone <repository-url>
   cd instant-mini
   ```

2. **安装依赖**

   ```bash
   bun install
   # 或者 npm install
   ```

3. **预构建原生代码**

   ```bash
   bunx expo prebuild
   ```

4. **运行应用**

   ```bash
   # iOS
   bunx expo run:ios

   # Android
   bunx expo run:android
   ```

## 资源链接

- [InstantDB 文档](https://instantdb.com/docs)
- [Expo Router 文档](https://docs.expo.dev/router/introduction/)
- [React Native 文档](https://reactnative.dev/)
- [OpenAI API 文档](https://platform.openai.com/docs)

---

**原教程**：[使用 React Native 和 InstantDB 构建你自己的应用构建器](https://youtu.be/HRACNTmikZI) 作者 Simon Grimm
