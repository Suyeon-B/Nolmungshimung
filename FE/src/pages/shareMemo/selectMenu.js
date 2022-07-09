import React from "react";
import { matchSorter } from "match-sorter";

const MENU_HEIGHT = 150;
const allowedTags = [
  {
    id: "page-title",
    tag: "h1",
    label: "Page Title",
  },
  {
    id: "heading",
    tag: "h2",
    label: "Heading",
  },
  {
    id: "subheading",
    tag: "h3",
    label: "Subheading",
  },
  {
    id: "paragraph",
    tag: "p",
    label: "Paragraph",
  },
];

class SelectMenu extends React.Component {
  constructor(props) {
    super(props);
    this.keyDownHandler = this.keyDownHandler.bind(this);
    this.state = {
      command: "",
      items: allowedTags,
      selectedItem: 0,
    };
  }

  // Attach a key listener to add any given key to the command
  componentDidMount() {
    document.addEventListener("keydown", this.keyDownHandler);
  }

  // Whenever the command changes, look for matching tags in the list
  componentDidUpdate(prevProps, prevState) {
    const command = this.state.command;
    if (prevState.command !== command) {
      const items = matchSorter(allowedTags, command, { keys: ["tag"] });
      this.setState({ items: items });
    }
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.keyDownHandler);
  }

  keyDownHandler(e) {
    const items = this.state.items;
    const selected = this.state.selectedItem;
    const command = this.state.command;

    switch (e.key) {
      case "Enter":
        e.preventDefault();
        this.props.onSelect(items[selected].tag);
        break;
      case "Backspace":
        if (!command) this.props.close();
        this.setState({ command: command.substring(0, command.length - 1) });
        break;
      case "ArrowUp":
        e.preventDefault();
        const prevSelected = selected === 0 ? items.length - 1 : selected - 1;
        this.setState({ selectedItem: prevSelected });
        break;
      case "ArrowDown":
      case "Tab":
        e.preventDefault();
        const nextSelected = selected === items.length - 1 ? 0 : selected + 1;
        this.setState({ selectedItem: nextSelected });
        break;
      default:
        this.setState({ command: this.state.command + e.key });
        break;
    }
  }

  render() {
    // Define the absolute position before rendering
    const x = this.props.position.x;
    const y = this.props.position.y - MENU_HEIGHT;
    const positionAttributes = { top: y, left: x };

    return (
      <div className="SelectMenu" style={positionAttributes}>
        <div className="Items">
          {this.state.items.map((item, key) => {
            const selectedItem = this.state.selectedItem;
            const isSelected = this.state.items.indexOf(item) === selectedItem;
            return (
              <div
                className={isSelected ? "Selected" : null}
                key={key}
                role="button"
                tabIndex="0"
                onClick={() => this.props.onSelect(item.tag)}
              >
                {item.label}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default SelectMenu;
