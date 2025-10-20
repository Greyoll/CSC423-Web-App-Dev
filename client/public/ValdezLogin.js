document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (!username || !password) {
        alert("Please enter both username and password");
        return;
    }

    try {
        const response = await fetch("/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
            const text = await response.text();
            alert("Login failed: " + text);
            return;
        }

        const data = await response.json();
        // Save JWT
        localStorage.setItem("token", data.token);
        // Redirect to ValdezHome.html
        window.location.href = "ValdezHome.html";

    } catch (err) {
        console.error(err);
        alert("An error occurred. Check console.");
    }
});
