# Qafila Multi-Vendor Data Collection Platform - Development Plan

## Project Overview

A full-stack Next.js application for collecting vendor data for the Qafila multi-vendor store. The platform features an animated landing page with brand identity, a multi-field form for vendor registration, and a secure admin dashboard for managing submissions.

---

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Authentication**: Custom auth with bcrypt + JWT/sessions
- **Localization**: next-intl
- **File Storage**: Local filesystem (VPS)
- **Form Handling**: React Hook Form + Zod validation

---

## Design System

### Colors (from design.md)

```
Primary: #1D1D1B
Secondary: #EBA656
Secondary 2: #C08367
Secondary 3: #9F5F42
White: #FFFFFF

Text Colors:
- Dark Text: #101618
- Body Text: #303030
- Gray Text 20: #C8C8C8
- Gray Text 50: #616263
- Gray Text 80: #414141
- Text Primary: #C08367
- Gray Text: #848484
- White Text: #FFFFFF
```

### Assets Available

- Logo: `/public/Qafila-01.svg`
- Patterns: `/public/Pattern 1.svg` through `/public/Pattern 5.svg`

---

## Form Fields Structure

| Field (Arabic)                   | Field (English)           | Type         | Required |
| -------------------------------- | ------------------------- | ------------ | -------- |
| اسم المصمم (ة)                   | Designer Name             | text         | Yes      |
| البريد الإلكتروني                | Email                     | email        | Yes      |
| المدينة                          | City                      | text         | Yes      |
| الفئة أو المجموعة                | Category/Group            | select       | Yes      |
| اسم العلامة التجارية             | Brand Name                | text         | Yes      |
| رقم الهاتف                       | Phone Number              | tel          | Yes      |
| رابط المتجر                      | Store Link                | url          | No       |
| قصة / نبذة عن العلامة التجارية   | Brand Story               | textarea     | Yes      |
| شعار عالي الدقة                  | High-Resolution Logo      | file (image) | Yes      |
| تفاصيل الحساب البنكي             | Bank Details (PDF)        | file (pdf)   | Yes      |
| طريقة التنفيذ                    | Fulfillment Method        | select       | Yes      |
| توفر المخزون                     | Stock Availability        | select       | Yes      |
| السجل التجاري / وثيقة العمل الحر | Commercial Register (PDF) | file (pdf)   | Yes      |
| سياسة الاسترجاع / الاسترداد      | Return Policy (PDF)       | file (pdf)   | No       |
| عدد الفروع / المتاجر             | Number of Branches        | number       | Yes      |

---

## Development Phases

### Phase 1: Project Setup and Configuration

#### Step 1.1: Install Dependencies

```bash
pnpm add prisma @prisma/client
pnpm add framer-motion
pnpm add next-intl
pnpm add react-hook-form @hookform/resolvers zod
pnpm add bcryptjs jsonwebtoken
pnpm add @types/bcryptjs @types/jsonwebtoken -D
pnpm add next-themes
pnpm add lucide-react
pnpm add clsx tailwind-merge
```

#### Step 1.2: Initialize Prisma

```bash
npx prisma init
```

#### Step 1.3: Configure Tailwind CSS with Design Tokens

- Create custom color palette from design.md
- Configure RTL support for Arabic
- Set up dark mode with class strategy

#### Step 1.4: Project Structure Setup

```
src/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx
│   │   ├── page.tsx              # Client landing + form
│   │   └── admin/
│   │       ├── layout.tsx
│   │       ├── page.tsx          # Dashboard
│   │       ├── login/
│   │       │   └── page.tsx
│   │       └── setup/
│   │           └── page.tsx      # First-time admin setup
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts
│   │   │   ├── logout/route.ts
│   │   │   └── setup/route.ts
│   │   ├── submissions/
│   │   │   ├── route.ts          # GET all, POST new
│   │   │   └── [id]/route.ts     # GET, DELETE single
│   │   └── upload/
│   │       └── route.ts
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Textarea.tsx
│   │   ├── FileUpload.tsx
│   │   └── Card.tsx
│   ├── landing/
│   │   ├── BrandReveal.tsx
│   │   ├── PatternBackground.tsx
│   │   └── AnimatedLogo.tsx
│   ├── form/
│   │   └── VendorForm.tsx
│   ├── admin/
│   │   ├── Sidebar.tsx
│   │   ├── SubmissionsTable.tsx
│   │   ├── SubmissionDetail.tsx
│   │   └── StatsCards.tsx
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── ThemeToggle.tsx
│   │   └── LanguageSwitcher.tsx
│   └── providers/
│       └── Providers.tsx
├── lib/
│   ├── prisma.ts
│   ├── auth.ts
│   ├── utils.ts
│   └── validations.ts
├── hooks/
│   ├── useAuth.ts
│   └── useSubmissions.ts
├── messages/
│   ├── en.json
│   └── ar.json
├── middleware.ts
└── types/
    └── index.ts
```

