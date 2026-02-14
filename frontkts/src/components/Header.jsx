import React, { useState } from "react";
import "./Header.css";
import { FaShoppingCart } from "react-icons/fa";
import { Dialog, DialogContent } from "./ui/dialog";

export default function Header({
  user,
  cartItems,
  onRemoveFromCart,
  onClearCart,
  onLogout,
  onOpenAuth,
}) {
  const [cartOpen, setCartOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [contactsOpen, setContactsOpen] = useState(false);

  const totalPrice = cartItems?.reduce(
    (sum, item) => sum + (Number(item.price) || 0),
    0
  );

  const handleHeaderClick = () => {
    if (cartOpen) {
      setCartOpen(false);
    }
  };

  return (
    <header onClick={handleHeaderClick}>
      <div>
        <span className="logo">Ноутбуки</span>
        <ul className="nav">
          <li onClick={() => setAboutOpen(true)}>О нас</li>
          <li onClick={() => setContactsOpen(true)}>Контакты</li>
          {user && (
            <li>{`Личный кабинет: ${user.first_name || user.username}`}</li>
          )}
          {user ? (
            <button className="open-btn" type="button" onClick={onLogout}>
              Выйти
            </button>
          ) : (
            <button className="open-btn" type="button" onClick={onOpenAuth}>
              Войти / Регистрация
            </button>
          )}
        </ul>
        <div
          className="cart-wrapper"
          onClick={(e) => {
            // не даём клику по иконке всплыть до header
            e.stopPropagation();
          }}
        >
          <FaShoppingCart
            onClick={() => setCartOpen(!cartOpen)}
            className={`shop-cart-button ${cartOpen && "active"}`}
          />
          {cartItems && cartItems.length > 0 && (
            <span className="cart-count">{cartItems.length}</span>
          )}
        </div>

        {cartOpen && (
          <div
            className="shop-cart"
            onClick={(e) => {
              // клики внутри корзины не закрывают её
              e.stopPropagation();
            }}
          >
            {(!cartItems || cartItems.length === 0) && (
              <p>Корзина пуста</p>
            )}
            {cartItems &&
              cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <span>{item.description}</span>
                  <span>{item.price} р.</span>
                  <button
                    type="button"
                    onClick={() => onRemoveFromCart(item.id)}
                  >
                    Удалить
                  </button>
                </div>
              ))}
            {cartItems && cartItems.length > 0 && (
              <>
                <div className="cart-total">Итого: {totalPrice} р.</div>
                <button type="button" onClick={onClearCart}>
                  Очистить корзину
                </button>
              </>
            )}
          </div>
        )}
      </div>
      <div className="presentetion"></div>

      <Dialog open={aboutOpen} onOpenChange={setAboutOpen}>
        <DialogContent>
          <h2>О нас</h2>
          <p>
            Мы собираем для вас лучшие предложения по ноутбукам с сайта kst.by и
            показываем их в удобном и понятном интерфейсе. Вы можете сравнивать
            модели, добавлять их в корзину и оформлять заказ.
          </p>
        </DialogContent>
      </Dialog>

      <Dialog open={contactsOpen} onOpenChange={setContactsOpen}>
        <DialogContent>
          <h2>Контакты</h2>
          <p>Если у вас есть вопросы по работе сайта или заказам:</p>
          <ul>
            <li>Телефон: +375 (29) 000‑00‑00</li>
            <li>E‑mail: info@kts-shop.local</li>
          </ul>
        </DialogContent>
      </Dialog>
    </header>
  );
}