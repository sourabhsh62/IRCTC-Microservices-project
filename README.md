# IRCTC Clone Project

## Goal

Build a production-grade IRCTC-like application while learning:

* Node.js
* Express.js
* PostgreSQL
* Redis
* Docker
* Kafka
* Elasticsearch
* Microservices
* System Design
* Distributed Systems
* React Frontend

---

## Learning Approach

For every feature:

1. Understand the problem
2. Design the solution
3. Implement the code
4. Understand every line
5. Learn real-world production practices

---

## Day 1

### Project Initialization

Commands used:

```bash
npm init -y
```

### What I Learned

* Node.js is a JavaScript runtime.
* npm is Node Package Manager.
* package.json stores project metadata.
* package-lock.json locks dependency versions.
* node_modules contains installed packages.

### Files Created

```text
IRCTC-Clone
|
├── package.json
├── README.md
└── server.js
```

### First Node.js Program

Code:

```js
console.log("Hello Sourabh");
```

Command:

```bash
node server.js
```

Output:

```text
Hello Sourabh
```

### Key Understanding

Node reads the JavaScript file and executes it line by line.

```
```

## Day 2 - Express Fundamentals

### Express Installation

Command:

npm install express

### Concepts Learned

#### localhost

localhost means my own computer.

127.0.0.1 = localhost

#### Port

A port is like a room inside a computer.

Example:

* 3000
* 5000
* 8000

Our Node server is running on port 3000.

#### HTTP Request Flow

Browser
→ HTTP Request
→ Express Server
→ Route Match
→ Response
→ Browser

#### GET Request

GET is used to fetch data.

Examples:

* GET /users
* GET /trains
* GET /bookings

#### Route

A route decides which code should run for a specific URL.

Examples:

* /
* /profile
* /trains

#### req

Contains information sent by the client.

#### res

Used to send response back to the client.

## Day 1 - Request Data Sources

### req.params

Used when data is part of the URL.

Example:

```text
/user/101
```

Output:

```js
req.params.id
```

### req.query

Used for filtering and searching.

Example:

```text
/search?from=Delhi&to=Mumbai
```

Output:

```js
req.query.from
req.query.to
```

### req.body

Used to send data inside the request body.

Common for:

* Signup
* Login
* Booking
* Payment

### Middleware

```js
app.use(express.json());
```

Purpose:

Converts incoming JSON data into a JavaScript object and makes it available inside `req.body`.



##  - Why Databases Exist

### Fake Database

```js
const users = [];
```

Used only for learning.

### Problem

Data is stored in RAM.

When the server restarts:

* Array is cleared
* Data is lost

### Why Database?

Databases provide persistent storage.

Example data:

* Users
* Trains
* Bookings
* Payments

Even if the server restarts, the data remains safe.

### Learning

RAM Storage ❌

Database Storage ✅




## PostgreSQL Setup

### Why PostgreSQL?

PostgreSQL is a relational database.

Used for storing:

* Users
* Trains
* Bookings
* Payments

### Default Port

5432

### Important

Store the PostgreSQL password safely because it is required to connect to the database.

### Why Not Arrays?

Arrays store data in RAM.

RAM data is lost after server restart.

PostgreSQL stores data permanently on disk.


## Day 2 - Node.js to PostgreSQL Connection

### Package

npm install pg

### What is pg?

A PostgreSQL driver for Node.js.

Acts as a translator between Node.js and PostgreSQL.

### Connection Pool

Used to reuse database connections instead of creating a new connection for every request.

### Test Query

SELECT NOW()

Purpose:

Verify that Node.js can successfully communicate with PostgreSQL.


## Day 2 - Login API

### Login Flow

1. Validate input
2. Find user by email
3. Verify password
4. Return success response

### SQL Used

SELECT * FROM users WHERE email = $1

### Current Limitation

Passwords are stored in plain text.

This is insecure and will be fixed using bcrypt password hashing.


## Day 3 - Password Hashing

### Problem

Plain text passwords are insecure.

### Solution

bcrypt

### Signup

Before saving a password:

bcrypt.hash(password, 10)

### Login

To verify password:

bcrypt.compare(
enteredPassword,
storedHash
)

### Hashing vs Encryption

Hashing:

* One way
* Cannot be reversed

Encryption:

* Can be decrypted

Passwords should be hashed, not encrypted.

## Day 3 - JWT Authentication

### Problem

How does the server know which user is making a request?

### Solution

JWT (JSON Web Token)

### Login Flow

Email + Password
↓
Verify Credentials
↓
Generate Token
↓
Return Token

### Middleware

Middleware runs before the controller.

Request
↓
Middleware
↓
Controller

### next()

Passes control to the next middleware or controller.

