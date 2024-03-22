const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

// Load environment variables
require('dotenv').config();


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const User = require('./models/User');

// Routes
app.get('/login', (req, res) => {
    res.render('login', { message: null });
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    if (user) {
        res.send(`Welcome, ${user.username}!`);
    } else {
        res.render('login', { message: 'Invalid username or password. Please try again.' });
    }
});

app.get('/register', (req, res) => {
    res.render('register', { message: null });
});

app.post('/register', async (req, res) => {
    const { firstName, lastName, dob, country, gender, course, email, phoneNumber, username, password } = req.body;
    const existingUser = await User.findOne({ username });

    if (existingUser) {
        res.render('register', { message: 'Username already exists. Please choose another one.' });
    } else {
        const newUser = new User({ firstName, lastName, dob, country, gender, course, email, phoneNumber, username, password });
        await newUser.save();
        res.send('Registration successful! <a href="/login">Login</a>');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
