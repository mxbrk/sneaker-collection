# Sneaker Collection App

A modern, secure, and scalable web application for sneaker enthusiasts to track their collection, manage their wishlist, and discover new sneakers.

![Sneaker Collection App](https://i.imgur.com/placeholder.jpg)

## Features

- 👟 **Collection Management**: Track your sneaker collection with detailed information including size, condition, purchase date and price
- 🔍 **Sneaker Search**: Find sneakers using the integrated search functionality
- 💖 **Wishlist**: Save sneakers you want to purchase in the future
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- 🔒 **Secure Authentication**: User accounts with secure password hashing and session management
-  **Modern UI**: Clean and intuitive interface built with Tailwind CSS

## Tech Stack

- **Frontend**: React 19, Next.js 15
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Custom auth implementation with iron-session
- **Styling**: Tailwind CSS 4
- **Validation**: Zod
- **API**: Integration with Sneakers API for sneaker data

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database
- Sneakers API key for fetching sneaker data

### Environment Setup

Create a `.env` file in the root directory with the following variables:

```
DATABASE_URL=postgresql://username:password@localhost:5432/sneaker_collection
NEXT_PUBLIC_SNEAKERS_API_KEY=your_api_key_here
SESSION_SECRET=your_secure_random_string
```

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/sneaker-collection.git
   cd sneaker-collection
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the database:
   ```bash
   npx prisma db push
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
src/
├── app/               # Next.js App Router pages and layouts
│   ├── api/           # API routes for backend functionality
│   ├── login/         # Login page
│   ├── profile/       # User profile pages
│   ├── search/        # Sneaker search page
│   ├── signup/        # Signup page
│   └── layout.tsx     # Root layout component
├── components/        # Reusable UI components
├── contexts/          # React context providers
├── lib/               # Utility functions and services
└── types/             # TypeScript type definitions
```

## Features in Detail

### User Authentication

- Secure sign-up and login
- Password hashing with bcrypt
- Session-based authentication with iron-session
- Protected routes with middleware

### Sneaker Collection

- Add sneakers to your collection with detailed information
- Track condition, size, purchase date, and purchase price
- View collection statistics (total items, value, etc.)
- Filter and sort your collection

### Wishlist Management

- Save sneakers to your wishlist
- Easy transfer from wishlist to collection when purchased
- Filter and sort wishlist items

### Sneaker Search

- Search by brand, model name, or color
- Filter options for gender-specific sneakers
- Option to hide kids' sizes
- Detailed sneaker information

## Screenshots

### Home Page
![Home Page](https://i.imgur.com/placeholder-home.jpg)

### Profile Page
![Profile Page](https://i.imgur.com/placeholder-profile.jpg)

### Search Page
![Search Page](https://i.imgur.com/placeholder-search.jpg)

### Collection Page
![Collection Page](https://i.imgur.com/placeholder-collection.jpg)

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- Sneakers API for providing sneaker data
- Next.js team for the amazing framework
- All open-source projects that made this possible