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
// amdin-dashboard.html
document.addEventListener('DOMContentLoaded', function () {
    const welcomeMessage = document.querySelector('main h2');
    const manageProductsLink = document.querySelector('nav a[href="../admin/add-product.html"]');
    const viewOrdersLink = document.querySelector('nav a[href="../admin/view-orders.html"]');
    const viewCustomersLink = document.querySelector('nav a[href="../admin/view-customers.html"]');

   
    welcomeMessage.textContent = `Welcome, Admin!`;

    
    manageProductsLink.title = 'Add new products to the inventory';
    viewOrdersLink.title = 'View and manage all customer orders';
    viewCustomersLink.title = 'View customer details and manage their accounts';

    
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000); 
    }

    
    showNotification('Welcome to the Admin Dashboard!', 'info');
});
//admin-dashboard.html ended

//add product.html
document.addEventListener('DOMContentLoaded', function () {
    const addProductForm = document.getElementById('addProductForm');
    const productNameInput = addProductForm.querySelector('input[placeholder="Product Name"]');
    const descriptionInput = addProductForm.querySelector('input[placeholder="Description"]');
    const priceInput = addProductForm.querySelector('input[placeholder="₹"]');
    const imageInput = addProductForm.querySelector('input[type="file"]');
    const videoInput = document.getElementById('videoUpload');

    
    function validateForm() {
        const name = productNameInput.value.trim();
        const description = descriptionInput.value.trim();
        const price = priceInput.value.trim();
        const image = imageInput.files[0];
        const video = videoInput.files[0];

        if (!name || !description || !price || !image) {
            alert('Please fill out all required fields and upload an image.');
            return false;
        }

        if (video && video.size > 5 * 1024 * 1024) { // 5 MB limit for video files
            alert('Video file size should be less than 5 MB.');
            return false;
        }

        return true;
    }

    
    function previewImage() {
        const file = imageInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const imagePreview = document.createElement('img');
                imagePreview.src = e.target.result;
                imagePreview.style.maxWidth = '200px';
                imagePreview.style.marginTop = '10px';
                imagePreview.id = 'imagePreview';

                const existingPreview = document.getElementById('imagePreview');
                if (existingPreview) {
                    existingPreview.remove();
                }
                
                addProductForm.appendChild(imagePreview);
            };
            reader.readAsDataURL(file);
        }
    }

   
    function previewVideo() {
        const file = videoInput.files[0];
        if (file) {
            const videoPreview = document.createElement('video');
            videoPreview.controls = true;
            videoPreview.style.maxWidth = '300px';
            videoPreview.style.marginTop = '10px';
            videoPreview.id = 'videoPreview';

            const videoSource = document.createElement('source');
            videoSource.src = URL.createObjectURL(file);
            videoSource.type = file.type;

            videoPreview.appendChild(videoSource);

            const existingPreview = document.getElementById('videoPreview');
            if (existingPreview) {
                existingPreview.remove();
            }

            addProductForm.appendChild(videoPreview);
        }
    }

    
    imageInput.addEventListener('change', previewImage);
    videoInput.addEventListener('change', previewVideo);

    addProductForm.addEventListener('submit', function (event) {
        event.preventDefault();

        if (validateForm()) {
            
            alert('Product added successfully!');
            addProductForm.reset(); 
            const imagePreview = document.getElementById('imagePreview');
            const videoPreview = document.getElementById('videoPreview');
            if (imagePreview) {
                imagePreview.remove(); 
            }
            if (videoPreview) {
                videoPreview.remove(); 
            }
        }
    });
});
//add product.html ended
//view-customers.html
document.addEventListener('DOMContentLoaded', function () {
    // Example customer data (in a real application, this would come from a database)
    const customers = [
        { name: 'Alice Johnson', email: 'alice@example.com', totalOrders: 12 },
        { name: 'Bob Smith', email: 'bob@example.com', totalOrders: 7 },
        { name: 'Charlie Brown', email: 'charlie@example.com', totalOrders: 5 }
    ];

    const mainSection = document.querySelector('main');
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search Customers';
    searchInput.id = 'searchInput';
    mainSection.insertBefore(searchInput, mainSection.firstChild);

    function renderCustomers(customerList) {
        mainSection.querySelectorAll('.customer').forEach(cust => cust.remove()); 

        customerList.forEach(customer => {
            const customerDiv = document.createElement('div');
            customerDiv.className = 'customer';
            customerDiv.innerHTML = `
                <h3>${customer.name}</h3>
                <p>Email: ${customer.email}</p>
                <p>Total Orders: ${customer.totalOrders}</p>
            `;
            mainSection.appendChild(customerDiv);
        });
    }

    
    renderCustomers(customers);

   
    searchInput.addEventListener('input', function () {
        const query = searchInput.value.toLowerCase();
        const filteredCustomers = customers.filter(customer =>
            customer.name.toLowerCase().includes(query) || 
            customer.email.toLowerCase().includes(query)
        );
        renderCustomers(filteredCustomers);
    });
});
//view-customers.html ended
//view-orders.html
document.addEventListener('DOMContentLoaded', function () {
    // Example order data (in a real application, this would come from a database)
    const orders = [
        { id: '001', customerName: 'Alice Johnson', totalAmount: '₹1500', details: 'Order placed on 2024-08-25' },
        { id: '002', customerName: 'Bob Smith', totalAmount: '₹800', details: 'Order placed on 2024-08-24' },
        { id: '003', customerName: 'Charlie Brown', totalAmount: '₹1200', details: 'Order placed on 2024-08-23' }
    ];

    const tableBody = document.querySelector('#view-orders tbody');

    function renderOrders(orderList) {
        tableBody.innerHTML = ''; 

        orderList.forEach(order => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${order.id}</td>
                <td>${order.customerName}</td>
                <td>${order.totalAmount}</td>
                <td><button class="details-btn" data-id="${order.id}">View Details</button></td>
            `;
            tableBody.appendChild(row);
        });
    }

    // Initial render of all orders
    renderOrders(orders);

    // Event delegation for details button
    tableBody.addEventListener('click', function (event) {
        if (event.target.classList.contains('details-btn')) {
            const orderId = event.target.getAttribute('data-id');
            const order = orders.find(o => o.id === orderId);
            if (order) {
                alert(`Order Details:\n\nID: ${order.id}\nCustomer Name: ${order.customerName}\nTotal Amount: ${order.totalAmount}\nDetails: ${order.details}`);
            }
        }
    });
});
//view-orders.html ended





