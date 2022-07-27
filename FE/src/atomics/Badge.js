import { Modal } from "antd";

const success = (message) => {
  Modal.success({
    content: message,
  });
};

const fail = (title, message) => {
  Modal.error({
    title: title,
    content: message,
  });
};

export default { success, fail };
