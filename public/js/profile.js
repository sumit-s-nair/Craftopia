document.getElementById('orders-btn').addEventListener('click', function() {
    const ordersSection = document.getElementById('orders-section');
    const securitySection = document.getElementById('security-section');

    if (ordersSection.classList.contains('hide')) {
        ordersSection.classList.remove('hide');
        securitySection.classList.add('hide');
    }
});

document.getElementById('security-btn').addEventListener('click', function() {
    const ordersSection = document.getElementById('orders-section');
    const securitySection = document.getElementById('security-section');

    if (securitySection.classList.contains('hide')) {
        securitySection.classList.remove('hide');
        ordersSection.classList.add('hide');
    }
});

document.getElementById('edit-user-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    const data = {
        name,
        email,
        currentPassword,
        newPassword,
        confirmPassword
    };

    try {
        const response = await fetch('/user/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json(); 

        // Update the message element with the server response
        const messageElement = document.getElementById('message');
        messageElement.textContent = result.message || 'Unknown error';
        messageElement.className = response.ok ? 'success' : 'error';

        if (response.ok) {
            window.location.reload(); // Refresh the page if successful
        }

    } catch (error) {
        console.error('Error updating profile:', error);
        const messageElement = document.getElementById('message');
        messageElement.textContent = 'Failed to update profile due to a network error';
        messageElement.className = 'error';
    }
});
