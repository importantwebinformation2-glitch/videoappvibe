// Simple working version with console logs for debugging
console.log("App loaded successfully!");

function App() {
  const [videoUrl, setVideoUrl] = React.useState(null);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [activeTab, setActiveTab] = React.useState('text');

  const generateVideo = () => {
    console.log("Starting video generation...");
    setIsGenerating(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 10;
        console.log(`Progress: ${newProgress}%`);
        if (newProgress >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          console.log("Video generation complete!");

          // Use a CORS-friendly video URL
          setVideoUrl("https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4");
          return 100;
        }
        return newProgress;
      });
    }, 200);
  };

  const handleGenerate = (e) => {
    e && e.preventDefault();
    console.log("Generate button clicked!");
    generateVideo();
  };

  const downloadVideo = () => {
    console.log("Download clicked, URL:", videoUrl);
    if (videoUrl) {
      const link = document.createElement('a');
      link.href = videoUrl;
      link.download = 'generated-video.mp4';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      console.log("Download triggered");
    }
  };

  const shareVideo = () => {
    console.log("Share clicked, URL:", videoUrl);
    if (videoUrl) {
      alert(`Video ready! Link: ${videoUrl}\n\nCopy this link to share.`);
    }
  };

  console.log("Rendering app...");

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #f0f9ff, #e0f2fe)',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', color: '#1e40af', marginBottom: '30px' }}>
          AI Video Generator
        </h1>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          marginBottom: '20px',
          borderBottom: '1px solid #e2e8f0',
          paddingBottom: '10px'
        }}>
          <button
            onClick={() => setActiveTab('text')}
            style={{
              padding: '8px 16px',
              background: activeTab === 'text' ? '#1e40af' : '#e2e8f0',
              color: activeTab === 'text' ? 'white' : '#1e40af',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Text to Video
          </button>
          <button
            onClick={() => setActiveTab('audio')}
            style={{
              padding: '8px 16px',
              background: activeTab === 'audio' ? '#1e40af' : '#e2e8f0',
              color: activeTab === 'audio' ? 'white' : '#1e40af',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Audio to Video
          </button>
          <button
            onClick={() => setActiveTab('video')}
            style={{
              padding: '8px 16px',
              background: activeTab === 'video' ? '#1e40af' : '#e2e8f0',
              color: activeTab === 'video' ? 'white' : '#1e40af',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Video to Video
          </button>
        </div>

        <div style={{
          background: 'white',
          padding: '25px',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          marginBottom: '20px'
        }}>
          {activeTab === 'text' && (
            <form onSubmit={handleGenerate}>
              <textarea
                style={{
                  width: '100%',
                  minHeight: '100px',
                  padding: '12px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  marginBottom: '15px',
                  fontSize: '14px'
                }}
                placeholder="Describe your video..."
              />
              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#1e40af',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  cursor: 'pointer'
                }}
              >
                {isGenerating ? 'Generating...' : 'Generate Video'}
              </button>
            </form>
          )}

          {activeTab === 'audio' && (
            <div>
              <p style={{ marginBottom: '15px' }}>Upload an audio file:</p>
              <input
                type="file"
                accept="audio/*"
                onChange={handleGenerate}
                style={{ display: 'none' }}
                id="audio-upload"
              />
              <label
                htmlFor="audio-upload"
                style={{
                  display: 'block',
                  padding: '40px',
                  border: '2px dashed #cbd5e1',
                  borderRadius: '8px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: '#f8fafc'
                }}
              >
                Click to upload audio
              </label>
            </div>
          )}

          {activeTab === 'video' && (
            <div>
              <p style={{ marginBottom: '15px' }}>Upload a video file:</p>
              <input
                type="file"
                accept="video/*"
                onChange={handleGenerate}
                style={{ display: 'none' }}
                id="video-upload"
              />
              <label
                htmlFor="video-upload"
                style={{
                  display: 'block',
                  padding: '40px',
                  border: '2px dashed #cbd5e1',
                  borderRadius: '8px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: '#f8fafc'
                }}
              >
                Click to upload video
              </label>
            </div>
          )}
        </div>

        {isGenerating && (
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            marginBottom: '20px'
          }}>
            <h3 style={{ margin: '0 0 10px 0' }}>Generating Video...</h3>
            <div style={{
              width: '100%',
              background: '#e2e8f0',
              borderRadius: '9999px',
              height: '8px'
            }}>
              <div style={{
                width: `${progress}%`,
                background: '#1e40af',
                height: '100%',
                borderRadius: '9999px',
                transition: 'width 0.3s'
              }}></div>
            </div>
            <p style={{ margin: '10px 0 0 0', color: '#64748b' }}>{progress}% complete</p>
          </div>
        )}

        {videoUrl && !isGenerating && (
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ margin: '0 0 15px 0' }}>Your Video</h2>
            <video
              src={videoUrl}
              controls
              style={{ width: '100%', borderRadius: '8px', marginBottom: '15px' }}
              poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='338'%3E%3Crect width='100%25' height='100%25' fill='%23e2e8f0'/%3E%3Ctext x='50%25' y='50%25' fill='%231e40af' text-anchor='middle' dy='.3em' font-size='20'%3EVideo Ready%3C/text%3E%3C/svg%3E"
            />
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handleGenerate}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: '#e2e8f0',
                  color: '#1e40af',
                  border: 'none',
                  borderRadius: '6px',
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
console.log("Initializing React...");
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
console.log("App rendered!");
