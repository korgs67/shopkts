import React, { useMemo, useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import "./AuthPage.css";
import { isValidBYPhone, normalizeBYPhone } from "../utils/byPhone";

const USERNAME_RE = /^[a-zA-Z0-9._-]{3,30}$/;

function normalizeLogin(value) {
  const v = String(value || "").trim();
  if (!v) return "";
  if (isValidBYPhone(v)) return normalizeBYPhone(v);
  return v;
}

export default function Login({ onAuthSuccess }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState("");

  const from = location.state?.from || "/";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm({ mode: "onChange" });

  const loginHint = useMemo(
    () => "Можно логин (латиница/цифры) или телефон (+375...).",
    []
  );

  const onSubmit = async (data) => {
    try {
      setServerError("");
      const payload = {
        username: normalizeLogin(data.login),
        password: data.password,
      };

      const response = await axios.post("/api/login/", payload);
      onAuthSuccess && onAuthSuccess(response.data);
      navigate(from, { replace: true });
    } catch (e) {
      const detail =
        e?.response?.data?.detail ||
        "Не удалось войти. Проверьте логин и пароль.";
      setServerError(detail);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-shell">
        <div className="auth-hero">
          <h1>Вход в аккаунт</h1>
          <p>
            Войдите, чтобы добавлять товары в корзину и оформлять заказ. Мы
            проверим корректность логина и телефона ещё до отправки формы.
          </p>
        </div>

        <div className="auth-card">
          <h2>Войти</h2>

          <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="auth-field">
              <div className="auth-label">Логин или телефон</div>
              <input
                className="auth-input"
                placeholder="login или +375 (29) 123-45-67"
                autoComplete="username"
                aria-invalid={errors.login ? "true" : "false"}
                {...register("login", {
                  required: "Укажите логин или телефон",
                  validate: (v) => {
                    const value = String(v || "").trim();
                    if (!value) return "Укажите логин или телефон";
                    if (USERNAME_RE.test(value)) return true;
                    if (isValidBYPhone(value)) return true;
                    return "Логин: 3–30 символов (A–Z, 0–9, . _ -) или корректный телефон BY";
                  },
                })}
              />
              <div className="auth-hint">{loginHint}</div>
              {errors.login && (
                <div className="auth-error">{errors.login.message}</div>
              )}
            </div>

            <div className="auth-field">
              <div className="auth-label">Пароль</div>
              <input
                className="auth-input"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                aria-invalid={errors.password ? "true" : "false"}
                {...register("password", {
                  required: "Укажите пароль",
                  minLength: { value: 6, message: "Минимум 6 символов" },
                })}
              />
              {errors.password && (
                <div className="auth-error">{errors.password.message}</div>
              )}
            </div>

            {serverError && <div className="auth-error">{serverError}</div>}

            <button
              className="auth-submit"
              type="submit"
              disabled={isSubmitting || !isValid}
            >
              {isSubmitting ? "Входим..." : "Войти"}
            </button>
          </form>

          <div className="auth-links">
            Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
          </div>
          <div className="auth-links">
            <Link to="/">← На главную</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

