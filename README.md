# SentinelAudit

A full-stack audit log monitoring and security event investigation dashboard built with React, TypeScript, Node.js, Express, MongoDB, and MongoDB Atlas.

SentinelAudit provides a centralized interface for ingesting, monitoring, filtering, searching, sorting, and investigating audit logs in a SIEM-inspired environment.

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

The project consists of a React frontend and a Node.js backend connected to MongoDB.

## Features

### Dashboard

The dashboard provides a high-level overview of the audit log system, including:

- Total log events
- Critical and high-severity alerts
- Failed executions
- Active regions
- Severity distribution
- Status summary
- Regional breakdown
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
- Individual log retrieval through the backend API

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
- MongoDB

### Database

- MongoDB Atlas

## Project Structure

```text
audit-log-dashboard/
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
│   ├── .env
│   ├── .gitignore
│   ├── package.json
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
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── tsconfig.json
│
└── README.md

Backend API
Get Audit Logs
GET /api/logs

Supported query parameters:

page
limit
search
severity
status
role
action
region
resourceType
sortBy
sortOrder

Example:

GET /api/logs?page=1&limit=20&severity=HIGH&sortBy=timestamp&sortOrder=desc
Get Log Statistics
GET /api/logs/stats

Returns aggregated information including:

Total log count
Severity distribution
Status distribution
Regional distribution
Get a Log by ID
GET /api/logs/:id
Bulk JSON Upload
POST /api/logs/bulk

Request body:

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
Bulk CSV Upload
POST /api/logs/bulk/csv

The CSV file must contain the following headers:

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
Environment Variables
Backend

Create a .env file inside the backend directory:

PORT=5000
MONGODB_URI=your_mongodb_connection_string

Example:

PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/audit-log-dashboard

Do not commit the .env file to version control.

Frontend

Create a .env file inside the frontend directory:

VITE_API_BASE_URL=http://localhost:5000/api

For production deployment, update the value to the deployed backend API URL.

Local Development
Clone the Repository
git clone <repository-url>
cd audit-log-dashboard
Start the Backend
cd backend
npm install
npm run dev

The backend will run on:

http://localhost:5000
Start the Frontend

Open another terminal:

cd frontend
npm install
npm run dev

The frontend will run on:

http://localhost:5173
Production Build
Backend
cd backend
npm run build

To start the compiled backend:

npm start
Frontend
cd frontend
npm run build

The production files will be generated in the dist directory.

Data Validation

Incoming data is validated using Zod schemas before processing.

Validation is applied to:

Individual audit log objects
Bulk JSON payloads
Query parameters
CSV upload data

Invalid requests return structured validation errors.

Example:

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
API Response Format

Successful responses follow a consistent structure.

Example:

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

Security Considerations

Database credentials are stored in environment variables.
Environment files are excluded from version control.
Input data is validated before database insertion.
Server-side filtering and pagination are used to avoid unnecessary data transfer.
API errors are handled through centralized middleware.
Sensitive database credentials should never be exposed to the frontend.

Deployment Architecture
                         ┌─────────────────────┐
                         │                     │
                         │      End User       │
                         │                     │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │                     │
                         │  React Frontend     │
                         │  Vercel / Netlify   │
                         │                     │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │                     │
                         │  Node.js Backend    │
                         │  Render / Railway   │
                         │                     │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │                     │
                         │   MongoDB Atlas     │
                         │                     │
                         └─────────────────────┘
Future Improvements

Potential future enhancements include:

Authentication and role-based access control
Real-time log streaming using WebSockets
Advanced date-range filtering
Exporting filtered logs
Advanced audit analytics
Chart-based historical trends
Automated alerting for critical events
Infrastructure and cloud provider integrations
Automated testing and CI/CD pipelines


Author

Shofiya M

Full Stack Developer

Technologies: React, Next.js, TypeScript, Node.js, Express, NestJS, MongoDB, PostgreSQL