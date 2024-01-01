async function login(event) {
    event.preventDefault();
    const form = document.getElementById('loginForm');
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const result = await response.json();

        if (!result.success) {
            alert(result.message);
            return;
        }else{
            console.log("SUCCESSS")
            window.location.href = '/gallery';
        }
    } catch (error) {
        console.error('Error during login:', error);
    }
}
