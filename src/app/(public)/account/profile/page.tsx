import { getCustomerProfile } from "@/utils/bagisto";
import ProfileDetails from "@/components/customer/ProfileDetails";
import type { CustomerProfile } from "@/types/customer/type";

export default async function ProfilePage() {
  const user = await getCustomerProfile();

  return <ProfileDetails user={user as CustomerProfile} />;
}
