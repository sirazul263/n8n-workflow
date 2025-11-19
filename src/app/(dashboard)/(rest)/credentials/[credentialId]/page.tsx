import { requireAuth } from "@/lib/auth-utils";

interface PageProps {
  params: Promise<{
    credentialId: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  const { credentialId } = await params;
  await requireAuth();
  return (
    <div className="text-red-500 flex flex-col min-h-screen justify-center items-center">
      {credentialId}
    </div>
  );
};
export default Page;
