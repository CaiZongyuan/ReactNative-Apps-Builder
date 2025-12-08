# Build your own App Builder with React Native and InstantDB

An AI-powered app builder that generates React Native applications using natural language prompts. Built with React Native, Expo, [InstantDB](https://dub.sh/instantdb), and OpenAI, showcasing modern mobile development practices.

## Features

- 🤖 **AI-Powered Generation**: Generate React Native apps from natural language prompts using OpenAI
- 📱 **Native Mobile Apps**: Build real React Native applications that run on iOS and Android
- 🔄 **Real-time Updates**: InstantDB provides real-time synchronization of builds and data
- 👤 **User Authentication**: Secure user authentication and build ownership
- 📝 **Build Management**: Create, view, and manage multiple app builds
- 🎨 **Live Preview**: Preview generated apps before deployment
- 🚀 **Expo Router**: File-based routing with protected routes

## Video Tutorial

Watch and build this App Builder step by step:

<p align="center">
  <a href="https://youtu.be/HRACNTmikZI" target="_blank">
    <img src="https://img.youtube.com/vi/HRACNTmikZI/maxresdefault.jpg" alt="Build your own App Builder with React Native and InstantDB" width="100%" />
  </a>
</p>

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (recommended) or Node.js
- [Expo CLI](https://docs.expo.dev/get-started/set-up-your-environment/)
- [InstantDB](https://dub.sh/instantdb) account and app credentials
- OpenAI API key

For the best development experience, install:

- [Android Studio](https://developer.android.com/studio) for Android development
- [Xcode](https://developer.apple.com/xcode/) (Mac only) for iOS development

### Environment Setup

Create a `.env` file in the root directory with your credentials:

```env
INSTANT_APP_ID=your-instant-app-id
INSTANT_ADMIN_TOKEN=your-admin-token
INSTANT_ORG_ID=your-org-id
OPENAI_API_KEY=your-openai-api-key
```

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd instant-mini
   ```

2. **Install dependencies**

   ```bash
   bun install
   # or npm install
   ```

3. **Prebuild the native code**

   ```bash
   bunx expo prebuild
   ```

4. **Run the app**

   ```bash
   # iOS
   bunx expo run:ios

   # Android
   bunx expo run:android
   ```

## 🚀 Learn More

**Take a shortcut from web developer to mobile development fluency with guided learning**

Enjoyed this project? Learn to use React Native to build production-ready, native mobile apps for both iOS and Android based on your existing web development skills.

<a href="https://galaxies.dev?utm_source=simongrimm&utm_medium=github&vid=pocket-clone"><img src="banner.png" height="auto" width="100%"></a>
