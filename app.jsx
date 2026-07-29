function App() {
  const [activeTab, setActiveTab] = React.useState('text');
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [videoUrl, setVideoUrl] = React.useState(null);
  const [textInput, setTextInput] = React.useState('');
  const [audioFile, setAudioFile] = React.useState(null);
  const [videoFile, setVideoFile] = React.useState(null);

  // Mock video generation
  const generateVideo = () => {
    setIsGenerating(true);
    setProgress(0);

    // Simulate generation
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 5;
        if (newProgress >= 100) {
          clearInterval(interval);
          setIsGenerating(false);

          // Create a mock video URL
          setVideoUrl("https://assets.mixkit.co/videos/preview/mixkit-woman-reading-a-book-while-relaxing-in-a-living-room-39539-large.mp4");
          return 100;
        }
        return newProgress;
      });
    }, 200);
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (textInput.trim()) generateVideo();
  };

  const handleAudioUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAudioFile(URL.createObjectURL(file));
      generateVideo();
    }
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(URL.createObjectURL(file));
      generateVideo();
    }
  };

  const downloadVideo = () => {
    if (videoUrl) {
      const link = document.createElement('a');
      link.href = videoUrl;
      link.download = 'ai-generated-video.mp4';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const shareVideo = () => {
    if (videoUrl) {
      alert('Share this link: ' + videoUrl);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">▶</span>
          </div>
          <h1 className="text-2xl font-bold">AI Video Generator</h1>
        </div>

        {/* Tabs */}
        <div className="flex border-b mb-6">
          <button
            onClick={() => setActiveTab('text')}
            className={`px-4 py-2 font-medium ${activeTab === 'text' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
          >
            Text to Video
          </button>
          <button
            onClick={() => setActiveTab('audio')}
            className={`px-4 py-2 font-medium ${activeTab === 'audio' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
          >
            Audio to Video
          </button>
          <button
            onClick={() => setActiveTab('video')}
            className={`px-4 py-2 font-medium ${activeTab === 'video' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
          >
            Video to Video
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'text' && (
          <form onSubmit={handleTextSubmit} className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Describe Your Video</h2>
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg mb-4"
              rows="4"
              placeholder="e.g., 'A sunset over mountains, cinematic style, 10 seconds'"
              disabled={isGenerating}
            />
            <button
              type="submit"
              disabled={isGenerating || !textInput.trim()}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400"
            >
              {isGenerating ? 'Generating...' : 'Generate Video'}
            </button>
          </form>
        )}

        {activeTab === 'audio' && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Upload Audio</h2>
            <input
              type="file"
              accept="audio/*"
              onChange={handleAudioUpload}
              disabled={isGenerating}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
          </div>
        )}

        {activeTab === 'video' && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Upload Video</h2>
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoUpload}
              disabled={isGenerating}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
          </div>
        )}

        {/* Progress Bar */}
        {isGenerating && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h3 className="font-semibold mb-2">Generating Video...</h3>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 mt-2">{progress}% complete</p>
          </div>
        )}

        {/* Video Preview */}
        {videoUrl && !isGenerating && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Your Generated Video</h2>
            <div className="relative bg-black rounded-lg overflow-hidden mb-4">
              <video
                src={videoUrl}
                controls
                className="w-full"
                poster="https://via.placeholder.com/640x360?text=AI+Generated+Video"
              />
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setVideoUrl(null)}
                className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg font-medium hover:bg-gray-300"
              >
                Generate Again
              </button>
              <button
                onClick={downloadVideo}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700"
              >
                Download
              </button>
              <button
                onClick={shareVideo}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700"
              >
                Share
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
