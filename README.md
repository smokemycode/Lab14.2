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