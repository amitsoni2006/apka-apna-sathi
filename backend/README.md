# Backend (Firebase Serverless)

This project uses Firebase as its serverless backend, so no Express, Node.js, Java, or Python server is required.

## Backend services

- **Firebase Authentication**: Google Sign-In identifies each planner user.
- **Cloud Firestore**: stores planner tasks, streak history, journals, LeetCode notes, goals, skills, and small file records.
- **Firebase Hosting**: publishes the frontend website.

## Why this folder exists

The browser app communicates directly with Firebase using the official Firebase Web SDK. Backend security is enforced by the Firestore rules in `../database/firestore.rules`, not by hiding code in the browser.

## Data model

Each signed-in user has one document:

```text
studyPlanners/{firebaseUserId}
```

The document stores `plannerJson`, a serialized planner state. This makes cloud backup and cross-device sync simple for a personal planner.
