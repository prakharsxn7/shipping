# ShippingPro — Frontend

ShippingPro (Elogisol Technologies) is a responsive React and Tailwind CSS web application providing an export business onboarding and compliance workflow. It guides Indian exporters through credentials verification, business identification (GSTIN, IEC, ICEGATE, AD Code), contact/warehouse location management, and PDF document uploads.

---

## 1. Project Directory Structure

```text
shippingpro/
├── package.json              # Root package script runner
├── vercel.json               # Root Vercel SPA rewrite & build configuration
├── README.md                 # Project documentation
└── frontend/
    ├── package.json          # Frontend dependencies and Vite scripts
    ├── index.html            # Vite HTML template entry
    ├── vite.config.js        # Vite bundler configuration
    ├── tailwind.config.js    # Tailwind CSS configuration
    ├── postcss.config.js     # PostCSS configuration
    ├── vercel.json           # Frontend Vercel SPA rewrite configuration
    └── src/
        ├── main.jsx          # React DOM entry point
        ├── App.jsx           # App wrapper with router & DemoAuthProvider
        ├── index.css         # Tailwind base styles and directives
        ├── pages/
        │   ├── AuthPage.jsx          # Authentication page route (/)
        │   └── OnboardingPage.jsx    # Onboarding workspace route (/onboarding)
        ├── components/
        │   ├── AuthCard.jsx          # Auth card UI: Login, Sign-Up, OTP states
        │   ├── BrandingPane.jsx      # Desktop branding visual panel
        │   └── onboarding/
        │       ├── ProgressBar.jsx   # Responsive 4-stage stepper
        │       ├── StepAccount.jsx   # Stage 1: Verified account status
        │       ├── StepProfile.jsx   # Stage 2: Business identification inputs
        │       ├── StepDetails.jsx   # Stage 3: Addresses & PDF document uploads
        │       ├── StepFinish.jsx    # Stage 4: Read-only review & completion
        │       └── PdfUploadField.jsx# Reusable PDF file selector & validator
        └── context/
            └── DemoAuthContext.jsx   # In-memory authentication & session store
```

---

## 2. Installation & Local Development

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (v9 or higher)

### Setup & Run

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Start the local development server:**
   ```bash
   # From the frontend directory:
   npm run dev

   # Or from the project root:
   npm run dev
   ```
   The application runs locally at `http://localhost:3000`.

3. **Build for production:**
   ```bash
   # From the frontend directory:
   npm run build

   # Or from the project root:
   npm run build
   ```
   The production bundle is output to `frontend/dist/`.

4. **Preview the production build locally:**
   ```bash
   npm run preview
   ```

---

## 3. Application Route Map

| Route Path | Component | Description |
| :--- | :--- | :--- |
| `/` | `AuthPage` | Default entry point with branding pane and centered `AuthCard` (Login and Sign-Up modes). |
| `/onboarding` | `OnboardingPage` | 4-stage business onboarding flow with progress stepper, form validation, and review. |
| `*` | `<Navigate to="/" replace />` | Wildcard route that redirects any unrecognized URL path back to `/`. |

---

## 4. Flow & Architecture

### Authentication & OTP Verification
- **Login View:** Validates credentials against the demo account registry in `DemoAuthContext`. On success, displays a transition overlay ("Signing in...") and navigates to `/onboarding`.
- **Sign-Up View:** Validates full name, email format, and password length (min. 8 characters). Verifies that the email is not already registered, then transitions directly into the 6-digit OTP email verification view.
- **OTP Verification View:** Simulates email code delivery with a 30-second resend countdown. When all 6 digits are entered and submitted, the demo account is created in memory, the session is established, and the user is navigated to `/onboarding`.
- **Sign Out:** The header in `OnboardingPage` clears the active session in `DemoAuthContext` and redirects to `/?view=login`.

### Onboarding Steps
1. **Stage 1 (Account):** Displays verified account status and credentials readiness.
2. **Stage 2 (Profile):** Captures customer name, business name, GSTIN (15-character validation), IEC code (10-character validation), and optional ICEGATE ID / AD Code.
3. **Stage 3 (Details & Documents):** Captures business email, registered office address, PIN code (6 digits), optional "same warehouse address" checkbox toggle, warehouse pickup address/PIN, and PDF file attachments.
4. **Stage 4 (Finish):** Read-only summary consolidating all entered data and attached document names/sizes with direct "Edit" jump links back to stages 2 and 3. Completing the review displays the completion banner.

### Form State & Validation
- **Authentication:** Managed inside `AuthCard.jsx` with input sanitization, regular expressions for email and length, and OTP digit auto-focus behavior.
- **Onboarding:** Centrally managed in `OnboardingPage.jsx`. Moving "Back" and "Next" preserves all form values and document objects.
- **Document Handling:** `PdfUploadField.jsx` validates file MIME type (`application/pdf`) and enforces a 5 MB file size limit before passing `File` objects to parent state.

---

## 5. Current Frontend-Only Demo Behaviors

The following features operate in-memory on the client and will connect to real backend services in the future:
- **Demo Accounts:** Default demo users (`admin@elogisol.com` and `demo@elogisol.com`) are held in React state inside `DemoAuthContext.jsx`.
- **Session State:** Auth session is held in memory during the browser session without writing passwords to `localStorage` or `sessionStorage`.
- **OTP Verification:** Verification code matching and 30s resend timer simulate email verification client-side.
- **File Uploads:** Uploaded PDF files are held as native browser `File` objects in memory for validation and preview; they are not currently uploaded to cloud storage.

---

## 6. Future Backend & Database Integration Points

When introducing the Node.js/Express backend on Render and Supabase:

1. **Authentication API:**
   - Replace `DemoAuthContext.jsx` with real REST API calls (`POST /api/auth/login`, `POST /api/auth/register`, `POST /api/auth/logout`, `GET /api/auth/me`).
   - Store session tokens securely (e.g., httpOnly cookies or secure token storage).
2. **OTP Verification:**
   - Connect the OTP form in `AuthCard.jsx` to `POST /api/auth/verify-otp` and `POST /api/auth/resend-otp`.
3. **Onboarding Submission:**
   - In `StepFinish.jsx` / `OnboardingPage.jsx`, submit onboarding details using `multipart/form-data` to `POST /api/onboarding` for database persistence in Supabase and file storage for document attachments.

---

## 7. Vercel Deployment Configuration

This repository is configured for immediate deployment on Vercel:

- **Build Command:** `npm run build` (or `npm --prefix frontend run build` if deploying from monorepo root)
- **Output Directory:** `dist` (or `frontend/dist` if deploying from monorepo root)
- **SPA Rewrites:** Configured via `vercel.json` (`rewrites: [{ source: "/(.*)", destination: "/index.html" }]`) to ensure client-side routing works when directly opening or refreshing deep links such as `/onboarding`.

