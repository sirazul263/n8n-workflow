import { Button } from "@/components/ui/button";
import { useExecuteWorkflow } from "@/features/workflows/hooks/use-workflows";
import { FlaskConicalIcon } from "lucide-react";

interface ExecuteWorkflowButtonProps {
  workflowId: string;
}
export const ExecuteWorkflowButton = ({
  workflowId,
}: ExecuteWorkflowButtonProps) => {
  const executeWorkflow = useExecuteWorkflow();
  const handleSubmit = () => {
    executeWorkflow.mutate({ id: workflowId });
  };
  return (
    <Button
      size="lg"
      onClick={handleSubmit}
      disabled={executeWorkflow.isPending}
    >
      {" "}
      <FlaskConicalIcon className="" /> Execute Workflow
    </Button>
  );
};
