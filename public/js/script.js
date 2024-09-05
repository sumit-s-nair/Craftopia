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
 
