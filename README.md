# 🔒 Lab 14.2 — Secure Record Storage (Notes API)

An Express + MongoDB API where users can only see, edit and delete **their own** notes.
Built from the instructor's starter code, converted to ES modules.

## 🛠️ Tech
Node.js · Express 5 · MongoDB Atlas · Mongoose · bcrypt · JSON Web Tokens · dotenv

## ⚙️ Setup
1. `npm install`
2. Copy `.env.example` to `.env` and fill in `MONGO_URI` and `JWT_SECRET`
3. `npm run dev`, then the server runs on `http://localhost:3000`

## 📍 Endpoints
| Method | Route | Auth | What it does |
|---|---|---|---|
| POST | /api/users/register | none | Create a user, returns a token |
| POST | /api/users/login | none | Log in, returns a token |
| GET | /api/notes | Bearer | Get **only my** notes |
| GET | /api/notes/:id | Bearer | Get one note, 403 if not mine |
| POST | /api/notes | Bearer | Create a note, owner set from token |
| PUT | /api/notes/:id | Bearer | Update, 403 if not mine |
| DELETE | /api/notes/:id | Bearer | Delete, 403 if not mine |

## 🔐 How ownership works
- `models/Note.js` has a required `user` field (ObjectId, ref `User`).
- `POST` sets `user: req.user._id` from the logged-in token, never from the body.
- `GET /` filters with `Note.find({ user: req.user._id })`.
- `PUT`, `DELETE` and `GET /:id` **find the note first**, compare `note.user` to `req.user._id`, and send **403 Forbidden** if they don't match.

## 💭 Reflection
- **Authentication vs. authorization:** logging in (401) is not the same as being allowed (403). The starter checked who you were but not what you owned.
- **Trip-ups:** `req.user.id` vs `req.user._id` (only `_id` exists on the token, so `.id` blocked even the owner). Forgetting `next` in middleware makes requests hang. With ES modules, `dotenv` has to load before anything reads `process.env`. Postman's Auth tab is set per request.
- **Converting to ES modules:** `require` → `import`, `module.exports` → `export default` / named exports, `.js` on local imports, `import.meta.dirname` instead of `__dirname`.

## ✅ Two-User Test Results
| # | Request | User | Expected | Result |
|---|---|---|---|---|
| 1 | POST /api/users/login | Ada | 200 | ✅ |
| 2 | POST /api/users/login | Bob | 200 | ✅ |
| 3 | POST /api/notes | Ada | 201 (note has user) | ✅ |
| 4 | GET /api/notes | Ada | 200, sees her note | ✅ |
| 5 | GET /api/notes | Bob | 200, empty | ✅ |
| 6 | GET /api/notes/:id | Bob | 403 | ✅ |
| 7 | PUT /api/notes/:id | Bob | 403 | ✅ |
| 8 | DELETE /api/notes/:id | Bob | 403 | ✅ |
| 9 | PUT /api/notes/:id | Ada | 200 | ✅ |
| 10 | DELETE /api/notes/:id | Ada | 200 | ✅ |
| 11 | GET /api/notes (no token) | none | 401 | ✅ |