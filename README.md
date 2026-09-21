# APKA APNA SATHI

A personal B.Tech study planner built by Amit Soni. It helps manage daily tasks, study streaks, LeetCode learning notes, semester goals, skills, personal reflections, reminders, and important study files.

**Live app:** https://amit-study-planner.web.app/

## Features

- Date-wise task planning, including planning tomorrow's tasks in advance
- Task completion records with date and time
- Streak logic with a 3 AM completion grace period
- LeetCode question tracker with logic notes and attached code files
- Monthly LeetCode consistency calendar
- Semester goals and skill-roadmap progress tracking
- Personal reflection and mood journal
- Browser reminders for tasks
- Important-files vault (up to 500 KB per file on the free cloud setup)
- Google sign-in and Firebase Firestore cloud sync
- Mobile-friendly progressive web app interface

## Project structure

```text
frontend/                 Client-side application
  index.html              Page structure and Firebase SDK imports
  styles.css              Responsive UI styles
  app.js                  Planner logic, cloud sync, tasks, streaks and reminders
  sw.js                   Service worker for basic offline support
  manifest.webmanifest    PWA installation metadata
  icon.svg                Application icon
backend/README.md         Firebase serverless backend explanation
database/                 Firestore and Storage security configuration
  firestore.rules
  storage.rules
firebase.json             Firebase Hosting and rules deployment configuration
```

## Technology used

- HTML, CSS and vanilla JavaScript
- Firebase Authentication (Google Sign-In)
- Cloud Firestore for private cloud sync
- Firebase Hosting for deployment

## Install and run this project

Anyone can run their own copy by following these steps.

### 1. Prerequisites

Install these tools first:

- [Git](https://git-scm.com/downloads)
- [Node.js LTS](https://nodejs.org/)
- A Google account for Firebase

### 2. Clone the repository

```bash
git clone https://github.com/amitsoni2006/apka-apna-sathi.git
cd apka-apna-sathi
npm install
```

### 3. Create a Firebase project

1. Open [Firebase Console](https://console.firebase.google.com/).
2. Create a new project.
3. Add a **Web app** to it.
4. Enable **Authentication → Sign-in method → Google**.
5. Create a **Cloud Firestore** database in test mode while developing.
6. Copy the Firebase web configuration object.

### 4. Connect your Firebase project

Open `frontend/app.js`, find `firebaseConfig`, and replace its values with the configuration copied from your own Firebase project.

Then edit `.firebaserc` and replace `amit-study-planner` with your Firebase project ID.

### 5. Sign in to Firebase CLI

```bash
npx firebase login
```

### 6. Deploy database rules and the website

```bash
npx firebase deploy --only firestore:rules,storage --project YOUR_PROJECT_ID
npx firebase deploy --only hosting --project YOUR_PROJECT_ID
```

Firebase will print a Hosting URL. Open that URL on both laptop and phone, then sign in with the same Google account to use cloud sync.

### Local preview

Use Firebase's local server instead of opening the HTML file directly:

```bash
npx firebase emulators:start --only hosting
```

Open the local URL printed in the terminal. Google sign-in/cloud sync needs the deployed Hosting URL unless Firebase Emulator Suite is configured for Auth and Firestore too.

## Update and push source code

```bash
git add .
git commit -m "Describe your update"
git push
```

To release an update after pushing code:

```bash
npx firebase deploy --only hosting --project YOUR_PROJECT_ID
```

## Data privacy

Cloud records are stored in a Firestore document tied to the signed-in Google account. Firestore rules restrict access to the matching user ID.
