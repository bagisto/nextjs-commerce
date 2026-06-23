import CredentialModal from "./CredentialModal";

export default function UserAccount({
  children,
  className,
  onOpen,
  onClose,
  isOpen,
  profile,
}: {
  children?: React.ReactNode;
  className?: string;
  onOpen?: () => void;
  onClose?: () => void;
  isOpen?: boolean;
  profile?: any;
}) {
  return (
    <CredentialModal 
      className={className} 
      onOpen={onOpen} 
      onClose={onClose} 
      isOpen={isOpen}
      profile={profile}
    >
      {children}
    </CredentialModal>
  );
}
