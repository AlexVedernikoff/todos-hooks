import React, { useState } from "react";

import "./task.css";

export default function Task(props) {
  const {
    done,
    id,
    string,
    onToggleDone,
    onDeleted,
    onEdit,
    onStartTimer,
    onStopTimer,
    min,
    sec,
    label
  } = props;

  const [taskState, setTaskState] = useState({
    labelState: label,
    editClassName: "hidden",
    taskClassName: "view",
    isTimeElapsed: ""
  });

  const onLabelChange = (event) => {
    // console.log("Вы вызвали функцию onLabelChange");
    // console.log(event.target.value);
    setTaskState((previous) => ({
      ...previous,
      labelState: event.target.value
    }));
  };

  const onSubmit = (event) => {
    const { labelState } = taskState;
    event.preventDefault();
    onEdit(id, labelState);
    setTaskState((previous) => ({
      ...previous,
      taskClassName: "view",
      editClassName: "hidden"
    }));
  };

  if (Number(min + sec) === 0) {
    const { isTimeElapsed } = taskState;
    if (!isTimeElapsed) {
      setTaskState((previous) => ({
        ...previous,
        isTimeElapsed: "timeElapsed"
      }));
    }
  }

  let classNames;
  let checked;
  if (done) {
    classNames = "completed";
    checked = true;
  } else {
    classNames = "";
    checked = false;
  }

  const { taskClassName, isTimeElapsed, labelState } = taskState;
  return (
    <div>
      <li id={id} className={classNames}>
        <div className={taskClassName}>
          <input
            className="toggle"
            type="checkbox"
            onChange={onToggleDone}
            checked={checked}
          />
          <label>
            <span className="title">
              <button id="1" onClick={onToggleDone}>
                {label}
              </button>
            </span>
            <span className="description">
              <button className="icon icon-play" onClick={onStartTimer} />
              <button className="icon icon-pause" onClick={onStopTimer} />
              <span className={isTimeElapsed}>
                {`${String(min).padStart(2, "0")}:
                  ${String(sec).padStart(2, "0")}`}
              </span>
            </span>
            <span className="description">{string}</span>
          </label>
          <button
            className="icon icon-edit"
            onClick={() => {
              setTaskState((previous) => ({
                ...previous,
                taskClassName: "hidden",
                editClassName: "view"
              }));
            }}
          />
          <button className="icon icon-destroy" onClick={onDeleted} />
        </div>
      </li>
      <li className="editing">
        <div className={taskState.editClassName}>
          <form onSubmit={onSubmit}>
            <input
              id="edit"
              className="edit"
              type="text"
              onChange={onLabelChange}
              value={labelState}
              ref={(input) => input && input.focus()}
              autoFocus
            />
          </form>
        </div>
      </li>
    </div>
  );
}
