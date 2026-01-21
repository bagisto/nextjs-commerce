import CartModal from "./CartModal";

export default function Cart({
  children,
  className,
  onClick,
  onClose,
}: {
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  onClose?: () => void;
}) {
  return (
    <CartModal className={className} onClick={onClick} onClose={onClose}>
      {children}
    </CartModal>
  );
}
