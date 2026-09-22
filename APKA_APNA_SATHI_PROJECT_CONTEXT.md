# APKA APNA SATHI — Complete Project Context

> Upload this file to any AI/chat before discussing this project. It contains the project purpose, technical setup, important behaviour, repository structure, deployment details, and known cautions.

## 1. Project identity

- **App name:** APKA APNA SATHI
- **Tagline:** Your daily planner
- **Creator:** Amit Soni
- **Purpose:** A personal B.Tech study-planner and self-improvement web app that works on laptop and mobile.
- **Live app:** https://amit-study-planner.web.app/
- **Firebase project ID:** `amit-study-planner`
- **GitHub source repository:** https://github.com/amitsoni2006/apka-apna-sathi

## 2. Main problem the app solves

The user wanted one personal space to plan daily study tasks, track discipline, remember past work date-wise, maintain a fair streak, manage LeetCode learning, record personal reflections, track college/semester goals, and keep useful study files.

The app should support adding tomorrow's tasks at night, reviewing old task records, and cloud-syncing records between phone and laptop with the same Google account.

## 3. Functional features

### Daily task planner

- Add tasks under College, Personal, Skill, or Health categories.
- Optional task detail/time field.
- Each task stores creation time and completion time.
- A date picker, Previous, Next, and Today controls let the user view or plan any date.
- The user can add next-day tasks before sleeping.
- Task records are stored date-wise.

### Streak rules

- A daily streak is earned only when all tasks for that day are completed.
- The planning date changes at **12:00 AM** local device time.
- The user gets a grace period until **3:00 AM** to complete the previous day’s tasks.
- After 3:00 AM, an old task can still be marked complete for record purposes, but it must not restore a lost streak.
- Marking a future task complete must not affect the streak.

### LeetCode tracker

- Log a solved question with title, difficulty, optional LeetCode URL, logic/approach notes, and exact solve time.
- Optional code-file attachment from VS Code/local files.
- Shows a monthly green consistency calendar.
- Notes and attached file remain tied to the same solved question.

### Other sections

- Personal Space: mood and daily reflection journal.
- Semester Goals: long-term college goals and percentage progress.
- Skills Roadmap: skills separate from college curriculum.
- My Important Files: small notes, PDFs, documents, or code files.
- Profile/Cloud tools: Google sign-in, cloud sync status, backup and restore.
- About and Contact section.
- Task reminders using browser notifications while the planner page is open.

## 4. File-upload limitation

- Firebase Storage requires paid billing for this Firebase project.
- The free implementation saves small files as data inside the private Firestore planner record.
- Per-file size limit is **500 KB**.
- Large files should be stored in Google Drive instead.
- Firestore document size has a 1 MiB limit, so this free file vault is intended only for a few small files.

## 5. Technology architecture

### Frontend

- HTML for page structure
- CSS for responsive mobile/laptop design
- Vanilla JavaScript for application logic, rendering, date control, reminders, data handling, and sync
- Progressive Web App support through a web manifest and service worker

### Backend (serverless Firebase)

There is no separate Express/Node/Python server. Firebase is the backend:

- **Firebase Authentication:** Google Sign-In
- **Cloud Firestore:** private planner data and cloud backup/sync
- **Firebase Hosting:** live website deployment

### Database/security

- Firestore collection: `studyPlanners`
- Each user stores data in a document identified by their Firebase user ID.
- Planner state is saved as `plannerJson`, a serialized JSON string, because nested Firestore array data previously caused issues.
- Firestore security rules allow a user to access only the document matching their own authentication UID.

## 6. Important cloud-sync history and safeguards

There were earlier cloud-sync conflicts caused by mixing separate local `file:///` app storage with the hosted Firebase app. The intended safe usage is:

1. Always open the hosted app URL: https://amit-study-planner.web.app/
2. Do not use a locally opened `file:///.../index.html` version for normal usage.
3. Use the same Google account on phone and laptop.
4. Wait for the cloud status to show **Saved to cloud ✓** after editing.
5. Avoid editing/deleting data simultaneously on two devices until sync has completed.
6. Use Backup Data occasionally for an extra manual JSON backup.

The app includes merge-oriented cloud-sync logic intended to prevent an empty device from replacing a populated device. However, no cloud-sync system should be treated as the only backup for valuable data.

## 7. Current source-code structure

The local project was reorganized into these folders:

```text
codex.project/
├── frontend/
│   ├── index.html            # App page structure and Firebase SDK imports
│   ├── styles.css            # Responsive UI styles
│   ├── app.js                # App logic, tasks, streaks, sync, reminders
│   ├── sw.js                 # Service worker
│   ├── manifest.webmanifest  # PWA metadata
│   └── icon.svg              # App icon
├── backend/
│   └── README.md             # Firebase serverless backend explanation
├── database/
│   ├── firestore.rules       # Firestore access rules
│   ├── storage.rules         # Storage rules
│   └── README.md             # Database/security explanation
├── firebase.json             # Firebase Hosting/rules configuration
├── .firebaserc               # Firebase project mapping
├── package.json
└── README.md                 # Installation and deployment guide
```

## 8. Deployment commands

Run commands from the project folder:

```bash
cd /home/amitsoni/Documents/folder/apka-apna-sathi.project
npx firebase login
npx firebase deploy --only hosting --project amit-study-planner
```

To deploy security rules:

```bash
npx firebase deploy --only firestore:rules,storage --project amit-study-planner
```

To push code to GitHub:

```bash
git add .
git commit -m "Describe the update"
git push origin main
```

## 9. Current local Git state note

The repository was reorganized into `frontend/`, `backend/`, and `database/` locally. Before relying on this as the live version, verify and deploy the Firebase Hosting configuration because hosting now uses `frontend/` as its public directory. Existing live app should be tested after deployment.

## 10. Design requirements to preserve

- Keep the app professional and mobile-first.
- On phone, use a proper sidebar/drawer menu and profile icon.
- On laptop, keep the profile/cloud area visible and well organized.
- Avoid excessive emoji; use small professional icons only where useful.
- Header size should stay consistent across sections.
- Do not remove existing user data when modifying task, streak, date, or cloud-sync logic.
- Do not expose user planner data publicly.

## 11. Contact information displayed in the app

- Email: amitsoni2006@gmail.co
- Phone/WhatsApp: 9305319898

## 12. How another developer/AI should help

When changing this project:

1. Read this file and `README.md` first.
2. Preserve current user records and Firebase cloud-sync compatibility.
3. Make changes in the correct folder (`frontend`, `backend`, or `database`).
4. Verify JavaScript syntax and test the hosted app before publishing.
5. Do not overwrite Firestore data with a blank local state.
6. Explain any Firebase rules, hosting, or data-model change clearly before deployment.

