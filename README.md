# Subtitle Blocker

## 中文说明

Subtitle Blocker 是一个用于遮挡视频字幕区域的 Chrome 扩展，适合语言学习、听力训练和减少字幕依赖的观看场景。

### 功能特点

- 在视频页面的字幕区域添加可拖动遮罩层
- 支持从上、下、左、右四边调整遮罩大小
- 支持锁定当前尺寸，避免误触改变宽高
- 全屏模式当前优先支持主流媒体网站

### 使用方式

启用扩展后，页面会出现一个半透明毛玻璃遮罩层。你可以：

- 拖动中间区域来移动位置
- 拖动四边来调整大小
- 打开 `锁定尺寸` 后，仅移动遮罩，不再改变宽高

### 安装方式

#### 开发者模式加载

1. 打开 `chrome://extensions/`
2. 打开右上角 `开发者模式`
3. 点击 `加载已解压的扩展程序`
4. 选择当前项目目录

#### Chrome 应用商店安装

发布后可直接通过 Chrome Web Store 安装。

### 说明

- 不同网站的视频播放器结构不同，因此全屏模式下的兼容性会有所差异
- 当前版本已优先适配主流媒体网站

### 隐私说明

本扩展不会收集、上传或出售用户个人数据。扩展仅在本地保存必要设置，例如是否启用遮罩、是否锁定尺寸等，用于改善使用体验。

---

## English

Subtitle Blocker is a Chrome extension that adds a movable overlay over subtitle areas, helping language learners focus on listening with fewer subtitle distractions.

### Features

- Add a draggable overlay to subtitle areas on video pages
- Resize the overlay from the top, bottom, left, and right edges
- Lock the current size to avoid accidental resizing
- Support fullscreen usage on mainstream media websites

### How It Works

After enabling the extension, a translucent blur overlay appears on the page. You can:

- Drag the middle area to move it
- Drag the four edges to resize it
- Enable `Lock Size` to keep the current width and height while still allowing repositioning

### Installation

#### Load Unpacked

1. Open `chrome://extensions/`
2. Enable `Developer mode`
3. Click `Load unpacked`
4. Select this project folder

#### From Chrome Web Store

Once published, install it directly from the Chrome Web Store.

### Notes

- Fullscreen behavior may vary across websites because video players use different page structures
- Current fullscreen support is prioritized for mainstream media sites

### Privacy

This extension does not collect, upload, or sell personal data. It only stores local settings needed for the overlay experience, such as whether the extension is enabled and whether resize is locked.
