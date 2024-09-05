document.addEventListener('DOMContentLoaded', () => {
    const deleteButtons = document.querySelectorAll('.delete-btn');

    deleteButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            const productId = event.target.closest('.delete-btn').getAttribute('data-id');

            try {
                const response = await fetch(`/cart/remove/${productId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const result = await response.json();

                if (response.ok) {
                    event.target.closest('tr').remove();
                } else {
                    alert(result.message || 'Failed to remove item');
                }
            } catch (error) {
                console.error('Error removing item:', error);
                alert('An error occurred while removing the item');
            }
        });
    });
});
