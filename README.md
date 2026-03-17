# Task Status App

An Ionic Angular app for managing field employee tasks with offline support.

## Features
- User Login (Mock API AUTH)
- View Task List
- Update Status (Pending → In Progress → Done)
- Works Offline

## Quick Start

```bash
npm install
npm start
```

## Version

```bash
node  v20.19
angular v20
ionic v7
```
## Project Structure

```
src/app/
├── core/           # Auth service, guards
├── features/       # Tasks, Home, Login pages
│   └── tasks/     # Task feature (services, store, pages)
└── shared/        # Models
```

## How Offline Works

1. Tasks are saved to localStorage when offline
2. Status changes go to a queue
3. When back online, changes sync automatically

## GCP Services

- **Mock Auth** - For user login

## Run Tests

```bash
npm test
```

## What You Would Improve with More Time

- Add comprehensive unit tests for all components
- Implement end-to-end tests with Cypress
- Add PWA support with service workers
- Push notifications for task updates
- Image upload feature for task evidence
- Better error handling and loading states
- User roles and permissions
- Task filtering and search

## How This Could Scale

- **Pagination** - Load tasks in batches instead of all at once
- **IndexedDB** - Replace localStorage with IndexedDB for better performance
- **WebSocket** - Use real-time updates instead of polling
- **CDN** - Serve static assets from CDN for faster loading
- **Caching** - Implement aggressive caching strategies
- **Microservices** - Break into smaller services for different features
- **Load Balancing** - Distribute traffic across multiple servers
- **Database Sharding** - Split data across multiple databases by region
