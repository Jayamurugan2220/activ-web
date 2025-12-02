# ACTIV backend (minimal)

This is a tiny Express + lowdb backend used for local development and demo purposes. It provides two simple endpoints:

- POST /api/register — accepts { memberId, password, email, firstName } and stores a user (password hashed)
- POST /api/login — accepts { identifier, password } where identifier is memberId or email and validates a user

How to run locally:

1. cd backend
2. npm install
3. npm run dev

You'll get a db.json created in the backend folder that stores users.

Security note: This is meant as a local demo only. For production use, add proper authentication, use a proper database and secure sessions, rate-limiting, and input validation.