---

### Phase 2: Database Schema Design

#### Step 2.1: Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Admin {
  id        String   @id @default(cuid())
  username  String   @unique
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Submission {
  id                String   @id @default(cuid())
  designerName      String
  email             String
  city              String
  category          String
  brandName         String
  phoneNumber       String
  storeLink         String?
  brandStory        String
  logoPath          String
  bankDetailsPdf    String
  fulfillmentMethod String
  stockAvailability String
  commercialRegPdf  String
  returnPolicyPdf   String?
  branchCount       Int
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}
```

#### Step 2.2: Run Migrations

```bash
npx prisma migrate dev --name init
npx prisma generate
```

---

### Phase 3: Core Infrastructure

#### Step 3.1: Prisma Client Singleton

Create `src/lib/prisma.ts` for database connection management.

#### Step 3.2: Authentication System

- Hash passwords with bcrypt (12 rounds)
- JWT tokens for session management
- HTTP-only cookies for security
- Middleware for protected routes

#### Step 3.3: File Upload System

- Create `/uploads` directory structure:
  ```
  uploads/
  ├── logos/
  ├── bank-details/
  ├── commercial-registers/
  └── return-policies/
  ```
- Implement file validation (type, size)
- Generate unique filenames with timestamps

#### Step 3.4: Localization Setup

- Configure next-intl with locale detection
- Create message files for EN and AR
- Set up RTL support for Arabic

---

### Phase 4: UI Components Development

#### Step 4.1: Base UI Components

Create reusable components with:

- Dark/light mode support
- RTL compatibility
- Consistent styling using design tokens
- Accessibility features

Components to build:

- Button (primary, secondary, outline variants)
- Input (text, email, tel, url, number)
- Select (with custom styling)
- Textarea
- FileUpload (with drag-and-drop)
- Card
- Modal
- Toast notifications

#### Step 4.2: Theme Provider

- Implement next-themes for dark/light mode
- Store preference in localStorage
- System preference detection

---

### Phase 5: Landing Page (Client-Facing)

#### Step 5.1: Brand Reveal Animation

Create full-screen animated landing:

1. **Initial State**:
   - Dark background (#1D1D1B)
   - Animated patterns floating/moving subtly
   - Logo centered with entrance animation
   - "Start" / "ابدأ" button below logo

2. **Animation Sequence**:
   - Page load: Patterns fade in with stagger
   - Logo: Scale up with opacity transition
   - Button: Fade in after logo animation completes

3. **Transition to Form**:
   - On button click: Logo scales up and fades
   - Patterns animate outward
   - Form slides in from bottom/fades in

#### Step 5.2: Pattern Background Component

- Load all 5 SVG patterns
- Position patterns decoratively around the page
- Add subtle floating/rotation animations
- Ensure responsive positioning

#### Step 5.3: Form Page

- Clean, minimal design
- Progress indicator (optional)
- Grouped form sections
- File upload previews
- Validation feedback
- Success animation on submit

---

### Phase 6: Vendor Registration Form

#### Step 6.1: Form Implementation

Using React Hook Form + Zod:

```typescript
const vendorSchema = z.object({
  designerName: z.string().min(2),
  email: z.string().email(),
  city: z.string().min(2),
  category: z.string().min(1),
  brandName: z.string().min(2),
  phoneNumber: z.string().regex(/^[+]?[\d\s-]+$/),
  storeLink: z.string().url().optional().or(z.literal("")),
  brandStory: z.string().min(50).max(2000),
  logo: z.instanceof(File),
  bankDetails: z.instanceof(File),
  fulfillmentMethod: z.string(),
  stockAvailability: z.string(),
  commercialRegister: z.instanceof(File),
  returnPolicy: z.instanceof(File).optional(),
  branchCount: z.number().min(0),
});
```

#### Step 6.2: Category Options

Predefined categories (to be confirmed):

- Fashion / أزياء
- Jewelry / مجوهرات
- Home Decor / ديكور منزلي
- Art / فن
- Crafts / حرف يدوية
- Food / أغذية
- Beauty / جمال
- Other / أخرى

#### Step 6.3: Fulfillment Method Options

- Self-fulfillment / تنفيذ ذاتي
- Qafila fulfillment / تنفيذ قافلة
- Hybrid / مختلط

#### Step 6.4: Stock Availability Options

- In stock / متوفر
- Made to order / حسب الطلب
- Pre-order / طلب مسبق
- Limited stock / مخزون محدود

---

### Phase 7: API Routes

#### Step 7.1: Authentication APIs

```
POST /api/auth/setup     - Create first admin (only if none exists)
POST /api/auth/login     - Admin login
POST /api/auth/logout    - Admin logout
GET  /api/auth/me        - Get current admin
```

#### Step 7.2: Submissions APIs

```
GET    /api/submissions      - List all submissions (admin only)
POST   /api/submissions      - Create new submission (public)
GET    /api/submissions/[id] - Get single submission (admin only)
DELETE /api/submissions/[id] - Delete submission (admin only)
```

#### Step 7.3: File Upload API

```
POST /api/upload - Handle file uploads, return file path
```

---

### Phase 8: Admin Dashboard

#### Step 8.1: Admin Setup Page

- Only accessible when no admin exists
- Username and password form
- Password confirmation
- Redirect to login after creation

#### Step 8.2: Admin Login Page

- Clean, branded login form
- Error handling
- Redirect to dashboard on success

#### Step 8.3: Dashboard Layout

- Sidebar navigation
- Header with:
  - Theme toggle
  - Language switcher
  - Logout button
- Main content area

#### Step 8.4: Dashboard Home

- Stats cards:
  - Total submissions
  - Submissions this week
  - Submissions this month
  - By category breakdown
- Recent submissions list

#### Step 8.5: Submissions Management

- Sortable, filterable table
- Columns: Designer, Brand, Category, Date, Actions
- Click to view full details
- Download uploaded files
- Delete with confirmation

#### Step 8.6: Submission Detail View

- All form data displayed
- File previews/downloads
- Metadata (submission date, etc.)

---

### Phase 9: Middleware and Security

#### Step 9.1: Route Protection

```typescript
// middleware.ts
- Protect /admin/* routes (except /admin/login and /admin/setup)
- Verify JWT token from cookies
- Redirect unauthorized to login
- Handle locale routing
```

#### Step 9.2: API Security

- Rate limiting for form submissions
- CSRF protection
- Input sanitization
- File type validation

---

### Phase 10: Localization

#### Step 10.1: English Messages (en.json)

```json
{
  "landing": {
    "start": "Start",
    "welcome": "Welcome to Qafila"
  },
  "form": {
    "designerName": "Designer Name",
    "email": "Email",
    ...
  },
  "admin": {
    "dashboard": "Dashboard",
    "submissions": "Submissions",
    ...
  }
}
```

#### Step 10.2: Arabic Messages (ar.json)

```json
{
  "landing": {
    "start": "ابدأ",
    "welcome": "مرحباً بك في قافلة"
  },
  "form": {
    "designerName": "اسم المصمم (ة)",
    "email": "البريد الإلكتروني",
    ...
  },
  "admin": {
    "dashboard": "لوحة التحكم",
    "submissions": "الطلبات",
    ...
  }
}
```

---

### Phase 11: Dark/Light Mode

#### Step 11.1: Theme Configuration

- Use next-themes provider
- CSS variables for theme colors
- Smooth transitions between modes

#### Step 11.2: Color Mappings

| Element        | Light Mode | Dark Mode |
| -------------- | ---------- | --------- |
| Background     | #FFFFFF    | #1D1D1B   |
| Text Primary   | #101618    | #FFFFFF   |
| Text Secondary | #303030    | #C8C8C8   |
| Accent         | #C08367    | #EBA656   |
| Card BG        | #F5F5F5    | #2A2A28   |
| Border         | #E0E0E0    | #414141   |

---

### Phase 12: Testing and Polish

#### Step 12.1: Testing

- Form validation testing
- File upload testing
- Authentication flow testing
- Responsive design testing
- RTL layout testing

#### Step 12.2: Performance Optimization

- Image optimization
- Code splitting
- API response caching
- Database query optimization

#### Step 12.3: Accessibility

- Keyboard navigation
- Screen reader support
- Color contrast compliance
- Focus indicators

---

### Phase 13: Deployment Preparation

#### Step 13.1: Environment Variables

```env
DATABASE_URL=postgresql://...
JWT_SECRET=...
UPLOAD_DIR=/path/to/uploads
NEXT_PUBLIC_APP_URL=https://...
```

#### Step 13.2: VPS Setup

- Install Node.js, PostgreSQL
- Configure Nginx reverse proxy
- Set up SSL certificate
- Configure file storage directory
- Set up PM2 for process management

#### Step 13.3: Build and Deploy

```bash
pnpm build
pnpm start
```

---

## Implementation Order Summary

1. Install dependencies and configure project
2. Set up Prisma schema and database
3. Create Prisma client and utility functions
4. Build base UI components
5. Implement theme provider and localization
6. Create landing page with animations
7. Build vendor registration form
8. Implement file upload system
9. Create API routes for submissions
10. Build authentication system
11. Create admin setup/login pages
12. Build admin dashboard
13. Add middleware for route protection
14. Test all functionality
15. Optimize and polish
16. Deploy to VPS

---

## Notes

- No emojis will be used in the UI to maintain professional appearance
- All uploaded files stored locally in structured directories
- Form supports both LTR (English) and RTL (Arabic) layouts
- Animations should be smooth but not excessive
- Mobile-responsive design throughout
