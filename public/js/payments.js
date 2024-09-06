document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch('/payments'); // Adjust the route if necessary
        const payments = await response.json();

        let totalBalance = 0;
        const paymentRecords = document.getElementById('payment-records');

        payments.forEach(payment => {
            const amount = payment.totalAmount ? payment.totalAmount : 0;
            totalBalance += amount;

            const paymentRow = document.createElement('tr');
            paymentRow.innerHTML = `
                <td>${payment._id || 'N/A'}</td>
                <td>${payment.user?.name || 'N/A'}</td>
                <td>${payment.user?.email || 'N/A'}</td>
                <td>₹${amount.toFixed(2)}</td>
                <td>${payment.paymentMethod || 'N/A'}</td>
                <td>${new Date(payment.createdAt).toLocaleDateString() || 'N/A'}</td>
                <td>${payment.status || 'N/A'}</td>
            `;
            paymentRecords.appendChild(paymentRow);
        });

        document.getElementById('total-balance').textContent = totalBalance.toFixed(2);
    } catch (error) {
        console.error('Error fetching payment data:', error);
    }
});
