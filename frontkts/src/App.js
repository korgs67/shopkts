import "./App.css";
import Header from "./components/Header";
import NoutbukList from "./components/NoutbukList";
import Footer from "./components/Footer";
import AuthModal from "./components/AuthModal";
import axios from "axios";
import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import NoutbukDetail from "./pages/NoutbukDetail";

const API_URL = "http://127.0.0.1:8000/noutbuks/";

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);

  const [noutbuks, setNoutbuks] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const savedToken = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('authUser');
    if (savedToken && savedUser) {
      setToken(savedToken);
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Ошибка парсинга пользователя из localStorage', e);
      }
    }
  }, []);

  useEffect(() => {
    // загружаем первую страницу при старте
    getNoutbuks(1);
  }, []);

  const handleAuthSuccess = ({ token, user }) => {
    setToken(token);
    setUser(user);
    localStorage.setItem('authToken', token);
    localStorage.setItem('authUser', JSON.stringify(user));
    setError(null);
    setIsAuthOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
  };

  async function getNoutbuks(targetPage = 1) {
    try {
      const response = await axios.get(`${API_URL}?page=${targetPage}`);
      const data = response.data;
      setNoutbuks(data.results || []);

      const pageSize = 12; // должен совпадать с PAGE_SIZE на бэкенде
      const total = data.count ? Math.ceil(data.count / pageSize) : 1;
      setTotalPages(total);
      setPage(targetPage);
    } catch (e) {
      console.error(e);
      setError('Не удалось загрузить список ноутбуков');
    }
  }

  const addToCart = (noutbuk) => {
    if (!user) {
      setError('Авторизуйтесь, чтобы добавлять товары в корзину.');
      setIsAuthOpen(true);
      return;
    }
    setCartItems((prev) => [...prev, noutbuk]);
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <div className="App">
      <Header
        user={user}
        cartItems={cartItems}
        onRemoveFromCart={removeFromCart}
        onClearCart={clearCart}
        onLogout={handleLogout}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {user && (
        <div className="Profile">
          <h1>
            {user.first_name} {user.last_name}
          </h1>
          <h2>{user.username}</h2>
          <p>email: {user.email}</p>
          <p>
            Профиль создан{" "}
            {new Date(user.date_joined).toLocaleDateString()}
          </p>
        </div>
      )}
      {error && <p>{error}</p>}

      <Routes>
        <Route
          path="/"
          element={
            <>
              <button onClick={() => getNoutbuks(1)}>Обновить ноутбуки</button>
              <NoutbukList noutbuks={noutbuks} onAdd={addToCart} />

              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    onClick={() => getNoutbuks(page - 1)}
                    disabled={page <= 1}
                  >
                    Предыдущая
                  </button>
                  <span>
                    Страница {page} из {totalPages}
                  </span>
                  <button
                    onClick={() => getNoutbuks(page + 1)}
                    disabled={page >= totalPages}
                  >
                    Следующая
                  </button>
                </div>
              )}
            </>
          }
        />
        <Route path="/noutbuk/:id" element={<NoutbukDetail />} />
      </Routes>

      <AuthModal
        open={isAuthOpen}
        onOpenChange={setIsAuthOpen}
        onAuthSuccess={handleAuthSuccess}
      />

      <Footer />
    </div>
  );
}

export default App;
