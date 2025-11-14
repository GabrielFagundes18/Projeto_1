let cart = [];
const cartTotalElement = document.getElementById("cart-total-value");
const cartListElement = document.getElementById("cart-items-list");
const checkoutAlert = document.getElementById("checkout-alert");

function selectSize(button, itemName, price, size) {
  const itemCard = button.closest(".item-card");

  itemCard
    .querySelectorAll(".size-selector button")
    .forEach((btn) => btn.classList.remove("selected"));
  button.classList.add("selected");

  const newPrice = parseFloat(price);
  itemCard.querySelector(".item-price").textContent = `R$ ${newPrice.toFixed(
    2
  )}`;
  itemCard.dataset.price = newPrice;
  itemCard.dataset.name = `${itemName} (${size})`;
}

function addItemToCart(name, price) {
  const itemCard = event.target.closest(".item-card");
  let finalName = name;
  let finalPrice = price;

  if (itemCard.querySelector(".size-selector")) {
    finalName = itemCard.dataset.name;
    finalPrice = parseFloat(itemCard.dataset.price);
  }

  if (finalPrice === undefined || isNaN(finalPrice)) {
    finalPrice = parseFloat(itemCard.dataset.price);
  }

  finalPrice = parseFloat(finalPrice.toFixed(2));

  const existingItem = cart.find((item) => item.name === finalName);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ name: finalName, price: finalPrice, quantity: 1 });
  }

  updateCartDisplay();
}

function removeItemFromCart(itemName) {
  const index = cart.findIndex((item) => item.name === itemName);
  if (index !== -1) {
    cart[index].quantity -= 1;
    if (cart[index].quantity <= 0) {
      cart.splice(index, 1);
    }
  }
  updateCartDisplay();
}

function updateCartDisplay() {
  cartListElement.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    cartListElement.innerHTML =
      '<li><i class="fas fa-box-open"></i> O carrinho está vazio!</li>';
  }

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const listItem = document.createElement("li");
    const safeItemName = item.name.replace(/'/g, "\\'");
    listItem.innerHTML = `
                    <span>${item.quantity}x ${item.name}</span>
                    <span>
                        R$ ${itemTotal.toFixed(2)}
                        <button class="remove-item" onclick="removeItemFromCart('${safeItemName}')"><i class="fas fa-times"></i></button>
                    </span>
                `;
    cartListElement.appendChild(listItem);
  });

  cartTotalElement.textContent = `R$ ${total.toFixed(2)}`;
}

function buildWhatsAppMessage(endereco, pagamento) {
  let message = "🚀 NOVO PEDIDO - BURGER POWER 🚀\n\n";

  message += "----------------------------------\n";
  message += "🏠 DADOS DE ENTREGA:\n";
  message += `Endereço: ${endereco}\n`;
  message += `Pagamento: ${pagamento}\n`;
  message += "----------------------------------\n\n";

  message += "🍔 ITENS DO PEDIDO:\n";
  cart.forEach((item) => {
    message += `[${item.quantity}x] ${item.name} - R$ ${(
      item.price * item.quantity
    ).toFixed(2)}\n`;
  });

  // 3. Total
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  message += "\n----------------------------------\n";
  message += `💰 VALOR TOTAL: R$ ${total.toFixed(2)}\n`;
  message += "----------------------------------\n";

  return encodeURIComponent(message);
}

function openWhatsAppChat() {
  checkoutAlert.style.display = "none";

  if (cart.length === 0) {
    checkoutAlert.textContent = "Seu carrinho está vazio!";
    checkoutAlert.style.display = "block";
    return;
  }

  const endereco = document.getElementById("endereco").value.trim();
  const pagamento = document.getElementById("pagamento").value;

  if (endereco === "" || pagamento === "") {
    checkoutAlert.textContent = "Preencha o Endereço e a Forma de Pagamento!";
    checkoutAlert.style.display = "block";
    return;
  }

  const phoneNumber = "5511959327821"; 

  const messageBody = buildWhatsAppMessage(endereco, pagamento);

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${messageBody}`;
  window.open(whatsappUrl, "_blank");
}

document
  .getElementById("avaliacaoForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    document.getElementById("mensagemSucesso").style.display = "block";
    this.reset();

    setTimeout(() => {
      document.getElementById("mensagemSucesso").style.display = "none";
    }, 5000);
  });

document.querySelectorAll(".menu-section").forEach((section) => {
  if (section.id === "refrigerantes") {
    section.querySelectorAll(".item-card").forEach((itemCard) => {
      const selectedButton = itemCard.querySelector(".size-selector .selected");
      if (selectedButton) {
        const itemName = selectedButton
          .closest(".item-details")
          .querySelector("strong").textContent;
        const price = parseFloat(selectedButton.dataset.price || 11.0);
        const size = selectedButton.textContent.split("(")[0].trim();

        itemCard.dataset.price = price.toFixed(2);
        itemCard.dataset.name = `${itemName} (${size})`;
        itemCard.querySelector(".item-price").textContent = `R$ ${price.toFixed(
          2
        )}`;
      }
    });
  }
});
updateCartDisplay();
