# GeeGees Unisex Salon Website

A beautiful, modern, and fully responsive website for GeeGees Unisex Salon built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Beautiful Landing Page**: Stunning hero section with gradient backgrounds and smooth animations
- **Services Page**: Complete service catalog with pricing and package deals
- **Team Page**: Showcase your talented staff with professional profiles
- **Online Booking**: Functional booking system with date/time selection
- **Contact Page**: Contact form and location information with map integration placeholder
- **Fully Responsive**: Optimized for all devices (mobile, tablet, desktop)
- **Modern UI/UX**: Clean design with smooth transitions and hover effects
- **SEO Optimized**: Proper meta tags and semantic HTML structure

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.0
- **Fonts**: Inter & Playfair Display (Google Fonts)
- **Icons**: Heroicons (via inline SVG)

## Getting Started

### Prerequisites

- Node.js 18+ installed on your machine
- npm, yarn, pnpm, or bun package manager

### Installation

1. Navigate to the project directory:
```bash
cd geegees-salon
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the website.

## Project Structure

```
geegees-salon/
├── app/
│   ├── page.tsx           # Home page
│   ├── layout.tsx         # Root layout
│   ├── globals.css        # Global styles
│   ├── services/          # Services page
│   ├── team/              # Team page
│   ├── booking/           # Booking page
│   └── contact/           # Contact page
├── components/
│   ├── Navbar.tsx         # Navigation component
│   └── Footer.tsx         # Footer component
└── public/                # Static assets
```

## Customization

### Update Colors

Edit `tailwind.config.ts` to change the color scheme:
```typescript
colors: {
  primary: {
    // Customize your brand colors here
  }
}
```

### Update Content

- **Contact Information**: Edit `components/Footer.tsx` and `app/contact/page.tsx`
- **Services**: Update service list in `app/services/page.tsx`
- **Team Members**: Modify team data in `app/team/page.tsx`
- **Salon Name**: Update throughout the files or use environment variables

### Add Google Maps

Replace the placeholder in `app/contact/page.tsx` with your Google Maps embed code:
```html
<iframe src="YOUR_GOOGLE_MAPS_EMBED_URL" ...></iframe>
```

## Building for Production

```bash
npm run build
npm start
```

## Deployment

### Deploy on Vercel (Recommended)

1. Push your code to GitHub
2. Visit [Vercel](https://vercel.com)
3. Import your repository
4. Deploy with one click!

### Deploy on Netlify

1. Build the project: `npm run build`
2. Deploy the `.next` folder to Netlify

### Other Platforms

This Next.js app can be deployed on any platform that supports Node.js applications.

## Future Enhancements

- Connect booking form to a backend/database
- Add authentication for customer accounts
- Integrate payment processing
- Add image gallery with actual salon photos
- Connect contact form to email service
- Add customer reviews/testimonials section
- Implement real-time availability checking

## Support

For support, contact info@geegeessalon.com

## License

Copyright © 2026 GeeGees Unisex Salon. All rights reserved.
