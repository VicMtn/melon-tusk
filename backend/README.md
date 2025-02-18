# Backend API

This is the backend API service built with Express.js.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the backend directory with the following variables:
```
PORT=3000
NODE_ENV=development
```

3. Start the development server:
```bash
npm run dev
```

## Available Scripts

- `npm run dev` - Starts the development server with hot-reload
- `npm start` - Starts the production server
- `npm test` - Runs the test suite

## API Endpoints

Documentation for API endpoints will be added here.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Port number for the server | 3000 |
| NODE_ENV | Environment mode (development/production) | development |

## Project Structure

```
backend/
├── src/
│   └── app.js          # Express app setup
├── .env                # Environment variables
├── .gitignore          # Git ignore file
└── README.md           # Project documentation
```

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request

## License

MIT
