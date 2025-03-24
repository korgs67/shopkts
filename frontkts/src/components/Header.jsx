import React, {useState} from "react";
import './Header.css'
import {FaShoppingCart} from "react-icons/fa";

export default function Header() {
    let [cartOpen, setCartOpen] = useState(false)
    return (
        <header>
            <div>
                <span className='logo'>Ноутбуки</span>
                <ul className='nav'>
                    <li>О нас</li>
                    <li>Контакты</li>
                    <li>Кабинет</li>
                    <button className='open-btn'> Открыть модальное оно</button>
                </ul>
                <FaShoppingCart onClick={() => setCartOpen(cartOpen =!cartOpen)}
                                className={`shop-cart-button ${cartOpen && 'active'}`}/>

                {cartOpen && (
                    <div className='shop-cart'>
                    </div>

                )}
            </div>
            <div className='presentetion'></div>
        </header>
    )

}