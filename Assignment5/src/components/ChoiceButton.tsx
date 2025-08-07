interface Props {
  text: string;
  onClick: () => void;
}

export default function ChoiceButton({ text, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="p-2 border rounded hover:bg-gray-100 transition"
    >
      {text}
    </button>
  );
}

