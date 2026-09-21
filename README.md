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
index.html           Main application UI, styles, and client-side logic
sw.js                Service worker for basic offline/PWA support
manifest.webmanifest App install metadata for phones
icon.svg             Application icon
firebase.json        Firebase Hosting configuration
firestore.rules      Firestore security rules (each user can access only their data)
storage.rules        Firebase Storage rules
```

## Technology used

- HTML, CSS and vanilla JavaScript
- Firebase Authentication (Google Sign-In)
- Cloud Firestore for private cloud sync
- Firebase Hosting for deployment

## Run locally

Open `index.html` in a browser for a quick preview. The production version should always be opened from the Firebase Hosting URL so cloud sync works consistently across laptop and phone.

```bash
npx firebase deploy --only hosting --project amit-study-planner
```

## Update and push source code

```bash
git add .
git commit -m "Describe your update"
git push
```

## Data privacy

Cloud records are stored in a Firestore document tied to the signed-in Google account. Firestore rules restrict access to the matching user ID.
