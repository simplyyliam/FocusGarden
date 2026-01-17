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
import { useRoomStore } from "@/core";


// type Todo = { id: number; text: string; completed: boolean };

export default function TodoWidget() {
  const [showInput, setShowInput] = useState(false);
  const [input, setInput] = useState("");
  const [newlyAddedId, setNewlyAddedId] = useState<string | null>(null);
  // const [todos, setTodos] = useState<Todo[]>([]);
  const { todos, addTodo, deleteTodo, toggleTodo } = useRoomStore()

  const todoRef = useRef<HTMLButtonElement | null>(null);


  function handleAddTodo(e: FormEvent) {
    e.preventDefault()

    if(!input.trim()) return

    addTodo(input)
    setInput("")
    setShowInput(false)

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

        <CardContent className="flex flex-col gap-2">
          <AnimatePresence>
            {todos.map((t) => {
              const isNew = t.id === newlyAddedId;
              return (
                <ContextMenu key={t.id}>
                  <ContextMenuTrigger asChild>
                    <button
                      ref={todoRef}
                      key={t.id}
                      className={`flex p-2.5 w-full cursor-pointer rounded-xl hover:bg-accent transition-colors ${
                        t.completed
                          ? "bg-blue-200 hover:bg-blue-300 text-blue-400 line-through"
                          : ""
                      }`}
                    >
                      <motion.div
                        initial={isNew ? { opacity: 0, scale: 0 } : false}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        onAnimationComplete={() => {
                          if (isNew) setNewlyAddedId(null);
                        }}
                        key={t.id}
                        className="flex items-center gap-2.5"
                      >
                        <Checkbox
                          id={t.id.toString()}
                          checked={t.completed}
                          onCheckedChange={() => toggleTodo(t.id)}
                        />
                        <label htmlFor={t.id.toString()}>{t.text}</label>
                      </motion.div>
                    </button>
                  </ContextMenuTrigger>
                  <ContextMenuContent>
                    <ContextMenuItem onClick={() => deleteTodo(t.id)}>
                      Delete
                    </ContextMenuItem>
                    <ContextMenuItem>Billing</ContextMenuItem>
                    <ContextMenuItem>Team</ContextMenuItem>
                    <ContextMenuItem>Subscription</ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              );
            })}
          </AnimatePresence>
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

            {showInput && (
              <motion.div
                key="input"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <form onSubmit={handleAddTodo} className="flex p-2.5 w-full">
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
