# Health Check Collector Personal App

This app is designed to be installed from the browser with Add to Home Screen. It does not need the App Store or Play Store.

## Best Setup

Host the `web-pwa` folder at one stable HTTPS address, for example:

- Netlify
- Cloudflare Pages
- GitHub Pages

Use the same address every time you update the app. The data saved on each phone stays inside that phone browser/app storage.

## Install on iPhone

1. Open the hosted app link in Safari.
2. Tap Share.
3. Tap Add to Home Screen.
4. Confirm the name and icon.

## Install on Android

1. Open the hosted app link in Chrome.
2. Tap the three-dot menu.
3. Tap Add to Home screen or Install app.
4. Confirm.

## Update the App

1. Edit the files in this folder.
2. Upload or deploy the whole `web-pwa` folder again to the same hosted address.
3. Open the app on the phone.
4. If an update notice appears, tap Refresh.

If the old version still appears, fully close and reopen the app. On iPhone, Safari/PWA updates can sometimes take a little while.

## Data Reminder

Reports are stored locally on the device. Before deleting the app, clearing browser data, or changing phones, use the backup export button in the app.

The app provides three backup formats:

- Full app backup: JSON file for restoring the app data later.
- Spreadsheet export: CSV file for Google Sheets or Excel.
- Readable summary: HTML file that can be opened, printed, or saved as PDF.

On iPhone or Android, use the share sheet after export and choose Google Drive. If the share sheet is not available, download the file first and then upload it to Google Drive from the Files app or Drive app.
