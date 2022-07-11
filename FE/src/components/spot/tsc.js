"use strict";
exports.__esModule = true;
var react_1 = require("react");
var react_2 = require("@syncedstore/react");
var store_1 = require("./store");
function App() {
  var state = (0, react_2.useSyncedStore)(store_1.store);
  return (
    <div>
      <p>Todo items:</p>
      <ul>
        {state.todos.map(function (todo, i) {
          return (
            <li
              key={i}
              style={{ textDecoration: todo.completed ? "line-through" : "" }}
            >
              <label>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onClick={function () {
                    return (todo.completed = !todo.completed);
                  }}
                />
                {todo.title}
              </label>
            </li>
          );
        })}
      </ul>
      <input
        placeholder="Enter a todo item and hit enter"
        type="text"
        onKeyPress={function (event) {
          if (event.key === "Enter") {
            var target = event.target;
            // Add a todo item using the text added in the textfield
            state.todos.push({ completed: false, title: target.value });
            target.value = "";
          }
        }}
        style={{ width: "200px", maxWidth: "100%" }}
      />
    </div>
  );
}
exports["default"] = App;
