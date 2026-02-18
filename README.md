# Discover Golan Heights

A complete responsive tourism web platform with a public website + admin panel.

## Stack
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT auth
- **Frontend:** Responsive HTML/CSS/Vanilla JS
- **Uploads:** Multer local storage

## Project Structure

```text
.
├── backend
│   ├── package.json
│   ├── .env.example
│   └── src
│       ├── config/db.js
│       ├── controllers
│       │   ├── authController.js
│       │   ├── categoryController.js
│       │   └── placeController.js
│       ├── middleware
│       │   ├── auth.js
│       │   └── upload.js
│       ├── models
│       │   ├── Category.js
│       │   ├── Place.js
│       │   └── User.js
│       ├── routes
│       │   ├── authRoutes.js
│       │   ├── categoryRoutes.js
│       │   └── placeRoutes.js
│       ├── uploads
│       ├── utils/seed.js
│       └── server.js
└── frontend
    ├── index.html
    ├── about.html
    ├── contact.html
    ├── css/styles.css
    ├── js
    │   ├── config.js
    │   └── main.js
    └── admin
        ├── index.html
        └── admin.js
```

## Database Schema Design

### User
- `name` (String, required)
- `email` (String, unique, required)
- `password` (String hash, required)
- `role` (admin)

### Category
- `nameEn` (String, required, unique)
- `nameHe` (String)
- `slug` (String, required, unique)
- `isActive` (Boolean)

### Place
- `titleEn`, `titleHe`
- `mainImage`, `gallery[]`
- `descriptionEn`, `descriptionHe`
- `locationName`
- `googleMapsEmbed`
- `openingHours`
- `contactInfo`
- `priceInfo`
- `category` (ObjectId ref Category)
- `isPublished`, `featured`

## Features

### Public Website
- Responsive mobile-first UI with nature-inspired palette.
- Hero + intro + categories + featured places.
- Search and filter by name/category.
- Each place includes image gallery, map embed, schedule, contact, price, category.
- About + Contact pages.
- Bilingual-ready content fields (English/Hebrew).

### Admin Panel
- Secure JWT login.
- Dashboard stats.
- Create/edit/delete places.
- Upload main and gallery images.
- Manage categories.
- Publish/unpublish toggle.

## REST API Endpoints

- `POST /api/auth/login`
- `GET /api/categories`
- `POST /api/categories` (auth)
- `PUT /api/categories/:id` (auth)
- `DELETE /api/categories/:id` (auth)
- `GET /api/places`
- `GET /api/places/:id`
- `POST /api/places` (auth, multipart)
- `PUT /api/places/:id` (auth, multipart)
- `DELETE /api/places/:id` (auth)

## Run Locally

### 1) Start MongoDB
Make sure MongoDB is running locally.

### 2) Backend setup
```bash
cd backend
cp .env.example .env
npm install
npm run seed
npm run dev
```

Backend runs at `http://localhost:5000`.

### 3) Frontend setup
Serve frontend on any static server:
```bash
cd frontend
python3 -m http.server 5500
```

Open:
- Public site: `http://localhost:5500`
- Admin panel: `http://localhost:5500/admin/`

### 4) Default admin credentials
From `.env` values:
- Email: `admin@golan.local`
- Password: `StrongPassword123!`

## SEO + Performance Notes
- Semantic HTML structure and metadata.
- Lazy-loaded place images.
- Lightweight frontend with minimal JS.
- Security middlewares (Helmet, rate limit, CORS).

