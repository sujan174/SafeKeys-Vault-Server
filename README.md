# SafeKeys Vault Server

*A lightweight, self-hostable, and secure vault server designed to work with the **AI Secrets Vault Scanner GitHub Action***

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)  
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)  
![AES](https://img.shields.io/badge/AES_256-FF6B6B?style=for-the-badge&logo=lock&logoColor=white)  

This server provides a simple API to store and retrieve secrets found in your codebases.

## Features

- **AES-256 Encryption**: Secrets are encrypted at rest in the local JSON database using a secure 32-character key.
- **API Key Authentication**: All endpoints are protected and require a secret API key for access.
- **Easy to Deploy**: Ready to be deployed to any Node.js hosting service like Render, Heroku, or a VPS.
- **Lightweight & Simple**: Built with Express.js, with no external database dependencies.
- **Direct Integration**: Designed specifically to be the backend for the AI Secrets Vault Scanner action.

## Getting Started

Follow these instructions to get the server up and running on your local machine for development and testing.

### Prerequisites

- Node.js (v18 or newer)
- npm (comes with Node.js)

### Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/sujan174/SafeKeys-Vault-Server.git
   cd SafeKeys-Vault-Server
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure your environment**: Create a `.env` file by copying the example file:
   ```bash
   cp .env.example .env
   ```

   Now, open the `.env` file and set a strong `VAULT_API_KEY` and a unique 32-character `ENCRYPTION_KEY`.

   ```env
   # .env

   # The port the server will run on
   PORT=8000

   # A strong, unique API key for client authentication
   VAULT_API_KEY="your-secret-api-key"

   # A 32-character key for AES-256 encryption of the database
   ENCRYPTION_KEY="6UEEJdPrJOHFrFgvw9aXKc1ipFTPNI4F"
   ```

4. **Start the server**:
   ```bash
   npm start
   ```

Your vault server is now running and accessible at: `http://localhost:8000`

## Deployment

This server is ready to be deployed to any modern cloud hosting provider (e.g., Render, Heroku, VPS).

### Example: Deploy to Render

1. Create a new **Web Service** on your Render dashboard and connect your GitHub repository.
2. Use the following settings:
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
3. Add your environment variables in the Render UI:
   - `VAULT_API_KEY`: `your-super-secret-and-random-api-key-12345`
   - `ENCRYPTION_KEY`: `your-unique-32-character-encryption-key`
4. Deploy! Render will provide you with a public URL for your live server.

## API Endpoints

The server exposes two main API endpoints. All requests require an `x-api-key` header.

### 1. Store a Secret

- **Endpoint**: `POST /secrets`
- **Description**: Encrypts and saves a new secret to the vault.
- **Body Example**:
  ```json
  {
    "Description": "Generic API Key",
    "Secret": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0",
    "File": "config/prod.env",
    "Commit": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0"
  }
  ```

- **Success Response (201 Created)**:
  ```json
  {
    "message": "Secret stored",
    "id": "a1b2c3d4e5f6g7h8"
  }
  ```

### 2. Retrieve a Secret

- **Endpoint**: `GET /secrets/:id`
- **Description**: Retrieves and decrypts a specific secret using its unique ID.
- **Success Response (200 OK)**:
  ```json
  {
    "Description": "Generic API Key",
    "Secret": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0",
    "File": "config/prod.env",
    "Commit": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0",
    "receivedAt": "2025-08-26T00:15:00.000Z"
  }
  ```
