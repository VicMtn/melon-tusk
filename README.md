<p align="center">
  <img src="logo.png" alt="Melon-Tusk Logo" width="200"/>
</p>

# Melon-Tusk

Melon-Tusk is a comprehensive cryptocurrency management application with a React frontend and Express.js backend. It allows users to monitor the cryptocurrency market in real-time, manage their virtual portfolio, and perform transactions.

<p align="center">
  <a href="https://github.com/VicMtn">
    <img src="https://github.com/VicMtn.png" width="50" style="border-radius:50%" alt="Victorien Montavon"/>
  </a>
  <a href="https://github.com/MinusW">
    <img src="https://github.com/MinusW.png" width="50" style="border-radius:50%" alt="Shanshe Gundishvili"/>
  </a>
</p>

## Features

### Frontend (/frontend)
- **Interactive Dashboard**: Overview of markets and your portfolio
- **Market Monitoring**: Real-time consultation of cryptocurrency prices and performance
- **Portfolio Management**: Track your assets and their value
- **Transactions**: Buy, sell, deposit, and withdraw funds
- **Fear & Greed Index**: Market sentiment indicator
- **Watchlist**: Follow your favorite cryptocurrencies
- **Market News**: Latest cryptocurrency news
- **Secure Authentication**: User registration and login
- **Account Settings**: Management of personal information and security

### Backend (/backend)
- **RESTful API**: Complete endpoints for all features
- **JWT Authentication**: Secure access to data
- **MongoDB Integration**: Storage of user data and transactions
- **External API for Rates**: Real-time market data retrieval
- **Swagger Documentation**: Documented and testable API
- **Security Middlewares**: Protection against common attacks

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/en/download) (v20 or higher)
- [MongoDB](https://www.mongodb.com/docs/manual/installation/) (v8.0.5 or higher)
- *Optional: [Compass](https://www.mongodb.com/docs/compass/current/install/) to visualize data in MongoDB*
- API key for crypto data services ([LCW_KEY](https://www.livecoinwatch.com/tools/api), [CMC_API_KEY](https://coinmarketcap.com/api/pricing/), [COINDESK_API_KEY](https://developers.coindesk.com/documentation/data-api/introduction))

### Installation and Configuration

#### Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Configure environment variables:
   - Create a `.env` file based on `.env.example`
   - Configure your MongoDB URI
   - Add your API keys for crypto data
   - Set a JWT secret key for authentication
   
   
   The API will be available at `http://localhost:3000`

3. (Optional) Populate the database with test data:
   ```bash
   npm run seed
   ```

#### Frontend
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```

3. Configure environment variables:
   - Create a `.env` file based on `.env.exemple`
   - Configure the API URL
   
   The frontend application will be available at `http://localhost:5173`

### Installing Dependencies and Launching the App
1. Navigate to the project root and run:
```
npm run install:all
```
Start both servers using concurrently
```
npm run dev
```

## TechStack

### Frontend
[![Frontend Skills](https://skillicons.dev/icons?i=react,ts,tailwind,vite)](https://skillicons.dev)
- React + TypeScript
- React Router for navigation
- Tailwind CSS for styling
- Axios for HTTP requests
- Chart.js and ApexCharts for charts
- FlyonUI for interface components

### Backend
[![Backend Skills](https://skillicons.dev/icons?i=nodejs,express,ts,mongodb)](https://skillicons.dev)
- Express.js + TypeScript
- MongoDB with Mongoose
- JWT for authentication
- Swagger for API documentation
- Axios for external requests

## Contribution
This project is currently closed to contributions

## License
This project is licensed under the MIT License - see the LICENSE file for details.
