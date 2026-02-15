import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { useForm } from "react-hook-form";
import axios from "axios";
import { isValidBYPhone, normalizeBYPhone } from "../utils/byPhone";
import "../pages/AuthPage.css";

const USERNAME_RE = /^[a-zA-Z0-9._-]{3,30}$/;

function normalizeLogin(value) {
  const v = String(value || "").trim();
  if (!v) return "";
  if (isValidBYPhone(v)) return normalizeBYPhone(v);
  return v;
}

function extractServerError(error) {
  const data = error?.response?.data;
  if (!data) return "Произошла ошибка. Попробуйте ещё раз.";
  if (typeof data === "string") return data;
  if (data.detail) return data.detail;
  if (typeof data === "object") {
    const key = Object.keys(data)[0];
    const val = data[key];
    if (Array.isArray(val) && val[0]) return String(val[0]);
    if (val) return String(val);
  }
  return "Произошла ошибка. Попробуйте ещё раз.";
}

export default function AuthModal({ open, onOpenChange, onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm({ mode: "onChange" });

  const password = watch("password");

  const loginHint = useMemo(
    () => "Можно логин (латиница/цифры) или телефон (+375...).",
    []
  );

  const handleModeChange = (nextIsLogin) => {
    if (nextIsLogin === isLogin) return;
    setIsLogin(nextIsLogin);
    setServerError("");
    reset();
  };

  const handleDialogChange = (value) => {
    if (!value) {
      reset();
      setServerError("");
    }
    onOpenChange && onOpenChange(value);
  };

  const onSubmit = async (data) => {
    try {
      setServerError("");

      if (isLogin) {
        const payload = {
          username: normalizeLogin(data.login),
          password: data.password,
        };
        const response = await axios.post("/api/login/", payload);
        onAuthSuccess && onAuthSuccess(response.data);
      } else {
        const payload = {
          username: String(data.username || "").trim(),
          phone: normalizeBYPhone(data.phone),
          email: String(data.email || "").trim(),
          password: data.password,
        };
        if (!payload.email) {
          delete payload.email;
        }
        const response = await axios.post("/api/register/", payload);
        onAuthSuccess && onAuthSuccess(response.data);
      }

      reset();
      onOpenChange && onOpenChange(false);
    } catch (error) {
      console.error("Auth error:", error.response?.data || error.message);
      setServerError(extractServerError(error));
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent>
        <div className="auth-card">
          <div className="auth-tabs">
            <button
              type="button"
              className={`auth-tab ${isLogin ? "active" : ""}`}
              onClick={() => handleModeChange(true)}
            >
              Вход
            </button>
            <button
              type="button"
              className={`auth-tab ${!isLogin ? "active" : ""}`}
              onClick={() => handleModeChange(false)}
            >
              Регистрация
            </button>
          </div>

          <h2>{isLogin ? "Вход в аккаунт" : "Создание аккаунта"}</h2>

          <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
            {isLogin ? (
              <>
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
              </>
            ) : (
              <>
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
                    <div className="auth-error">
                      {errors.password2.message}
                    </div>
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
                    Я согласен на обработку персональных данных и принимаю
                    условия сервиса.
                  </span>
                </label>
                {errors.agree && (
                  <div className="auth-error">{errors.agree.message}</div>
                )}
              </>
            )}

            {serverError && <div className="auth-error">{serverError}</div>}

            <button
              className="auth-submit"
              type="submit"
              disabled={isSubmitting || !isValid}
            >
              {isSubmitting
                ? isLogin
                  ? "Входим..."
                  : "Регистрируем..."
                : isLogin
                ? "Войти"
                : "Зарегистрироваться"}
            </button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
