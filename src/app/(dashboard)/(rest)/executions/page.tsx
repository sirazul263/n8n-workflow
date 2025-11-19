import { requireAuth } from "@/lib/auth-utils";

const Page = async () => {
  await requireAuth();
  return (
    <div className="text-red-500 flex flex-col min-h-screen justify-center items-center">
      Executions
    </div>
  );
};
export default Page;
