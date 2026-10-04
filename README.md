# 🌿 VerdantReader — Universal Document & Book Reader

> A minimalist, sophisticated, and user-centric reading application built for **Android** and **Windows Desktop**, styled in an **Emerald & Cream** aesthetic with realistic **Google Play Books 3D page-curl animation** applied across all document formats (including **PDFs**).

---

## ✨ Features & Architecture

### 1. Palette & Aesthetics
* **Light Mode (Alabaster & Forest)**: Cream paper background (`#FBF9F4`), deep forest emerald accents (`#0F5132`), warm charcoal typography (`#1E293B`).
* **Dark Mode (Obsidian & Mint)**: Deep midnight obsidian (`#08120E`), luminous emerald accents (`#10B981`), high-contrast soft white typography (`#F8FAFC`).
* Seamless one-click theme switcher in header.

### 2. Universal Document Format Support
* **eBooks & Kindle**: `.epub`, `.mobi`, `.kindle`, `.azw3`, `.fb2`, `.book`
* **Documents & Vectors**: `.pdf` (with full 3D page curl support!), `.djvu`
* **Office & Rich Text**: Microsoft Word `.doc`, `.docx`, `.rtf`, `.odt`, plain text `.txt`
* **Comics & Graphic Novels**: `.cbr`, `.cbz`

### 3. Realistic 3D Page-Turn Physics (Google Play Books Style)
* **3D Page Curl**: Realistic page-bending mesh with cast drop-shadows and spine crease depth. Works with mouse peeling on desktop and thumb corner-drag on Android.
* **Dual-Page Spread (Landscape)**: 2-page book view with central gutter shadow for tablets and desktop.
* **Single-Page Spread (Portrait)**: Single-page focus optimized for one-handed mobile reading.
* **Alternative Navigation Modes**: Switch in Settings between **3D Page Curl**, **Slide**, and **Tap (Instant)**.

### 4. Reading Shelves & Organization
* **Currently Reading**: Automatically tracks books you open and read, sorted by most recently accessed.
* **Books & Documents**: Full library directory with keyword search and format filter pills (PDFs, eBooks, Word, Comics).
* **Favorites**: Dedicated shelf for titles starred with the Favorite SVG icon.
* **Already Read**: Dedicated shelf for books marked completed with the Done SVG icon.

### 5. Book Card Specification
* **Left Section**:
  * Book Title (prominent semibold)
  * Author Name (subtle subtext)
  * Format & Size comma-separated (e.g., `EPUB, 2.8 MB` or `PDF, 14.6 MB`)
  * **SVG Action Toggles**:
    * **Favorite SVG** (Heart outline that fills with emerald)
    * **Already Read SVG** (Checkmark-circle that fills with emerald)
* **Right Section**:
  * 3D Book Cover / Front page wallpaper with book-spine lighting and elevation.

### 6. Floating Action Button (`+` FAB)
* Floating emerald circular button at bottom right.
* Tap to select any document file from system or drag-and-drop directly.

### 7. Automated In-App Updates & GitHub Releases
* **Zero Manual APK Downloading**: You never need to go to GitHub Actions or download files manually from a browser.
* **In-App Pop-Up**: When you release an update on GitHub, an in-app pop-up notifies you immediately with version notes and an **Update Now** button.
* **Cumulative Installation**: If you skip earlier versions, tapping update installs all intermediate improvements directly to the newest release in a single step.
* **Persistent Update Indicator**: If dismissed with "Later", an emerald badge remains in the navbar and settings so you can update at your convenience.
* **60-Day Mandatory Enforcement**: If an update is older than 60 days (2 months), it becomes mandatory to ensure stability and format compatibility.
* **100% Data Preservation**: All books, reading progress, bookmarks, and favorites are preserved across updates.

---

## 🚀 Running the App Locally

To start the development server on your machine:
```bash
cd "C:\Users\Sayan\.gemini\antigravity\scratch\universal-reader"
npm run dev
```

To build production assets:
```bash
npm run build
```

---

## 📦 Pushing to GitHub & Future Updates

1. Initialize git and link your GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of VerdantReader"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```

2. When you want to release an update in the future:
   ```bash
   git tag v2.4.0
   git push origin v2.4.0
   ```
3. GitHub Actions (`.github/workflows/release.yml`) will automatically compile the release.
4. Next time you open the app on Android or Desktop, the **"New Update Available"** pop-up will appear on screen ready to update in one tap!
