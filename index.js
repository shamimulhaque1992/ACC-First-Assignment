const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/myRoutes');
const PORT = process.env.PORT || 8000;

const app = express();

app.use(express.json());
app.use(cors());

app.use('/user', userRoutes);

app.get('/', (req, res) => {
    res.status(400).send("Welcome to my first backend api Random User");
})

app.listen(PORT, () => {
    console.log(`Random User Server running at PORT: ${PORT}`);
})