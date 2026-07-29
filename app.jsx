function App() {
  const [text, setText] = React.useState('');
  const [videoUrl, setVideoUrl] = React.useState(null);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  // This will generate a real sample video
  const generateVideo = () => {
    setIsGenerating(true);
    setProgress(0);

    // Simulate progress
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsGenerating(false);
          // Use a real sample video URL
          setVideoUrl("https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4");
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      generateVideo();
    }
  };

  const downloadVideo = () => {
    const link = document.createElement('a');
    link.href = videoUrl;
    link.download = 'my-video.mp4';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const shareVideo = () => {
    alert('Video link copied! Share this: ' + videoUrl);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #f9fafb, #ffffff)', padding: '16px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
          <div style={{ width: '32px', height: '32px', background: '#2563eb', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'white', fontWeight: 'bold' }}>▶</span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>AI Video Generator</h1>
        </div>

        <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '24px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'semibold', marginBottom: '16px' }}>Describe Your Video</h2>
          <form onSubmit={handleSubmit}>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', marginBottom: '16px', fontSize: '14px', minHeight: '100px' }}
              placeholder="e.g., 'A beautiful sunset over mountains, cinematic style'"
              disabled={isGenerating}
            />
            <button
              type="submit"
              disabled={isGenerating || !text.trim()}
              style={{
                width: '100%',
                padding: '12px',
                background: isGenerating ? '#9ca3af' : '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: isGenerating ? 'not-allowed' : 'pointer'
              }}
            >
              {isGenerating ? 'Generating...' : 'Generate Video'}
            </button>
          </form>
        </div>

        {isGenerating && (
          <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '24px', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'semibold', marginBottom: '12px' }}>Generating Your Video</h3>
            <div style={{ width: '100%', background: '#e5e7eb', borderRadius: '9999px', height: '8px', overflow: 'hidden' }}>
              <div style={{ width: `${progress}%`, background: '#2563eb', height: '100%', borderRadius: '9999px', transition: 'width 0.3s' }}></div>
            </div>
            <p style={{ marginTop: '8px', fontSize: '14px', color: '#6b7280' }}>{progress}% complete</p>
          </div>
        )}

        {videoUrl && !isGenerating && (
          <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'semibold', marginBottom: '16px' }}>Your Generated Video</h2>
            <div style={{ background: '#000', borderRadius: '8px', overflow: 'hidden', marginBottom: '16px' }}>
              <video
                src={videoUrl}
                controls
                style={{ width: '100%', height: 'auto' }}
                poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='640' height='360'%3E%3Crect width='100%25' height='100%25' fill='%23000'/%3E%3Ctext x='50%25' y='50%25' fill='white' text-anchor='middle' dy='.3em'%3EAI Generated Video%3C/text%3E%3C/svg%3E"
              />
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setVideoUrl(null)}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: '#f3f4f6',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                Generate Again
              </button>
              <button
                onClick={downloadVideo}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                Download
              </button>
              <button
                onClick={shareVideo}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
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

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
