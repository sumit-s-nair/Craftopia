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
                </ul>

            <div class="rightnav"> 
                <div class="search-container">

                <input type="text" id="SearchInput" placeholder="search the Products"onkeyup="filterProducts()">
                <button class="btn btn-sm">Search</button>

                    <div id="dropdownList" class="dropdown-content">
                    <a href="#">Resin Frames</a>
                    <a href="#">Vintage Frames</a>
                    <a href="#">Scrapbooks,GreetingCards</a>
                    <a href="#">Resin Keychain</a>
                    <a href="#">Resin Bookmarks</a>
                    <a href="#">Wallet Cards</a>
                    </div>
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
                        <a href="/cart"> add to cart</a>
                        <a href="/orders"> My Orders</a>
                        <a href="/help"> Chat </a>
                        <a href="/login">Login</a>
                    </ul>

                <div class="rightnav"> 
                    <div class="search-container">

                    <input type="text" id="SearchInput" placeholder="search the Products"onkeyup="filterProducts()">
                    <button class="btn btn-sm">Search</button>

                        <div id="dropdownList" class="dropdown-content">
                        <a href="#">Resin Frames</a>
                        <a href="#">Vintage Frames</a>
                        <a href="#">Scrapbooks,GreetingCards</a>
                        <a href="#">Resin Keychain</a>
                        <a href="#">Resin Bookmarks</a>
                        <a href="#">Wallet Cards</a>
                        </div>
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

customElements.define('user-header', UserHeader);
customElements.define('new-user-header', NewUserHeader);
customElements.define('user-footer', Footer);