### Protected Route

GET /profile

Requires a valid JWT token.


## Day 4 - JWT Middleware

### Authentication Flow

Login
↓
Generate JWT
↓
Client Stores Token
↓
Protected Route
↓
JWT Verify
↓
Access Granted

### Authorization Header

Authorization: Bearer <token>

### Middleware

Runs before controller.

Responsibilities:

* Check token
* Verify token
* Extract user information
* Attach user to req.user

### req.user

Contains decoded JWT payload.

Example:

{
id: 6,
email: "[abc@gmail.com](mailto:abc@gmail.com)"
}


## Day 6 - Refresh Token Architecture

### Problem

Access tokens expire quickly.

### Solution

Use Refresh Tokens.

### Flow

Login
↓
Access Token (short-lived)
Refresh Token (long-lived)

### Benefit

Users stay logged in without entering credentials again.

### Database Change

Added:

refresh_token TEXT

to users table.



## Day 6 - Refresh Token Deep Dive

### Access Token

Short-lived token.

Example:
15 minutes

Used for protected APIs.

### Refresh Token

Long-lived token.

Example:
7 days

Used to generate new access tokens.

### Token Revocation

Logout works by removing the refresh token from storage.

### Current Design

users.refresh_token

### Future Design

refresh_tokens table

Supports:

* Multiple devices
* Better security
* Session management


## Day 7 - Train Module Design

### Core Entities

* User
* Train
* Station
* Schedule
* Booking
* Seat
* Payment

### First Domain Module

Train Management

### Trains Table

Columns:

* id
* train_number
* train_name
* source
* destination
* created_at

### Design Principle

Start simple.

Use plain source and destination strings first.

Later migrate to dedicated stations table.


## Day 8 - Read APIs

### Endpoint

GET /trains

### SQL

SELECT * FROM trains
ORDER BY id ASC

### CRUD

Create -> POST
Read -> GET
Update -> PUT/PATCH
Delete -> DELETE

### Future Improvement

Replace source and destination strings with station references.




## Day 11 - Train Search Engine

### Endpoint

GET /search-trains

Example:

/search-trains?source=NDLS&destination=BRC

### Concepts Learned

* SQL JOIN
* Many-to-Many Relationship
* Junction Table
* stop_order based route validation

### Core Logic

A train is valid if:

source_stop_order < destination_stop_order


## Day 12 - Train Schedule Design

### New Table

train_schedules

### Purpose

Store timing information for each station.

### Columns

* train_id
* station_id
* arrival_time
* departure_time
* day_number

### Solves

Train route tells:

"Where train goes"

Train schedule tells:

"When train goes"


## Day 13 - Seat Inventory Design

### Problem

Train exists.

Schedule exists.

But seat availability is unknown.

### Solution

seat_inventory table

### Columns

* train_id
* travel_date
* seat_number
* status

### Status

AVAILABLE
BOOKED

### Important

Inventory is date-specific.

20 June inventory != 21 June inventory

### Future

Concurrency control will be required to prevent double booking.




## Booking Expiry Job

Problem:
Pending bookings block seats forever.

Solution:
node-cron checks every minute.

If booking is pending for 5 minutes:

- booking_status → CANCELLED
- seat_inventory → AVAILABLE

Concepts Learned:

- Background Jobs
- node-cron
- Transactions
- Compensation Logic


## Email Notification

* Added nodemailer service.
* Sends booking confirmation email.
* Uses Gmail App Password.
* Triggered after successful payment.

Next:
BullMQ + Redis Queue for background email processing.


Payment Success
↓
Queue.add()
↓
Response user ko

Background

Worker
↓
sendBookingMail()
↓
Email sent

## Email Queue

- Added BullMQ queue.
- Added email worker.
- Payment service pushes email jobs.
- Worker sends email in background.

#######PROBLEM 
Problem 😈

Ab ek naya question:

Agar server restart ho gaya aur queue me 1000 emails pending thi?

Kya wo sab emails lost ho jayengi?

Answer:

NO

Kyuki BullMQ Redis me data rakhta hai.

Isi wajah se next step hai:

Redis

Hum seekhenge:

Redis kya hai?
Queue data Redis me kaise save hota hai?
Cache kya hota hai?
Session storage
Distributed Lock


## Redis Cache

Applied cache in searchTrains()

Flow:

User
↓
Redis
↓
Postgres

Repeated requests avoid database hits.


## Redis Distributed Lock

Added lock before bookTicket()

Flow:

Redis Lock
↓
Postgres Transaction
↓
Commit
↓
Release Lock

Prevents concurrent booking requests.


Abhi problem ye hai:

User A seat 25 book karta hai.

