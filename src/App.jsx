import React, { useState, useRef, useCallback } from 'react';
import { Upload, Mic, Video, Text, Download, Share, Loader2, Play, Pause, RotateCcw, Settings, HelpCircle } from 'nucleo-sharp';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

// Mock video generation - in a real app, this would call an AI API
const generateVideoFromText = async (text, options) => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  return {
    url: URL.createObjectURL(new Blob([], { type: 'video/mp4' })),
    duration: Math.min(60, Math.max(10, text.length / 10)),
    size: Math.min(50, Math.max(5, text.length / 5)) + 'MB'
  };
};

const generateVideoFromAudio = async (audioFile, options) => {
  await new Promise(resolve => setTimeout(resolve, 3000));
  return {
    url: URL.createObjectURL(new Blob([], { type: 'video/mp4' })),
    duration: 30,
    size: '25MB'
  };
};

const generateVideoFromVideo = async (videoFile, options) => {
  await new Promise(resolve => setTimeout(resolve, 4000));
  return {
    url: URL.createObjectURL(new Blob([], { type: 'video/mp4' })),
    duration: 45,
    size: '35MB'
  };
};

// Mock download function
const downloadVideo = (url, filename = 'ai-generated-video.mp4') => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Mock share function
const shareVideo = async (url) => {
  const shareData = {
    title: 'AI Generated Video',
    text: 'Check out this video I generated with AI!',
    url: url
  };
  
  try {
    if (navigator.share) {
      await navigator.share(shareData);
      return true;
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(url);
      return true;
    }
  } catch (err) {
    console.error('Error sharing:', err);
    return false;
  }
};

