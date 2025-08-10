import React from "react";
import "./ImageViewer.css";

type Props = {
  imageUrl?: string;
};

export default function ImageViewer({ imageUrl }: Props) {
  if (!imageUrl) return null;
  return (
    <div className="image-viewer">
      <img src={imageUrl} alt="스토리 이미지" />
    </div>
  );
}


