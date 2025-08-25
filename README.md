# SafeKeys Vault Server

A lightweight, self-hostable, and secure vault server designed to work with the **AI Secrets Vault Scanner GitHub Action**.  
This server provides a simple API to store and retrieve secrets found in your codebases.

---

## Features
- **Secure Storage**: Secrets are stored persistently in a local JSON database file.  
- **API Key Authentication**: All endpoints are protected and require a secret API key.  
- **Easy to Deploy**: Ready to be deployed to any Node.js hosting service like Render, Heroku, or a VPS.  
- **Lightweight & Simple**: Built with Express.js, with no external database dependencies.  
- **Direct Integration**: Designed specifically to be the backend for the AI Secrets Vault Scanner action.  

---

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
   
3. **Configure your environment**:
Create a .env file by copying the example file:
   ```bash
   cp .env.example .env
   ```
    Now, open the .env file and set a strong, unique VAULT_API_KEY.

   ```env
   PORT=4000
   VAULT_API_KEY=your-secret-api-key
   ```

  4. **Start the server**:
   ```bash
   npm start
   Your vault server is now running and accessible at: http://localhost:4000
   ```

   ### Deployment
   - This server is ready to be deployed to any modern cloud hosting provider (e.g., Render, Heroku, VPS).
   - Example: Deploy to Render
     - Create a new Web Service on your Render dashboard and connect your GitHub repository.
     - Set the Root Directory to vault-server (if your server is in a subfolder).
     - Use the following settings:
        - Environment: Node
        - Build Command: npm install
        - Start Command: node index.js
        - Add environment variables in the Render UI:
          - VAULT_API_KEY=your-super-secret-and-random-api-key-12345
    
     Deploy! Render will provide you with a public URL for your live server.
    
  ## API Endpoints
  
  The server exposes two main API endpoints.

  1. Store a Secret
  Endpoint: POST /secrets
  
  Headers:
  
  Content-Type: application/json
  x-api-key: <your-VAULT_API_KEY>
  
  Body Example:
  ```json
  {
    "Description": "Generic API Key",
    "Secret": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0",
    "File": "config/prod.env",
    "Commit": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0"
  }
  ```
  Success Response (201 Created):
  ```json
  {
    "message": "Secret stored",
    "id": "a1b2c3d4e5f6g7h8"
  }
  ```
  2. Retrieve a Secret
  Endpoint: GET /secrets/:id
  
  Headers:
  
  x-api-key: <your-VAULT_API_KEY>
  
  Success Response (200 OK):
  ```json
  {
    "Description": "Generic API Key",
    "Secret": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0",
    "File": "config/prod.env",
    "Commit": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0",
    "receivedAt": "2025-08-26T00:15:00.000Z"
  }
  ```
  ## Security
  API Key: The security of your vault depends entirely on the secrecy and strength of your VAULT_API_KEY. Use a long, random string and store it securely.
  
  HTTPS: When deploying, ensure you are using a hosting provider that automatically enables HTTPS on your public URL.
  
  Trusted Environment: This server is designed for personal or small team use. Run it in a trusted environment.
