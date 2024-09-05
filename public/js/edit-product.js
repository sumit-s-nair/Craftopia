document.getElementById('editProductForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const productId = document.getElementById('productId').value;
    const formData = new FormData(this); // Collect form data, including file upload
    
    try {
        const response = await fetch(`/admin/products/edit/${productId}`, {
            method: 'PUT',
            body: formData
        });

        if (response.ok) {
            alert('Product updated successfully');
            window.location.href = '/admin/dashboard'; // Redirect on success
        } else {
            const error = await response.text();
            alert(`Failed to update product: ${error}`);
        }
    } catch (error) {
        console.error('Error updating product:', error);
        alert('Failed to update product due to a network error');
    }
});