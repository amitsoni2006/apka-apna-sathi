# Database and security

The database layer is Firebase Cloud Firestore.

## Files

- `firestore.rules`: protects planner documents. A user can only read or write the document whose ID matches their Firebase user ID.
- `storage.rules`: reserved Firebase Storage rules. The current free file vault keeps small files inside the private Firestore planner record.

## Deploy rules

```bash
npx firebase deploy --only firestore:rules,storage --project amit-study-planner
```

## Security principle

Never change the `request.auth.uid == userId` condition to `true`. Keeping that check means one signed-in user cannot access another user's planner data.
