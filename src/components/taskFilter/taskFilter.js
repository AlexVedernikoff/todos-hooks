import React from "react";

import "./taskFilter.css";

export default function TaskFilter({ onToggleFilter, buttonsText, filter }) {
  const buttons = buttonsText.map((text, i) => {
    let className = "";
    if (text === filter) {
      className = "selected";
    }
    return (
      <li key={i}>
        <button
          type="button"
          className={className}
          onClick={() => onToggleFilter(text)}
        >
          {text}
        </button>
      </li>
    );
  });

  return <ul className="filters">{buttons}</ul>;
}
