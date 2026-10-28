# Deploy Stay at Madison's Cebu to Render

This is a deployment-prepared copy of the original project. The original source files and behavior have not been intentionally changed; this package adds Render deployment configuration and this guide.

## Deploy steps

1. Create or sign in to GitHub.
2. Create a **private** repository, for example `stay-at-madisons-cebu`.
3. Extract this ZIP on your computer and upload the project files/folders to the repository root. Ensure `package.json`, `render.yaml`, and `server.js` are at the root (not inside an extra nested folder).
4. In Render, choose **New + → Blueprint** and connect that GitHub repository. Render should detect `render.yaml`.
   - If you choose **New + → Web Service** instead, use:
     - Build command: `npm install && npm run build`
     - Start command: `npm start`
5. Deploy. Render will provide a public `onrender.com` URL after the build succeeds.

## Important configuration checks after deployment

- In Firebase Console → Authentication → Settings → Authorized domains, add the exact Render hostname (for example `your-service-name.onrender.com`).
- In Google Cloud Console, verify the OAuth consent screen and OAuth client settings. Add the deployed hostname to authorized domains and configure the correct redirect/origin settings required by the Firebase Google sign-in flow.
- Confirm the Firebase project's Authentication provider has Google sign-in enabled.
- Test Google sign-in, reading the calendar, creating a calendar event, and the booking flow on the deployed URL.
- The Firebase client configuration in `firebase-applet-config.json` is included in the frontend bundle by design. Firebase API keys are not server secrets, but access must be protected by Firebase Authentication, authorized domains, and appropriate Firebase security rules.
- Do not add private service-account keys or other secrets to source control. The current chat widget answers from fixed property information and does not call Gemini, so a Gemini API key is not required for that widget as written.

## What this deployment does not do

- It does not create or configure your Render account, GitHub repository, Firebase project, Google OAuth consent screen, or Calendar permissions.
- It does not guarantee that Google sign-in or Calendar features work until the external provider settings are checked.
- The app currently keeps confirmed booking state in the browser session; deploying it does not add a shared booking database or server-side reservation system.
