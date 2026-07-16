import CredentialModal from "./CredentialModal";
import { CustomerProfile } from "@/types/customer/type";

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
  profile?: CustomerProfile;
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
