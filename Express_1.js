import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
const app = express();
app.use(express.json());
app.use(cors());
const PORT = 3000;
mongoose.connect('mongodb://localhost:27017/linkedin_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('DB connection error:', err));
app.get('/', (req, res) => {
  res.send('Hello from Node.js with import!');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
