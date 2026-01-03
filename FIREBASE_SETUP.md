# Firebase OTP Setup Guide

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a new project" or select an existing one
3. Name it (e.g., "Tubhyam")
4. Click "Create project"

## Step 2: Enable Phone Authentication

1. In Firebase Console, go to **Authentication** (left sidebar)
2. Click the **"Sign-in method"** tab
3. Click on **"Phone"**
4. Toggle **"Enable"** to turn it on
5. Click **"Save"**

## Step 3: Enable reCAPTCHA v3 (for phone verification)

1. Still in the **Sign-in method** tab
2. Look for **"reCAPTCHA Enterprise"** or **"App Check"** section
3. Follow the setup instructions provided by Firebase
4. Note: reCAPTCHA will work automatically with the Firebase SDK

## Step 4: Get Your Firebase Credentials

1. Click on the **gear icon** ⚙️ (Project Settings) in the top-right
2. Go to **"Project settings"**
3. Scroll to **"Your apps"** section
4. If you don't see a web app, click **"<>"** to add one
5. Copy the configuration object that looks like:
```javascript
{
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
}
```

## Step 5: Configure Your App

1. Open the file `.env.local` in your project root
2. Replace the placeholder values with your Firebase credentials from Step 4
3. Example:
```
VITE_FIREBASE_API_KEY=AIzaSyDxxx...
VITE_FIREBASE_AUTH_DOMAIN=tubhyam.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tubhyam
VITE_FIREBASE_STORAGE_BUCKET=tubhyam.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:xxxxx
```

## Step 6: Test the OTP Flow

1. Make sure your dev server is running: `npm run dev`
2. Navigate to `/video-call` page
3. Enter any 10-digit Indian phone number (starting with 6-9)
4. Click "Send OTP"
5. You should receive an SMS with a 6-digit OTP code
6. Enter the OTP to complete the booking

## Step 7: Security Rules

⚠️ **Important**: Firebase by default allows SMS to any number. To prevent abuse:

1. In Firebase Console, go to **Authentication**
2. Click **"Settings"** tab
3. Under **"User restrictions"**, set up limits for:
   - Number of SMS per user
   - Rate limiting for OTP requests

## Troubleshooting

### "reCAPTCHA verification failed"
- Make sure your domain is added to Firebase reCAPTCHA settings
- In Firebase Console, go to **Authentication** → **Settings** → **Authorized domains**
- Add your development domain (e.g., `localhost:8081`)

### "Phone number must be a valid E.164 standard"
- Make sure numbers start with country code (+91 for India)
- The app automatically handles this, so just enter 10 digits

### SMS not received
- Check that Phone Authentication is enabled
- Ensure you're using a real phone number (some test numbers don't work)
- Wait a few seconds; SMS delivery can be slow

## Next Steps

Once OTP is working:
1. Add appointment scheduling functionality
2. Store booking details in Firestore
3. Send WhatsApp notifications with appointment confirmation
4. Create an admin panel to manage video call appointments

---

For more help, visit:
- [Firebase Phone Authentication Docs](https://firebase.google.com/docs/auth/web/phone-auth)
- [Firebase Setup Guide](https://firebase.google.com/docs/web/setup)
