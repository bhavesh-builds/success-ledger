# Success Ledger

An AI-powered personal achievement platform that transforms raw accomplishments into structured success stories (STAR format), tracks growth over time, and generates insights, summaries, and shareable wins.

## Features

- **Achievement Capture** - Quickly journal your accomplishments with optional metadata
- **AI STAR Structuring** - Automatically convert achievements into structured STAR format (Situation, Task, Action, Result)
- **Achievement Library** - Organize, filter, search, and browse all your achievements
- **Visualizations** - See your growth journey with success graphs and trends
- **Insights & Reflection** - Discover strength themes and actionable insights
- **Share & Export** - Generate public read-only links and social-ready summaries

## Tech Stack

- **Frontend**: Next.js 16, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Row Level Security)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account and project

### Installation

1. Clone the repository:
```bash
git clone https://github.com/bhavesh-builds/success-ledger.git
cd success-ledger
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Set up the database:
   - Go to your Supabase Dashboard → SQL Editor
   - Run the migration script from `supabase/migrations/001_initial_schema.sql`

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
├── app/                    # Next.js app directory
├── lib/
│   └── supabase/          # Supabase client and utilities
├── supabase/
│   └── migrations/        # Database migration scripts
└── public/                 # Static assets
```

## Documentation

- [Supabase Setup Guide](./supabase/SETUP_GUIDE.md) - Database setup instructions
- [Supabase Integration](./SUPABASE_SETUP.md) - Next.js integration guide

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)

## License

This project is private and proprietary.
