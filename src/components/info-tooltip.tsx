import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PropsWithChildren } from "react";

interface InfoTooltipProps {
  content: string;
}

export function InfoTooltip({
  content,
  children,
}: PropsWithChildren<InfoTooltipProps>) {
  return (
    <Tooltip>
      <TooltipTrigger type="button">{children}</TooltipTrigger>
      <TooltipContent>
        <p>{content}</p>
      </TooltipContent>
    </Tooltip>
  );
}
