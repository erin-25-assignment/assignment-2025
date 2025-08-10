import React from "react";
import "./StoryView.css";

type Props = {
  text: string;
};

export default function StoryView({ text }: Props) {
  return <div className="story-view">{text}</div>;
}

