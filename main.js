// Cart System
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM Elements
const cartBtn = document.getElementById('cartBtn');
const cartModal = document.getElementById('cartModal');
const closeBtn = cartModal.querySelector('.close');
const cartItemsContainer = document.getElementById('cartItems');
const cartCounter = document.getElementById('cartCounter');
const checkoutBtn = document.getElementById('checkoutBtn');

// Update cart counter
function updateCartCounter() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    cartCounter.textContent = count;
}

// Add to cart function
function addToCart(productName, price, image) {
    const existingItem = cart.find(item => item.name === productName);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            name: productName,
            price: price,
            image: image,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartCounter();
    showCartNotification(productName);
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Show "Added to cart" notification
function showCartNotification(productName) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = `${productName} added to cart!`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 2000);
    }, 10);
}

// Render cart items
function renderCart() {
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <p>Your cart is empty</p>
            </div>
        `;
        return;
    }

    cartItemsContainer.innerHTML = '';
    let total = 0;
    
    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <span class="cart-item-name">${item.name}</span>
                <span class="cart-item-price">৳${item.price}</span>
                <div class="cart-item-quantity">
                    <button class="quantity-btn minus" data-index="${index}">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn plus" data-index="${index}">+</button>
                </div>
            </div>
            <button class="remove-item" data-index="${index}">×</button>
        `;
        
        cartItemsContainer.appendChild(cartItem);
    });
    
    document.getElementById('cartTotal').innerHTML = `
        <span>Total:</span>
        <span>৳${total}</span>
    `;
}

// Initialize event listeners
function init() {
    updateCartCounter();
    
    // Add to cart buttons
    document.querySelectorAll('.brk-card h3 a').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const card = button.closest('.brk-card');
            const name = card.querySelector('h3:nth-of-type(1)').textContent;
            const price = parseInt(card.querySelector('h3:nth-of-type(2)').textContent.replace(/\D/g, ''));
            const image = card.querySelector('img').src;
            
            addToCart(name, price, image);
        });
    });
    
    // Cart modal toggle
    cartBtn.addEventListener('click', () => {
        renderCart();
        cartModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });
    
    closeBtn.addEventListener('click', () => {
        cartModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Cart item interactions
    document.addEventListener('click', (e) => {
        // Remove item
        if (e.target.classList.contains('remove-item')) {
            const index = e.target.dataset.index;
            cart.splice(index, 1);
            saveCart();
            updateCartCounter();
            renderCart();
        }
        
        // Decrease quantity
        if (e.target.classList.contains('minus')) {
            const index = e.target.dataset.index;
            if (cart[index].quantity > 1) {
                cart[index].quantity--;
            } else {
                cart.splice(index, 1);
            }
            saveCart();
            updateCartCounter();
            renderCart();
        }
        
        // Increase quantity
        if (e.target.classList.contains('plus')) {
            const index = e.target.dataset.index;
            cart[index].quantity++;
            saveCart();
            updateCartCounter();
            renderCart();
        }
    });
    
    // Checkout button
    checkoutBtn.addEventListener('click', () => {
        alert('Proceeding to checkout!');
        // In a real app, you would redirect to checkout page
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        document.querySelector('.container').classList.toggle('scrolled', window.scrollY > 50);
    });
}

// Initialize the app
document.addEventListener('DOMContentLoaded', init);
// Checkout button
checkoutBtn.addEventListener('click', () => {
    // Show processing state
    checkoutBtn.classList.add('processing');
    checkoutBtn.textContent = 'Processing...';
    
    // Simulate payment processing (2 seconds)
    setTimeout(() => {
        // Show success
        checkoutBtn.classList.remove('processing');
        checkoutBtn.classList.add('success');
        checkoutBtn.textContent = 'Payment Successful!';
        
        // Show payment confirmation modal
        const paymentModal = document.getElementById('paymentModal');
        paymentModal.style.display = 'block';
        
        // Close cart modal
        cartModal.style.display = 'none';
        
        // Reset cart
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCounter();
        
        // Reset button after animation
        setTimeout(() => {
            checkoutBtn.classList.remove('success');
            checkoutBtn.textContent = 'Proceed to Checkout';
        }, 2000);
        
    }, 2000);
});

// Close payment modal
document.getElementById('closePaymentBtn').addEventListener('click', () => {
    document.getElementById('paymentModal').style.display = 'none';
    document.body.style.overflow = 'auto';
});