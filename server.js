const express = require('express');
const zxcvbn = require('zxcvbn');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const app = express();
app.use(express.json());
app.use(express.static('public')); // Serve static files from the 'public' directory

// Password Strength Checker Route
app.get('/password-strength', (req, res) => {
    const password = req.query.password;
    if (!password) return res.status(400).send('Password is required');
    
    const result = zxcvbn(password);
    res.json(result);
});

// Password Generator Route (Random Password Generation)
app.get('/generate-password', (req, res) => {
    const length = req.query.length || 12; // Default password length is 12
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';
    let password = '';
    
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    res.json({ password });
});

// Have I Been Pwned Check Route
app.get('/pwned', async (req, res) => {
    const password = req.query.password;
    if (!password) return res.status(400).send('Password is required');
    
    const hash = bcrypt.hashSync(password, 10);
    const first5Chars = hash.slice(0, 5);
    const restOfHash = hash.slice(5);
    
    try {
        const response = await axios.get(`https://api.pwnedpasswords.com/range/${first5Chars}`);
        const pwnedPasswords = response.data.split('\n');
        
        const isPwned = pwnedPasswords.some(line => line.startsWith(restOfHash.toUpperCase()));
        res.json({ isPwned });
    } catch (err) {
        res.status(500).send('Error checking password in Have I Been Pwned');
    }
});

// User Authentication (Login Example) - For demonstration
const dummyUser = { username: 'user1', password: '$2a$10$B6HlRMGNS5.pO9hxlwV1N.Z36dRH4AbJoiqE/7qROjD1lISw8g4wK' }; // Sample hashed password

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (username !== dummyUser.username) return res.status(400).send('User not found');
    
    const isMatch = await bcrypt.compare(password, dummyUser.password);
    if (isMatch) {
        const token = jwt.sign({ username }, 'secretKey', { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(400).send('Invalid password');
    }
});

// Start the server on port 3001
app.listen(3001, () => {
    console.log('Server is running on http://localhost:3001');
});
