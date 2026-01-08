import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon } from "@hugeicons/core-free-icons";

export default function TodoWidget() {

  return (
    <Card className="absolute left-0 top-5 w-full max-w-sm bg-white border-none shadow-none rounded-[30px]">
      <CardHeader>
        <CardTitle>Tasks</CardTitle>
        <CardAction>
          <button
            className="flex items-center justify-center w-8.75 h-8.75 rounded-[10px] bg-[#F7F7F7]"
          >
            <HugeiconsIcon icon={Add01Icon} />
          </button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="flex p-2.5 w-full h-fit">
          <div className="flex items-center gap-2.5">
            <Checkbox id="todo" />
            <label htmlFor="todo">Placehold todo</label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
