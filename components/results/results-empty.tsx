export function ResultsEmpty({ onStartNew }: { onStartNew: () => void }) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p className="text-gray-500 mb-4 text-5xl">No results found</p>
        <button
          onClick={onStartNew}
          className="bg-cyan-500 text-white px-10 py-10 rounded-lg hover:bg-cyan-600 text-7xl cursor-pointer transition-all animate-pulse"
        >
          Start New Analysis
        </button>
      </div>
    </div>
  );
}