User B ke browser par abhi bhi:

Seat 25 AVAILABLE

dikha raha hai.

Page refresh karega tabhi update dikhega.

Real IRCTC me:

Seat 25 BOOKED
↓
Sab users ki screen auto-update

Ye WebSocket se hota hai.

Next Feature: WebSocket (Socket.io)

## WebSocket

Added Socket.io.

Emits:

seatBooked

Clients receive live seat updates without refresh.



## Kafka Event Streaming

Added Kafka producer and consumer.

Flow:

Payment Service
↓
payment.success Event
↓
Kafka Topic
↓
Consumers

Concepts:
Producer, Consumer, Topics, Event Driven Architecture




## User Service

Extracted authentication and user management from monolith.

Runs independently on port 3001.

Communication:
REST API

## API Gateway

Added API Gateway using http-proxy-middleware.

Routes:

/users → User Service
/booking → Booking Service

Provides a single entry point for clients.


## Service Communication

Booking Service communicates with User Service using Axios and REST APIs.

Booking Service no longer accesses users table directly.

Concept:
Database Per Service.

## Train Service

Extracted train module from monolith.

Communication:

Booking Service
↓ REST
Train Service

Concept:
Database Per Service


## Circuit Breaker

Added:

Timeout
Retry
Circuit Breaker

Libraries:

axios-retry
opossum

Protects booking-service from failures in user-service.

Q4 Open, Closed and Half-Open states?
Closed

Everything normal.

Open

Service unhealthy.

No requests sent.

Half Open

Testing whether service has recovered.


## Service Discovery

Replaced hardcoded service URLs with environment variables.

USER_SERVICE_URL
TRAIN_SERVICE_URL

Supports Docker and Kubernetes service discovery.


## Docker Compose

Containerized microservices:

- API Gateway
- Booking Service
- User Service
- Train Service
- Postgres
- Redis

Run:

docker-compose up --build


## Kubernetes Basics

Dockerfile
↓
Docker Image
↓
Container
↓
Pod

Kubernetes manages Pods, not individual containers.

## Deployment

Deployment manages Pods.

Features:
- Self Healing
- Replica Management
- Rolling Updates


## Logging

Added centralized logging using Winston.

Benefits:

- Structured logs
- Log levels
- Timestamp
- Easier debugging


## Logging Levels

INFO

Application events

WARN

Business warnings

ERROR

Application failures



global error handler flow 

Client

↓

Controller

↓

Service

↓

throw Error

↓

next(error)

↓

Global Error Middleware

↓

JSON Response

## Global Error Handling

Added centralized Express error middleware.

Benefits:

- Consistent API responses
- Centralized logging
- Cleaner controllers



Request
    │
    ▼
Controller (AsyncHandler)
    │
    ▼
Service
    │
    ▼
Error
    │
    ▼
Global Error Middleware
    │
    ▼
Logger
    │
    ▼
Response



## Request Validation

Added Joi-based validation.

Benefits:

- Reject invalid requests early
- Clean controllers
- Better API security


## API Validation

Validated:

- Request Body
- Query Parameters
- Route Parameters

Implemented using a reusable Joi validation middleware.


## Graceful Shutdown

Implemented graceful shutdown for the Booking Service.

Features:

- Stops accepting new requests
- Closes PostgreSQL connections
- Closes Redis connection
- Handles SIGINT and SIGTERM




## Swagger Documentation

Added Swagger UI for interactive API documentation.

Benefits:

- Interactive API testing
- Easy frontend integration
- Self-documented REST APIs



## Swagger

Configured Swagger UI using swagger-jsdoc.

Access:

http://localhost:3000/api-docs


## Testing

Configured Jest and Supertest.

Current Setup:

- Jest
- Supertest

Upcoming:

- Unit Testing
- Integration Testing
- Mocking
- Coverage


mocking database query for test order for bookticket function
bookTicket()

↓

BEGIN
(Mock-1)

↓

SELECT Seat
(Mock-2)

↓

INSERT Booking
(Mock-3)

↓

UPDATE Seat
(Mock-4)

↓

COMMIT
(Mock-5)

## Testing

### Testing Framework

- Jest
- Supertest

### Unit Tests Implemented

- ✅ Successful Ticket Booking
- ✅ Seat Already Booked
- ✅ User Not Found
- ✅ Train Not Found
- ✅ Redis Lock Failure
- ✅ Database Rollback

### Tested Components

- Redis Lock
- PostgreSQL Transactions
- Socket.io Events
- Axios Calls
- Circuit Breaker
- Database Connection Release

### Commands

Install Dependencies

```bash
npm install --save-dev jest supertest
```

Run Tests

```bash
npm test
```

### Current Coverage

