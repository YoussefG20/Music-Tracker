async function signIn(event) {
    event.preventDefault();
    const form = document.getElementById('signInForm');
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    console.log(username);
    console.log(password);

    try {
        const response = await fetch('/signup', {
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
            window.location.href = '/';
        }
    } catch (error) {
        console.error('Error during sign-in:', error);
    }
}
