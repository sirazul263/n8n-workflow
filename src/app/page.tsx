"use client";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const HomePage = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data } = useQuery(trpc.getWorkflows.queryOptions());

  const create = useMutation(
    trpc.createWorkflow.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.getWorkflows.queryOptions());
      },
    })
  );

  const testAi = useMutation(
    trpc.testAi.mutationOptions({
      onSuccess: () => {
        toast.success("Job queued");
      },
    })
  );

  return (
    <div className="text-red-500 flex flex-col min-h-screen justify-center items-center">
      {data && JSON.stringify(data)}
      <div className="flex flex-col gap-6">
        <Button disabled={create.isPending} onClick={() => create.mutate()}>
          Create Work Flow
        </Button>

        <Button disabled={testAi.isPending} onClick={() => testAi.mutate()}>
          Test Ai
        </Button>
      </div>
    </div>
  );
};
export default HomePage;
