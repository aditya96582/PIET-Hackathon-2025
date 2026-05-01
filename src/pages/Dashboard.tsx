import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  GamepadIcon, 
  QrCode, 
  Shield, 
  Calendar, 
  Gift,
  TrendingUp,
  Users,
  Award,
  Bell,
  ChevronRight,
  Coins,
  Brain,
  RefreshCw,
  Camera,
  Cloud,
  Mic,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Thermometer,
  Droplets
} from "lucide-react";
import { Link } from "react-router-dom";
import { geminiService } from "@/services/geminiService";
import { weatherService } from "@/services/weatherService";
import { toast } from "sonner";

const Dashboard = () => {
  const [dashboardInsights, setDashboardInsights] = useState<any>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [marketPredictions, setMarketPredictions] = useState<any>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    updateDashboard();
    // Auto-update every 5 minutes
    const interval = setInterval(updateDashboard, 300000);
    return () => clearInterval(interval);
  }, []);

  const updateDashboard = async () => {
    setIsUpdating(true);
    try {
      // Get current location and weather
      const location = await weatherService.getCurrentLocation();
      const weather = await weatherService.getWeatherData(location.lat, location.lon);
      setWeatherData(weather);
      
      // Get market predictions
      const predictions = await geminiService.getMarketPredictions('wheat');
      setMarketPredictions(predictions);
      
      // Prepare comprehensive farmer data
      const farmerData = {
        location: weather.location,
        currentWeather: weather.current,
        forecast: weather.forecast,
        crops: ['wheat', 'rice', 'sugarcane'],
        farmSize: '5 acres',
        soilType: 'loamy',
        recentActivities: recentActivities,
        marketData: predictions,
        season: getCurrentSeason()
      };
      
      // Get AI-powered dashboard insights
      const insights = await geminiService.getDashboardInsights(farmerData);
      setDashboardInsights(insights);
      setLastUpdated(new Date());
      
      toast.success("Dashboard updated with latest AI insights!");
    } catch (error) {
      console.error('Dashboard update error:', error);
      toast.error("Failed to update dashboard. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const getCurrentSeason = () => {
    const month = new Date().getMonth() + 1;
    if (month >= 3 && month <= 5) return 'Spring';
    if (month >= 6 && month <= 8) return 'Monsoon';
    if (month >= 9 && month <= 11) return 'Post-Monsoon';
    return 'Winter';
  };

  const quickStats = [
    { 
      label: "Today's Wheat Price", 
      value: marketPredictions?.currentPrices?.wholesale || "₹2,450/quintal", 
      change: "+5.2%", 
      icon: TrendingUp,
      color: "text-[#f5810f]"
    },
    { 
      label: "Weather Status", 
      value: weatherData?.current?.weather_main || "Clear", 
      change: `${weatherData?.current?.temp || 25}°C`, 
      icon: Cloud,
      color: "text-[#00aeef]"
    },
    { 
      label: "Game Tokens", 
      value: "2,350", 
      change: "+15%", 
      icon: Award,
      color: "text-[#efd133]"
    },
    { 
      label: "Active Alerts", 
      value: "3", 
      change: "New", 
      icon: Bell,
      color: "text-[#d50000]"
    }
  ];

  const recentActivities = [
    { action: "Crop Health Scan", crop: "Wheat", result: "Healthy", time: "2 hours ago", status: "success" },
    { action: "Mandi e-Pass Generated", location: "Kanpur Mandi", time: "4 hours ago", status: "info" },
    { action: "Game Level Completed", game: "Fertilizer Quiz", reward: "50 tokens", time: "1 day ago", status: "success" },
    { action: "Weather Alert", message: "Rain expected tomorrow", time: "1 day ago", status: "warning" }
  ];

  const upcomingReminders = [
    { task: "Wheat Irrigation", date: "Tomorrow", priority: "high", icon: Droplets },
    { task: "Fertilizer Application", date: "Jan 12", priority: "medium", icon: CheckCircle },
    { task: "Pest Control Check", date: "Jan 15", priority: "low", icon: Shield }
  ];

  const aiRecommendations = dashboardInsights?.aiRecommendations || [
    "Monitor wheat crop for early signs of rust disease",
    "Optimal time for fertilizer application is next week",
    "Consider diversifying with pulse crops this season"
  ];

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #fffdf6 0%, #f0f9ff 100%)' }}>
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 safe-area-inset-top">
        <div className="container-mobile py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-enhanced" style={{ color: '#002b45' }}>Farmer Dashboard</h1>
              <p className="text-sm sm:text-base text-gray-600">Welcome back, Ramesh Kumar</p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Button 
                onClick={updateDashboard}
                disabled={isUpdating}
                className="bg-[#002b45] hover:bg-[#003d5c] text-white touch-target text-sm sm:text-base px-3 sm:px-4"
              >
                {isUpdating ? (
                  <RefreshCw className="w-4 h-4 mr-1 sm:mr-2 animate-spin icon-enhanced" />
                ) : (
                  <Brain className="w-4 h-4 mr-1 sm:mr-2 icon-enhanced" />
                )}
                <span className="hidden sm:inline">{isUpdating ? 'Updating AI...' : 'AI Update'}</span>
                <span className="sm:hidden">{isUpdating ? 'AI...' : 'AI'}</span>
              </Button>
              <Badge className="bg-[#efd133] text-[#002b45] border-0 text-xs sm:text-sm px-2 py-1">
                <Coins className="w-3 h-3 mr-1 icon-enhanced" />
                <span className="hidden sm:inline">2,350 Tokens</span>
                <span className="sm:hidden">2.3K</span>
              </Badge>
              <div className="text-xs text-gray-500 hidden lg:block">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container-mobile py-6 sm:py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          {quickStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="card-enhanced mobile-card">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-2 sm:gap-0">
                    <div className="text-center sm:text-left">
                      <p className="text-xs sm:text-sm text-gray-600 font-medium">{stat.label}</p>
                      <p className="text-lg sm:text-2xl font-bold text-[#002b45] text-enhanced">{stat.value}</p>
                      <p className={`text-xs sm:text-sm font-medium ${stat.color}`}>{stat.change}</p>
                    </div>
                    <Icon className={`w-6 h-6 sm:w-8 sm:h-8 ${stat.color} icon-enhanced`} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* AI Insights Section */}
        <Card className="mb-6 sm:mb-8 border-0 shadow-lg bg-gradient-to-r from-[#002b45] to-[#00aeef] text-white card-enhanced">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Brain className="w-5 h-5 sm:w-6 sm:h-6 icon-enhanced" />
              AI-Powered Farm Intelligence
            </CardTitle>
            <CardDescription className="text-blue-100 text-sm sm:text-base">
              Real-time insights powered by Gemini AI and weather data
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {/* Status Update */}
              <div className="glass-card rounded-lg p-3 sm:p-4">
                <h4 className="font-semibold mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 icon-enhanced" />
                  Farm Status
                </h4>
                <p className="text-xs sm:text-sm text-blue-100">
                  {dashboardInsights?.statusUpdate || "Farm operations running smoothly with favorable weather conditions"}
                </p>
              </div>

              {/* Market Insights */}
              <div className="glass-card rounded-lg p-3 sm:p-4">
                <h4 className="font-semibold mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 icon-enhanced" />
                  Market Intelligence
                </h4>
                <p className="text-xs sm:text-sm text-blue-100">
                  {dashboardInsights?.marketInsights || marketPredictions?.marketTrends || "Wheat prices showing upward trend. Good time for selling."}
                </p>
              </div>

              {/* Weather Impact */}
              <div className="glass-card rounded-lg p-3 sm:p-4">
                <h4 className="font-semibold mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                  <Cloud className="w-4 h-4 sm:w-5 sm:h-5 icon-enhanced" />
                  Weather Impact
                </h4>
                <p className="text-xs sm:text-sm text-blue-100">
                  {weatherData ? 
                    `${weatherData.current.weather_description}. Temperature: ${weatherData.current.temp}°C. Humidity: ${weatherData.current.humidity}%` :
                    "Loading weather data..."
                  }
                </p>
              </div>
            </div>

            {/* AI Recommendations */}
            {aiRecommendations.length > 0 && (
              <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  AI Recommendations
                </h4>
                <div className="grid md:grid-cols-2 gap-3">
                  {aiRecommendations.map((recommendation: string, index: number) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 mt-0.5 text-[#61cc1d]" />
                      <p className="text-sm text-blue-100">{recommendation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Features */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-[#002b45]">Quick Actions</CardTitle>
                <CardDescription>Access your most used farming tools</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <Link to="/crop-health">
                    <Button variant="outline" className="h-20 flex flex-col gap-2 border-[#4d7d2e] hover:bg-[#4d7d2e] hover:text-white transition-all">
                      <Camera className="w-6 h-6 text-[#4d7d2e]" />
                      <span className="text-sm">Crop Health Scan</span>
                    </Button>
                  </Link>
                  <Link to="/weather">
                    <Button variant="outline" className="h-20 flex flex-col gap-2 border-[#00aeef] hover:bg-[#00aeef] hover:text-white transition-all">
                      <Cloud className="w-6 h-6 text-[#00aeef]" />
                      <span className="text-sm">Weather Advisory</span>
                    </Button>
                  </Link>
                  <Link to="/prices">
                    <Button variant="outline" className="h-20 flex flex-col gap-2 border-[#f5810f] hover:bg-[#f5810f] hover:text-white transition-all">
                      <TrendingUp className="w-6 h-6 text-[#f5810f]" />
                      <span className="text-sm">Live Mandi Prices</span>
                    </Button>
                  </Link>
                  <Link to="/voice">
                    <Button variant="outline" className="h-20 flex flex-col gap-2 border-[#2d99ec] hover:bg-[#2d99ec] hover:text-white transition-all">
                      <Mic className="w-6 h-6 text-[#2d99ec]" />
                      <span className="text-sm">Voice Assistant</span>
                    </Button>
                  </Link>
                  <Link to="/agri-game">
                    <Button variant="outline" className="h-20 flex flex-col gap-2 border-[#efd133] hover:bg-[#efd133] hover:text-white transition-all">
                      <GamepadIcon className="w-6 h-6 text-[#efd133]" />
                      <span className="text-sm">AgriGame Learning</span>
                    </Button>
                  </Link>
                  <Link to="/e-pass">
                    <Button variant="outline" className="h-20 flex flex-col gap-2 border-[#66ba6e] hover:bg-[#66ba6e] hover:text-white transition-all">
                      <QrCode className="w-6 h-6 text-[#66ba6e]" />
                      <span className="text-sm">Generate e-Pass</span>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-[#002b45]">Recent Activities</CardTitle>
                <CardDescription>Your latest farming actions and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-gray-50 to-blue-50 border-l-4 border-[#00aeef]">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.status === 'success' ? 'bg-[#00a650]' :
                          activity.status === 'warning' ? 'bg-[#ffc700]' :
                          activity.status === 'info' ? 'bg-[#00aeef]' : 'bg-gray-400'
                        }`} />
                        <div>
                          <p className="font-medium text-[#002b45]">{activity.action}</p>
                          <p className="text-sm text-gray-600">
                            {activity.crop && `${activity.crop} - `}
                            {activity.result && `${activity.result} - `}
                            {activity.location && `${activity.location} - `}
                            {activity.game && `${activity.game} - `}
                            {activity.reward && `+${activity.reward} - `}
                            {activity.message && `${activity.message} - `}
                            {activity.time}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Reminders */}
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-[#002b45]">Upcoming Tasks</CardTitle>
                <CardDescription>Your farming schedule</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingReminders.map((reminder, index) => {
                    const Icon = reminder.icon;
                    return (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-gray-50 to-green-50">
                        <div className="flex items-center gap-3">
                          <Icon className="w-5 h-5 text-[#4d7d2e]" />
                          <div>
                            <p className="font-medium text-[#002b45]">{reminder.task}</p>
                            <p className="text-sm text-gray-600">{reminder.date}</p>
                          </div>
                        </div>
                        <Badge 
                          className={
                            reminder.priority === 'high' ? 'bg-[#d50000] text-white' :
                            reminder.priority === 'medium' ? 'bg-[#ffc700] text-[#002b45]' :
                            'bg-[#ececec] text-[#525252]'
                          }
                        >
                          {reminder.priority}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Token Progress */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-[#efd133] to-[#f4a30d] text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Learning Progress
                </CardTitle>
                <CardDescription className="text-yellow-100">
                  Keep learning to earn more tokens
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Level 5 Farmer</span>
                      <span>2,350 / 3,000</span>
                    </div>
                    <Progress value={78} className="h-3 bg-white/20" />
                  </div>
                  <p className="text-sm text-yellow-100">
                    650 more tokens needed for Level 6
                  </p>
                  <Link to="/agri-game">
                    <Button className="w-full bg-white text-[#002b45] hover:bg-gray-100">
                      <GamepadIcon className="w-4 h-4 mr-2" />
                      Play More Games
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Weather Widget */}
            {weatherData && (
              <Card className="border-0 shadow-lg bg-gradient-to-br from-[#00aeef] to-[#2d99ec] text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cloud className="w-5 h-5" />
                    Current Weather
                  </CardTitle>
                  <CardDescription className="text-blue-100">
                    {weatherData.location.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-bold">{weatherData.current.temp}°C</span>
                      <span className="capitalize">{weatherData.current.weather_description}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Droplets className="w-4 h-4" />
                        <span>{weatherData.current.humidity}% Humidity</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Thermometer className="w-4 h-4" />
                        <span>Feels {weatherData.current.feels_like}°C</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;