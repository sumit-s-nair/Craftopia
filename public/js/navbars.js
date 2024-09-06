class UserHeader extends HTMLElement {
    connectedCallback(){
        this.innerHTML = `
        <header>
            <nav class="navbar">

                <ul class="nav-list">
                <div class="logo"><img src="/assets/images/logo.jpeg" width="50px" alt="logo"></div>
                
                <div class="tagline"><h2 class="tagline">Craftopia </h2></div>
                <a href="/">Home</a>
                <a href="/cart">Cart</a>
                <a href="/products">Products</a>
                <a href="/profile">Profile</a>

                </ul>

                <div class="rightnav"> 
                    <div class="logout">
                    <button class="btn btn-sm" id="logout">Logout</button>
                    </div>
                </div>  
        </header>`
    }
}

class NewUserHeader extends HTMLElement {
    connectedCallback(){
        this.innerHTML = `
            <header>
                <nav class="navbar">

                    <ul class="nav-list">
                        <div class="logo"><img src="/assets/images/logo.jpeg" width="50px" alt="logo"></div>
                        <div class="tagline"><h2 class="tagline">Craftopia </h2></div>

                        <a href="/">Home</a>
                        <a href="/products">Products</a>
                    </ul>

                <div class="rightnav"> 
                    <div class="login">
                    <button class="btn btn-sm" id="login">Login</button>
                    </div>
                </div>  
            </nav>
        </header>`
    }
}

class Footer extends HTMLElement {
    connectedCallback(){
        this.innerHTML = `
            <footer>
                &copy; 2024 Handmade Crafts - Craftopia | 
                <a href="https://www.instagram.com/craftopia08?igsh=M3kybDgxMGE4YjRp" target="_blank">Follow us on Instagram</a> | 
                Contact us: +91-1234567890
            </footer>`
    }
}

class AdminHeader extends HTMLElement {
    connectedCallback(){
        this.innerHTML =`
            <header>
                <h1>Admin Dashboard</h1>
                <nav class="navbar">

                    <ul class="nav-list">
                        <div class="logo"><img src="/assets/images/logo.jpeg" width="50px" alt="logo"></div>

                        <a href="/admin/dashboard">Dashboard</a>
                        <a href="/admin/add-product">Add Product</a>
                        <a href="/admin/view-orders">View Orders</a>
                        <a href="/admin/view-customers">View Customers</a>
                        <a href="/admin/payments">Payment Received</a>
                    </ul>
                    <div class="rightnav"> 
                        <div class="logout">
                        <button class="btn btn-sm" id="admin-logout">Logout</button>
                        </div>
                    </div> 
            </header>`
    }
}

customElements.define('user-header', UserHeader);
customElements.define('new-user-header', NewUserHeader);
customElements.define('user-footer', Footer);
customElements.define('admin-header', AdminHeader);

document.addEventListener('DOMContentLoaded', () => {
    // Handle Logout Button Click
    const logoutButton = document.getElementById('logout');
    if (logoutButton) {
        logoutButton.addEventListener('click', async () => {
            try {
                const response = await fetch('/logout', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    window.location.href = '/';
                } else {
                    alert('Logout failed. Please try again.');
                }
            } catch (error) {
                console.error('Error during logout:', error);
                alert('Logout failed. Please try again.');
            }
        });
    }

    const adminlogoutButton = document.getElementById('admin-logout');
    if (adminlogoutButton) {
        adminlogoutButton.addEventListener('click', async () => {
            try {
                const response = await fetch('/admin/logout', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    window.location.href = '/';
                } else {
                    alert('Logout failed. Please try again.');
                }
            } catch (error) {
                console.error('Error during logout:', error);
                alert('Logout failed. Please try again.');
            }
        });
    }

    // Handle Login Button Click
    const loginButton = document.getElementById('login');
    if (loginButton) {
        loginButton.addEventListener('click', () => {
            window.location.href = '/login'; 
        });
    }
});
