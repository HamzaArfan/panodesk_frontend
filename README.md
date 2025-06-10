# Panodesk Frontend

Frontend application for Panodesk built with Next.js and React.

## Features

- Modern React 19 with Next.js 15
- Tailwind CSS for styling
- Authentication UI
- Admin dashboard
- Responsive design
- Form handling with React Hook Form
- Toast notifications
- Charts and data visualization

## Setup

1. Clone the repository
```bash
git clone https://github.com/HamzaArfan/panodesk_frontend.git
cd panodesk_frontend
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up environment variables
```bash
cp .env.example .env.local
```
Add your backend API URL to the environment variables:
```
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

4. Start the development server
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

- `NEXT_PUBLIC_API_URL` - Backend API URL (required for production)

## Deployment

This frontend is designed to be deployed on Vercel. It will automatically connect to your backend API using the configured environment variables.

## Tech Stack

- Next.js 15
- React 19
- Tailwind CSS
- Axios for API calls
- React Hook Form
- Lucide React icons
- Recharts for data visualization

## Project Structure

```
src/
├── app/           # Next.js app router pages
├── components/    # Reusable React components
├── contexts/      # React context providers
├── lib/          # Utility functions and configurations
└── constants.js   # App constants and routes
```

## Backend

This frontend connects to a separate backend repository: [Panodesk Backend](https://github.com/HamzaArfan/panodeskbackend)
