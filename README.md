# SentinelAudit

A full-stack audit log monitoring and security event investigation dashboard built with React, TypeScript, Node.js, Express, MongoDB, and MongoDB Atlas.

SentinelAudit provides a centralized interface for ingesting, monitoring, filtering, searching, sorting, and investigating audit logs in a SIEM-inspired environment.

## Live Demo

- Frontend: https://sentinel-audit-dashboard.vercel.app/
- Backend API: https://sentinel-audit-backend-a939.onrender.com
- GitHub Repository: https://github.com/sofiyamasthan1317/sentinel-audit-dashboard

## Overview

SentinelAudit is designed to demonstrate a production-oriented audit log management workflow.

The application allows users to:

- View security event statistics
- Monitor audit logs in a centralized dashboard
- Search logs across multiple fields
- Filter logs by severity, status, role, action, region, and resource type
- Sort records on the server side
- Navigate through paginated log data
- Inspect detailed information for individual audit events
- Upload logs in bulk using CSV or JSON
- View aggregated statistics by severity, status, and region

The project consists of a React frontend and a Node.js backend connected to MongoDB Atlas.

## Features

### Dashboard

The dashboard provides a high-level overview of the audit log system, including:

- Total log events
- Critical and high-severity alerts
- Failed executions
- Active regions
- Severity distribution
- Status summary
- Regional activity visualization
- Recent audit activity

### Audit Log Explorer

The Audit Log Explorer provides detailed access to the complete audit log collection.

Features include:

- Server-side search
- Multi-field filtering
- Server-side sorting
- Pagination
- Configurable page size
- Severity indicators
- Status indicators
- Detailed log inspection

### Log Search and Filtering

The application supports filtering and searching based on:

- Actor
- Role
- Action
- Resource
- Resource type
- IP address
- Region
- Severity
- Status

Search and filter parameters are processed by the backend to support scalable server-side data retrieval.

### Bulk Log Ingestion

Audit logs can be imported using:

- CSV files
- JSON arrays

The backend validates uploaded data before inserting it into MongoDB.

Bulk ingestion includes validation for:

- Required fields
- Data types
- Timestamp values
- Maximum upload size

### Log Investigation

Individual audit logs can be opened in a detailed investigation view.

The details view provides:

- Complete log information
- Structured JSON representation
- Copy-to-clipboard functionality
- Individual log retrieval through the backend

## Technology Stack

### Frontend

- React
- TypeScript
- Vite
- Axios
- Lucide React
- CSS

### Backend

- Node.js
- Express
- TypeScript
- Zod
- Mongoose

### Database

- MongoDB Atlas

## Project Structure

```text
sentinel-audit-dashboard/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   ├── App.tsx
│   │   └── main.tsx
│   │
│   ├── .gitignore
│   ├── .npmrc
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.ts
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── types/
│   │   ├── validators/
│   │   └── app.ts
│   │
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   └── tsconfig.json
│
└── README.md
````

## Backend API

### Get Audit Logs

```http
GET /api/logs
```

Supported query parameters:

* `page`
* `limit`
* `search`
* `severity`
* `status`
* `role`
* `action`
* `region`
* `resourceType`
* `sortBy`
* `sortOrder`

Example:

```http
GET /api/logs?page=1&limit=20&severity=HIGH&sortBy=timestamp&sortOrder=desc
```

### Get Log Statistics

```http
GET /api/logs/stats
```

Returns aggregated information including:

* Total log count
* Severity distribution
* Status distribution
* Regional distribution

### Get a Log by ID

```http
GET /api/logs/:id
```

Returns detailed information for a specific audit log.

### Bulk JSON Upload

```http
POST /api/logs/bulk
```

Request body:

```json
{
  "logs": [
    {
      "actor": "admin@security.io",
      "role": "Admin",
      "action": "POLICY_UPDATE",
      "resource": "iam-policy-v2",
      "resourceType": "IAM",
      "ipAddress": "192.168.1.100",
      "region": "us-east-1",
      "severity": "HIGH",
      "status": "Unresolved",
      "timestamp": "2025-06-14T08:32:11.000Z"
    }
  ]
}
```

### Bulk CSV Upload

```http
POST /api/logs/bulk/csv
```

The CSV file must contain the following headers:

```text
actor
role
action
resource
resourceType
ipAddress
region
severity
status
timestamp
```

## Environment Variables

### Backend

Create a `.env` file inside the `backend` directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
```

Example:

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/audit-log-dashboard
```

Do not commit the `.env` file to version control.

### Frontend

Create a `.env` file inside the `frontend` directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

For production deployment, configure the environment variable with the deployed backend API URL:

```env
VITE_API_BASE_URL=https://sentinel-audit-backend-a939.onrender.com/api
```

## Local Development

### Clone the Repository

```bash
git clone https://github.com/sofiyamasthan1317/sentinel-audit-dashboard.git
cd sentinel-audit-dashboard
```

### Start the Backend

```bash
cd backend
npm install
npm run dev
```

The backend will run on:

```text
http://localhost:5000
```

### Start the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on:

```text
http://localhost:5173
```

## Production Build

### Backend

```bash
cd backend
npm run build
```

To start the compiled backend:

```bash
npm start
```

### Frontend

```bash
cd frontend
npm run build
```

The production files will be generated in the `dist` directory.

## Data Validation

Incoming data is validated using Zod schemas before processing.

Validation is applied to:

* Individual audit log objects
* Bulk JSON payloads
* Query parameters
* CSV upload data

Invalid requests return structured validation errors.

Example:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "logs.0.actor",
      "message": "Actor is required"
    }
  ]
}
```

## API Response Format

Successful responses follow a consistent structure.

Example:

```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 0,
    "totalPages": 0
  }
}
```

## Security Considerations

* Database credentials are stored in environment variables.
* Environment files are excluded from version control.
* Input data is validated before database insertion.
* Server-side filtering and pagination are used to reduce unnecessary data transfer.
* API errors are handled through centralized middleware.
* Sensitive database credentials are never exposed to the frontend.

## Deployment Architecture

```text
┌─────────────────────┐
│                     │
│      End User       │
│                     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────────────────────┐
│                                     │
│       React Frontend                │
│       Deployed on Vercel            │
│                                     │
│  sentinel-audit-dashboard           │
│       .vercel.app                   │
│                                     │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│                                     │
│       Node.js Backend               │
│       Deployed on Render            │
│                                     │
│  sentinel-audit-backend-a939        │
│       .onrender.com                 │
│                                     │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│                                     │
│          MongoDB Atlas              │
│                                     │
│       Audit Log Database            │
│                                     │
└─────────────────────────────────────┘
```

## Future Improvements

Potential future enhancements include:

* Authentication and role-based access control
* Real-time log streaming using WebSockets
* Advanced date-range filtering
* Exporting filtered logs
* Advanced audit analytics
* Chart-based historical trends
* Automated alerting for critical events
* Infrastructure and cloud provider integrations
* Automated testing
* CI/CD pipelines

## Author

**Shofiya M**

Full Stack Developer

Technologies used in this project:

React, TypeScript, Vite, Axios, Node.js, Express, Zod, Mongoose, MongoDB, and MongoDB Atlas.