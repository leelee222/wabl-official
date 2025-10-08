# 🏀 WABL - West African Basketball League

> **Where Legends Rise** - The premier basketball league website for West Africa

[![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4+-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=flat-square&logo=vercel)](https://vercel.com/)

A modern, responsive basketball league website featuring 8 teams across West African cities. Built with Next.js 15, TypeScript, and Tailwind CSS.

## ✨ Features

### 🏠 **Homepage**
- Hero section with league branding
- Recent matches with live scores
- Standings preview
- Featured player spotlight
- Responsive design with smooth animations

### 🏀 **Teams & Players**
- Complete team roster (8 teams, 96+ players)
- Team detail pages with statistics
- Player profiles with career stats
- Team colors and branding integration
- Interactive team cards

### 📊 **Standings & Statistics**
- Real-time league standings
- Win/loss records and streaks
- Points for/against statistics
- Sortable league table
- Championship race tracking

### 📅 **Schedule & Matches**
- Complete match calendar
- Past and upcoming games
- Venue and attendance information
- Match status indicators
- Date-based filtering

### 🔍 **Advanced Search**
- Global search functionality
- Search teams, players, and matches
- Debounced input for performance
- Categorized search results
- Keyboard shortcuts support

### 🎨 **Design System**
- Custom WABL branding
- Dark/Light mode toggle
- Consistent color palette
- Professional typography (Inter + JetBrains Mono)
- Smooth animations and transitions

## 🏗️ Architecture

### **Tech Stack**
- **Framework**: Next.js 15.5.4 (App Router)
- **Language**: TypeScript 5+ (strict mode)
- **Styling**: Tailwind CSS 3.4+
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **State Management**: Zustand
- **Data Fetching**: React Query (TanStack Query)
- **Caching**: Next.js ISR + React Query

### **Key Architectural Decisions**

#### **1. Data Architecture**
```typescript

// Comprehensive type system
interface Team {
  id: string
  name: string
  city: string
  country: string
  stats: TeamStats
  // ... more fields
}

interface Player {
  id: string
  name: string
  teamId: string
  position: 'PG' | 'SG' | 'SF' | 'PF' | 'C'
  stats: PlayerStats
  // ... more fields
}
```

#### **2. State Management**
- **Zustand stores** for global state (teams, players, app state)
- **React Query** for server state and caching
- **Persistent storage** for user preferences

#### **3. Performance Optimization**
- **Static Generation (SSG)** for team and player pages
- **Incremental Static Regeneration (ISR)** for dynamic content
- **React Query caching** with intelligent invalidation
- **Image optimization** with Next.js Image component

#### **4. API Design**
```
/api/teams          - GET, POST (CRUD operations)
/api/teams/[id]     - GET, PUT, DELETE
/api/players        - GET, POST with filtering
/api/matches        - GET with status filtering
/api/search         - GET with query parameters
```

## 🗂️ Project Structure

```
wabl-official/
├── app/                          # Next.js 15 App Router
│   ├── (dashboard)/             # Route groups
│   ├── teams/[slug]/           # Dynamic team pages
│   ├── players/[id]/           # Player detail pages
│   ├── search/                 # Global search
│   ├── api/                    # API endpoints
│   └── globals.css            # Global styles
├── components/
│   ├── ui/                     # shadcn/ui components
│   ├── layout/                 # Header, Footer, Navigation
│   ├── features/               # Feature-specific components
│   └── providers/              # Context providers
├── lib/
│   ├── data/                   # JSON data files
│   ├── hooks/                  # Custom React hooks
│   ├── stores/                 # Zustand stores
│   ├── utils/                  # Utility functions
│   └── types.ts               # TypeScript definitions
└── public/
    ├── images/                 # Team logos, player photos
    └── logos/                  # Brand assets
```

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18.0 or later
- npm, yarn, or pnpm
- Git

### **Installation**

1. **Clone the repository**
```bash
git clone https://github.com/leelee222/wabl-official.git
cd wabl-official/my-app
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Run the development server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

### **Build for Production**
```bash
npm run build
npm start
```

## 🏀 League Data

### **Teams (8 teams)**
- **Lagos Lions** (Nigeria) - Gold/Navy
- **Dakar Sharks** (Senegal) - Blue/White  
- **Accra Panthers** (Ghana) - Black/Gold
- **Abidjan Thunder** (Côte d'Ivoire) - Orange/Green
- **Bamako Warriors** (Mali) - Red/Yellow
- **Cotonou Titans** (Benin) - Green/Red
- **Ouagadougou Eagles** (Burkina Faso) - Red/White
- **Lomé Storm** (Togo) - Yellow/Green

### **Statistics**
- **96+ players** with realistic stats and photos
- **24+ matches** with complete results
- **Comprehensive team statistics** (wins, losses, streaks)
- **Player performance data** (PPG, RPG, APG, FG%)

## 🎨 Design System

### **Color Palette**
```css
--primary: #1A365D      /* Deep Navy */
--secondary: #D4AF37    /* Championship Gold */
--accent: #E85D04       /* Energy Orange */
--neutral: #F7FAFC      /* Light Gray */
--dark: #0F172A         /* Rich Black */
```

### **Typography**
- **Headers**: Inter Bold (modern, professional)
- **Body**: Inter Regular
- **Stats/Numbers**: JetBrains Mono (monospace)

### **Components**
- Consistent spacing and sizing
- Hover states and animations
- Dark/Light mode support
- Mobile-first responsive design

## 🔧 Development

### **Available Scripts**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript check
```

### **Code Quality**
- **TypeScript strict mode** enabled
- **ESLint** with Next.js configuration
- **Prettier** for code formatting
- **Consistent naming conventions**

### **Testing**
- Component testing setup ready
- API route testing examples
- Type safety validation

## 📊 Performance

### **Lighthouse Scores**
- **Performance**: 78
- **Accessibility**: 100
- **Best Practices**: 96
- **SEO**: 91

### **Optimizations**
- Image optimization with Next.js Image
- Code splitting and lazy loading
- Static generation where possible
- Efficient caching strategies

### **Development Guidelines**
- Follow TypeScript strict mode
- Use consistent naming conventions
- Write clear commit messages
- Test your changes thoroughly

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

**Developer**: [@leelee222](https://github.com/leelee222)  
**Project**: [wabl-official](https://github.com/leelee222/wabl-official)  
**Demo**: [Live Website](https://wabl-official.vercel.app)

---

<div align="center">
  <strong>🏀 Where Legends Rise 🏀</strong>
  <br>
  <em>WABL - West African Basketball League</em>
</div>