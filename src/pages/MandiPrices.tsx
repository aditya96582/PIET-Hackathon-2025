import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, TrendingUp, TrendingDown, Search, MapPin, Clock, RefreshCw, Brain, BarChart3, AlertTriangle, CheckCircle, Target, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { geminiService } from "@/services/geminiService";
import { toast } from "sonner";
import { useNavigationPersistence } from "@/utils/navigationStore";

const MandiPrices = () => {
  const [selectedState, setSelectedState] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [marketPredictions, setMarketPredictions] = useState<any>(null);
  const [isLoadingPredictions, setIsLoadingPredictions] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState("wheat");
  const [aiInsights, setAiInsights] = useState<any>(null);
  
  const { savePage, restorePage } = useNavigationPersistence('/prices');

  useEffect(() => {
    const savedData = restorePage();
    if (savedData) {
      setSelectedState(savedData.selectedState || "all");
      setSearchQuery(savedData.searchQuery || "");
      setSelectedCrop(savedData.selectedCrop || "wheat");
    }
    loadMarketPredictions();
  }, []);

  useEffect(() => {
    savePage({
      selectedState,
      searchQuery,
      selectedCrop
    });
  }, [selectedState, searchQuery, selectedCrop]);

  const loadMarketPredictions = async () => {
    setIsLoadingPredictions(true);
    try {
      // Get comprehensive market predictions
      const predictions = await geminiService.getMarketPredictions(selectedCrop);
      setMarketPredictions(predictions);
      
      // Get AI-powered market insights
      const insights = await geminiService.getMarketVisionForecast(selectedCrop, "3-month");
      setAiInsights(insights);
      
      toast.success("Market predictions updated with AI insights!");
    } catch (error) {
      console.error('Market predictions error:', error);
      toast.error("Failed to load market predictions");
    } finally {
      setIsLoadingPredictions(false);
    }
  };

  const states = [
    { code: "all", name: "All States" },
    { code: "up", name: "Uttar Pradesh" },
    { code: "mh", name: "Maharashtra" },
    { code: "pb", name: "Punjab" },
    { code: "hr", name: "Haryana" },
    { code: "rj", name: "Rajasthan" },
    { code: "mp", name: "Madhya Pradesh" },
    { code: "gj", name: "Gujarat" },
    { code: "wb", name: "West Bengal" },
    { code: "tn", name: "Tamil Nadu" },
    { code: "kn", name: "Karnataka" },
    { code: "ap", name: "Andhra Pradesh" },
    { code: "ts", name: "Telangana" }
  ];

  const crops = [
    { code: "wheat", name: "Wheat (गेहूं)" },
    { code: "rice", name: "Rice (चावल)" },
    { code: "cotton", name: "Cotton (कपास)" },
    { code: "sugarcane", name: "Sugarcane (गन्ना)" },
    { code: "onion", name: "Onion (प्याज)" },
    { code: "potato", name: "Potato (आलू)" },
    { code: "tomato", name: "Tomato (टमाटर)" },
    { code: "mustard", name: "Mustard (सरसों)" }
  ];

  const marketPrices = [
    {
      commodity: "Wheat",
      hindiName: "गेहूं",
      state: "Punjab",
      mandi: "Amritsar",
      minPrice: 2100,
      maxPrice: 2150,
      modalPrice: 2125,
      trend: "up",
      change: "+25",
      unit: "per quintal",
      quality: "FAQ",
      arrival: "2500 quintals"
    },
    {
      commodity: "Rice",
      hindiName: "चावल",
      state: "Punjab",
      mandi: "Patiala",
      minPrice: 3200,
      maxPrice: 3400,
      modalPrice: 3300,
      trend: "up",
      change: "+50",
      unit: "per quintal",
      quality: "Grade A",
      arrival: "1800 quintals"
    },
    {
      commodity: "Cotton",
      hindiName: "कपास",
      state: "Maharashtra",
      mandi: "Akola",
      minPrice: 5800,
      maxPrice: 6200,
      modalPrice: 6000,
      trend: "down",
      change: "-100",
      unit: "per quintal",
      quality: "Medium",
      arrival: "3200 quintals"
    },
    {
      commodity: "Sugarcane",
      hindiName: "गन्ना",
      state: "Uttar Pradesh",
      mandi: "Muzaffarnagar",
      minPrice: 280,
      maxPrice: 320,
      modalPrice: 300,
      trend: "stable",
      change: "0",
      unit: "per quintal",
      quality: "Standard",
      arrival: "5000 quintals"
    },
    {
      commodity: "Onion",
      hindiName: "प्याज",
      state: "Maharashtra",
      mandi: "Lasalgaon",
      minPrice: 1200,
      maxPrice: 1500,
      modalPrice: 1350,
      trend: "up",
      change: "+200",
      unit: "per quintal",
      quality: "Medium",
      arrival: "4500 quintals"
    },
    {
      commodity: "Tomato",
      hindiName: "टमाटर",
      state: "Karnataka",
      mandi: "Bangalore",
      minPrice: 1500,
      maxPrice: 2000,
      modalPrice: 1750,
      trend: "up",
      change: "+150",
      unit: "per quintal",
      quality: "Grade A",
      arrival: "2800 quintals"
    }
  ];

  const filteredPrices = marketPrices.filter(price => {
    const matchesState = selectedState === "all" || price.state.toLowerCase().includes(states.find(s => s.code === selectedState)?.name.toLowerCase() || "");
    const matchesSearch = searchQuery === "" || 
      price.commodity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      price.hindiName.includes(searchQuery) ||
      price.mandi.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesState && matchesSearch;
  });

  const refreshPrices = async () => {
    setLastUpdated(new Date());
    await loadMarketPredictions();
    toast.success("Prices updated with latest market data!");
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-[#00a650]" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-[#d50000]" />;
      default:
        return <div className="w-4 h-4 bg-[#525252] rounded-full" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-[#00a650]';
      case 'down':
        return 'text-[#d50000]';
      default:
        return 'text-[#525252]';
    }
  };

  return (
    <div className="min-h-screen bg-light-yellow">
      {/* Header */}
      <header className="border-b bg-bright-orange backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" asChild>
                <Link to="/dashboard">
                  <ArrowLeft className="w-5 h-5" />
                </Link>
              </Button>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-6 h-6 text-warm-yellow" />
                <h1 className="text-xl font-bold text-white">Live Mandi Prices</h1>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-sky-blue text-white border-0">
                <Clock className="w-3 h-3 mr-1" />
                Updated: {lastUpdated.toLocaleTimeString()}
              </Badge>
              <Button onClick={refreshPrices} className="bg-sunset-orange hover:bg-mandarin-orange text-white">
                <RefreshCw className="w-4 h-4 mr-1" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <Card className="mb-8 border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-[#002b45]">Market Price Filters</CardTitle>
            <CardDescription>
              Search by commodity, state, or mandi name for accurate pricing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-[#525252]" />
                <Input
                  placeholder="Search commodity, mandi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-[#ececec] focus:border-[#00aeef]"
                />
              </div>
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger className="border-[#ececec] focus:border-[#00aeef]">
                  <SelectValue placeholder="Select State" />
                </SelectTrigger>
                <SelectContent>
                  {states.map((state) => (
                    <SelectItem key={state.code} value={state.code}>
                      {state.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                <SelectTrigger className="border-[#ececec] focus:border-[#00aeef]">
                  <SelectValue placeholder="Select Crop" />
                </SelectTrigger>
                <SelectContent>
                  {crops.map((crop) => (
                    <SelectItem key={crop.code} value={crop.code}>
                      {crop.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="text-sm text-[#525252] flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                Showing {filteredPrices.length} results
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Market Intelligence */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-[#002b45] to-[#00aeef] text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-6 h-6" />
                AI Market Predictions
              </CardTitle>
              <CardDescription className="text-blue-100">
                Powered by Gemini AI - {selectedCrop.charAt(0).toUpperCase() + selectedCrop.slice(1)} Analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingPredictions ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="w-6 h-6 animate-spin" />
                  <span className="ml-2">Analyzing market data...</span>
                </div>
              ) : marketPredictions ? (
                <div className="space-y-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <BarChart3 className="w-5 h-5" />
                      <span className="font-semibold">Price Forecast</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p><strong>Next Month:</strong> {marketPredictions.priceForecasts?.nextMonth || "Stable prices expected"}</p>
                      <p><strong>3 Months:</strong> {marketPredictions.priceForecasts?.next3Months || "Gradual increase anticipated"}</p>
                      <p><strong>6 Months:</strong> {marketPredictions.priceForecasts?.next6Months || "Seasonal variations expected"}</p>
                    </div>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <TrendingUp className="w-5 h-5" />
                      <span className="font-semibold">Market Trends</span>
                    </div>
                    <p className="text-sm">{marketPredictions.marketTrends || "Growing demand in urban markets with stable supply"}</p>
                  </div>
                  
                  {marketPredictions.recommendations && (
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <Target className="w-5 h-5" />
                        <span className="font-semibold">AI Recommendations</span>
                      </div>
                      <ul className="text-sm space-y-1">
                        {marketPredictions.recommendations.map((rec: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="w-3 h-3 mt-1 text-[#61cc1d]" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-yellow-300" />
                  <p>Unable to load predictions. Please try refreshing.</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-r from-[#f5810f] to-[#ec7d31] text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-6 h-6" />
                Export Opportunities
              </CardTitle>
              <CardDescription className="text-orange-100">
                International market insights and opportunities
              </CardDescription>
            </CardHeader>
            <CardContent>
              {marketPredictions?.exportOpportunities ? (
                <div className="space-y-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <MapPin className="w-5 h-5" />
                      <span className="font-semibold">Target Markets</span>
                    </div>
                    <p className="text-sm">{marketPredictions.exportOpportunities.join(', ')}</p>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <BarChart3 className="w-5 h-5" />
                      <span className="font-semibold">Demand Analysis</span>
                    </div>
                    <p className="text-sm">{marketPredictions.demandAnalysis}</p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <TrendingUp className="w-5 h-5" />
                      <span className="font-semibold">Current Prices</span>
                    </div>
                    <div className="text-sm space-y-1">
                      <p><strong>Wholesale:</strong> {marketPredictions.currentPrices?.wholesale || "₹2,100-2,200/quintal"}</p>
                      <p><strong>Export:</strong> {marketPredictions.currentPrices?.export || "₹2,400-2,500/quintal"}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 text-sm">
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 mt-1 text-[#61cc1d]" />
                    <p>Check quality standards before export planning</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 mt-1 text-[#61cc1d]" />
                    <p>Consider logistics costs for international shipping</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 mt-1 text-[#61cc1d]" />
                    <p>Monitor currency exchange rates for better profits</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 mt-1 text-[#61cc1d]" />
                    <p>Build relationships with export agencies</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Market Prices Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrices.map((price, index) => (
            <Card key={index} className="border-0 shadow-lg bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg text-[#002b45]">{price.commodity}</CardTitle>
                    <CardDescription className="text-sm text-[#525252]">{price.hindiName}</CardDescription>
                  </div>
                  <div className="flex items-center space-x-1">
                    {getTrendIcon(price.trend)}
                    <span className={`text-sm font-medium ${getTrendColor(price.trend)}`}>
                      {price.change !== "0" ? price.change : "Stable"}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-gradient-to-r from-[#002b45] to-[#00aeef] rounded-lg text-white">
                    <div className="text-sm opacity-90">Modal Price</div>
                    <div className="text-2xl font-bold">{formatPrice(price.modalPrice)}</div>
                    <div className="text-xs opacity-75">{price.unit}</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-[#f0f9ff] p-3 rounded-lg">
                      <span className="text-[#525252]">Min Price:</span>
                      <div className="font-semibold text-[#002b45]">{formatPrice(price.minPrice)}</div>
                    </div>
                    <div className="bg-[#f0f9ff] p-3 rounded-lg">
                      <span className="text-[#525252]">Max Price:</span>
                      <div className="font-semibold text-[#002b45]">{formatPrice(price.maxPrice)}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-[#525252]">Quality:</span>
                      <Badge className="bg-[#efd133] text-[#002b45] border-0">{price.quality}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#525252]">Arrival:</span>
                      <span className="font-medium text-[#002b45]">{price.arrival}</span>
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t border-[#ececec]">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-[#525252]">
                        <MapPin className="w-3 h-3 mr-1" />
                        {price.mandi}, {price.state}
                      </div>
                      <Badge variant="outline" className="text-xs border-[#00aeef] text-[#00aeef]">
                        Live
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MandiPrices;