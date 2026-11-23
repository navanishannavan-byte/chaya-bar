const drinks = [
    {
        id: 1,
        name: "cold coffee",
        price: 5.00,
        category: "Cold coffee is a chilled, creamy beverage made by blending instant coffee, milk, sugar, and ice to create a frothy, café‑style drink,",
        image: "images/cold coffee.jpeg"
    },
    { id: 2,
        name: "quesillo",
        price: 8.00,
        category: "Quesilo is a delicious, cheesy dish featuring a rich, creamy texture with a golden, melted cheese layer. Every bite delivers a satisfying combination of savoury flavours and smooth, cheesy goodness, making it perfect for cheese lovers.,",
        image: "quesillo.jpeg"
    },
   
];

// Shopping cart
let cart = JSON.parse(localStorage.getItem("chayaCart")) || [];

// Display drinks
function showDrinks() {
    const container = document.getElementById("products");
    const search = document.getElementById("search").value.toLowerCase();

    const filtered = drinks.filter(drink =>
        drink.name.toLowerCase().includes(search)
    );

    container.innerHTML = "";

    filtered.forEach(drink => {
        container.innerHTML += `
            <div class="product">
                <img src="${drink.image}" alt="${drink.name}">
                <h3>${drink.name}</h3>
                <p>RM ${drink.price.toFixed(2)}</p>
                <button onclick="addToCart(${drink.id})">
                    Add to Order
                </button>
            </div>
        `;
    });

    if (filtered.length === 0) {
        container.innerHTML = "<p>Drink not found.</p>";
    }
}

// Add drink to cart
function addToCart(id) {
    const drink = drinks.find(item => item.id === id);
    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({
            ...drink,
            quantity: 1
        });
    }

    saveCart();
    showCart();
}

// Save cart
function saveCart() {
    localStorage.setItem("chayaCart", JSON.stringify(cart));
}

// Display cart
function showCart() {
    const container = document.getElementById("cart-items");

    container.innerHTML = "";

    let total = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;

        container.innerHTML += `
            <div class="cart-item">
                <span>${item.name}</span>
                <span>${item.quantity} × RM ${item.price.toFixed(2)}</span>

                <div>
                    <button onclick="changeQuantity(${item.id}, -1)">−</button>
                    <button onclick="changeQuantity(${item.id}, 1)">+</button>
                    <button onclick="removeDrink(${item.id})">Remove</button>
                </div>
            </div>
        `;
    });

    document.getElementById("total").textContent = total.toFixed(2);
}

// Change quantity
function changeQuantity(id, amount) {
    const item = cart.find(drink => drink.id === id);

    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {
        removeDrink(id);
        return;
    }

    saveCart();
    showCart();
}

// Remove drink
function removeDrink(id) {
    cart = cart.filter(item => item.id !== id);

    saveCart();
    showCart();
}

// Search drinks
document.getElementById("search")
    .addEventListener("input", showDrinks);

// WhatsApp checkout
function checkout() {
    if (cart.length === 0) {
        alert("Please add a drink first!");
        return;
    }

    // Replace with the shop's actual WhatsApp number
    const SHOP_WHATSAPP = "60169095327";

    let message = "Hello CHAYA BAR! I would like to order:\n\n";

    cart.forEach(item => {
        message += `${item.name} x ${item.quantity} - RM ${(item.price * item.quantity).toFixed(2)}\n`;
    });

    message += "\nTotal: RM " +
        document.getElementById("total").textContent;

    message += "\n\nPlease confirm my order. Thank you!";

    const url = "https://wa.me/" +
        SHOP_WHATSAPP +
        "?text=" +
        encodeURIComponent(message);

    window.open(url, "_blank");
}

// Start website
showDrinks();
showCart();
