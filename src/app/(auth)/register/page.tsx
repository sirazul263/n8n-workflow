import { RegisterForm } from "@/features/auth/components/register-form";
import { requireUnauth } from "@/lib/auth-utils";

export async function generateMetadata() {
  return {
    title: `Register Page`,
  };
}

const Page = async () => {
  await requireUnauth();
  return <RegisterForm />;
};
export default Page;