// Video preview component
const VideoPreview = ({ src, onReset, isGenerating, progress }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  if (isGenerating) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Generating Your Video</CardTitle>
          <CardDescription>Please wait while we create your video</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center space-y-4 py-8">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <div className="w-full max-w-md">
              <Progress value={progress} className="h-4" />
              <p className="text-sm text-muted-foreground mt-2 text-center">
                {Math.round(progress)}% complete
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!src) {
    return (
      <Card className="w-full border-2 border-dashed border-muted">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Upload className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-center">
            Your generated video will appear here
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Your Generated Video</CardTitle>
        <CardDescription>Preview and download your AI-generated video</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-4">
          <video
            ref={videoRef}
            src={src}
            className="w-full h-full object-contain"
            onClick={handlePlayPause}
            controls={false}
          />
          <button
            onClick={handlePlayPause}
            className="absolute inset-0 flex items-center justify-center"
          >
            {isPlaying ? (
              <Pause className="h-12 w-12 text-white bg-black bg-opacity-50 rounded-full p-2" />
            ) : (
              <Play className="h-12 w-12 text-white bg-black bg-opacity-50 rounded-full p-2" />
            )}
          </button>
        </div>
        <div className="flex gap-4">
          <Button onClick={onReset} variant="outline" className="flex-1">
            <RotateCcw className="h-4 w-4 mr-2" />
            Generate Again
          </Button>
          <Button onClick={() => downloadVideo(src)} className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button onClick={() => shareVideo(src)} variant="outline" className="flex-1">
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Text to video tab
const TextToVideoTab = ({ onGenerate, isGenerating }) => {
  const [text, setText] = useState('');
  const [style, setStyle] = useState('realistic');
  const [duration, setDuration] = useState('15');
  const [includeVoiceover, setIncludeVoiceover] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onGenerate({
        type: 'text',
        text,
        options: { style, duration: parseInt(duration), includeVoiceover }
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="video-text" className="text-lg font-semibold">
          Describe your video
        </Label>
        <Textarea
          id="video-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="e.g., 'A sunset over the ocean with a sailboat, cinematic style, 4K resolution'"
          rows={6}
          className="mt-2"
          disabled={isGenerating}
        />
        <p className="text-sm text-muted-foreground mt-2">
          Be as descriptive as possible for best results
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Video Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="style">Art Style</Label>
              <Select value={style} onValueChange={setStyle} disabled={isGenerating}>
                <SelectTrigger id="style" className="mt-2">
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="realistic">Realistic</SelectItem>
                  <SelectItem value="cartoon">Cartoon</SelectItem>
                  <SelectItem value="anime">Anime</SelectItem>
                  <SelectItem value="cyberpunk">Cyberpunk</SelectItem>
                  <SelectItem value="fantasy">Fantasy</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="duration">Duration (seconds)</Label>
              <Select value={duration} onValueChange={setDuration} disabled={isGenerating}>
                <SelectTrigger id="duration" className="mt-2">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 seconds</SelectItem>
                  <SelectItem value="10">10 seconds</SelectItem>
                  <SelectItem value="15">15 seconds</SelectItem>
                  <SelectItem value="30">30 seconds</SelectItem>
                  <SelectItem value="60">60 seconds</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="voiceover"
              checked={includeVoiceover}
              onCheckedChange={setIncludeVoiceover}
              disabled={isGenerating}
            />
            <Label htmlFor="voiceover">Include AI voiceover</Label>
          </div>
        </CardContent>
      </Card>

      <Button
        type="submit"
        disabled={isGenerating || !text.trim()}
        className="w-full md:w-auto"
      >
        {isGenerating ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Generating...
          </>
        ) : (
          'Generate Video'
        )}
      </Button>
    </form>
  );
};

// Audio to video tab
const AudioToVideoTab = ({ onGenerate, isGenerating }) => {
  const [audioFile, setAudioFile] = useState(null);
  const [audioName, setAudioName] = useState('');
  const [style, setStyle] = useState('music-visualizer');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      setAudioFile(file);
      setAudioName(file.name);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (audioFile) {
      onGenerate({
        type: 'audio',
        file: audioFile,
        options: { style }
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload Audio File</CardTitle>
          <CardDescription>
            MP3, WAV, or AAC files up to 100MB
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              audioFile ? 'border-green-500 bg-green-50' : 'border-muted hover:border-primary'
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="audio/*"
              className="hidden"
              disabled={isGenerating}
            />
            {audioFile ? (
              <>
                <Mic className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <p className="font-medium">{audioName}</p>
                <p className="text-sm text-muted-foreground">
                  {(audioFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </>
            ) : (
              <>
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="font-medium">Click to upload or drag and drop</p>
                <p className="text-sm text-muted-foreground">
                  MP3, WAV, AAC (Max 100MB)
                </p>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Visualization Style</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={style} onValueChange={setStyle} disabled={isGenerating || !audioFile}>
            <SelectTrigger>
              <SelectValue placeholder="Select visualization style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="music-visualizer">Music Visualizer</SelectItem>
              <SelectItem value="lyric-video">Lyric Video</SelectItem>
              <SelectItem value="abstract">Abstract Animation</SelectItem>
              <SelectItem value="landscape">Dynamic Landscape</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Button
        type="submit"
        disabled={isGenerating || !audioFile}
        className="w-full md:w-auto"
      >
        {isGenerating ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Generating...
          </>
        ) : (
          'Generate Video'
        )}
      </Button>
    </form>
  );
};

// Video to video tab
const VideoToVideoTab = ({ onGenerate, isGenerating }) => {
  const [videoFile, setVideoFile] = useState(null);
  const [videoName, setVideoName] = useState('');
  const [effect, setEffect] = useState('enhance');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
      setVideoName(file.name);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (videoFile) {
      onGenerate({
        type: 'video',
        file: videoFile,
        options: { effect }
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload Video File</CardTitle>
          <CardDescription>
            MP4, MOV, or AVI files up to 500MB
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              videoFile ? 'border-blue-500 bg-blue-50' : 'border-muted hover:border-primary'
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="video/*"
              className="hidden"
              disabled={isGenerating}
            />
            {videoFile ? (
              <>
                <Video className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <p className="font-medium">{videoName}</p>
                <p className="text-sm text-muted-foreground">
                  {(videoFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </>
            ) : (
              <>
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="font-medium">Click to upload or drag and drop</p>
                <p className="text-sm text-muted-foreground">
                  MP4, MOV, AVI (Max 500MB)
                </p>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI Video Effect</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={effect} onValueChange={setEffect} disabled={isGenerating || !videoFile}>
            <SelectTrigger>
              <SelectValue placeholder="Select effect" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="enhance">Enhance Quality</SelectItem>
              <SelectItem value="color-correct">Color Correction</SelectItem>
              <SelectItem value="stabilize">Stabilize</SelectItem>
              <SelectItem value="slow-motion">Slow Motion</SelectItem>
              <SelectItem value="style-transfer">Style Transfer</SelectItem>
              <SelectItem value="object-removal">Object Removal</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Button
        type="submit"
        disabled={isGenerating || !videoFile}
        className="w-full md:w-auto"
      >
        {isGenerating ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          'Generate Enhanced Video'
        )}
      </Button>
    </form>
  );
};

// Main app component
export default function App() {
  const [activeTab, setActiveTab] = useState('text');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoResult, setVideoResult] = useState(null);
  const [error, setError] = useState(null);

  const handleGenerate = useCallback(async (input) => {
    setError(null);
    setIsGenerating(true);
    setProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 5, 95));
      }, 200);

      let result;
      switch (input.type) {
        case 'text':
          result = await generateVideoFromText(input.text, input.options);
          break;
        case 'audio':
          result = await generateVideoFromAudio(input.file, input.options);
          break;
        case 'video':
          result = await generateVideoFromVideo(input.file, input.options);
          break;
        default:
          throw new Error('Invalid input type');
      }

      clearInterval(progressInterval);
      setProgress(100);
      
      // Small delay before showing result
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setVideoResult({
        url: result.url,
        type: input.type,
        inputData: input
      });
    } catch (err) {
      setError(err.message || 'Failed to generate video');
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const handleReset = () => {
    setVideoResult(null);
    setProgress(0);
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Video className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="font-bold text-xl">AI Video Generator</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <HelpCircle className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>How to Use</DialogTitle>
                    <DialogDescription>
                      <div className="space-y-4">
                        <p>
                          Create videos from text descriptions, audio files, or existing videos using AI.
                        </p>
                        <ul className="list-disc list-inside space-y-2">
                          <li><strong>Text to Video:</strong> Describe your video and let AI generate it</li>
                          <li><strong>Audio to Video:</strong> Upload MP3 and create visualizations</li>
                          <li><strong>Video to Video:</strong> Enhance or transform existing videos</li>
                        </ul>
                        <p>
                          All generated videos can be downloaded or shared directly from the app.
                        </p>
                      </div>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
              
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
                <TabsList className="grid w-full md:w-auto grid-cols-3">
                  <TabsTrigger value="text" disabled={isGenerating}>
                    <Text className="h-4 w-4 mr-2" />
                    Text to Video
                  </TabsTrigger>
                  <TabsTrigger value="audio" disabled={isGenerating}>
                    <Mic className="h-4 w-4 mr-2" />
                    Audio to Video
                  </TabsTrigger>
                  <TabsTrigger value="video" disabled={isGenerating}>
                    <Video className="h-4 w-4 mr-2" />
                    Video to Video
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="text">
                  <TextToVideoTab onGenerate={handleGenerate} isGenerating={isGenerating} />
                </TabsContent>
                <TabsContent value="audio">
                  <AudioToVideoTab onGenerate={handleGenerate} isGenerating={isGenerating} />
                </TabsContent>
                <TabsContent value="video">
                  <VideoToVideoTab onGenerate={handleGenerate} isGenerating={isGenerating} />
                </TabsContent>
              </Tabs>

              <VideoPreview
                src={videoResult?.url}
                onReset={handleReset}
                isGenerating={isGenerating}
                progress={progress}
              />
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Start</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Text to Video</h4>
                    <p className="text-sm text-muted-foreground">
                      Describe your scene in detail for best results
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Audio to Video</h4>
                    <p className="text-sm text-muted-foreground">
                      Upload music or speech to create visualizations
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Video to Video</h4>
                    <p className="text-sm text-muted-foreground">
                      Enhance, style, or transform existing videos
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Features</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Upload className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-sm">Multiple input formats</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Settings className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="text-sm">Customizable styles</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <Download className="h-4 w-4 text-purple-600" />
                    </div>
                    <span className="text-sm">Download in HD</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <Share className="h-4 w-4 text-orange-600" />
                    </div>
                    <span className="text-sm">Easy sharing</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

        <footer className="border-t py-6">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            AI Video Generator - Create stunning videos from text, audio, or video
          </div>
        </footer>
      </div>
    </TooltipProvider>
  );
}
