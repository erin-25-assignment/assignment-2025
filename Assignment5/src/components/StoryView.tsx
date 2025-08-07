interface Props {
  text: string;
}

export default function StoryView({ text }: Props) {
  return <p className="text-lg font-medium mb-4">{text}</p>;
}
