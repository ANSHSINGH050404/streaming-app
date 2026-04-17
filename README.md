# Latent - Streaming & Event Management Platform

Latent is a full-stack event management and streaming platform built with Next.js, Bun, and Prisma.

## Project Structure

- `backend/`: Bun-powered Express backend with Prisma ORM.
- `client/`: Next.js frontend with Tailwind CSS and Shadcn UI.

## Features

- **Event Management**: Create and manage events.
- **User Dashboard**: Personalized dashboard for users.
- **Admin Panel**: Comprehensive admin controls for event oversight.
- **Authentication**: Secure OTP-based authentication.
- **Streaming**: Integrated streaming capabilities.

## Tech Stack

### Backend
- **Runtime**: [Bun](https://bun.sh/)
- **Framework**: [Express](https://expressjs.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Prisma](https://www.prisma.io/)
- **Authentication**: JWT & OTP

### Frontend
- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)

## Getting Started

### Prerequisites
- [Bun](https://bun.sh/) installed on your machine.
- PostgreSQL database.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ANSHSINGH050404/streaming-app.git
   cd streaming-app
   ```

2. Setup Backend:
   ```bash
   cd backend
   bun install
   # Configure your .env file with DATABASE_URL
   bun run db:push
   bun start
   ```

3. Setup Frontend:
   ```bash
   cd ../client
   bun install
   bun dev
   ```

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
[MIT](LICENSE)
