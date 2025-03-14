// Password Strength Checker
function checkPasswordStrength() {
    const password = document.getElementById('password').value;
    let strength = 'Weak';
    if (password.length >= 8) {
        strength = 'Medium';
        if (/[A-Z]/.test(password) && /[0-9]/.test(password)) {
            strength = 'Strong';
        }
    }
    document.getElementById('password-strength').innerText = `Strength: ${strength}`;
}

// Password Generator
function generatePassword() {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    let password = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    document.getElementById('generated-password').innerText = `Generated Password: ${password}`;
}

// Have I Been Pwned Check
async function checkPwned() {
    const password = document.getElementById('check-password').value;
    const hash = sha1(password); // You need a SHA-1 hash function for this
    const prefix = hash.substring(0, 5);
    const suffix = hash.substring(5);

    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
    const data = await response.text();

    if (data.includes(suffix.toUpperCase())) {
        document.getElementById('pwned-status').innerText = "This password has been exposed in a data breach!";
        document.getElementById('pwned-status').classList.add('text-danger');
    } else {
        document.getElementById('pwned-status').innerText = "This password is safe.";
        document.getElementById('pwned-status').classList.add('text-success');
    }
}

// SHA-1 Hashing function (used in Pwned API)
function sha1(str) {
    const sha1 = new jsSHA("SHA-1", "TEXT");
    sha1.update(str);
    return sha1.getHash("HEX");
}
