\# HookPilot Backend



HookPilot Backend is a Node.js and Express.js backend system for managing webhook subscriptions and processing webhook events securely and reliably.



It allows users to register, login, create webhook subscriptions, receive webhook events, store event logs, process events, and send real-time updates to the frontend.



\## Tech Stack



\- Node.js

\- Express.js

\- MongoDB

\- Mongoose

\- JWT Authentication

\- Socket.IO

\- dotenv

\- Nodemon

\- JavaScript



\## Features



\- User registration

\- User login

\- JWT-based authentication

\- Protected API routes

\- Create webhook subscriptions

\- Store webhook subscription details

\- Receive webhook events

\- Verify webhook signatures

\- Store webhook event logs

\- Track event status

\- Track retry count

\- Process webhook events

\- Real-time event updates using Socket.IO

\- Webhook simulator for testing



\## Local Setup



\### 1. Clone the repository



```bash

git clone https://github.com/VishwasKrishnamurthy/hookpilot-backend.git

```



\### 2. Go to project folder



```bash

cd hookpilot-backend

```



\### 3. Install dependencies



```bash

npm install

```



\## Environment Setup



Create a `.env` file in the root folder.



```env

PORT=5000

MONGO\_URI=your\_mongodb\_connection\_string

JWT\_SECRET=your\_jwt\_secret\_key

```



Example:



```env

PORT=5000

MONGO\_URI=mongodb+srv://username:password@cluster.mongodb.net/hookpilot

JWT\_SECRET=hookpilot\_secret\_key

```



Do not upload the `.env` file to GitHub.



\## Run Project Locally



Start the backend server:



```bash

npm run dev

```



Backend runs on:



```bash

http://localhost:5000

```



Expected terminal output:



```bash

Webhook queue worker started

HookPilot backend running on port 5000

MongoDB connected

```



\## API Routes



\### Authentication Routes



Base URL:



```bash

/api/auth

```



\#### Register User



```bash

POST /api/auth/register

```



Request body:



```json

{

&#x20; "name": "Vishwas",

&#x20; "email": "vishwas123@gmail.com",

&#x20; "password": "123456"

}

```



\#### Login User



```bash

POST /api/auth/login

```



Request body:



```json

{

&#x20; "email": "vishwas123@gmail.com",

&#x20; "password": "123456"

}

```



Response includes JWT token.



\## Authorization



Protected routes require JWT token in headers.



```bash

Authorization: Bearer YOUR\_LOGIN\_TOKEN

```



\## Webhook Subscription Routes



Base URL:



```bash

/api/webhooks

```



\#### Create Webhook Subscription



```bash

POST /api/webhooks

```



Headers:



```bash

Authorization: Bearer YOUR\_LOGIN\_TOKEN

```



Request body:



```json

{

&#x20; "sourceName": "Razorpay",

&#x20; "sourceUrl": "https://razorpay.com",

&#x20; "callbackUrl": "https://example.com/webhook",

&#x20; "eventTypes": \["payment.success", "payment.failed"]

}

```



\## Event Routes



Base URL:



```bash

/api/events

```



\#### Get Webhook Events



```bash

GET /api/events

```



Headers:



```bash

Authorization: Bearer YOUR\_LOGIN\_TOKEN

```



Returns webhook event logs for the authenticated user.



\## Webhook Simulator



The project includes a webhook simulator to test webhook event delivery.



Run:



```bash

npm run simulate SUBSCRIPTION\_ID SUBSCRIPTION\_SECRET

```



Example:



```bash

npm run simulate 6a144410ab805bf55a35d66c 1ad9b550b152938dd6c4c92035c3d047bed00884d8ff4b24

```



If successful, the event will be received, stored, processed, and shown in the frontend events page.



\## Project Structure



```txt

src/

├── config/

│   └── db.js

├── controllers/

│   ├── authController.js

│   ├── eventController.js

│   └── webhookController.js

├── middleware/

│   └── authMiddleware.js

├── models/

│   ├── user.js

│   ├── WebhookSubscription.js

│   └── WebhookEvent.js

├── queues/

│   └── webhookQueue.js

├── routes/

│   ├── authRoutes.js

│   ├── eventRoutes.js

│   └── webhookRoutes.js

├── services/

│   └── webhookService.js

├── sockets/

│   └── socket.js

├── utils/

│   ├── generateToken.js

│   └── verifySignature.js

├── app.js

└── server.js

```



\## Design Choices



The backend is designed using a modular MVC-style architecture.



Routes, controllers, models, middleware, services, queues, sockets, and utilities are separated into different folders. This makes the code easier to understand, maintain, and extend.



MongoDB is used because webhook event payloads are document-based and can have flexible structures depending on the external service.



JWT authentication is used to secure protected routes and ensure that only authenticated users can access their subscriptions and event logs.



Socket.IO is used to provide real-time updates to the frontend whenever webhook events are received or processed.



A webhook simulator is included so the system can be tested without depending on an actual third-party payment gateway.



\## Architectural Decisions



The backend is divided into three main modules:



\### 1. Authentication Module



This module handles user registration, login, JWT token generation, and route protection.



\### 2. Webhook Subscription Module



This module allows authenticated users to create webhook subscriptions by providing source name, source URL, callback URL, and event types.



Each subscription is connected to a user so that users can manage only their own webhook data.



\### 3. Webhook Event Module



This module receives webhook events, verifies the signature, stores event details, tracks status, and processes the event.



Each event stores:



\- Subscription reference

\- Event type

\- Payload

\- Status

\- Retry count

\- Received time

\- Processed time



This helps in monitoring webhook reliability and debugging event delivery.



\## Security Decisions



\- Passwords are not stored directly.

\- JWT token is used for authentication.

\- Protected routes require Authorization header.

\- `.env` is ignored and not uploaded to GitHub.

\- Webhook signature verification is used to validate incoming webhook events.



\## Reliability Decisions



\- Events are stored in MongoDB before processing.

\- Event status is tracked.

\- Retry count is stored for future retry handling.

\- Processing time is recorded.

\- Socket.IO sends real-time updates to the frontend.



\## Frontend Repository



Frontend code is maintained separately as required.



```bash

https://github.com/VishwasKrishnamurthy/hookpilot-frontend

```

