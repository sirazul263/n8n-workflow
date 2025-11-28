import { LoginForm } from "@/features/auth/components/login-form";
import { requireUnauth } from "@/lib/auth-utils";

export async function generateMetadata() {
  return {
    title: `Login Page`,
  };
}

const Page = async () => {
  await requireUnauth();
  return <LoginForm />;
};
export default Page;
