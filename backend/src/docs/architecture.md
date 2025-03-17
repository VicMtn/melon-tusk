├── src
│   ├── app.ts
│   ├── config
│   │   ├── envConfig.ts
│   │   ├── mongoDB.ts
│   │   └── swagger.ts
│   ├── controllers
│   │   ├── marketController.ts
│   │   ├── transactionController.ts
│   │   ├── userController.ts
│   │   └── walletController.ts
│   ├── docs
│   │   ├── architecture.md
│   │   └── swagger.yaml
│   ├── interfaces
│   │   ├── IArticles.ts
│   │   ├── IAuthRequest.ts
│   │   ├── ICoins.ts
│   │   ├── IFearAndGreed.ts
│   │   ├── ITransaction.ts
│   │   ├── IUser.ts
│   │   └── IWallet.ts
│   ├── middleware
│   │   └── authMiddleware.ts
│   ├── models
│   │   ├── Coin.ts
│   │   ├── Transaction.ts
│   │   ├── User.ts
│   │   └── Wallet.ts
│   ├── routes
│   │   ├── authRoutes.ts
│   │   ├── index.ts
│   │   ├── marketRoutes.ts
│   │   ├── transactionRoutes.ts
│   │   ├── userRoutes.ts
│   │   └── walletRoutes.ts
│   ├── seeders
│   │   └── seed.ts
│   ├── services
│   │   ├── AuthService.ts
│   │   ├── coinDeskService.ts
│   │   ├── coinMarketCapService.ts
│   │   ├── index.ts
│   │   └── liveCoinWatchService.ts
│   └── validations
│       └── userValidations.ts
└── tsconfig.json