# LinkedTrust ESG Transparency Platform

A modern React TypeScript application built with Material-UI that displays company ESG ratings and community attestations. This platform provides transparency and accountability in corporate ESG performance.

## 🚀 Features

- **Dashboard**: Overview of ESG-rated companies with key metrics
- **Company Profiles**: Detailed ESG information, ratings, and attestations
- **Search & Filter**: Find companies by name, grade, or other criteria
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Real-time Data**: Mock service ready for backend integration
- **Modern UI**: Built with Material-UI v6 components and custom theme

## 🛠 Tech Stack

- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **UI Library**: Material-UI (MUI) v6
- **Routing**: React Router v6
- **State Management**: React Hooks (useState, useReducer)
- **HTTP Client**: Axios
- **Icons**: MUI Icons
- **Styling**: Emotion (CSS-in-JS)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd esg.linkedtrust
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # .env file is already created with:
   VITE_BACKEND_BASE_URL=http://localhost:9000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🏗 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Common/         # Shared components (LoadingSpinner, ErrorMessage, etc.)
│   ├── Company/        # Company-related components (CompanyCard, CompanyGrid, etc.)
│   └── Layout/         # Layout components (Header, Layout)
├── pages/              # Page components
│   ├── Dashboard.tsx
│   ├── CompaniesPage.tsx
│   ├── CompanyDetailsPage.tsx
│   └── ScanProductPage.tsx
├── hooks/              # Custom React hooks
│   ├── useCompanies.ts
│   ├── useClaim.ts
│   └── useNotification.ts
├── services/           # API and utility services
│   ├── api.ts          # Backend API service
│   ├── mockService.ts  # Mock data service
│   └── utils.ts        # Utility functions
├── data/               # Mock data
│   └── mockData.json
├── theme/              # MUI theme configuration
│   └── theme.ts
├── types/              # TypeScript type definitions
│   └── index.ts
├── App.tsx             # Main App component
└── main.tsx            # Application entry point
```

## 🎨 Design System

### Colors
- **Primary**: LinkedIn Blue (#1976d2)
- **Secondary**: Trust Green (#4caf50)
- **Background**: Light Gray (#f5f5f5)

### Typography
- **Font Family**: Roboto, Helvetica, Arial
- **Headings**: Semi-bold (600) weight
- **Body Text**: Regular (400) weight

### Components
- **Cards**: Rounded corners (12px), subtle shadows, hover effects
- **Buttons**: Rounded corners (8px), no text transform
- **Chips**: Rounded (16px), medium weight text

## 📊 Data Models

The application uses TypeScript interfaces that match the exact Prisma schema:

### Claim Interface
```typescript
interface Claim {
  id: number;
  subject: string;              // Company Name/ISIN
  claim: string;               // "rated"
  statement?: string;          // ESG assessment text
  score?: number;              // -1 to 1 scale
  stars?: number;              // 0 to 5 stars
  aspect?: string;             // "esg-overall" | "esg-climate"
  author?: string;             // Rating agency
  sourceURI?: string;          // Source URL
  confidence?: number;         // 0 to 1 confidence level
  // ... additional fields
}
```

### Grade Calculation
ESG scores (-1 to 1) are converted to letter grades:
- **A+**: 90-100% (0.8-1.0)
- **A**: 85-89% (0.7-0.79)
- **A-**: 80-84% (0.6-0.69)
- **B+**: 75-79% (0.5-0.59)
- And so on...

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌐 API Integration

The application is ready for backend integration:

1. **API Service** (`src/services/api.ts`): Axios-based service with endpoints
2. **Mock Service** (`src/services/mockService.ts`): Development fallback
3. **Environment Config**: Backend URL in `.env` file

### API Endpoints (Ready for Backend)
- `GET /claims` - Get all claims
- `GET /claims/:id` - Get claim by ID
- `GET /claims?claim=rated` - Get rated claims only
- `GET /nodes` - Get all nodes
- `GET /nodes?entType=ORGANIZATION` - Get company nodes

## 🚀 Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your hosting provider

3. **Configure environment variables** for production

## 🔮 Future Enhancements

- **Product Scanning**: QR code and image recognition (placeholder ready)
- **Advanced Filtering**: By industry, score range, date
- **Real-time Updates**: WebSocket integration
- **User Authentication**: Login and personalization
- **Data Visualization**: Charts and graphs for ESG trends
- **Export Features**: PDF reports and data export



.
