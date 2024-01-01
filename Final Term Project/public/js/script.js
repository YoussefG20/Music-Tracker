
document.addEventListener("DOMContentLoaded", async function () {
    // Function to fetch random books from Google Books API
    async function fetchRandomBooks() {
        const response = await fetch("https://www.googleapis.com/books/v1/volumes?q=random&maxResults=10");
        const data = await response.json();
        return data.items.map(book => ({
            title: book.volumeInfo.title,
            author: book.volumeInfo.authors ? book.volumeInfo.authors.join(", ") : "Unknown Author",
            thumbnail: book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : "https://via.placeholder.com/150",
        }));
    }

    try {
        // Fetch random books
        const randomBooks = await fetchRandomBooks();

        // Compile the template
        const templateSource = document.getElementById("book-template").innerHTML;
        const template = Handlebars.compile(templateSource);

        // Render the template with the fetched books
        document.getElementById("bookGrid").innerHTML = template({ books: randomBooks });
    } catch (error) {
        console.error("Error fetching books:", error);
    }
});


async function fetchSearchBooks(searchQuery) {
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${searchQuery}&maxResults=10`);
    const data = await response.json();
    return data.items.map(book => ({
        title: book.volumeInfo.title,
        author: book.volumeInfo.authors ? book.volumeInfo.authors.join(", ") : "Unknown Author",
        thumbnail: book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : "https://via.placeholder.com/150",
    }));
}



async function handleSearch() {
    const searchInput = document.querySelector(".search-input");
    const searchQuery = searchInput.value.trim();

    if (searchQuery) {
        try {
            const SearchBooks = await fetchSearchBooks(searchQuery);
            const templateSource = document.getElementById("book-template").innerHTML;
            const template = Handlebars.compile(templateSource);
    
            // Render the template with the fetched books
            document.getElementById("bookGrid").innerHTML = template({ books: SearchBooks });
        } catch (error) {
            console.error("Error fetching books:", error);
        }
    }
}

const searchButton = document.querySelector(".search-button");
searchButton.addEventListener("click", handleSearch);


function createAdminButton() {
    

    // Create the button element
    const adminButton = document.createElement('button');
    adminButton.textContent = 'Admin Panel';
    adminButton.classList.add('admin-panel-button');

    // Append the button to the admin-button-container div in the navbar
    const adminButtonContainer = document.querySelector('.admin-button-container');
    adminButtonContainer.appendChild(adminButton);

    // Add an event listener or link this button to the admin panel
    adminButton.addEventListener('click', () => {
        window.location.href = '/admin';
    });
}

// Fetch the isAdmin status from the API
fetch('/isAdmin')
    .then(response => response.json())
    .then(data => {
        const isAdmin = data.isAdmin;
        if (isAdmin) {
            createAdminButton(isAdmin);
        }
    })
    .catch(error => {
        console.error('Error fetching isAdmin status:', error);
    });


