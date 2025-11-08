import { useState, useEffect } from "react";
import TodoInput from "./components/TodoInput";
import TodoItem from "./components/TodoItem";
import "./App.css";
import iconmoon from "./images/iconmoon.svg";
import iconsun from "./images/iconsun.svg";
import axios from "axios";
//



import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function App() {

  
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("all");
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

const baseURL = "http://localhost:3000";

 // ✅ Load todos from backend
  useEffect(() => {
    axios.get(`${baseURL}/todos`)
      .then(res => setTodos(res.data))
      .catch(err => console.error(err));
  }, []);
  
 // ✅ Add todo to backend
  const addTodo = async (text) => {
    const res = await axios.post(`${baseURL}/todos`, { text });
    setTodos([...todos, res.data]);
  };


  // const filteredTodos = todos.filter(todo =>
  //   filter === "active" ? !todo.completed :
  //   filter === "completed" ? todo.completed : true
  // );

  // const addTodo = (text) => {
  //   setTodos([...todos, { id: Date.now(), text, completed: false }]);
  // };

  // const toggleTodo = (id) => {
  //   setTodos(todos.map(todo => 
  //     todo.id === id ? { ...todo, completed: !todo.completed } : todo
  //   ));
  // };

 // ✅ Toggle complete
  const toggleTodo = async (id, completed) => {
    await axios.put(`${baseURL}/todos/${id}`, { completed: !completed });
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !completed } : t));
  };

  // const deleteTodo = (id) => {
  //   setTodos(todos.filter(todo => todo.id !== id));
  // };

  // ✅ Delete
  const deleteTodo = async (id) => {
    await axios.delete(`${baseURL}/todos/${id}`);
    setTodos(todos.filter(t => t.id !== id));
  };

  // const clearCompleted = () => {
  //   setTodos(todos.filter(todo => !todo.completed));
  // };

// ✅ Clear completed
  const clearCompleted = async () => {
    const completedTodos = todos.filter(t => t.completed);
    for (const todo of completedTodos) {
      await axios.delete(`${baseURL}/todos/${todo.id}`);
    }
    setTodos(todos.filter(t => !t.completed));
  };

  //  const toggleTheme = () => {
  //   const newTheme = theme === "dark" ? "light" : "dark";
  //   setTheme(newTheme);
  //   localStorage.setItem("theme", newTheme);
  // };

// ✅ Theme toggle
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };



 useEffect(() => {
    document.body.className = theme;
  }, [theme]);


  // ✅ Filtered todos
  const filteredTodos = todos.filter(todo =>
    filter === "active" ? !todo.completed :
    filter === "completed" ? todo.completed : true
  );

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
