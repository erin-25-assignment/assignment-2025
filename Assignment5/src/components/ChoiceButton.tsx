import React from "react";
import "./ChoiceButton.css";

type Props = {
  text: string;
  onClick: () => void;
  disabled?: boolean;
};

export default function ChoiceButton({ text, onClick, disabled }: Props) {
  return (
    <button
      className={`choice-button ${disabled ? "disabled" : ""}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={`선택지: ${text}`}
      type="button"
    >
      {text}
    </button>
  );
}

