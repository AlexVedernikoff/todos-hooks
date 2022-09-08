import React, { useState } from "react";

import "./newTaskForm.css";

export default function NewTaskForm({ onItemAdded }) {
  const [taskFormState, setTaskForm] = useState({
    label: "",
    min: "",
    sec: ""
  });

  const { label, min, sec } = taskFormState;

  const onLabelChange = (event) => {
    // console.log("Вы вызвали функцию onLabelChange");
    // console.log(event.target.value);
    setTaskForm({ label: event.target.value, min, sec });
  };

  const onChangeTime = (event) => {
    // console.log(`Мы внутри функции onChangeTime`);
    const { value, name } = event.target;

    if (value.trim() && value <= 59 && value >= 0 && !Number.isNaN(value)) {
      name === "min"
        ? setTaskForm({ label, min: value, sec })
        : setTaskForm({ label, min, sec: value });
    }
    if (!value.trim()) {
      name === "min"
        ? setTaskForm({ label, min: "", sec })
        : setTaskForm({ label, min, sec: "" });
    }
  };

  const onSubmit = (event) => {
    const { label, min, sec } = taskFormState;
    event.preventDefault();
    onItemAdded(label, min, sec);
    setTaskForm({ label: "", min: "", sec: "" });
  };

  return (
    <form className="new-todo-form" onSubmit={onSubmit}>
      <input
        type="text"
        className="new-todo"
        placeholder="Task"
        onChange={onLabelChange}
        value={label}
        autoFocus
        required
      />
      <input
        className="new-todo-form__timer"
        placeholder="Min"
        name="min"
        value={min}
        onChange={onChangeTime}
        required
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            onSubmit(event);
          }
        }}
      />
      <input
        className="new-todo-form__timer"
        placeholder="Sec"
        name="sec"
        value={sec}
        onChange={onChangeTime}
        required
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            onSubmit(event);
          }
        }}
      />
      <input className="new-todo-form__submit" type="submit" />
    </form>
  );
}
