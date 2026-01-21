import CredentialModal from "./CredentialModal";

export default function UserAccount({
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
    <CredentialModal className={className} onClick={onClick} onClose={onClose}>
      {children}
    </CredentialModal>
  );
}
