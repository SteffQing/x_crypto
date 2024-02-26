import * as React from 'react';

const Input = (props) => {
  return (
    <input
      type={props.type}
      className={props.className}
      style={props.style}
      placeholder={props.placeholder}
      value={props.value}
      onChange={props.onChange}
      disabled={props.disabled}
      checked={props.checked}
    />
  );
};

export default Input;
