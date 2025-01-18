// JavaScript
const tabs = document.querySelectorAll('.tab-button');
const contents = document.querySelectorAll('.tab-content');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(btn => btn.classList.remove('active'));
        tab.classList.add('active');

        contents.forEach(content => content.classList.remove('active'));
        document.getElementById(tab.dataset.tab).classList.add('active');
    });
});

document.querySelectorAll('.create-tab-button').forEach(button => {
  button.addEventListener('click', () => {
    // Remove active class from all create tabs and content
    document.querySelectorAll('.create-tab-button').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.create-tab-content').forEach(content => content.classList.remove('active'));
    
    // Add active class to clicked button
    button.classList.add('active');
    
    // Show corresponding content
    const tabId = button.getAttribute('data-createtab');
    document.getElementById(tabId).classList.add('active');
  });
});
// Add this after your existing code
function initializeQuantityCounters() {
  document.querySelectorAll('.quantity-counter').forEach(counter => {
    const minusBtn = counter.querySelector('.minus');
    const plusBtn = counter.querySelector('.plus');
    const input = counter.querySelector('.quantity-input');

    minusBtn.addEventListener('click', () => {
      const currentValue = parseInt(input.value);
      if (currentValue > 1) {
        input.value = currentValue - 1;
      }
    });

    plusBtn.addEventListener('click', () => {
      const currentValue = parseInt(input.value);
      if (currentValue < 99) {
        input.value = currentValue + 1;
      }
    });

    input.addEventListener('change', () => {
      let value = parseInt(input.value);
      if (isNaN(value) || value < 1) {
        input.value = 1;
      } else if (value > 99) {
        input.value = 99;
      }
    });
  });
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', initializeQuantityCounters);

const cartIcon = document.querySelector('.cart-icon');
const cart = document.querySelector('.cart');
const cartClose = document.querySelector('.cart_close');
const headerRight = document.querySelector('.header-right');

function toggleCart() {
  cart.classList.toggle('active');
  headerRight.classList.toggle('shifted');
}

cartIcon.addEventListener('click', toggleCart);
cartClose.addEventListener('click', toggleCart);

// Cart functionality
let cartItems = [];

// Load cart from cookies when page loads
document.addEventListener('DOMContentLoaded', () => {
  const savedCart = getCookie('cartItems');
  if (savedCart) {
    cartItems = JSON.parse(savedCart);
    updateCartDisplay();
    updateCartCount();
  }
});

// Add event listeners to all "Buy Now" buttons
document.querySelectorAll('.buy-now').forEach(button => {
  button.addEventListener('click', () => {
    const card = button.closest('.item-card');
    const name = card.querySelector('h3').textContent;
    const price = card.querySelector('p').textContent;
    const image = card.querySelector('img').src;
    const quantity = 1;  // Since we removed quantity selectors

    buyNow({
      name,
      price,
      image,
      quantity
    });
  });
});

function buyNow(item) {
  // Check if item already exists in cart
  const existingItem = cartItems.find(cartItem => cartItem.name === item.name);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cartItems.push(item);
  }
  
  // Save to cookie
  setCookie('cartItems', JSON.stringify(cartItems), 1);
  
  // Update display
  updateCartDisplay();
  updateCartCount();
}

function updateCartDisplay() {
  const listCart = document.querySelector('.listCart');
  listCart.innerHTML = '';
  
  if (cartItems.length === 0) {
    const emptyMessage = document.createElement('div');
    emptyMessage.className = 'cart-empty-message';
    emptyMessage.innerHTML = `
      <div class="empty-cart-icon">🛒</div>
      <p>Your cart is empty</p>
      <p class="empty-cart-subtitle">Add some delicious items to get started!</p>
    `;
    listCart.appendChild(emptyMessage);
    return;
  }
  
  cartItems.forEach(item => {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart_item';
    cartItem.innerHTML = `
      <img src="${item.image}">
      <div class="cart_content">
        <div class="cart_name">${item.name}</div>
        <div class="cart_price">${item.price}</div>
      </div>
      <div class="cart_quantity">
        <button class="decrease">-</button>
        <span class="cart_value">${item.quantity}</span>
        <button class="increase">+</button>
      </div>
    `;
    
    const decreaseBtn = cartItem.querySelector('.decrease');
    const increaseBtn = cartItem.querySelector('.increase');
    
    decreaseBtn.addEventListener('click', () => updateQuantity(item.name, -1));
    increaseBtn.addEventListener('click', () => updateQuantity(item.name, 1));
    
    listCart.appendChild(cartItem);
  });
}

function updateQuantity(itemName, change) {
  const item = cartItems.find(item => item.name === itemName);
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) {
      cartItems = cartItems.filter(item => item.name !== itemName);
    }
    setCookie('cartItems', JSON.stringify(cartItems), 1);
    updateCartDisplay();
    updateCartCount();
  }
}

function updateCartCount() {
  const cartCount = document.querySelector('.cart-count');
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;
}

// Cookie utilities
function setCookie(name, value, days) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}