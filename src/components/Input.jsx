import * as React from 'react';
// interface InputProps {
//   className?: string;
//   style?: React.CSSProperties;
//   placeholder?: string;
//   value?: string;
//   onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   type?: string;
//   disabled?: boolean;
//   checked?: boolean;
// }
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
