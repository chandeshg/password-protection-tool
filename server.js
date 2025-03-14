const express = require('express');
const axios = require('axios');
const sha1 = require('sha.js');

const app = express();
const port = 3000;

app.use(express.json());

app.post('/check-pwned', async (req, res) => {
    const { password } = req.body;
    if (!password) {
        return res.status(400).json({ error: 'Password is required' });
    }

    const hashedPassword = sha1().update(password).digest('hex');
    const prefix = hashedPassword.substring(0, 5);
    const suffix = hashedPassword.substring(5).toUpperCase();

    try {
        const response = await axios.get(`https://api.pwnedpasswords.com/range/${prefix}`);
        const hashes = response.data.split('\n');
        const found = hashes.some(hash => hash.startsWith(suffix));

        if (found) {
            res.json({ pwned: true });
        } else {
            res.json({ pwned: false });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error checking password' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

function checkPwned() {
    const password = document.getElementById('check-password').value;
    const pwnedStatus = document.getElementById('pwned-status');

    fetch('http://localhost:3000/check-pwned', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.pwned) {
            pwnedStatus.textContent = 'Password has been exposed!';
        } else {
            pwnedStatus.textContent = 'Password is safe.';
        }
    })
    .catch(error => {
        pwnedStatus.textContent = 'Error checking password.';
    });
}