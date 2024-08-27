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
//product.html
let cartItems = [];


function addToCart(productName, productPrice) {
    
    const selectedOption = document.querySelector(`input[name="${productName}-size"]:checked`);

    if (selectedOption) {
        const item = {
            name: productName,
            size: selectedOption.value.split(": ")[0],
            price: parseFloat(selectedOption.value.split(": ")[1]),
            quantity: 1,
        };

        cartItems.push(item);

       
        localStorage.setItem('cartItems', JSON.stringify(cartItems));

       
        window.location.href = 'cart.html';
    } else {
        alert("Please select an option before adding to the cart.");
    }
}


document.querySelectorAll('.product button').forEach(button => {
    button.addEventListener('click', function() {
        const productName = this.parentElement.querySelector('p').textContent.trim();
        const productPrice = this.parentElement.querySelector('input[name^="product-"]').value;
        addToCart(productName, productPrice);
    });
});

//product.html ended

// cart.html 
function loadCartItems() {
    const cartTableBody = document.querySelector('#cart tbody');
    const storedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    let totalAmount = 0;

    
    cartTableBody.innerHTML = '';

    
    storedCartItems.forEach((item, index) => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${item.name} - ${item.size}</td>
            <td>&#8377;${item.price}</td>
            <td><input type="number" value="${item.quantity}" min="1" data-index="${index}" class="quantity-input"></td>
            <td><input type="text" placeholder="Enter customizations" class="customization-input" data-index="${index}"></td>
            <td>&#8377;<span class="item-total">${item.price * item.quantity}</span></td>
            <td><button data-index="${index}" class="remove-btn">Remove</button></td>
        `;

        cartTableBody.appendChild(row);

        totalAmount += item.price * item.quantity;
    });

    
    document.getElementById('total-amount').textContent = totalAmount;

    
    document.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', removeCartItem);
    });

    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', updateQuantity);
    });
}


function removeCartItem(event) {
    const index = event.target.dataset.index;
    cartItems.splice(index, 1);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    loadCartItems();
}


function updateQuantity(event) {
    const index = event.target.dataset.index;
    const newQuantity = parseInt(event.target.value);
    cartItems[index].quantity = newQuantity;
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    loadCartItems();
}

document.addEventListener('DOMContentLoaded', loadCartItems);
//cart.html ended

//order.html
document.addEventListener('DOMContentLoaded', () => {
    loadOrderSummary();
    loadShipmentTracking();

    // Handle order form submission
    const orderForm = document.getElementById('order-form');
    orderForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const address = document.getElementById('address').value;
        const phone = document.getElementById('phone').value;

        if (storedCartItems.length > 0) {
            // Save order items to local storage for tracking
            const orderId = generateOrderId();
            saveOrderItems(storedCartItems, orderId);

            // Update shipment tracking
            updateShipmentTracking(storedCartItems, orderId);

            // Clear cart items from local storage
            localStorage.removeItem('cartItems');

            // Redirect to payment page or show confirmation
            window.location.href = 'payment.html';
        } else {
            alert('Your cart is empty. Please add items to your cart before placing an order.');
        }
    });
});

function loadOrderSummary() {
    const orderTableBody = document.querySelector('#order-table tbody');
    const totalAmountEl = document.getElementById('total-amount');
    let totalAmount = 0;

    orderTableBody.innerHTML = '';

    storedCartItems.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name} - ${item.size}</td>
            <td>&#8377;${item.price}</td>
            <td>${item.quantity}</td>
            <td>&#8377;${item.price * item.quantity}</td>
        `;
        totalAmount += item.price * item.quantity;
        orderTableBody.appendChild(row);
    });

    totalAmountEl.textContent = totalAmount.toFixed(2);
}

