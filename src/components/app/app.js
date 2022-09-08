import React, { useState, useEffect } from "react";
import { formatDistance } from "date-fns";
import { isEqual } from "lodash";

import "./app.css";
import TaskList from "../taskList";
import Footer from "../footer";
import NewTaskForm from "../newTaskForm";

export default function App() {
  const createTodoItem = (
    label,
    timeStamp,
    id,
    min = 59,
    sec = 59,
    statusTimer = "stop"
  ) => {
    return {
      label,
      min,
      sec,
      statusTimer,
      done: false,
      id: id,
      timeStamp,
      string: formatDistance(new Date(), timeStamp, {
        includeSeconds: true
      })
    };
  };

  let initialState = JSON.parse(localStorage.getItem("todoData"));
  if (!initialState || !initialState.length) {
    initialState = [
      createTodoItem("Drink coffee", new Date(), 0),
      createTodoItem("Make Awesome App", new Date(), 1),
      createTodoItem("Have a lunch", new Date(), 2)
    ];
  }

  const [todoState, setTodoState] = useState({
    todoData: initialState,
    buttons: ["All", "Active", "Completed"],
    filter: "All",
    timer: {}
  });

  const addItem = (text, min = 59, sec = 59, statusTimer = "stop") => {
    const { todoData } = todoState;
    const id = todoData.reduce((acc, item) => {
      if (item.id > acc) {
        acc = item.id;
      }
      return acc + 1;
    }, 0);
    const newItem = createTodoItem(text, new Date(), id, min, sec, statusTimer);
    const newArray = [...todoData, newItem];
    localStorage.setItem("todoData", JSON.stringify(newArray));
    setTodoState((previous) => ({
      ...previous,
      todoData: newArray
    }));
  };

  const deleteItem = (id) => {
    setTodoState((previous) => {
      const { todoData, timer } = previous;
      clearInterval(timer[id]);
      const newTimer = {};
      for (const key in timer) {
        if (Number(key) !== id) {
          newTimer[key] = timer[key];
        }
      }
      const idx = todoData.findIndex((el) => el.id === id);
      const newArray = [...todoData.slice(0, idx), ...todoData.slice(idx + 1)];
      localStorage.setItem("todoData", JSON.stringify(newArray));
      return {
        ...previous,
        todoData: newArray,
        timer: newTimer
      };
    });
  };

  const clearCompleted = () => {
    const { todoData } = todoState;
    const newArray = todoData.reduce((acc, item) => {
      if (!item.done) {
        acc.push(item);
      }
      return acc;
    }, []);
    localStorage.setItem("todoData", JSON.stringify(newArray));
    setTodoState((previous) => ({
      ...previous,
      todoData: newArray
    }));
  };

  const updateList = (todoData, newItem, idx) => {
    return [...todoData.slice(0, idx), newItem, ...todoData.slice(idx + 1)];
  };

  const editItem = (id, label) => {
    const { todoData } = todoState;
    const idx = todoData.findIndex((el) => el.id === id);
    const oldItem = todoData[idx];
    const newItem = {
      ...oldItem,
      label: label
    };
    const newArray = updateList(todoData, newItem, idx);
    localStorage.setItem("todoData", JSON.stringify(newArray));
    setTodoState((previous) => ({
      ...previous,
      todoData: newArray
    }));
  };

  const toggleProperty = (todoData, id, propName, label) => {
    const idx = todoData.findIndex((el) => el.id === id);
    if (!label) {
      label = todoData[idx].label;
    }
    const oldItem = todoData[idx];
    const newItem = {
      ...oldItem,
      [propName]: !oldItem[propName],
      label: label
    };
    const newArray = updateList(todoData, newItem, idx);
    return newArray;
  };

  const updateTime = (todoData, stringArray) => {
    const newArray = todoData.map((element, i) => {
      const newItem = element;
      if (stringArray[i]) {
        newItem.string = stringArray[i];
      }
      return newItem;
    });
    localStorage.setItem("todoData", JSON.stringify(newArray));
    return newArray;
  };

  const onToggleDone = (id) => {
    const { todoData } = todoState;
    const newArray = toggleProperty(todoData, id, "done");
    localStorage.setItem("todoData", JSON.stringify(newArray));
    setTodoState((previous) => ({
      ...previous,
      todoData: newArray
    }));
  };

  const onToggleFilter = (text) => {
    setTodoState((previous) => ({
      ...previous,
      filter: text
    }));
  };

  const onStartTimer = (id) => {
    const { todoData, timer } = todoState;
    const idx = todoData.findIndex((el) => el.id === id);
    if (!timer[id]) {
      const timerId = setInterval(() => {
        setTodoState((previous) => {
          const { todoData } = previous;
          const idx = todoData.findIndex((el) => el.id === id);
          if (idx === -1) return previous;
          let { min, sec } = todoData[idx];
          if (sec > 0) {
            sec--;
          } else if (min > 0) {
            sec = 59;
            min--;
          }
          if (todoData[idx]) {
            const oldItem = todoData[idx];
            if (!oldItem) return;
            const newItem = {
              ...oldItem,
              min: min,
              sec: sec
            };
            const newArray = updateList(todoData, newItem, idx);
            localStorage.setItem("todoData", JSON.stringify(newArray));
            return {
              ...previous,
              todoData: newArray
            };
          }
        });
      }, 1000);

      timer[id] = timerId;

      setTodoState((previous) => {
        const { todoData } = previous;
        if (todoData[idx]) {
          const oldItem = todoData[idx];
          if (!oldItem) return;
          const newItem = {
            ...oldItem,
            statusTimer: "play"
          };
          const newArray = updateList(todoData, newItem, idx);
          localStorage.setItem("timer", JSON.stringify(timer));
          return {
            ...previous,
            todoData: newArray,
            timer
          };
        }
      });
    }
  };

  const onStopTimer = (id) => {
    const { timer } = todoState;
    if (timer[id]) {
      localStorage.setItem("stop", JSON.stringify(timer[id]));
    }
    clearInterval(timer[id]);
    const newTimer = {};
    for (const key in timer) {
      if (Number(key) !== id) {
        newTimer[key] = timer[key];
      }
    }
    setTodoState((previous) => {
      const { todoData } = previous;
      const idx = todoData.findIndex((el) => el.id === id);
      const oldItem = todoData[idx];
      const newItem = {
        ...oldItem,
        statusTimer: "stop"
      };
      const newArray = updateList(todoData, newItem, idx);
      localStorage.setItem("todoData", JSON.stringify(newArray));
      localStorage.setItem("timer", JSON.stringify(newTimer));
      return {
        ...previous,
        todoData: newArray,
        timer: newTimer
      };
    });
  };

  const updateData = () => {
    // console.log("Произошли изменения в локальном хранилище!");
    let newData = JSON.parse(localStorage.getItem("todoData"));
    let newTimer = JSON.parse(localStorage.getItem("timer"));
    const { todoData } = todoState;
    if (!newTimer) {
      newTimer = {};
    }
    if (!newData) {
      newData = todoData;
    }
    if (!isEqual(newData, todoData)) {
      setTodoState((previous) => {
        return {
          ...previous,
          todoData: newData,
          timer: newTimer
        };
      });
    }
  };

  //Если таймер был остановлен из другой вкладки
  const updateTimer = () => {
    const stopId = JSON.parse(localStorage.getItem("stop"));
    console.log(`Произошло событе stop и оно равно ${stopId}`);
    clearInterval(stopId);
  };

  useEffect(() => {
    window.addEventListener("storage", updateTimer);
    return () => window.removeEventListener("storage", updateTimer);
  }, []);

  useEffect(() => {
    localStorage.removeItem("timer");
    window.addEventListener("storage", updateData);
    //После перезагрузки страницы запускаем влюченные таймеры заново.
    const { todoData } = todoState;
    todoData.forEach((el) => {
      if (el.statusTimer === "play") {
        console.log("Мы запускаем play из UseEffect!");
        console.log("play!");
        onStartTimer(el.id);
      }
    });
  }, []);

  //Обновляем время создания дел в списке
  useEffect(() => {
    const newTime = setInterval(() => {
      setTodoState((previous) => {
        const { todoData } = previous;
        const stringArray = todoData.map((element) => {
          return formatDistance(new Date(), new Date(element.timeStamp), {
            includeSeconds: true
          });
        });

        const newArray = updateTime(todoData, stringArray);

        return {
          ...previous,
          todoData: newArray
        };
      });
    }, 4000);
    return () => clearInterval(newTime);
  }, []);

  const { todoData, filter, buttons } = todoState;
  const doneCount = todoData.filter((el) => el.done).length;
  const todoCount = todoData.length - doneCount;

  return (
    <section className="todoapp">
      <header className="header">
        <h1>todos</h1>
        <NewTaskForm onItemAdded={addItem} />
      </header>
      <section className="main">
        <TaskList
          todos={todoData}
          onDeleted={deleteItem}
          onEdit={editItem}
          onToggleDone={onToggleDone}
          onStartTimer={onStartTimer}
          onStopTimer={onStopTimer}
          filter={filter}
        />
        <Footer
          toDo={todoCount}
          onToggleFilter={onToggleFilter}
          clearCompleted={clearCompleted}
          buttons={buttons}
          filter={filter}
        />
      </section>
    </section>
  );
}
