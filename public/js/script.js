document.addEventListener("DOMContentLoaded", function() {
    const textArray = [
        "Think of Gifts, Think of Craftopia.",
        "Elevating Emotions, Cultivating Passion."
    ];
    let textIndex = 0;
    let charIndex = 0;
    const speed = 100; // typing speed in milliseconds

    const typedText = document.getElementById('typedText');
    const cursor = document.createElement('span');
    cursor.className = 'typed-cursor';
    cursor.innerHTML = '|';
    typedText.appendChild(cursor);

    function type() {
        if (charIndex < textArray[textIndex].length) {
            typedText.textContent = textArray[textIndex].substring(0, charIndex + 1);
            charIndex++;
            setTimeout(type, speed);
        } else {
            setTimeout(erase, 2000); // Wait before starting to erase
        }
    }

    function erase() {
        if (charIndex > 0) {
            typedText.textContent = textArray[textIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, speed / 2); // Erase faster than typing
        } else {
            textIndex = (textIndex + 1) % textArray.length; // Move to the next phrase
            setTimeout(type, 500); // Start typing again after a short delay
        }
    }

    // Start the typing effect
    type();

    function search() {
        var searchQuery = document.getElementById("Search").value;
        window.location.href = "search-results.html?query=" + encodeURIComponent(searchQuery);
    }

    var video = document.getElementById("myvideo");
    video.playbackRate = 3.5;
});


document.addEventListener('DOMContentLoaded', function() {
    function filterProducts() {
        let input = document.getElementById('searchInput');
        let filter = input.value.toLowerCase();
        let dropdown = document.getElementById('dropdownList');
        let links = dropdown.getElementsByTagName('a');
    
        // Show the dropdown if there is any input
        if (filter) {
            dropdown.classList.add("show");
        } else {
            dropdown.classList.remove("show");
        }
    
        // Loop through all list items, and hide those who don't match the search query
        for (let i = 0; i < links.length; i++) {
            let txtValue = links[i].textContent || links[i].innerText;
            if (txtValue.toLowerCase().indexOf(filter) > -1) {
                links[i].style.display = "";
            } else {
                links[i].style.display = "none";
            }
        }
    }
});

//register page 
document.getElementById('registrationForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting normally

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Retrieve the stored admin credentials from localStorage
    const adminUsername = localStorage.getItem('adminUsername');
    const adminEmail = localStorage.getItem('adminEmail');
    const adminPassword = localStorage.getItem('adminPassword');


    // Check if the entered credentials match the admin credentials
    if (username === adminUsername && email === adminEmail && password === adminPassword) {
        // Redirect to the admin dashboard
        window.location.href = "../admin/admin-dashboard.html";
    } else {
        // Otherwise, assume it's a regular user and redirect to the home page
        window.location.href = "../pages/index.html";
    }
});
//register page ended
