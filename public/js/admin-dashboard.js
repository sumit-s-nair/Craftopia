document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', async () => {
            const productId = button.getAttribute('data-id');
            try {
                const response = await fetch(`/admin/products/delete/${productId}`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    alert('Product deleted successfully!');
                    location.reload(); 
                } else {
                    alert('Failed to delete product');
                }
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        });
    });

    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.getAttribute('data-id');
            window.location.href = `/admin/products/edit/${productId}`;
        });
    });
});
