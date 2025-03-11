This project is a clone of Discord web app, created to practice coding skills and try new implementations.

## Getting Started

1. install the dependencies:

```bash
npm install
```

2. add enviroment variables:

- Create your .env file based on the .env.example.
- You'll need to generate publishable and private keys from [Clerk](https://dashboard.clerk.com/).
- You'll need a database url, a good option is [Neondb](https://console.neon.tech/), create a cluster and get the database url.

3. generate the prisma schema and push it

```bash
npx prisma generate
```

```bash
npx prisma db push
```

4. run the development server:

```bash
npm run dev
```

5. run the prisma studio to see the db:

```bash
npx prisma studio
```

Open [http://localhost:3000](http://localhost:3000) and [http://localhost:5555](http://localhost:5555) with your browser to see the result.

The work on this project is ongoing but feel free to create an issue suggesting improvement, or contact me via [email](niksonrotondaro1@gmail.com).
