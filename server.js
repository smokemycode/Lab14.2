import 'dotenv/config';
import express from 'express';
import path from 'path';
import db from './config/connection.js';
// import noteRoutes from './routes/noteRoutes.js';
// import userRoutes from './routes/userRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
	app.use(express.static(path.join(import.meta.dirname, '../client/build')));
}


// mount each router at its address
// app.use('/api/users', userRoutes);
// app.use('/api/notes', noteRoutes);

// anything that doesn't match the above
app.use((req, res) => res.status(404).json({ message: 'Wrong route!' }));

db.once('open', () => {
	app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});
