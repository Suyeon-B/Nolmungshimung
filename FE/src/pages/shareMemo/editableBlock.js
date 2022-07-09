import React from "react";
import ContentEditable from "react-contenteditable";

import "./styles.css";
import SelectMenu from "./selectMenu";

import { getCaretCoordinates, setCaretToEnd } from "./utils/caretHelpers";

const CMD_KEY = "/";

class EditableBlock extends React.Component {
  constructor(props) {
    super(props);
    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.onKeyDownHandler = this.onKeyDownHandler.bind(this);
    this.onKeyUpHandler = this.onKeyUpHandler.bind(this);
    this.openSelectMenuHandler = this.openSelectMenuHandler.bind(this);
    this.closeSelectMenuHandler = this.closeSelectMenuHandler.bind(this);
    this.tagSelectionHandler = this.tagSelectionHandler.bind(this);
    this.contentEditable = React.createRef();
    this.state = {
      htmlBackup: null, // needed to store the html temporarely
      html: "",
      tag: "p",
      previousKey: "",
      selectMenuIsOpen: false,
      selectMenuPosition: {
        x: null,
        y: null,
      },
    };
  }

  componentDidMount() {
    this.setState({ html: this.props.html, tag: this.props.tag });
  }

  // Update the page component if one of the following is true:
  // 1. user has changed the html content
  // 2. user has changed the tag
  componentDidUpdate(prevProps, prevState) {
    const htmlChanged = prevState.html !== this.state.html;
    const tagChanged = prevState.tag !== this.state.tag;
    if (htmlChanged || tagChanged) {
      this.props.updatePage({
        id: this.props.id,
        html: this.state.html,
        tag: this.state.tag,
      });
    }
  }

  onChangeHandler(e) {
    this.setState({ html: e.target.value });
  }

  onKeyDownHandler(e) {
    if (e.key === CMD_KEY) {
      // If the user starts to enter a command, we store a backup copy of
      // the html. We need this to restore a clean version of the content
      // after the content type selection was finished.
      this.setState({ htmlBackup: this.state.html });
    }
    if (e.key === "Enter") {
      // While pressing "Enter" should add a new block to the page, we
      // still want to allow line breaks by pressing "Shift-Enter"
      if (this.state.previousKey !== "Shift" && !this.state.selectMenuIsOpen) {
        e.preventDefault();
        this.props.addBlock({
          id: this.props.id,
          ref: this.contentEditable.current,
        });
      }
    }
    if (e.key === "Backspace" && !this.state.html) {
      // If there is no content, we delete the block by pressing "Backspace",
      // just as we would remove a line in a regular text container
      e.preventDefault();
      this.props.deleteBlock({
        id: this.props.id,
        ref: this.contentEditable.current,
      });
    }
    // Store the key to detect combinations like "Shift-Enter" later on
    this.setState({ previousKey: e.key });
  }

  // The openSelectMenuHandler function needs to be invoked on key up. Otherwise
  // the calculation of the caret coordinates does not work properly.
  onKeyUpHandler(e) {
    if (e.key === CMD_KEY) {
      this.openSelectMenuHandler();
    }
  }

  // After openening the select menu, we attach a click listener to the dom that
  // closes the menu after the next click - regardless of outside or inside menu.
  openSelectMenuHandler() {
    const { x, y } = getCaretCoordinates();
    this.setState({
      selectMenuIsOpen: true,
      selectMenuPosition: { x, y },
    });
    document.addEventListener("click", this.closeSelectMenuHandler);
  }

  closeSelectMenuHandler() {
    this.setState({
      htmlBackup: null,
      selectMenuIsOpen: false,
      selectMenuPosition: { x: null, y: null },
    });
    document.removeEventListener("click", this.closeSelectMenuHandler);
  }

  // Restore the clean html (without the command), focus the editable
  // with the caret being set to the end, close the select menu
  tagSelectionHandler(tag) {
    this.setState({ tag: tag, html: this.state.htmlBackup }, () => {
      setCaretToEnd(this.contentEditable.current);
      this.closeSelectMenuHandler();
    });
  }

  render() {
    return (
      <>
        {this.state.selectMenuIsOpen && (
          <SelectMenu
            position={this.state.selectMenuPosition}
            onSelect={this.tagSelectionHandler}
            close={this.closeSelectMenuHandler}
          />
        )}
        <ContentEditable
          className="Block"
          innerRef={this.contentEditable}
          html={this.state.html}
          tagName={this.state.tag}
          onChange={this.onChangeHandler}
          onKeyDown={this.onKeyDownHandler}
          onKeyUp={this.onKeyUpHandler}
        />
      </>
    );
  }
}

export default EditableBlock;
