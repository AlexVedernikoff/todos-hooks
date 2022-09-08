import React from "react";

import Task from "../task";

import "./taskList.css";

export default function TaskList(props) {
  const {
    todos,
    onDeleted,
    onEdit,
    onToggleDone,
    onStartTimer,
    onStopTimer,
    filter
  } = props;

  const elements = todos.map((item) => {
    const { id, ...itemProps } = item;

    return (
      <Task
        {...item}
        key={id}
        id={id}
        onDeleted={() => onDeleted(id)}
        onEdit={onEdit}
        onToggleDone={() => onToggleDone(id)}
        onStartTimer={() => onStartTimer(id)}
        onStopTimer={() => onStopTimer(id)}
        done={item.done}
        itemProps={itemProps}
      />
    );
  });

  const elementsDone = elements.filter((element) => {
    return element.props.done;
  });

  const elementsActive = elements.filter((element) => {
    return !element.props.done;
  });

  let arrayFiltetered;

  if (filter === "Completed") {
    arrayFiltetered = elementsDone;
  } else if (filter === "Active") {
    arrayFiltetered = elementsActive;
  } else {
    arrayFiltetered = elements;
  }

  return <ul className="todo-list">{arrayFiltetered}</ul>;
}
