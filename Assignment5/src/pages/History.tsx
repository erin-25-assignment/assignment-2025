import { useEffect, useState } from "react";

type SavedStep = {
  story: string;
  choice: string;
  image: string;
};

export default function History() {
  const [history, setHistory] = useState<SavedStep[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("story_history");
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch {
        setHistory([]);
      }
    }
  }, []);

  if (history.length === 0) {
    return (
      <div className="p-6 max-w-3xl mx-auto text-center text-gray-500 dark:text-gray-400">
        스토리 히스토리가 없습니다.
      </div>
    );
  }

  return (
    <main className="p-6 max-w-3xl mx-auto dark:bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">스토리 히스토리</h1>

      <section className="space-y-6">
        {history.map((step, idx) => (
          <article
            key={idx}
            className="border border-gray-300 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 shadow-md"
          >
            <p className="font-semibold text-gray-900 dark:text-gray-100">{step.story}</p>
            {step.choice && <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">선택: {step.choice}</p>}
            {step.image && (
              <img
                src={step.image}
                alt="스토리 이미지"
                className="mt-4 w-full rounded-lg object-cover max-h-72"
              />
            )}
          </article>
        ))}
      </section>
    </main>
  );
}

