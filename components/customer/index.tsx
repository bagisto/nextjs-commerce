import dynamic from 'next/dynamic';
const CredentialModal = dynamic(() => import('./modal'), { ssr: false });
export default function UserAccount() {
  return <CredentialModal />;
}
