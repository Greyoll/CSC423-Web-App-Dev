document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (!username || !password) {
        alert("Please enter both username and password");
        return;
    }

    try {
        const response = await fetch("/api/auth/login", {
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
        // Save role
        const userRole = data.role;

        let redirect = "index.html";
        // Redirect to proper index
        if (userRole === "admin") {
            redirect = "dashboardAdmin.html";
        }
        else if (userRole === "doctor") {
            redirect = "dashboardDoctor.html";
        }
        else if (userRole === "patient") {
            redirect = "dashboardPatient.html";
        }
       
        window.location.href = redirect;

    } catch (err) {
        console.error(err);
        alert("An error occurred. Check console.");
    }
});
