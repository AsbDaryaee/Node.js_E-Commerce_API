# E-commerce API

This is a Node.js API for an e-commerce website. It provides endpoints for authentication, user management, product management, review management, and order management.

## Installation

1. Clone this repository
2. Install dependencies using `npm install`
3. Set environment variables:
   - `PORT`: The port number to run the server on (default is 3000)
   - `MONGO_URI`: The MongoDB connection URI
   - `JWT_SECRET`: The secret key for JSON Web Tokens
4. Start the server using `npm start`

## Endpoints

### Authentication

- POST `/api/v1/auth/register`: Register a new user
- POST `/api/v1/auth/login`: Log in an existing user
- GET `/api/v1/auth/logout`: Log out an existing user

### Users

- GET `/api/v1/users`: Get all users (admin only)
- GET `/api/v1/users/:id`: Get a single user by ID (admin or authenticated user only)
- PATCH `/api/v1/users/:id`: Update a user by ID (admin or authenticated user only)
- DELETE `/api/v1/users/:id`: Delete a user by ID (admin only)
- GET `/api/v1/users/ShowMe`: Get the current user's profile

### Products

- GET `/api/v1/products`: Get all products
- GET `/api/v1/products/:id`: Get a single product by ID
- POST `/api/v1/products`: Create a new product (Admin Or Registerd Users)
- PATCH `/api/v1/products/:id`: Update a product by ID (admin or owner)
- DELETE `/api/v1/products/:id`: Delete a product by ID (admin only or owner)

### Reviews

- GET `/api/v1/reviews`: Get all reviews
- GET `/api/v1/reviews/:id`: Get a single review by ID
- POST `/api/v1/reviews`: Create a new review (authenticated user only)
- PATCH `/api/v1/reviews/:id`: Update a review by ID (admin or the review author only)
- DELETE `/api/v1/reviews/:id`: Delete a review by ID (admin or the review author only)

### Orders

- GET `/api/v1/orders`: Get all orders (admin only)
- GET `/api/v1/orders/:id`: Get a single order by ID (admin or the order owner only)
- POST `/api/v1/orders`: Create a new order (authenticated user only)
- PATCH `/api/v1/orders/:id`: Update an order by ID (admin only)

## Error Handling

If an error occurs in any endpoint, it will be handled by the `errorHandler` middleware and returned as a JSON response with the following properties:

- `status`: The HTTP status code of the error (e.g. 400, 404, 500)
- `message`: A human-readable error message
- `stack`: A stack trace for debugging purposes (only included in development mode)
