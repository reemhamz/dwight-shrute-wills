import React from "react";
import "../styles/App.scss";

const Modal = (props, otherProps) => {
  const wills = props.willInfo;
  const willId = props.willId;

  const filterClick = wills.find((will) => {
    return will.key === willId;
  });

  const name = filterClick.info.fileName;

  const date = filterClick.info.date;

  return (
    <div className="modal">
      <h2>File upload information:</h2>
      <div>
        <h3>File Name</h3> <span>{name}</span>
      </div>
      <div>
        <h3>Date and time uploaded:</h3>
        <span>{date}</span>
      </div>
      <button onClick={(e) => props.onChange(false)}>Close modal</button>
    </div>
  );
};

export default Modal;
