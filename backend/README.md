# Better Auth TypeScript Backend

This is the backend server for the Better Auth authentication system used by the Expo mobile app.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update `BETTER_AUTH_SECRET` with a strong secret (minimum 32 characters)
   - Update `DATABASE_URL` with your PostgreSQL connection string
   - Add your Google OAuth credentials (`GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`)

3. Set up the database:
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The server will run on `http://localhost:8081`

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio (database GUI)

## Auth Endpoints

All auth endpoints are available at `/api/auth/*`:

- `/api/auth/sign-up` - Create new account
- `/api/auth/sign-in/email` - Sign in with email/password
- `/api/auth/sign-in/social` - Sign in with Google OAuth
- `/api/auth/sign-out` - Sign out
- `/api/auth/session` - Get current session
- And more...

## Database

Uses PostgreSQL with Prisma ORM. Configure your database connection in the `.env` file.

### Setting up PostgreSQL

Make sure you have PostgreSQL installed and running, then create a database:

```sql
CREATE DATABASE myapp_auth;
```

Update the `DATABASE_URL` in `.env` with your connection string:
```
postgresql://username:password@localhost:5432/myapp_auth
```

## OAuth Setup

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:8081/api/auth/callback/google`
6. Copy the Client ID and Client Secret to your `.env` file
