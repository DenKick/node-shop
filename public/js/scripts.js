function order(title, price) {
  const currentOrder = new OrdersPopup(title, price);
  currentOrder.render();
  document.getElementById("background-popup").style["display"] = "block";
}

function closePopup() {
  let element = document.getElementById('form-popup');
  element.remove();
  document.getElementById("background-popup").style["display"] = "none";
}