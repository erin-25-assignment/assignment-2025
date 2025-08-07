export default function History() {
  const history = JSON.parse(localStorage.getItem('story_history') || '[]');

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-4">스토리 히스토리</h1>
      {history.map((step: any, idx: number) => (
        <div key={idx} className="mb-4 border p-2 rounded">
          <p>{step.story}</p>
          {step.image && <img src={step.image} alt="Story" className="mt-2 w-full" />}
        </div>
      ))}
    </div>
  );
}