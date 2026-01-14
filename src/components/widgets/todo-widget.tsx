"use client";

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
import { useRef, useState, type FormEvent } from "react";

import { AnimatePresence, motion } from "motion/react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "../ui/context-menu";

type Todo = { id: number; text: string; completed: boolean };

export default function TodoWidget() {
  const [showInput, setShowInput] = useState(false);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");

  const todoRef = useRef<HTMLButtonElement | null>(null);
  function addTodo(e: FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;

    setTodos([...todos, { id: Date.now(), text: input, completed: false }]);
    setInput("");
    setShowInput(false);
  }

  function deleteTodo(id: number) {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }

  return (
    <>
      <Card className="absolute left-0 top-5 w-full max-w-sm bg-white border-none shadow-none rounded-[30px]">
        <CardHeader>
          <CardTitle>Tasks</CardTitle>
          <CardAction>
            <motion.button
              whileTap={{ y: 1 }}
              onClick={() => setShowInput(!showInput)}
              className="flex items-center justify-center w-8.75 h-8.75 rounded-[10px] bg-[#F7F7F7]"
            >
              <HugeiconsIcon icon={Add01Icon} />
            </motion.button>
          </CardAction>
        </CardHeader>

        <CardContent>
          <AnimatePresence mode="wait">
            {todos.length === 0 && !showInput && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center w-full text-muted-foreground p-2.5"
              >
                Add a todo
              </motion.div>
            )}

            {todos.map((t) => (
              <ContextMenu key={t.id}>
                <ContextMenuTrigger asChild>
                  <button
                    ref={todoRef}
                    key={t.id}
                    className="flex p-2.5 w-full cursor-pointer rounded-xl hover:bg-accent transition-colors ease-linear "
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      key={t.id}
                      className="flex items-center gap-2.5"
                    >
                      <Checkbox
                        id={t.id.toString()}
                        checked={t.completed}
                        onCheckedChange={() =>
                          setTodos((prev) =>
                            prev.map((todo) =>
                              todo.id === t.id
                                ? { ...todo, completed: !t.completed }
                                : todo
                            )
                          )
                        }
                      />
                      <label
                        htmlFor={t.id.toString()}
                        className={`${
                          t.completed
                            ? "line-through text-muted-foreground"
                            : ""
                        }`}
                      >
                        {t.text}
                      </label>
                    </motion.div>
                  </button>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem onClick={() => deleteTodo(t.id)}>Delete</ContextMenuItem>
                  <ContextMenuItem>Billing</ContextMenuItem>
                  <ContextMenuItem>Team</ContextMenuItem>
                  <ContextMenuItem>Subscription</ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            ))}

            {showInput && (
              <motion.div
                key="input"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <form onSubmit={addTodo} className="flex p-2.5 w-full">
                  <input
                    className="w-full p-2.5"
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Todo..."
                    autoFocus
                  />
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </>
  );
}
