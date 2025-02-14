### Weekly Log - Week 6
**Duration:** 10.02.2025 - 15.02.2025

**Work Done:**

*   **Core Backend Development (Part 1):**
    *   Implemented core backend APIs for User Authentication (Signup, Login, Logout).
    *   Implemented Product Management APIs (GET, POST, PUT, DELETE for Products).
    *   Established secure data handling practices, including password hashing (bcrypt) and JWT authentication.
*   **User Authentication Implementation:**
    *   Developed API endpoints for user registration (`/auth/signup`) and login (`/auth/login`).
    *   Implemented password hashing using `bcrypt` for secure password storage.
    *   Generated and returned JWT tokens upon successful login.
*   **Product Management API Development:**
    *   Implemented API endpoints for:
        *   Getting all products (`/products`)
        *   Getting a single product by ID (`/products/:id`)
        *   Creating a new product (Admin only, `/products`)
        *   Updating an existing product (Admin only, `/products/:id`)
        *   Deleting a product (Admin only, `/products/:id`)
    *   Implemented input validation and error handling for API requests.
* **Security Measures:**
        * Established HTTPS to make communications more secure

**Challenges Encountered:**

*   Ensuring secure password handling and data protection.
*   Designing API endpoints that are both functional and easy to use.
*   Implementing proper authentication and authorization mechanisms.

**Next Steps:**

*   Develop additional APIs and business logic.
*   Implement database queries for more complex use cases.