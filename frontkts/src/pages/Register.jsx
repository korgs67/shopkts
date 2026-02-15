import React, { useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import "./AuthPage.css";
import { isValidBYPhone, normalizeBYPhone } from "../utils/byPhone";

const USERNAME_RE = /^[a-zA-Z0-9._-]{3,30}$/;

function extractServerError(e) {
  const data = e?.response?.data;
  if (!data) return "Не удалось зарегистрироваться. Проверьте данные.";
  if (typeof data === "string") return data;
  if (data.detail) return data.detail;
  if (typeof data === "object") {
    const firstKey = Object.keys(data)[0];
    const firstVal = data[firstKey];
    if (Array.isArray(firstVal) && firstVal[0]) return String(firstVal[0]);
    if (firstVal) return String(firstVal);
  }
  return "Не удалось зарегистрироваться. Проверьте данные.";
}

export default function Register({ onAuthSuccess }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState("");

  const from = location.state?.from || "/";

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm({ mode: "onChange" });

  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      setServerError("");
      const payload = {
        username: String(data.username || "").trim(),
        phone: normalizeBYPhone(data.phone),
        email: String(data.email || "").trim(),
        password: data.password,
      };

      // не отправляем пустой email (бэкенд тоже принимает, но так чище)
      if (!payload.email) delete payload.email;

      const response = await axios.post("/api/register/", payload);
      onAuthSuccess && onAuthSuccess(response.data);
      navigate(from, { replace: true });
    } catch (e) {
      setServerError(extractServerError(e));
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-shell">
        <div className="auth-hero">
          <h1>Регистрация</h1>
          <p>
            Создайте аккаунт за минуту. Логин и номер телефона проверяются на
            клиенте, а номер телефона сохраняется в профиле.
          </p>
        </div>

        <div className="auth-card">
          <h2>Создать аккаунт</h2>

          <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="auth-field">
              <div className="auth-label">Логин</div>
              <input
                className="auth-input"
                placeholder="например, kts_user"
                autoComplete="username"
                aria-invalid={errors.username ? "true" : "false"}
                {...register("username", {
                  required: "Укажите логин",
                  validate: (v) => {
                    const value = String(v || "").trim();
                    if (!value) return "Укажите логин";
                    if (!USERNAME_RE.test(value)) {
                      return "Логин: 3–30 символов (A–Z, 0–9, . _ -)";
                    }
                    return true;
                  },
                })}
              />
              {errors.username && (
                <div className="auth-error">{errors.username.message}</div>
              )}
            </div>

            <div className="auth-field">
              <div className="auth-label">Номер телефона</div>
              <input
                className="auth-input"
                placeholder="+375 (29) 123-45-67"
                inputMode="tel"
                aria-invalid={errors.phone ? "true" : "false"}
                {...register("phone", {
                  required: "Укажите номер телефона",
                  validate: (v) =>
                    isValidBYPhone(v) ||
                    "Введите корректный телефон BY (например, +375 (29) 123-45-67)",
                })}
              />
              <div className="auth-hint">
                Поддерживаются коды: 25, 29, 33, 44.
              </div>
              {errors.phone && (
                <div className="auth-error">{errors.phone.message}</div>
              )}
            </div>

            <div className="auth-field">
              <div className="auth-label">Email (необязательно)</div>
              <input
                className="auth-input"
                placeholder="you@example.com"
                type="email"
                autoComplete="email"
                aria-invalid={errors.email ? "true" : "false"}
                {...register("email", {
                  validate: (v) => {
                    const value = String(v || "").trim();
                    if (!value) return true;
                    // простая проверка, чтобы не принимать совсем мусор
                    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                      return "Укажите корректный email";
                    }
                    return true;
                  },
                })}
              />
              {errors.email && (
                <div className="auth-error">{errors.email.message}</div>
              )}
            </div>

            <div className="auth-field">
              <div className="auth-label">Пароль</div>
              <input
                className="auth-input"
                type="password"
                placeholder="Минимум 6 символов"
                autoComplete="new-password"
                aria-invalid={errors.password ? "true" : "false"}
                {...register("password", {
                  required: "Придумайте пароль",
                  minLength: { value: 6, message: "Минимум 6 символов" },
                })}
              />
              {errors.password && (
                <div className="auth-error">{errors.password.message}</div>
              )}
            </div>

            <div className="auth-field">
              <div className="auth-label">Повтор пароля</div>
              <input
                className="auth-input"
                type="password"
                placeholder="Повторите пароль"
                autoComplete="new-password"
                aria-invalid={errors.password2 ? "true" : "false"}
                {...register("password2", {
                  required: "Повторите пароль",
                  validate: (v) =>
                    v === password || "Пароли не совпадают",
                })}
              />
              {errors.password2 && (
                <div className="auth-error">{errors.password2.message}</div>
              )}
            </div>

            <label className="auth-checkbox">
              <input
                type="checkbox"
                {...register("agree", {
                  required: "Нужно согласие на обработку данных",
                })}
              />
              <span>
                Я согласен на обработку персональных данных и принимаю условия
                сервиса.
              </span>
            </label>
            {errors.agree && (
              <div className="auth-error">{errors.agree.message}</div>
            )}

            {serverError && <div className="auth-error">{serverError}</div>}

            <button
              className="auth-submit"
              type="submit"
              disabled={isSubmitting || !isValid}
            >
              {isSubmitting ? "Регистрируем..." : "Зарегистрироваться"}
            </button>
          </form>

          <div className="auth-links">
            Уже есть аккаунт? <Link to="/login">Войти</Link>
          </div>
          <div className="auth-links">
            <Link to="/">← На главную</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

