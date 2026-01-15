import { useState, useRef, useEffect } from "react";

export const MessageWidget = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef({ x: 0, y: 0 });
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    offsetRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      setPosition({
        x: e.clientX - offsetRef.current.x,
        y: e.clientY - offsetRef.current.y,
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      ref={dragRef}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
      className="flex flex-col bg-white w-220 h-150 rounded-3xl absolute right-0 bottom-0 overflow-hidden"
    >
      <div
        onMouseDown={handleMouseDown}
        className={`flex items-center bg-accent w-full h-10 rounded-t-3xl ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
      ></div>
      <div className="flex-1 p-4">Chat Area</div>
      <div className="h-fit p-4">
        <form onSubmit={() => {}}>
          <input
            className="h-10 w-full outline-none"
            type="text"
            placeholder="Chat with members"
          />
        </form>
      </div>
    </div>
  );
};
