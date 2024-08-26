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

localStorage.setItem('adminUsername', 'Jainee Shah');
localStorage.setItem('adminEmail', 'jaineeshah@gmail.com');
localStorage.setItem('adminPassword', 'jainee@123');

document.getElementById('registrationForm').addEventListener('submit', function(event) {
    event.preventDefault(); 

    const username = document.getElementById('username').value.trim(); 
    const email = document.getElementById('email').value.trim(); 
    const password = document.getElementById('password').value.trim();

    const adminUsername = localStorage.getItem('adminUsername');
    const adminEmail = localStorage.getItem('adminEmail');
    const adminPassword = localStorage.getItem('adminPassword');

  
    console.log('Entered Username:', `"${username}"`);
    console.log('Stored Admin Username:', `"${adminUsername}"`);
    console.log('Entered Email:', `"${email}"`);
    console.log('Stored Admin Email:', `"${adminEmail}"`);
    console.log('Entered Password:', `"${password}"`);
    console.log('Stored Admin Password:', `"${adminPassword}"`);

   
    if (username === adminUsername && email === adminEmail && password === adminPassword) {
        console.log('Admin credentials matched. Redirecting to admin dashboard.');
      
        window.location.href = "../admin/admin-dashboard.html";
    } else {
        console.log('Credentials do not match admin. Redirecting to home page.');
       
        window.location.href = "../pages/index.html";
    }
});
//register page ended
// cart.html 
// Example cart data - replace with real data or fetch from your backend
const cartItems = [
    { id: 1, name: "Resin Frame", price: 500, quantity: 1, customization: "" },
    { id: 2, name: "Vintage Frame", price: 800, quantity: 2, customization: "" },
    { id: 3, name: "Scrapbook", price: 1000, quantity: 1, customization: "" }
];

function renderCart() {
    const cartTableBody = document.querySelector("#cart tbody");
    const totalAmountEl = document.getElementById("total-amount");
    let totalAmount = 0;

    cartTableBody.innerHTML = ""; // Clear existing rows

    cartItems.forEach((item, index) => {
        const row = document.createElement("tr");

        const itemTotal = item.price * item.quantity;
        totalAmount += itemTotal;

        row.innerHTML = `
            <td>${item.name}</td>
            <td>₹${item.price}</td>
            <td>
                <input type="number" value="${item.quantity}" min="1" class="quantity" data-index="${index}">
            </td>
            <td>
                <input type="text" placeholder="Enter customizations" value="${item.customization}" class="customization" data-index="${index}">
            </td>
            <td>₹<span class="item-total">${itemTotal}</span></td>
            <td><button class="remove-btn" data-index="${index}">Remove</button></td>
        `;

        cartTableBody.appendChild(row);
    });

    totalAmountEl.textContent = totalAmount;
}

function updateCartItem(index, quantity, customization) {
    cartItems[index].quantity = quantity;
    cartItems[index].customization = customization;
    renderCart();
}

function removeCartItem(index) {
    cartItems.splice(index, 1);
    renderCart();
}

// Event Listeners
document.querySelector("#cart").addEventListener("input", (e) => {
    const index = e.target.dataset.index;

    if (e.target.classList.contains("quantity")) {
        const quantity = parseInt(e.target.value, 10);
        updateCartItem(index, quantity, cartItems[index].customization);
    } else if (e.target.classList.contains("customization")) {
        const customization = e.target.value;
        updateCartItem(index, cartItems[index].quantity, customization);
    }
});

document.querySelector("#cart").addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-btn")) {
        const index = e.target.dataset.index;
        removeCartItem(index);
    }
});

// Initialize cart on page load
renderCart();



