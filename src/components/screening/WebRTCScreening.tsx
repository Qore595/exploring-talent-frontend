import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Video, VideoOff, Phone, PhoneOff, MessageSquare, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

interface WebRTCScreeningProps {
  candidateName: string;
  position: string;
  onComplete: (result: { score: number; feedback: string }) => void;
  onCancel: () => void;
}

const WebRTCScreening: React.FC<WebRTCScreeningProps> = ({
  candidateName,
  position,
  onComplete,
  onCancel
}) => {
  // State for WebRTC
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [messages, setMessages] = useState<{ sender: 'user' | 'candidate'; text: string }[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  // Refs for video elements
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Mock questions for the screening
  const screeningQuestions = [
    "Tell me about your experience with React and TypeScript.",
    "How do you handle state management in large applications?",
    "Describe a challenging project you worked on and how you overcame obstacles.",
    "What's your approach to writing maintainable and scalable code?",
    "How do you stay updated with the latest technologies and best practices?"
  ];

  // Initialize WebRTC
  useEffect(() => {
    const initWebRTC = async () => {
      try {
        // Request user media
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true
        });
        
        setLocalStream(stream);
        
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        // Create peer connection
        const pc = new RTCPeerConnection({
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' }
          ]
        });

        // Add local stream to peer connection
        stream.getTracks().forEach(track => {
          pc.addTrack(track, stream);
        });

        // Handle remote stream
        pc.ontrack = (event) => {
          if (remoteVideoRef.current && event.streams[0]) {
            remoteVideoRef.current.srcObject = event.streams[0];
            setRemoteStream(event.streams[0]);
          }
        };

        // Handle ICE candidates
        pc.onicecandidate = (event) => {
          if (event.candidate) {
            // In a real app, you would send this to the signaling server
            console.log('New ICE candidate:', event.candidate);
          }
        };

        // Handle connection state changes
        pc.onconnectionstatechange = () => {
          switch(pc.connectionState) {
            case 'connected':
              setConnectionStatus('connected');
              startTimer();
              break;
            case 'disconnected':
            case 'failed':
              setConnectionStatus('disconnected');
              stopTimer();
              break;
            case 'connecting':
              setConnectionStatus('connecting');
              break;
          }
        };

        setPeerConnection(pc);

        // For demo purposes, simulate a connection after a delay
        setTimeout(() => {
          setConnectionStatus('connected');
          startTimer();
          
          // Create a mock remote stream
          const mockRemoteStream = new MediaStream();
          // In a real app, this would come from the remote peer
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = mockRemoteStream;
            setRemoteStream(mockRemoteStream);
          }
        }, 2000);

        return () => {
          // Cleanup
          stream.getTracks().forEach(track => track.stop());
          pc.close();
          stopTimer();
        };
      } catch (error) {
        console.error('Error initializing WebRTC:', error);
        toast({
          title: 'WebRTC Error',
          description: 'Failed to initialize video call. Please check your camera and microphone permissions.',
          variant: 'destructive'
        });
      }
    };

    initWebRTC();

    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      if (peerConnection) {
        peerConnection.close();
      }
      stopTimer();
    };
  }, []);

  // Start recording
  const startRecording = () => {
    if (!localStream) return;

    try {
      const recorder = new MediaRecorder(localStream, { mimeType: 'video/webm' });
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordedChunks(prev => [...prev, event.data]);
        }
      };
      
      recorder.start(1000); // Collect data every second
      setMediaRecorder(recorder);
      setIsRecording(true);
      
      toast({
        title: 'Recording Started',
        description: 'Your screening session is now being recorded.'
      });
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: 'Recording Error',
        description: 'Failed to start recording. Please try again.',
        variant: 'destructive'
      });
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      
      toast({
        title: 'Recording Stopped',
        description: 'Your screening recording has been saved.'
      });
    }
  };

  // Toggle audio
  const toggleAudio = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !audioEnabled;
      });
      setAudioEnabled(!audioEnabled);
    }
  };

  // Toggle video
  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !videoEnabled;
      });
      setVideoEnabled(!videoEnabled);
    }
  };

  // Start timer
  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
  };

  // Stop timer
  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Send message
  const sendMessage = () => {
    if (messageInput.trim()) {
      setMessages([...messages, { sender: 'user', text: messageInput }]);
      setMessageInput('');
      
      // Simulate candidate response after a delay
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          sender: 'candidate', 
          text: "I understand your question. Let me think about that for a moment..." 
        }]);
      }, 2000);
    }
  };

  // End call and complete screening
  const endCall = () => {
    stopTimer();
    stopRecording();
    
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    
    if (peerConnection) {
      peerConnection.close();
    }
    
    // In a real app, you would process the recording and generate a score
    // For demo purposes, we'll just generate a random score
    const score = Math.floor(Math.random() * 30) + 70; // Random score between 70-99
    
    onComplete({
      score,
      feedback: "Candidate demonstrated good technical knowledge and communication skills. Follow-up interview recommended."
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
      {/* Main video area */}
      <div className="lg:col-span-2 space-y-4">
        <Card className="border-0 shadow-none bg-black rounded-lg overflow-hidden relative">
          {/* Remote video (candidate) */}
          <div className="aspect-video w-full bg-black">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            
            {connectionStatus !== 'connected' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="animate-pulse mb-2">
                    {connectionStatus === 'connecting' ? 'Connecting...' : 'Disconnected'}
                  </div>
                  <Badge variant="outline" className="bg-primary/20 text-primary-foreground">
                    {candidateName} - {position}
                  </Badge>
                </div>
              </div>
            )}
            
            {/* Call duration */}
            <div className="absolute top-4 right-4">
              <Badge variant="outline" className="bg-black/50 text-white">
                {formatTime(elapsedTime)}
              </Badge>
            </div>
            
            {/* Local video (interviewer) - small overlay */}
            <div className="absolute bottom-4 right-4 w-1/4 aspect-video bg-black rounded-lg overflow-hidden border border-primary/50">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          {/* Call controls */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
            <div className="flex justify-center space-x-4">
              <Button
                variant="outline"
                size="icon"
                className={`rounded-full ${audioEnabled ? 'bg-primary/20' : 'bg-destructive/80'}`}
                onClick={toggleAudio}
              >
                {audioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                className={`rounded-full ${videoEnabled ? 'bg-primary/20' : 'bg-destructive/80'}`}
                onClick={toggleVideo}
              >
                {videoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                className={`rounded-full ${isRecording ? 'bg-red-500/80' : 'bg-primary/20'}`}
                onClick={isRecording ? stopRecording : startRecording}
              >
                <div className={`h-2 w-2 rounded-full ${isRecording ? 'bg-white animate-pulse' : 'bg-red-500'}`} />
              </Button>
              
              <Button
                variant="destructive"
                size="icon"
                className="rounded-full"
                onClick={endCall}
              >
                <Phone className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Sidebar with questions and chat */}
      <div className="space-y-4">
        {/* Screening questions */}
        <Card>
          <CardHeader>
            <CardTitle>Screening Questions</CardTitle>
            <CardDescription>Ask these questions during the interview</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {screeningQuestions.map((question, index) => (
                <li key={index} className="p-2 rounded-md bg-muted/50 text-sm">
                  {question}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        
        {/* Chat */}
        <Card className="flex flex-col h-[calc(100%-13rem)]">
          <CardHeader className="pb-2">
            <CardTitle>Chat</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow overflow-y-auto">
            <div className="space-y-4">
              {messages.length === 0 ? (
                <p className="text-center text-muted-foreground text-sm">
                  No messages yet
                </p>
              ) : (
                messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.sender === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <div className="flex w-full items-center space-x-2">
              <Input
                placeholder="Type a message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              />
              <Button size="icon" onClick={sendMessage}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default WebRTCScreening;
