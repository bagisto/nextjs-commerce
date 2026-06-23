import { getCustomerProfile } from "@/utils/bagisto";
import ProfileDetails from "@/components/customer/ProfileDetails";

export default async function ProfilePage() {
  const user = await getCustomerProfile();

  return <ProfileDetails user={user} />;
}
