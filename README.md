# Awesome English Leaderboard API

> Serverless Leaderboard Backend powered by **Google Apps Script** and **Google Sheets / Microsoft Excel (.xlsx)**.

A ready-to-deploy serverless REST API that records user scores, handles anti-duplication, formats spreadsheets automatically, and returns ranked global leaderboards in JSON format.

Designed for the **[Awesome English Arena Game](https://github.com/jefry195)**, but flexible enough to be used in any web or mobile game.

---

## ⚡ Key Features

- **Zero Hosting Cost**: 100% free serverless hosting via Google Apps Script.
- **Excel & Sheets Database**: All scores are recorded directly in Google Sheets and can be exported at any time to **Microsoft Excel (.xlsx)**.
- **Smart Anti-Duplication**:
  - Automatically renames empty default `Sheet1` to `Leaderboard` (never creates redundant sheets).
  - Inspects row 1 before creating headers (never duplicates headers even on repeated runs).
- **Custom Google Sheets Toolbar Menu**:
  - Adds `⚡ Awesome English > Inisialisasi / Periksa Database` directly inside your Google Sheets interface.
- **CORS Enabled**: Can be queried via `fetch()` or `XMLHttpRequest` from any domain or localhost without CORS blocking issues.
- **Live Leaderboard Sorting**: Automatically sorts high scores descending and limits response to Top 50.

---

## 🚀 Quick Setup (1 Minute)

### Step 1: Create a Google Spreadsheet
1. Open [Google Sheets](https://sheets.new).
2. Name your spreadsheet, for example: `Awesome English Leaderboard`.

### Step 2: Paste Code.gs
1. In your spreadsheet, click **Extensions > Apps Script**.
2. Replace all code in `Code.gs` with the content of [`Code.gs`](./Code.gs).
3. Click **Save (Ctrl + S)**.

### Step 3: Deploy as Web App
1. At the top right, click **Deploy > New deployment**.
2. Click the gear icon (**Select type**) and choose **Web app**.
3. Fill in:
   - **Description**: `Awesome English Leaderboard API`
   - **Execute as**: `Me (your email)`
   - **Who has access**: **`Anyone`** *(Crucial: allows frontend apps to fetch and submit scores without login)*.
4. Click **Deploy**.
5. Click **Authorize access**, select your Google account, and grant permission (click *Advanced > Go to Untitled project (unsafe) > Allow*).
6. Copy the **Web app URL** (e.g. `https://script.google.com/macros/s/AKfycb.../exec`).

---

## 📡 API Reference

### 1. Get Top Leaderboard (GET)

Fetch the top scores sorted from highest to lowest.

```http
GET https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec?action=leaderboard
```

#### Example Response (JSON):
```json
{
  "status": "success",
  "total": 3,
  "data": [
    {
      "id": 1,
      "timestamp": "2026-09-14T14:30:00.000Z",
      "playerName": "Jefri",
      "gameMode": "Speaking & Shadowing",
      "score": 520,
      "accuracy": 96,
      "level": 3,
      "notes": "Excellent pronunciation!"
    },
    {
      "id": 2,
      "timestamp": "2026-09-14T14:25:00.000Z",
      "playerName": "Sarah",
      "gameMode": "Listening Dictation",
      "score": 480,
      "accuracy": 92,
      "level": 2,
      "notes": ""
    }
  ]
}
```

---

### 2. Submit New Score (POST)

Record a player's score to the database.

```http
POST https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
Content-Type: application/json
```

#### Payload (JSON):
```json
{
  "playerName": "Jefri",
  "gameMode": "Speaking & Shadowing",
  "score": 520,
  "accuracy": 96,
  "level": 3,
  "notes": "Native accent!"
}
```

#### JavaScript Frontend Usage:
```javascript
// Submit score
await fetch(APP_SCRIPT_URL, {
  method: 'POST',
  mode: 'no-cors', // standard Apps Script POST compatibility
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    playerName: 'Jefri',
    gameMode: 'Speaking & Shadowing',
    score: 520,
    accuracy: 96,
    level: 3
  })
});
```

---

## 📂 Project Structure

```
.
├── Code.gs             # Apps Script source code with anti-duplication logic
├── appsscript.json     # Apps Script manifest configuration
├── index.html          # Interactive API test client & live leaderboard viewer
├── .gitignore          # Git ignore file
└── README.md           # Documentation and integration guide
```

---

## 📄 License
MIT License. Free to use for any educational or commercial project.
