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
import { useRef, useState, useEffect, type FormEvent } from "react";
import { gsap } from "gsap";

type Todo = { id: number; text: string };

export default function TodoWidget() {
  const [showInput, setShowInput] = useState(false);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");

  const formRef = useRef<HTMLFormElement | null>(null);

  function addTodo(e: FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;

    setTodos([...todos, { id: Date.now(), text: input }]);
    setInput("");
    setShowInput(false);
  }

  function deleteTodo(id: number) {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }

  function handleShowInput() {
    setShowInput((prev) => !prev);
  }

  useEffect(() => {
    if (showInput && formRef.current) {
      gsap.fromTo(
        formRef.current,
        { scale: 0.5, autoAlpha: 0 },
        {
          scale: 1,
          autoAlpha: 1,
          duration: 0.6,
          ease: "back.out",
        }
      );
    }
  }, [showInput]);

  return (
    <Card className="absolute left-0 top-5 w-full max-w-sm bg-white border-none shadow-none rounded-[30px]">
      <CardHeader>
        <CardTitle>Tasks</CardTitle>
        <CardAction>
          <button
            onClick={handleShowInput}
            className="flex items-center justify-center w-8.75 h-8.75 rounded-[10px] bg-[#F7F7F7]"
          >
            <HugeiconsIcon icon={Add01Icon} />
          </button>
        </CardAction>
      </CardHeader>

      {todos.length === 0 && !showInput ? (
        <div className="flex items-center justify-center w-full h-full text-muted-foreground p-2.5">
          Add a todo
        </div>
      ) : (
        <CardContent>
          {todos.map((t) => (
            <div key={t.id} className="flex p-2.5 w-full h-fit">
              <div className="flex items-center gap-2.5">
                <Checkbox
                  id={t.id.toString()}
                  onClick={() => deleteTodo(t.id)}
                />
                <label htmlFor={t.id.toString()}>{t.text}</label>
              </div>
            </div>
          ))}

          {showInput && (
            <form
              ref={formRef}
              onSubmit={addTodo}
              className="flex p-2.5 w-full h-fit"
            >
              <input
                className="w-full p-2.5"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Todo..."
                autoFocus
              />
            </form>
          )}
        </CardContent>
      )}
    </Card>
  );
}
