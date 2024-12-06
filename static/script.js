document.addEventListener('DOMContentLoaded', ()=> {
fetch('/api/menu')
    .then(response => response.json())
    .then(menu => {
        const menuContainer = document.getElementById('menu');
        menu.forEach(dish => {
            const dishElement = document.createElement('div');
            dishElement.className = 'menu-item';
            dishElement.innerHTML = `<h3>${dish.name}</h3>
                 <p>${dish.description}</p>
                 <p>Price: $${dish.price}</p>
                 <button onclick='addToCart("${dish.name}", ${dish.price}, 1)'>Add to Cart</button>`;
            menuContainer.appendChild(dishElement);
        });
    })
    .catch(error => {
    console.error('Failed to load menu', error)
    });
});

if (document.getElementById('cart-item')){
    fetch('/orders')
        .then(response => response.json())
        .then(orders => {
            const cartItemsContainer = document.getElementById('cart-item');
            const totalContainer = document.getElementById('total');
            let total =0;

            const currentOrder = orders.find(order => order.user_id === 1 && order.status === 'in progress');
            if (currentOrder && currentOrder.items.length > 0){
                cartItemsContainer.innerHTML = '';
                currentOrder.items.forEach(item => {
                    const cartItem = document.createElement('li');
                    cartItem.className = 'cart-item';
                    cartItem.innerHTML = `
                        <span>${item.dish.name} (x${item.quantity})</span>
                        <span>$${item.dish.price * item.quantity}</span>
                    `;
                    cartItemsContainer.appendChild(cartItem);
                    total += item.dish.price * item.quantity;
                });
                totalContainer.textContent = `Total: $${total}`;
                } else {
                cartItemsContainer.innerHTML = '<li>Cart is empty</li>';
                totalContainer.textContent = '';
                }
        });
};
//fetch - отправить запрос

function addToCart(dishName, dishPrice, quantity){
    fetch('/orders')
        .then(response => response.json())
        .then(orders => {
            let order = orders.find(order => order.user_id === 1 && order.status === 'in progress') || {user_id: 1, items: [], status: 'in progress'};
            const item = order.items.find(i => i.dish.name === dishName);
            if (item){
            item.quantity += quantity;
            } else {
            order.items.push({dish: {name: dishName, price: dishPrice}, quantity});
            }
            fetch('/update_order',{
                method: 'POST',
                headers: {'Content-type': 'application/json'},
                body: JSON.stringify(order),
            })
            .then(response => response.json())
            .then(data => {
                if(data.message === 'Success'){
                alert(`${dishName} added at cart`);
                } else {
                console.error('failed update order', data);
                }
            });
        });
}