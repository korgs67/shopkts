import React from "react";

// Простейшая реализация модального окна.
// Управляется пропсами `open` и `onOpenChange`, которые передаёт родитель.

export function Dialog({ open, onOpenChange, children }) {
  if (!open) return null;

  return (
    <div
      className="dialog-backdrop"
      onClick={() => onOpenChange && onOpenChange(false)}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "#fff",
          borderRadius: 8,
          padding: 24,
          minWidth: 320,
          maxWidth: "90vw",
        }}
      >
        {children}
      </div>
    </div>
  );
}

export function DialogContent({ children }) {
  return <>{children}</>;
}

// В текущей версии проекта `DialogTrigger` не используется,
// но экспорт оставляем, чтобы не ломать импорты.
export function DialogTrigger({ children }) {
  return <>{children}</>;
}