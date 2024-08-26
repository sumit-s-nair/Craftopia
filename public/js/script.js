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
//signup.html
document.getElementById('signupForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    var usernameInput = document.getElementById('username');
    var emailInput = document.getElementById('email');
    var passwordInput = document.getElementById('password');
    var confirmPasswordInput = document.getElementById('confirm-password');
    var messageElement = document.getElementById('message');

    // Clear previous messages
    messageElement.textContent = '';

    // Basic validation
    if (!validateEmail(emailInput.value)) {
        messageElement.textContent = 'Please enter a valid email address.';
        messageElement.style.color = 'red';
        return;
    }

    if (passwordInput.value.length < 8) {
        messageElement.textContent = 'Password must be at least 8 characters long.';
        messageElement.style.color = 'red';
        return;
    }

    if (passwordInput.value !== confirmPasswordInput.value) {
        messageElement.textContent = 'Passwords do not match. Please try again.';
        messageElement.style.color = 'red';
        return;
    }

    // If all validations pass, simulate successful signup
    messageElement.textContent = 'Sign up successful! Welcome, ' + usernameInput.value + '!';
    messageElement.style.color = 'green';

    // Reset form fields
    usernameInput.value = '';
    emailInput.value = '';
    passwordInput.value = '';
    confirmPasswordInput.value = '';
});
//signup.html ended
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
//forgot password 
document.getElementById('forgotPasswordForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    var emailInput = document.getElementById('email');
    var email = emailInput.value;
    var messageElement = document.getElementById('message');

    if (validateEmail(email)) {
        // Simulate sending reset password link
        messageElement.textContent = 'A reset password link has been sent to ' + email + '.';
        messageElement.style.color = 'green';
    } else {
        // Display error message
        messageElement.textContent = 'Please enter a valid email address.';
        messageElement.style.color = 'red';
    }
});

// Function to validate email
function validateEmail(email) {
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}
//forgot password ended

// cart.html 
// Example cart data - replace with real data or fetch from your backend
const cartItems = [
    { id: 1, name: "Resin Frame", price: 500, quantity: 1, customization: "" },
    { id: 2, name: "Vintage Frame", price: 400, quantity: 2, customization: "" },
    { id: 3, name: "Scrapbook", price: 250, quantity: 1, customization: "" }
];

function renderCart() {
    const cartTableBody = document.querySelector("#cart tbody");
    const totalAmountEl = document.getElementById("total-amount");
    let totalAmount = 0;

    cartTableBody.innerHTML = ""; 

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

renderCart();
//cart.html ended

//order.html

function calculateTotal() {
    let totalAmount = 0;
    cartItems.forEach(item => {
        totalAmount += item.quantity * item.price;
    });
    return totalAmount;
}


function generateOrderSummary() {
    const orderTableBody = document.querySelector('#order-table tbody');
    orderTableBody.innerHTML = ''; 

    cartItems.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.product}</td>
            <td>${item.quantity}</td>
            <td>&#8377;${item.price.toFixed(2)}</td>
            <td>&#8377;${(item.quantity * item.price).toFixed(2)}</td>
        `;
        orderTableBody.appendChild(row);
    });

    
    document.getElementById('total-amount').textContent = calculateTotal().toFixed(2);
}


document.getElementById('order-form').addEventListener('submit', function(event) {
    event.preventDefault(); 

    const name = document.getElementById('name').value.trim();
    const address = document.getElementById('address').value.trim();
    const phone = document.getElementById('phone').value.trim();

    
    if (name === '' || address === '' || phone === '') {
        alert('Please fill in all the fields.');
        return;
    }

    alert('Order placed successfully!');
    window.location.href = '../pages/payment.html';
});

generateOrderSummary();
//order.html ended

//payment.html 
document.addEventListener('DOMContentLoaded', function () {
    const paymentForm = document.getElementById('Payment-Method');
    const paymentMethodSelect = document.getElementById('Payment');
    const orderConfirmation = document.getElementById('order-confirmation');

    paymentForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const selectedPaymentMethod = paymentMethodSelect.value;

        
        if (selectedPaymentMethod === 'cod') {
            alert('Cash on Delivery selected. You can pay when the product is delivered.');
        } else if (selectedPaymentMethod === 'upi') {
            const upiId = prompt('Please enter your UPI ID for payment:');
            if (upiId) {
                alert('UPI payment initiated. Please approve the transaction.');
            } else {
                alert('UPI payment canceled.');
                return;
            }
        } else if (selectedPaymentMethod === 'card') {
            const cardNumber = prompt('Please enter your Credit/Debit Card number:');
            if (cardNumber) {
                alert('Card payment processing...');
            } else {
                alert('Card payment canceled.');
                return;
            }
        }

        paymentForm.classList.add('hidden');
        orderConfirmation.classList.remove('hidden');
    });
});
//payment.html ended



