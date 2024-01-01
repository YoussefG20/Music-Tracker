document.addEventListener("DOMContentLoaded", async function () {
    // Fetch users from the server using the new endpoint
    const users = await fetch('/api/users').then(response => response.json());
    console.log(users);

    // Compile the user template
    const userTemplateSource = document.getElementById("user-template").innerHTML;
    const userTemplate = Handlebars.compile(userTemplateSource);

    // Render the user template with the users data
    document.getElementById("userGrid").innerHTML = userTemplate({ users });
});