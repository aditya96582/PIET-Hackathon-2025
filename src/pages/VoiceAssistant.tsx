import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Mic, MicOff, Volume2, VolumeX, ArrowLeft, MessageCircle, Loader2, Send, Brain, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { geminiService } from "@/services/geminiService";

const VoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState("hi");
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [conversationHistory, setConversationHistory] = useState<Array<{question: string, answer: string, timestamp: Date}>>([]);
  const [currentLocation, setCurrentLocation] = useState({ lat: 28.6139, lon: 77.2090 });
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  const languages = [
    { code: "hi", name: "हिन्दी (Hindi)", sample: "नमस्ते! मैं आपकी खेती में कैसे मदद कर सकता हूं?", speechLang: "hi-IN" },
    { code: "ta", name: "தமிழ் (Tamil)", sample: "வணக்கம்! உங்கள் விவசாயத்தில் எப்படி உதவ முடியும்?", speechLang: "ta-IN" },
    { code: "te", name: "తెలుగు (Telugu)", sample: "నమస్కారం! మీ వ్యవసాయంలో ఎలా సహాయం చేయగలను?", speechLang: "te-IN" },
    { code: "bn", name: "বাংলা (Bengali)", sample: "নমস্কার! আপনার কৃষিকাজে আমি কীভাবে সাহায্য করতে পারি?", speechLang: "bn-IN" },
    { code: "mr", name: "मराठी (Marathi)", sample: "नमस्कार! तुमच्या शेतीमध्ये मी कशी मदत करू शकते?", speechLang: "mr-IN" },
    { code: "gu", name: "ગુજરાતી (Gujarati)", sample: "નમસ્તે! તમારા ખેતીમાં હું કેવી રીતે મદદ કરી શકું?", speechLang: "gu-IN" },
    { code: "kn", name: "ಕನ್ನಡ (Kannada)", sample: "ನಮಸ್ಕಾರ! ನಿಮ್ಮ ಕೃಷಿಯಲ್ಲಿ ನಾನು ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?", speechLang: "kn-IN" },
    { code: "ml", name: "മലയാളം (Malayalam)", sample: "നമസ്കാരം! നിങ്ങളുടെ കൃഷിയിൽ എനിക്ക് എങ്ങനെ സഹായിക്കാം?", speechLang: "ml-IN" },
    { code: "pa", name: "ਪੰਜਾਬੀ (Punjabi)", sample: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਤੁਹਾਡੀ ਖੇਤੀ ਵਿੱਚ ਮੈਂ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?", speechLang: "pa-IN" },
    { code: "or", name: "ଓଡ଼ିଆ (Odia)", sample: "ନମସ୍କାର! ଆପଣଙ୍କ କୃଷିରେ ମୁଁ କିପରି ସାହାଯ୍ୟ କରିପାରିବି?", speechLang: "or-IN" },
    { code: "as", name: "অসমীয়া (Assamese)", sample: "নমস্কাৰ! আপোনাৰ কৃষিত মই কেনেকৈ সহায় কৰিব পাৰোঁ?", speechLang: "as-IN" },
    { code: "ur", name: "اردو (Urdu)", sample: "السلام علیکم! میں آپ کی کھیتی میں کیسے مدد کر سکتا ہوں؟", speechLang: "ur-PK" },
    { code: "en", name: "English", sample: "Hello! How can I help you with your farming?", speechLang: "en-IN" }
  ];

  const sampleQuestions = {
    hi: [
      "मेरी फसल में कीड़े लगे हैं, क्या करूं?",
      "गेहूं की बुवाई का सही समय क्या है?",
      "धान के लिए कितना पानी चाहिए?",
      "मेरे टमाटर के पत्ते पीले हो रहे हैं",
      "खाद की कमी के लक्षण क्या हैं?",
      "बारिश के बाद फसल की देखभाल कैसे करें?",
      "नई तकनीक से खेती कैसे करें?",
      "मंडी में सबसे अच्छी कीमत कैसे पाएं?"
    ],
    en: [
      "My crops have pest infestation, what should I do?",
      "What is the right time for wheat sowing?",
      "How much water does rice need?",
      "My tomato leaves are turning yellow",
      "What are the signs of fertilizer deficiency?",
      "How to take care of crops after rain?",
      "How to farm with new technology?",
      "How to get the best price in the market?"
    ],
    ta: [
      "என் பயிரில் பூச்சிகள் உள்ளன, என்ன செய்வது?",
      "கோதுமை விதைப்பதற்கான சரியான நேரம் எது?",
      "நெல்லுக்கு எவ்வளவு தண்ணீர் தேவை?",
      "என் தக்காளி இலைகள் மஞ்சளாக மாறுகின்றன",
      "உரக் குறைபாட்டின் அறிகுறிகள் என்ன?",
      "மழைக்குப் பிறகு பயிர்களை எப்படி பராமரிப்பது?",
      "புதிய தொழில்நுட்பத்துடன் எப்படி விவசாயம் செய்வது?",
      "சந்தையில் சிறந்த விலை எப்படி பெறுவது?"
    ]
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCurrentLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        () => {/* keep default Delhi coords */}
      );
    }
    
    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
    
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.maxAlternatives = 1;
    }
  }, []);

  const startListening = () => {
    if (!recognitionRef.current) {
      toast.error("Speech recognition not supported in this browser");
      return;
    }
    
    if (!isListening) {
      setIsListening(true);
      setTranscript("");
      
      const currentLang = languages.find(l => l.code === currentLanguage);
      recognitionRef.current.lang = currentLang?.speechLang || 'hi-IN';
      
      recognitionRef.current.onstart = () => {
        toast.success(`Voice listening started in ${currentLang?.name}`);
      };
      
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setTranscript(transcript);
        setIsListening(false);
        processVoiceInput(transcript);
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast.error(`Speech recognition error: ${event.error}`);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
      
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      toast.info("Voice listening stopped");
    }
  };

  const processVoiceInput = async (input: string) => {
    if (!input.trim()) return;
    
    setIsProcessing(true);
    
    try {
      const currentLang = languages.find(l => l.code === currentLanguage);
      const languageName = currentLang?.name || 'Hindi';
      
      // Create context-aware prompt for Gemini
      const prompt = `You are an expert agricultural advisor for Indian farmers. The user is asking in ${languageName} language. Please respond in the same language (${languageName}) with practical, actionable advice. Consider the user's location (lat: ${currentLocation.lat}, lon: ${currentLocation.lon}) for region-specific recommendations.

User Question: ${input}

Provide a comprehensive answer covering:
1. Direct solution to the problem
2. Preventive measures
3. Local/seasonal considerations
4. Cost-effective alternatives
5. When to seek expert help

Keep the response conversational and easy to understand for farmers.`;
      
      const aiResponse = await geminiService.getVoiceAssistantResponse(prompt, currentLocation);
      
      setResponse(aiResponse);
      
      // Add to conversation history
      setConversationHistory(prev => [{
        question: input,
        answer: aiResponse,
        timestamp: new Date()
      }, ...prev.slice(0, 9)]); // Keep last 10 conversations
      
      // Auto-speak the response
      speakResponse(aiResponse);
      
      toast.success("AI response generated successfully!");
    } catch (error) {
      console.error('Error processing voice input:', error);
      toast.error("Failed to process your question. Please try again.");
      setResponse("क्षमा करें, आपके प्रश्न को समझने में समस्या हुई है। कृपया दोबारा कोशिश करें।");
    } finally {
      setIsProcessing(false);
    }
  };

  const speakResponse = (text: string) => {
    if (!synthRef.current || !text) return;
    
    // Stop any ongoing speech
    synthRef.current.cancel();
    
    setIsSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(text);
    
    const currentLang = languages.find(l => l.code === currentLanguage);
    utterance.lang = currentLang?.speechLang || 'hi-IN';
    utterance.rate = 0.8;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    utterance.onstart = () => {
      toast.success("Playing audio response");
    };
    
    utterance.onend = () => {
      setIsSpeaking(false);
    };
    
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error);
      setIsSpeaking(false);
      toast.error("Audio playback failed");
    };
    
    synthRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
      toast.info("Audio stopped");
    }
  };
  
  const handleTextSubmit = () => {
    if (textInput.trim()) {
      setTranscript(textInput);
      processVoiceInput(textInput);
      setTextInput("");
    }
  };
  
  const getCurrentQuestions = () => {
    return sampleQuestions[currentLanguage as keyof typeof sampleQuestions] || sampleQuestions.hi;
  };

  const askSampleQuestion = (question: string) => {
    setTranscript(question);
    processVoiceInput(question);
  };

  return (
    <div className="min-h-screen bg-light-yellow">
      {/* Header */}
      <header className="border-b bg-deep-blue backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" asChild>
                <Link to="/">
                  <ArrowLeft className="w-5 h-5" />
                </Link>
              </Button>
              <div className="flex items-center space-x-2">
                <Mic className="w-6 h-6 text-primary" />
                <h1 className="text-xl font-bold text-white">Voice Assistant</h1>
              </div>
            </div>
            <Badge className="bg-sky-blue text-white border-0">
              Gemini AI • Multi-Language
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Language Selection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Language Selection
            </CardTitle>
            <CardDescription>
              Choose your preferred language for voice interaction with Gemini AI
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <Select value={currentLanguage} onValueChange={setCurrentLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="text-sm text-muted-foreground p-2 bg-muted rounded">
                <strong>Sample:</strong> {languages.find(l => l.code === currentLanguage)?.sample}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Voice Interface */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Gemini AI Voice Interface
              </CardTitle>
              <CardDescription>
                Direct voice interaction with Google Gemini AI for personalized farming advice
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Voice Controls */}
              <div className="flex justify-center space-x-4">
                <Button
                  size="lg"
                  onClick={isListening ? stopListening : startListening}
                  className={`relative ${isListening ? 'bg-destructive hover:bg-destructive/90' : 'bg-primary hover:bg-primary/90'}`}
                  disabled={isProcessing}
                >
                  {isListening ? (
                    <>
                      <MicOff className="w-5 h-5 mr-2" />
                      Stop Listening
                      <div className="absolute -inset-1 bg-red-500 rounded-full animate-pulse opacity-75" />
                    </>
                  ) : (
                    <>
                      <Mic className="w-5 h-5 mr-2" />
                      Start Voice
                    </>
                  )}
                </Button>
                
                <Button
                  size="lg"
                  variant="outline"
                  onClick={isSpeaking ? stopSpeaking : () => speakResponse(response)}
                  disabled={!response || isProcessing}
                >
                  {isSpeaking ? (
                    <>
                      <VolumeX className="w-5 h-5 mr-2" />
                      Stop Audio
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-5 h-5 mr-2" />
                      Play Audio
                    </>
                  )}
                </Button>
              </div>
              
              {/* Text Input Alternative */}
              <div className="space-y-2">
                <div className="text-sm font-medium text-center text-muted-foreground">Or type your question:</div>
                <div className="flex space-x-2">
                  <Textarea
                    placeholder={`Type your farming question in ${languages.find(l => l.code === currentLanguage)?.name}...`}
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    className="flex-1 min-h-[60px]"
                    disabled={isProcessing}
                  />
                  <Button
                    onClick={handleTextSubmit}
                    disabled={!textInput.trim() || isProcessing}
                    className="self-end"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Status Indicators */}
              <div className="space-y-2">
                {isListening && (
                  <div className="flex items-center justify-center space-x-2 text-destructive">
                    <div className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
                    <span className="text-sm">Listening in {languages.find(l => l.code === currentLanguage)?.name}...</span>
                  </div>
                )}
                
                {isProcessing && (
                  <div className="flex items-center justify-center space-x-2 text-primary">
                    <Brain className="w-4 h-4 animate-pulse" />
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">AI Processing with Gemini...</span>
                  </div>
                )}
                
                {isSpeaking && (
                  <div className="flex items-center justify-center space-x-2 text-success">
                    <Volume2 className="w-4 h-4 animate-pulse" />
                    <span className="text-sm">Speaking in {languages.find(l => l.code === currentLanguage)?.name}...</span>
                  </div>
                )}
              </div>

              {/* Transcript */}
              {transcript && (
                <div className="p-4 bg-primary/10 rounded-lg">
                  <h4 className="font-semibold text-primary mb-2">Your Question:</h4>
                  <p className="text-sm">{transcript}</p>
                </div>
              )}

              {/* Response */}
              {response && (
                <div className="p-4 bg-success/10 rounded-lg">
                  <h4 className="font-semibold text-success mb-2">Gemini AI Response:</h4>
                  <p className="text-sm">{response}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sample Questions */}
          <Card>
            <CardHeader>
              <CardTitle>Sample Questions</CardTitle>
              <CardDescription>
                Click on any question to try Gemini AI voice interaction
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {getCurrentQuestions().map((question, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-start text-left h-auto p-3 hover:bg-primary/10"
                    onClick={() => askSampleQuestion(question)}
                    disabled={isProcessing}
                  >
                    <div className="text-sm">{question}</div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Conversation History */}
        {conversationHistory.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Recent Conversations
              </CardTitle>
              <CardDescription>
                Your recent AI-powered farming consultations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {conversationHistory.map((conv, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-2">
                    <div className="text-sm text-muted-foreground">
                      {conv.timestamp.toLocaleString()}
                    </div>
                    <div className="p-2 bg-primary/10 rounded text-sm">
                      <strong>Q:</strong> {conv.question}
                    </div>
                    <div className="p-2 bg-success/10 rounded text-sm">
                      <strong>A:</strong> {conv.answer}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => speakResponse(conv.answer)}
                      className="mt-2"
                    >
                      <Volume2 className="w-3 h-3 mr-1" />
                      Replay
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Globe className="w-5 h-5" />
                Multi-Language Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Real-time voice recognition and response in 13+ regional languages with native speech synthesis.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Brain className="w-5 h-5" />
                Gemini AI Integration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Direct integration with Google Gemini AI for contextual, location-aware agricultural advice.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MessageCircle className="w-5 h-5" />
                Voice & Text Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Flexible input methods with voice recognition and text input for accessibility in all conditions.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistant;