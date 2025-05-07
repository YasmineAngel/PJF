"use client";
import { useState, useEffect } from "react";

// Define the Todo type
type Todo = {
  id: string;
  content: string;
  isDone: boolean;
};

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [content, setContent] = useState("");

  const fetchTodos = async () => {
    const res = await fetch("/api/todos");
    const data = await res.json();
    setTodos(data);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async () => {
    if (!content.trim()) return;
    await fetch("/api/todos", {
      method: "POST",
      body: JSON.stringify({ content }),
      headers: { "Content-Type": "application/json" },
    });
    setContent("");
    fetchTodos();
  };

  const toggleTodo = async (id: string, isDone: boolean) => {
    await fetch(`/api/todos/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ isDone: !isDone }),
      headers: { "Content-Type": "application/json" },
    });
    fetchTodos();
  };

  const deleteTodo = async (id: string) => {
    await fetch(`/api/todos/${id}`, { method: "DELETE" });
    fetchTodos();
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Todo List</h1>
      
      <div className="flex mb-6">
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && addTodo()}
          placeholder="What needs to be done?"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg "
        />
        <button
          onClick={addTodo}
          disabled={!content.trim()}
          className="px-4 py-2 bg-sky-700 text-white rounded-r-lg hover:bg-sky-700 disabled:bg-blue-300 transition-colors"
        >
          Add
        </button>
      </div>
      
      <ul className="space-y-2">
        {todos.length === 0 ? (
          <p className="text-center text-gray-500 py-4">No todos yet. Add one above!</p>
        ) : (
          todos.map((todo) => (
            <li 
              key={todo.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={todo.isDone}
                  onChange={() => toggleTodo(todo.id, todo.isDone)}
                  className="h-5 w-5 text-sky-500 rounded focus:ring-sky-400 cursor-pointer"
                />
                <span
                  className={`text-gray-800 ${todo.isDone ? "line-through text-gray-400" : ""}`}
                >
                  {todo.content}
                </span>
              </div>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 transition-colors"
                aria-label="Delete todo"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </li>
          ))
        )}
      </ul>
      
      {todos.length > 0 && (
        <div className="mt-4 text-sm text-gray-500">
          {todos.filter(t => t.isDone).length} of {todos.length} tasks completed
        </div>
      )}
    </div>
  );
}