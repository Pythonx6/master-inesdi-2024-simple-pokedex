import c from "classnames";

type Props = React.ComponentProps<"button"> & {
  children: React.ReactNode; // Usamos children en lugar de restringir "label"
};

import "./button.css";

export function Button({ children, ...rest }: Props) {
  return (
    <button className={c("button")} {...rest}>
      {children} {/* El contenido del botón se pasa como children */}
    </button>
  );
}
