interface Props {
  imageUrl: string;
}

export default function ImageViewer({ imageUrl }: Props) {
  if (!imageUrl) return null;
  return <img src={imageUrl} alt="Story scene" className="w-full rounded mb-4" />;
}