import React from "react";

// Обёртка над обычным `<input />`, совместимая с react-hook-form (ref пробрасывается).
export const Input = React.forwardRef(function Input(props, ref) {
  return <input ref={ref} {...props} />;
});