function loadShipmentTracking() {
    const trackingTableBody = document.querySelector('#tracking-table tbody');
    const storedShipmentTracking = JSON.parse(localStorage.getItem('shipmentTracking')) || [];

    trackingTableBody.innerHTML = '';

    storedShipmentTracking.forEach(info => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${info.orderId}</td>
            <td>${info.product}</td>
            <td>${info.status}</td>
        `;
        trackingTableBody.appendChild(row);
    });
}

function saveOrderItems(orderItems, orderId) {
    const storedOrderItems = JSON.parse(localStorage.getItem('orderItems')) || [];
    orderItems.forEach(item => {
        item.orderId = orderId;
        storedOrderItems.push(item);
    });
    localStorage.setItem('orderItems', JSON.stringify(storedOrderItems));
}

function updateShipmentTracking(orderItems, orderId) {
    const storedShipmentTracking = JSON.parse(localStorage.getItem('shipmentTracking')) || [];
    orderItems.forEach(item => {
        const trackingInfo = {
            orderId: orderId,
            product: item.name,
            status: 'Processing'  // Default status, can be updated later
        };
        storedShipmentTracking.push(trackingInfo);
    });
    localStorage.setItem('shipmentTracking', JSON.stringify(storedShipmentTracking));
}

function generateOrderId() {
    return 'ORD' + Math.floor(Math.random() * 100000);
}
//order.html ended

//payment.html 
document.addEventListener('DOMContentLoaded', function () {
    const paymentForm = document.getElementById('Payment-Method');
    const paymentMethodSelect = document.getElementById('Payment');
    const orderConfirmation = document.getElementById('order-confirmation');

    paymentForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const selectedPaymentMethod = paymentMethodSelect.value;
        const paymentId = Date.now(); // Unique ID for the payment
        const userName = 'User Name'; // Replace with actual user name
        const userEmail = 'user@example.com'; // Replace with actual user email
        const amount = 500; // Replace with actual amount
        const paymentMehtod= 'UPI or cash or debit/credit'// Replace with actual method
        const date = new Date().toLocaleDateString();
        const status = 'Completed'; // Payment status

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

        // Store payment information in localStorage
        const paymentRecord = {
            paymentId,
            userName,
            userEmail,
            amount,
            paymentMehtod,
            date,
            status
        };
        let paymentRecords = JSON.parse(localStorage.getItem('paymentRecords')) || [];
        paymentRecords.push(paymentRecord);
        localStorage.setItem('paymentRecords', JSON.stringify(paymentRecords));

        paymentForm.classList.add('hidden');
        orderConfirmation.classList.remove('hidden');

        setTimeout(() => {
            localStorage.removeItem('cartItems');
            window.location.href = 'index.html';
        }, 3000);
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
document.addEventListener('DOMContentLoaded', function() {
    const customersTableBody = document.querySelector('#view-customers tbody');
    const orders = JSON.parse(localStorage.getItem('orders')) || [];

    const customers = {};

    orders.forEach(order => {
        if (!customers[order.phone]) {
            customers[order.phone] = {
                customerID: order.orderID, // Using orderID as a proxy for customer ID
                name: order.customerName,
                email: order.email || "N/A", // Assuming you store email, otherwise add an email field in order data
                phone: order.phone,
                address: order.address
            };
        }
    });

    Object.values(customers).forEach(customer => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${customer.customerID}</td>
            <td>${customer.name}</td>
            <td>${customer.email}</td>
            <td>${customer.phone}</td>
            <td>${customer.address}</td>
        `;
        customersTableBody.appendChild(row);
    });
});
//view-customers.html ended
//view-orders.html
document.addEventListener('DOMContentLoaded', function() {
    const ordersTableBody = document.querySelector('#view-orders tbody');
    const orders = JSON.parse(localStorage.getItem('orders')) || [];

    ordersTableBody.innerHTML = '';

    orders.forEach(order => {
        order.items.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${order.orderID}</td>
                <td>${order.customerName}</td>
                <td>${item.name} - ${item.size}</td>
                <td>${item.customization || "None"}</td>
                <td>&#8377;${item.price * item.quantity}</td>
            `;
            ordersTableBody.appendChild(row);
        });
    });
});
//view-orders.html ended
// admin payment.html 
document.addEventListener('DOMContentLoaded', () => {
    const paymentRecords = document.querySelectorAll('#payment-records tr');
    let totalBalance = 0;

    paymentRecords.forEach(record => {
        const amountCell = record.querySelector('td:nth-child(4)');
        if (amountCell) {
            const amount = parseFloat(amountCell.textContent.replace('₹', '').trim());
            if (!isNaN(amount)) {
                totalBalance += amount;
            }
        }
    });

    document.getElementById('total-balance').textContent = totalBalance.toFixed(2);
});
// admin payment.html ended
//admin chat and user chat 
q
// Import and configure Firebase
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Reference to the database
const database = firebase.database();

document.addEventListener('DOMContentLoaded', function() {
    const chatBox = document.getElementById('chat-box');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');

    // Reference to the chat messages in Firebase
    const chatRef = database.ref('chats');

    // Load existing messages
    chatRef.on('child_added', function(snapshot) {
        const message = snapshot.val();
        chatBox.innerHTML += `<p><strong>${message.sender}:</strong> ${message.text}</p>`;
        chatBox.scrollTop = chatBox.scrollHeight; 
    });

    // Handle send button click
    sendButton.addEventListener('click', function() {
        const messageText = messageInput.value.trim();
        if (messageText) {
            const sender = document.body.classList.contains('admin') ? 'Admin' : 'Customer';
            chatRef.push({ sender, text: messageText });
            messageInput.value = '';
        }
    });
});

// Ensure user is logged in
firebase.auth().onAuthStateChanged(function(user) {
    if (!user) {
        window.location.href = 'register.html'; // Redirect to login if not authenticated
    }
});


//admin chat and user chat ended
