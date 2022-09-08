import React from "react";

import TaskFilter from "../taskFilter";

import "./footer.css";

export default function Footer({
  toDo,
  onToggleFilter,
  clearCompleted,
  buttons,
  filter
}) {
  return (
    <footer className="footer">
      <span className="todo-count">{toDo} items left</span>
      <TaskFilter
        onToggleFilter={onToggleFilter}
        clearCompleted={clearCompleted}
        buttonsText={buttons}
        filter={filter}
      />
      <button
        type="button"
        className="clear-completed"
        onClick={() => clearCompleted()}
      >
        Clear completed
      </button>
    </footer>
  );
}
