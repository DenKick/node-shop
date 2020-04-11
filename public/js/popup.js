class OrdersPopup {
  constructor(title, price) {
    this.title = title;
    this.price = price;
  }

  render() {
    let popupOrderHtml = `
      <form class="popup-content" action="/order-success" method="post" id="form-popup">
        <span class="content__film">You want to buy "${this.title}"</span>
        <span class="content__fill">Please, fill this form to order the film</span>
        <span class="content__warn">* is required</span>
        <div class="content__block">
          <span class="block__label">Enter your name*: </span>
          <input type="text" class="block__input" name="name" required>
        </div>
        <div class="content__block">
          <span class="block__label">Phone number*: </span>
          <input type="phone" class="block__input" name="phone" required>
        </div>
        <div class="content__block">
          <span class="block__label">Address*: </span>
          <input type="text" class="block__input" name="address" required>
        </div>
        <div class="content__block">
          <span class="block__label">Zip-code*: </span>
          <input type="number" class="block__input" name="zip" required>
        </div>
        <div class="content__block">
          <span class="block__label">Commentary to order: </span>
          <input type="text" class="block__input" name="comment">
        </div>
        <span class="content__price">Price: $${this.price}</span>
        <button class="submit-btn" type="submit">Order</button>
        <input type="hidden" name="filmName" value="${this.title}">
        <input type="hidden" name="cost" value="${this.price}">
      </form>
    `;
    document.getElementById('popup').innerHTML = popupOrderHtml;
  }
}