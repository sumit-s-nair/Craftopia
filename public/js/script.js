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
document.addEventListener('DOMContentLoaded', function() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const cartTableBody = document.querySelector('#cart tbody');
    const totalAmountElement = document.getElementById('total-amount');

    function updateCart() {
        cartTableBody.innerHTML = '';
        let totalAmount = 0;

        cartItems.forEach((item, index) => {
            const row = document.createElement('tr');

            // Product name
            const productNameCell = document.createElement('td');
            productNameCell.textContent = item.product;
            row.appendChild(productNameCell);

            // Price
            const priceCell = document.createElement('td');
            priceCell.textContent = `₹${item.price}`;
            row.appendChild(priceCell);

            // Quantity
            const quantityCell = document.createElement('td');
            const quantityInput = document.createElement('input');
            quantityInput.type = 'number';
            quantityInput.value = item.quantity;
            quantityInput.min = 1;
            quantityInput.addEventListener('change', () => updateQuantity(index, quantityInput.value));
            quantityCell.appendChild(quantityInput);
            row.appendChild(quantityCell);

            // Customization
            const customizationCell = document.createElement('td');
            const customizationInput = document.createElement('input');
            customizationInput.type = 'text';
            customizationInput.value = item.customization || '';
            customizationInput.placeholder = 'Enter customization details';
            customizationInput.addEventListener('input', () => updateCustomization(index, customizationInput.value));
            customizationCell.appendChild(customizationInput);
            row.appendChild(customizationCell);

            // Total
            const totalCell = document.createElement('td');
            const itemTotal = item.price * item.quantity;
            totalCell.textContent = `₹${itemTotal}`;
            row.appendChild(totalCell);

            // Remove button
            const removeCell = document.createElement('td');
            const removeButton = document.createElement('button');
            removeButton.textContent = 'Remove';
            removeButton.addEventListener('click', () => removeItem(index));
            removeCell.appendChild(removeButton);
            row.appendChild(removeCell);

            cartTableBody.appendChild(row);

            totalAmount += itemTotal;
        });

        totalAmountElement.textContent = totalAmount;
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }

    function updateQuantity(index, quantity) {
        cartItems[index].quantity = parseInt(quantity);
        updateCart();
    }

    function updateCustomization(index, customization) {
        cartItems[index].customization = customization;
        updateCart();
    }

    function removeItem(index) {
        cartItems.splice(index, 1);
        updateCart();
    }

    document.getElementById('order-form').addEventListener('submit', function(event) {
        event.preventDefault();
        alert('Order placed successfully!');
        localStorage.removeItem('cartItems');
        window.location.href = 'payment.html';
    });

    updateCart();
});
//cart.html ended

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
 