- bookTicket() Service




## Integration Testing

Started API Integration Testing using Supertest.

Current Status

- Express App Refactored
- Supertest Configured
- API Test Structure Created

Upcoming

- POST /book-ticket
- POST /cancel-ticket
- GET /available-seats


### Integration Tests Completed

#### POST /book-ticket

Tests:

- ✅ Returns HTTP 200 on successful booking
- ✅ Verifies Controller → Service interaction
- ✅ Uses Supertest for HTTP testing







### Validation Tests

Implemented validation testing for Booking APIs.

Covered Cases:

- ✅ Missing Required Fields
- ✅ Validation Middleware Blocks Invalid Requests
- ✅ Controller Is Not Executed On Validation Failure


### Error Handling Tests

Implemented error handling integration tests.

Covered Cases

- ✅ Internal Server Error
- ✅ Error Middleware Invocation
- ✅ Service Failure Handling



### Cancel Ticket API Tests

Covered Cases

- ✅ Successful Ticket Cancellation
- ✅ Controller to Service Communication Verified


### Cancel Ticket Validation Tests

Covered Cases

- ✅ Missing bookingId
- ✅ Validation Middleware Tested
- ✅ Controller Not Executed
- ✅ Service Not Called


### Cancel Ticket Error Tests

Covered Cases

- ✅ Internal Server Error
- ✅ Error Middleware Tested
- ✅ Service Failure Handling


### Available Seats API Tests

Covered Cases

- ✅ Successful Seat Availability Fetch
- ✅ Query Parameter Handling
- ✅ Controller to Service Communicationgit


### Available Seats Validation Tests

Covered Cases

- ✅ Missing trainId
- ✅ Missing travelDate
- ✅ Validation Middleware Tested
- ✅ Controller Not Executed


### Available Seats Validation Tests

Covered Cases

- ✅ Missing trainId
- ✅ Missing travelDate
- ✅ Validation Middleware Tested
- ✅ Controller Not Executed


### Available Seats Error Tests

Covered Cases

- ✅ Internal Server Error
- ✅ Error Middleware Tested
- ✅ Service Failure Handling



# API Gateway

## Architecture

```
server.js
      │
      ▼
src/app.js
      │
      ▼
Gateway Routes
      │
      ▼
Rate Limiter
      │
      ▼
Proxy Middleware
      │
      ▼
Microservices
```

### Features

- Express
- Proxy Middleware
- Redis Rate Limiting
- Production Ready Folder Structure



## Configuration

Environment variables are used for all external services.

Variables

```env
PORT=3000
USER_SERVICE_URL=http://localhost:3001
BOOKING_SERVICE_URL=http://localhost:3002
```

Benefits

- No Hardcoded URLs
- Easy Deployment
- Docker Friendly
- Kubernetes Friendly


## Authentication

Gateway verifies JWT before forwarding requests.

Flow

```text
Client
    ↓
Gateway
    ↓
JWT Verification
    ↓
Booking Service
```

Protected Routes

- /booking/*



Client

↓

Gateway

↓

JWT Verify

↓

Role Check

↓

Proxy

↓

Booking Service



## Authorization

The API Gateway implements Role Based Access Control (RBAC).

Supported Roles

- ADMIN
- USER

Flow

```text
JWT Verify
      ↓
Role Check
      ↓
Proxy
```



## Swagger Documentation

Run

```bash
npm start
```

Open

```
http://localhost:3000/api-docs
```

Features

- Interactive API Documentation
- OpenAPI 3.0
- Gateway Endpoint Documentation



## Security

The API Gateway implements production-ready security.

### Features

- Helmet
- CORS
- JWT Authentication
- Role Based Authorization
- Redis Rate Limiting

### Allowed Origin

```env
CLIENT_URL=http://localhost:5173
```


## Logging

The API Gateway uses production-ready logging.

### Stack

- Morgan
- Winston

### Logged Information

- HTTP Method
- URL
- Status Code
- Response Time

### Log File

```
logs/gateway.log
```


## Testing

Run

```bash
npm test
```

Testing Stack

- Jest
- Supertest

### Proxy Tests

Covered

- ✅ User Service Proxy
- ✅ Proxy Middleware Execution


### JWT Authentication Tests

Covered Cases

- ✅ Missing Authorization Header
- ✅ Unauthorized Request

### Invalid JWT Tests

Covered Cases

- ✅ Invalid JWT
- ✅ Tampered Token
- ✅ Unauthorized Response




### JWT Error Handling

The Gateway logs authentication failures internally while returning a generic error response to clients.

Example

```
JWT Verification Failed :
TokenExpiredError
```

Client Response

```json
{
    "message":"Invalid Token"
}
```