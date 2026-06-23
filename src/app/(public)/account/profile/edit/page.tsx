import { getCustomerProfile } from "@/utils/bagisto";
import ProfileEditForm from "@/components/customer/ProfileEditForm";

export default async function ProfileEditPage() {
  const user = await getCustomerProfile();

  return <ProfileEditForm user={user} />;
}
