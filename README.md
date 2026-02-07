# DriveCloud - Backend

Backend API for DriveCloud file storage application.

## Tech Stack

- **Runtime:** Node.js
- **Language:** TypeScript
- **Framework:** Express.js
- **ORM:** TypeORM
- **Database:** MongoDB
- **Storage:** AWS S3

## Features

### Core Functionality
- File upload and storage to S3
- Folder creation and management
- File and folder metadata management
- Star/favorite folders
- Folder sharing capabilities

### API Endpoints
- File upload and retrieval
- Folder CRUD operations
- Star/unstar folders
- Share folder management

## Database

- **MongoDB** for storing metadata (file/folder information, user data, sharing details)
- **AWS S3** for actual file storage

## Getting Started

```bash
npm install
npm run dev
```

