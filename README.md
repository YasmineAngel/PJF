# WeLearn

A modern full-stack learning platform built with Next.js, Prisma, and PostgreSQL for managing online courses, student progress, quizzes, payments, and community engagement.

## Overview

WeLearn is a complete e-learning application designed for both instructors and students. Teachers can create and publish courses, organize chapters, upload learning materials, and manage assessments. Students can explore a course catalog, purchase access, complete lessons, track their progress, and participate in quizzes and discussions.

This project was built to demonstrate a production-style learning management system with real-world features such as authentication, video delivery, payment processing, file uploads, and dashboards.

## Key Features

- Course catalog and discovery experience
- Secure authentication with Clerk
- Teacher dashboard for course creation and management
- Chapter-based learning flow with multimedia content
- Video streaming integration through Mux
- User progress tracking and completion status
- Quiz and assessment system with scoring and pass/fail logic
- Community posts and replies for student interaction
- Todo and personal productivity tracking
- Stripe-powered checkout and payment flow
- UploadThing-based media storage
- Analytics and insights for course performance

## Tech Stack

- Next.js 15
- React 18
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL
- Clerk Auth
- Stripe
- UploadThing
- Mux
- Recharts
- Radix UI

## Project Architecture

```text
we_learn/
├── app/                 # App Router pages and API routes
├── actions/             # Server actions for data fetching and logic
├── components/          # Reusable UI and feature components
├── lib/                 # Database, Stripe, and utility logic
├── prisma/              # Prisma schema and migrations
├── public/              # Static assets
├── scripts/             # Seed and dev scripts
├── middleware.ts        # App middleware
├── package.json         # Scripts and dependencies
├── next.config.ts       # Next.js config
├── tsconfig.json        # TypeScript config
└── README.md            # Project documentation
```

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd we_learn
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root and add the required values:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/welearn"

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
CLERK_SECRET_KEY="your_clerk_secret_key"
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL="/"
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL="/"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

UPLOADTHING_TOKEN="your_uploadthing_token"

MUX_TOKEN_ID="your_mux_token_id"
MUX_TOKEN_SECRET="your_mux_token_secret"

STRIPE_API_KEY="your_stripe_publishable_key"
STRIPE_SECRET_KEY="your_stripe_secret_key"
STRIPE_WEBHOOK_SECRET="your_stripe_webhook_secret"
```

### 4. Set up the database

```bash
npx prisma generate
npx prisma db push
```

### 5. Run the app

```bash
npm run dev
```

Open http://localhost:3000 to view the application.

## Available Scripts

```bash
npm run dev      # Start the development server
npm run build    # Create a production build
npm run start    # Run the production build
npm run lint     # Check linting and code quality
```

## Common Development Notes

- Use Stripe CLI for local webhook testing:

```bash
stripe listen --forward-to localhost:3000/api/webhook
```

- Prisma migrations can be managed with:

```bash
npx prisma migrate dev
```

- UploadThing and Mux credentials should be configured before running media-related features.

## Use Cases

This app supports a complete educational workflow:

- Teacher onboarding and course creation
- Student account management and enrollment
- Lesson consumption and progress tracking
- Quizzes and completion validation
- Community engagement and discussions
- Paid course experiences through Stripe

## Why This Project Stands Out

This project combines several real-world product features into a single cohesive platform, including:

- scalable architecture with Next.js App Router
- relational data modeling with Prisma
- secure authentication and onboarding
- monetization using Stripe
- media management and content delivery
- role-based learning experience for instructors and students

## License

This project is a project for bachelor's final year 2024/2025 currently intended for personal portfolio use and learning purposes.

## Portfolio Summary

WeLearn is a full-stack e-learning platform built to solve real educational product challenges in one application. It demonstrates end-to-end product thinking, modern web architecture, and a practical workflow for both instructors and learners.

