import { useState, useEffect } from "react";
import TodoInput from "./components/TodoInput";
import TodoItem from "./components/TodoItem";
import "./App.css";
import iconmoon from "./images/iconmoon.svg";
import iconsun from "./images/iconsun.svg";
//



import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function App() {

  
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("all");
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  
  const filteredTodos = todos.filter(todo =>
    filter === "active" ? !todo.completed :
    filter === "completed" ? todo.completed : true
  );

  const addTodo = (text) => {
    setTodos([...todos, { id: Date.now(), text, completed: false }]);
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

   const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

 useEffect(() => {
    document.body.className = theme;
  }, [theme]);


     // ✅ Handle drag end
  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(todos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setTodos(items);
  };
  return (
    <div className={`app ${theme}`}>
  <header>
    <h1>TODO</h1>
   <button onClick={toggleTheme} className="theme-toggle">
  {theme === "dark" ? (
    <img src={iconsun} alt="Light Mode" />
  ) : (
    <img src={iconmoon} alt="Dark Mode" />
  )}
</button>

  </header>

  <TodoInput onAdd={addTodo} />
{/* 
  <div className="todo-list">
    {filteredTodos.map(todo => (
      <TodoItem key={todo.id} todo={todo} onToggle={toggleTodo} onDelete={deleteTodo} />
    ))}
  </div> */}

    {/* ✅ Drag and Drop Wrapper */}
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="todos">
          {(provided) => (
            <div
              className="todo-list"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {filteredTodos.map((todo, index) => (
                <Draggable
                  key={todo.id}
                  draggableId={todo.id.toString()}
                  index={index}
                >
                  {(provided, snapshot) => (
                   <div
  ref={provided.innerRef}
  {...provided.draggableProps}
  {...provided.dragHandleProps}
  className={`todo-item-wrapper ${
    snapshot.isDragging ? "dragging" : ""
  }`}
>
  <TodoItem
    todo={todo}
    onToggle={toggleTodo}
    onDelete={deleteTodo}
  />
</div>

                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>


  <footer>
    <p>{todos.filter(t => !t.completed).length} items left</p>
    <div className="filters">
      <button onClick={() => setFilter("all")} className={filter==="all"?"active":""}>All</button>
      <button onClick={() => setFilter("active")} className={filter==="active"?"active":""}>Active</button>
      <button onClick={() => setFilter("completed")} className={filter==="completed"?"active":""}>Completed</button>
    </div>
    <button onClick={clearCompleted}>Clear Completed</button>
  </footer>

  <p className="drag-info">Drag and drop to reorder list</p>
</div>

  );
}
