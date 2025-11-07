# Imbali Telecoms

Imbali Telecoms is a cutting-edge website showcasing innovative network solutions for modern telecommunications. This project features a dynamic, interactive frontend with advanced animations and a robust backend API for managing services, contacts, contracts, and news.

## Features

- **Interactive Hero Section**: 3D network globe visualization with live status indicators and animated network nodes.
- **Service Cards**: Dynamic service listings fetched from the backend with hover effects and morphing animations.
- **Testimonials Slider**: Customer reviews with auto-sliding functionality and rating displays.
- **Portfolio Filtering**: Interactive portfolio items with category-based filtering.
- **Contract Inquiries**: Form submission for service contract inquiries with backend integration.
- **News & Blog Section**: Latest telecom updates and articles fetched from the database.
- **Contact Form**: User-friendly contact form with validation and backend submission.
- **Dark/Light Mode Toggle**: Theme switching with explosive particle effects.
- **Voice-Activated Navigation**: Speech recognition for navigating sections.
- **AR-like Previews**: 3D transforms on hover for enhanced interactivity.
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices.
- **Backend API**: RESTful API built with Express.js and Supabase for data management.

## Technologies Used

### Frontend
- HTML5
- CSS3 (with advanced animations and effects)
- JavaScript (ES6+)
- Particle systems and morphing animations

### Backend
- Node.js
- Express.js
- Supabase (PostgreSQL database)
- CORS for cross-origin requests

## Installation and Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Supabase account and project

### Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `backend` directory with the following variables:
   ```
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   PORT=3001
   ```

4. Set up your Supabase database with the following tables:
   - `services`: Columns - id (uuid), name (text), description (text)
   - `contacts`: Columns - id (uuid), name (text), email (text), message (text)
   - `contracts`: Columns - id (uuid), company (text), email (text), plan (text), message (text)
   - `news`: Columns - id (uuid), title (text), excerpt (text), date (date)

5. Start the backend server:
   ```bash
   npm start
   ```
   The server will run on `http://localhost:3001`.

### Frontend Setup
1. Open `index.html` in your browser or serve it using a local server (e.g., using VS Code Live Server extension).

2. Ensure the backend is running for API calls to work properly.

## Usage

1. Open the website in your browser.
2. Navigate through sections using the menu or voice commands.
3. Toggle between dark and light modes using the theme button.
4. Interact with service cards, portfolio items, and forms.
5. View testimonials and news articles.
6. Submit contact or contract forms (requires backend to be running).

## Project Structure

```
Imbali Telecoms/
├── index.html          # Main HTML file
├── script.js           # Frontend JavaScript
├── styles.css          # CSS styles and animations
├── Imbali Telecoms.jpeg # Logo image
├── backend/
│   ├── server.js       # Express server and API routes
│   ├── package.json    # Backend dependencies
│   └── package-lock.json
├── TODO.md             # Project task list
└── README.md           # This file
```

## API Endpoints

- `GET /api/services`: Retrieve all services
- `POST /api/contact`: Submit contact form
- `POST /api/contracts`: Submit contract inquiry
- `GET /api/news`: Retrieve latest news articles

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and commit: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with modern web technologies for optimal performance and user experience.
- Inspired by innovative telecom solutions and cutting-edge UI/UX design trends.
