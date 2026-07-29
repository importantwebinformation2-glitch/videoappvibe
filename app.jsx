function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">▶</span>
          </div>
          <h1 className="text-2xl font-bold">AI Video Generator</h1>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Create Video from Text</h2>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg mb-4"
            rows="4"
            placeholder="Describe your video..."
          />
          <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700">
            Generate Video
          </button>
        </div>

        <div className="bg-gray-100 rounded-xl p-6 text-center">
          <p className="text-gray-600">Your generated video will appear here</p>
        </div>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
