import { requireAuth } from "@/lib/auth-utils";

interface PageProps {
  params: Promise<{
    executionId: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  await requireAuth();
  const { executionId } = await params;
  return (
    <div className="text-red-500 flex flex-col min-h-screen justify-center items-center">
      {executionId}
    </div>
  );
};
export default Page;
