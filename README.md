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

Artificial Intelligence was integrated into the software development lifecycle following a structured methodology to enhance productivity and architectural integrity. Initially, it was leveraged for **Scaffolding & Architecture** to generate a robust project skeleton, establishing the Next.js 15 App Router structure and TypeScript configuration. During the **Implementation Phase**, AI assistants facilitated the creation of complex logic, including the custom SVG rendering algorithms and asynchronous state management, while also translating design requirements into responsive Tailwind UI components. Finally, in the **Optimization & QA Phase**, AI tools were employed for code depuration, resolving ESLint violations, and refactoring hardcoded values into centralized configuration files to ensure maintainability.

Regarding assumptions and trade-offs, the historical chart was implemented based on the assumption that users might be investors interested in visualizing currency fluctuations over the last month. Additionally, for the exchange rates table, the selection of the top 10 major world currencies was determined by evaluating market movements from various sources, assuming these are the most relevant for the user base.

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

The application is optimized for deployment on Vercel. You can view the live deployment here: https://riamoney-dashboard.vercel.app
