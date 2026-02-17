# Publishing FIO to the Chrome Web Store

## Step 1: Test locally first

1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top-right)
3. Click **Load unpacked** and select the `fio-extension` folder
4. Open a new tab — you should see FIO!
5. Add some cities, test 12H/24H toggle, remove columns, etc.

## Step 2: Register as a Chrome Web Store developer

1. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. Sign in with your Google account
3. Pay the one-time **$5 registration fee**
4. Accept the developer agreement

## Step 3: Prepare store assets

You'll need these before uploading:

| Asset | Size | Notes |
|-------|------|-------|
| Extension ZIP | — | Zip the `fio-extension` folder (see below) |
| Store icon | 128x128 px | Already included as `icons/icon128.png` |
| Promotional tile (small) | 440x280 px | Screenshot or designed graphic |
| Screenshots | 1280x800 or 640x400 px | At least 1, up to 5 |

**To create the ZIP:**
- On Mac: Right-click the `fio-extension` folder → "Compress"
- On Windows: Right-click → "Send to" → "Compressed (zipped) folder"
- Or from terminal: `cd` to the parent directory and run:
  ```
  zip -r fio-extension.zip fio-extension/
  ```

**Tip for screenshots:** Load the extension, add 4-5 cities across different timezones (e.g., Tokyo, Dubai, London, New York, Los Angeles) and take a screenshot of your new tab page. This makes a great store listing image.

## Step 4: Upload and configure listing

1. In the Developer Dashboard, click **New Item**
2. Upload your `fio-extension.zip`
3. Fill in the listing details:

**Suggested listing info:**

- **Name:** FIO – Figure It Out
- **Summary:** See the current time across your favorite locations in beautiful colored columns — right on your new tab.
- **Category:** Productivity
- **Language:** English

**Description (suggested):**

```
FIO replaces your new tab with a beautiful timezone dashboard.

Each location gets its own color-coded column that shifts based on the time of day — bright and saturated during daytime, dark and muted at night.

Features:
• Up to 10 timezone columns
• Cities in the same timezone auto-group together (up to 3 per column)
• Switch between 12-hour and 24-hour formats
• 100+ cities worldwide
• Columns sorted west-to-east automatically
• Clean, minimal design — no clutter, just time

Perfect for remote teams, frequent travelers, or anyone who needs to keep track of time across the globe.
```

4. Upload your screenshots and promotional images
5. Set visibility to **Public**

## Step 5: Submit for review

1. Click **Submit for Review**
2. Google typically reviews within 1-3 business days
3. You'll get an email when it's approved (or if changes are needed)

## Optional: Privacy policy

Chrome Web Store may require a privacy policy since the extension uses `chrome.storage`. A simple one noting that all data stays local on the user's device and nothing is transmitted externally should suffice. You can host this on a simple GitHub Pages site or Google Doc.

## Updating the extension later

1. Bump the `version` in `manifest.json` (e.g., "1.0.1")
2. Create a new ZIP
3. Go to Developer Dashboard → your extension → **Package** tab
4. Upload the new ZIP
5. Submit for review
