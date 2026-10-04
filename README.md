# 🌿 Daily Read — Universal Document & Book Reader

> A minimalist, sophisticated reading application built for **Android** and **Windows Desktop**, styled in an **Emerald & Cream White** aesthetic with realistic **3D page-curl animation** applied across all document formats (including **PDFs**).

---

## ✨ Features & Architecture

### 1. Palette & Aesthetics
* **Light Mode (Cream White & Light Emerald)**: Soft warm ivory cream (`#FAF8F2`), vibrant light emerald green accents (`#059669`, `#10B981`), high-contrast emerald-charcoal typography (`#11261E`).
* **Dark Mode (Obsidian Emerald)**: Midnight pine obsidian (`#0A1612`), luminous emerald accents (`#10B981` / `#34D399`), crisp soft white typography (`#F7FAF8`).
* Instant light/dark mode switcher in header.

### 2. Universal Document Format Support
* **eBooks & Kindle**: `.epub`, `.mobi`, `.kindle`, `.azw3`, `.fb2`, `.book`
* **Documents & Vectors**: `.pdf` (with full 3D real page-curl support!), `.djvu`
* **Office & Rich Text**: Microsoft Word `.doc`, `.docx`, `.rtf`, `.odt`, plain text `.txt`
* **Comics & Graphic Novels**: `.cbr`, `.cbz`

### 3. Realistic 3D Page-Turn Physics & Gestures
* **Finger & Mouse Swiping**: Drag or swipe across the screen on Android or Desktop to curl the page in 3D perspective with realistic shadows and spine creasing.
* **Direction Settings**:
  * **Left to Right (Standard / Western)**: Swiping right-to-left flips forward.
  * **Right to Left (Manga / RTL)**: Swiping left-to-right flips forward.
* **Turn Style Selector**:
  * **3D Page Curl** *(Physics-based paper peeling with dynamic drop shadows)*
  * **Smooth Slide** *(Horizontal swipe glide)*
  * **Tap to Turn** *(Edge tap instant turn)*
* **Dual-Page Spread (Landscape)**: 2-page book spread with a central gutter fold shadow.
* **Single-Page (Portrait)**: Single-page focus for vertical screens and phones.

### 4. Reading Shelves & Local Indexing
* **Currently Reading**: Automatically tracks books you open and read, sequenced by most recently accessed.
* **Books & Documents**: Complete library directory with search and format filters (`PDFs`, `EPUB & Kindle`, `Word & Text`, `Comics`).
* **Favorites**: Dedicated shelf for books marked with the Favorite SVG (heart).
* **Already Read**: Dedicated shelf for completed titles marked with the Done SVG (checkmark).
* **Zero File Duplication**: Books stay on your device; only reading progress and metadata are indexed locally.

### 5. In-App Updates & Upper-Right Corner Option
* **No Intrusive Modals**: Updates are unobtrusive.
* **Upper-Right Corner Button**: An **"Update Later"** button sits in the upper right corner of the navbar.
* **Tapping it opens a notification**:
  * Option to **`[ Install Updated App ]`** (downloads with in-app progress and updates in-place).
  * Option to **`[ Update Later ]`** (dismisses the notification, keeping it available in the corner).

---

## 🚀 Running the App Locally

```bash
npm install
npm run dev
```

Build production assets:
```bash
npm run build
```

---

## 📦 GitHub Repository

Remote URL: `https://github.com/bugsnaxor-exe/DailyRead.git`
