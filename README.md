# RiaMoney - Currency Exchange Dashboard

This project is a modern currency exchange dashboard designed to provide real-time conversion rates and historical data visualization. It features a clean, responsive user interface that allows users to convert between various global currencies and view exchange rate trends over the last 30 days. The application leverages the Frankfurter API for accurate financial data and is built with performance and usability in mind.

### Tech Stack
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Frankfurter API

### Prerequisites
- Node.js 18 or higher
- npm, yarn, pnpm, or bun

## Innovation Feature

The core innovation of this dashboard is the custom-built historical exchange rate chart. Unlike standard implementations that rely on heavy third-party charting libraries, this project features a lightweight, bespoke SVG charting component. This component renders a 30-day trend line with interactive hover states, dynamic scaling based on rate fluctuations, and optimized data point visualization. This approach significantly reduces the application's bundle size while providing a highly performant and responsive user experience tailored specifically for financial data.

## AI Usage and Trade-offs

Artificial Intelligence was utilized throughout the development process to accelerate implementation and ensure code quality. Specifically, AI assistants were used to generate initial component structures, debug complex logic in the currency conversion algorithms, and refactor code for better maintainability. 

Regarding trade-offs, the decision was made to build a custom SVG chart rather than importing a comprehensive library like Recharts or Chart.js. While this required more initial development effort, it resulted in a lighter application with no external dependencies for visualization. Additionally, the project uses the free Frankfurter API. While this provides reliable data from the European Central Bank, it may have limitations compared to enterprise-grade paid APIs, which was considered an acceptable trade-off for this demonstration.

## Setup Instructions

1. Clone the repository to your local machine.
2. Navigate to the project directory.
3. Install the dependencies:
   ```bash
   npm install
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open http://localhost:3000 with your browser to see the result.

## Deployment

The application is optimized for deployment on Vercel. You can view the live deployment here: [Insert Vercel Deployment Link Here]
