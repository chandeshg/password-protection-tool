document.getElementById("checkStrength").addEventListener("click", () => {
    const password = document.getElementById("password").value;

    if (!password) {
        alert("Please enter a password!");
        return;
    }

    // Call the backend API to check strength
    fetch(`/api/strength/${password}`)
        .then((response) => response.json())
        .then((data) => {
            const strengthLevels = [
                "Very Weak",
                "Weak",
                "Moderate",
                "Strong",
                "Very Strong",
            ];
            const result = strengthLevels[data.strength] || "Unknown";
            document.getElementById("strengthResult").textContent =
                `Password Strength: ${result}`;
        })
        .catch((err) => console.error("Error:", err));
});
