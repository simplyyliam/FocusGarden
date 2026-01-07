import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Checkbox } from "../ui/checkbox";

export default function TodoWidget() {
  return (
    <Card className="absolute left-0 top-5 w-full max-w-sm bg-white border-none shadow-none rounded-[30px]">
      <CardHeader>
        <CardTitle>Tasks</CardTitle>
        <CardAction>Card Action</CardAction>
      </CardHeader>
      <CardContent>
        <div className="flex p-2.5 w-full h-fit">
            <div className="flex items-center gap-2.5">
                <Checkbox id="todo"/>
                <label htmlFor="todo">Placehold todo</label>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
