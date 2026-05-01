import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, Sprout, DollarSign, Store, Users, Cpu, Wrench, 
  ArrowRight, Sparkles, Zap, Globe, Shield, TrendingUp,
  Camera, Cloud, Mic, Calendar, GamepadIcon, QrCode,
  ChevronRight, Star, Award, Target, Rocket
} from "lucide-react";
import { Link } from "react-router-dom";

const EnhancedIndex = () => {
  const [activeCategory, setActiveCategory] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const categories = [
    {
      id: 'ai-intelligence',
      name: 'AI Intelligence Hub',
      icon: <Brain className="w-8 h-8" />,
      color: 'from-purple-500 to-pink-500',
      description: 'Advanced AI-powered farming solutions',
      features: [
        { name: 'CropGenius AI', desc: 'Smart crop advisory system', href: '/crop-health' },
        { name: 'MarketVision AI', desc: 'Demand forecasting engine', href: '/prices' },
        { name: 'SeedSense Pro', desc: 'Fertilizer & seed recommendations', href: '/crop-health' },
        { name: 'ExportEdge AI', desc: 'Predictive export advisory', href: '/prices' }
      ]
    },
    {
      id: 'smart-farm',
      name: 'Smart Farm Management',
      icon: <Sprout className="w-8 h-8" />,
      color: 'from-green-500 to-emerald-500',
      description: 'Intelligent farm operations management',
      features: [
        { name: 'FarmFlow Scheduler', desc: 'Daily task management', href: '/crop-calendar' },
        { name: 'SoilScan Analytics', desc: 'Soil health monitoring', href: '/crop-health' },
        { name: 'PestGuard Shield', desc: 'Pest detection & control', href: '/crop-health' },
        { name: 'HydroSync Pro', desc: 'Smart irrigation system', href: '/weather' }
      ]
    },
    {
      id: 'financial',
      name: 'Financial & Market Intelligence',
      icon: <DollarSign className="w-8 h-8" />,
      color: 'from-blue-500 to-cyan-500',
      description: 'Financial tools and market insights',
      features: [
        { name: 'FarmCredit Score', desc: 'Credit profile management', href: '/subsidy-finder' },
        { name: 'PriceLock Guarantee', desc: 'Future price locking', href: '/prices' },
        { name: 'ColdVault Reserve', desc: 'Cold storage booking', href: '/e-pass' },
        { name: 'AgriFinance Hub', desc: 'Loans & insurance', href: '/subsidy-finder' }
      ]
    },
    {
      id: 'marketplace',
      name: 'Marketplace & Trading',
      icon: <Store className="w-8 h-8" />,
      color: 'from-orange-500 to-red-500',
      description: 'Trading and marketplace solutions',
      features: [
        { name: 'AgriTrade Central', desc: 'Main marketplace', href: '/prices' },
        { name: 'FarmGear Rental', desc: 'Equipment rental hub', href: '/e-pass' },
        { name: 'FreshDirect Connect', desc: 'Farm to consumer market', href: '/prices' },
        { name: 'TradeSignal Pro', desc: 'Trading alerts system', href: '/prices' }
      ]
    },
    {
      id: 'community',
      name: 'Community & Support',
      icon: <Users className="w-8 h-8" />,
      color: 'from-indigo-500 to-purple-500',
      description: 'Community-driven support network',
      features: [
        { name: 'FarmersUnite Network', desc: 'Community platform', href: '/agri-game' },
        { name: 'NeighborWise', desc: 'Ask neighbor feature', href: '/voice' },
        { name: 'AgriSupport 24/7', desc: 'Helpdesk service', href: '/voice' },
        { name: 'GovConnect Portal', desc: 'Government queries', href: '/subsidy-finder' }
      ]
    },
    {
      id: 'advanced-tech',
      name: 'Advanced Technology',
      icon: <Cpu className="w-8 h-8" />,
      color: 'from-teal-500 to-green-500',
      description: 'Cutting-edge agricultural technology',
      features: [
        { name: 'SkyWatch Drones', desc: 'Drone crop monitoring', href: '/crop-health' },
        { name: 'SmartField Sensors', desc: 'IoT farm sensors', href: '/weather' },
        { name: 'TrustChain Tracking', desc: 'Blockchain supply chain', href: '/blockchain-tracking' },
        { name: 'SatelliteEye Monitor', desc: 'Satellite integration', href: '/crop-health' }
      ]
    }
  ];

  const stats = [
    { value: "1M+", label: "Farmers Empowered", icon: <Users className="w-6 h-6" /> },
    { value: "50+", label: "AI Models", icon: <Brain className="w-6 h-6" /> },
    { value: "99.9%", label: "Accuracy Rate", icon: <Target className="w-6 h-6" /> },
    { value: "24/7", label: "Support", icon: <Shield className="w-6 h-6" /> }
  ];

  return (
    <div className="min-h-screen bg-light-yellow relative overflow-hidden animate-fade-in">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
        <img 
          src="/src/assets/hero-smart-bharat.jpg" 
          alt="Smart Bharat agricultural hero" 
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div 
          className="absolute w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
          style={{
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
          }}
        />
        <div 
          className="absolute w-96 h-96 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl right-0 bottom-0"
          style={{
            transform: `translate(${-mousePosition.x * 0.01}px, ${-mousePosition.y * 0.01}px)`
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-50 border-b border-bright-orange/20 bg-bright-orange backdrop-blur-xl safe-area-inset-top">
        <div className="container-mobile py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-warm-yellow to-goldenrod rounded-xl flex items-center justify-center shadow-2xl icon-button">
                  <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-white icon-enhanced" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-warm-yellow to-goldenrod rounded-xl blur opacity-30 animate-bounce-gentle" />
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-white text-enhanced">
                  Kisan Sathi Digital Bharat
                </h1>
                <p className="text-xs sm:text-sm text-warm-yellow/80">AI-Powered Agricultural Revolution</p>
              </div>
            </div>
            <nav className="hidden md:flex space-x-4 lg:space-x-6">
              <Link to="/dashboard" className="text-warm-yellow/80 hover:text-white transition-colors font-medium">
                Dashboard
              </Link>
              <Link to="/voice" className="text-warm-yellow/80 hover:text-white transition-colors font-medium">
                AI Assistant
              </Link>
              <Link to="/prices" className="text-warm-yellow/80 hover:text-white transition-colors font-medium">
                Live Prices
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="mb-8">
            <Badge className="mb-4 bg-gradient-to-r from-deep-blue/20 to-sky-blue/20 text-deep-blue border-deep-blue/30 backdrop-blur-sm">
              <Rocket className="w-4 h-4 mr-2" />
              Next-Gen Agricultural Platform
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-graphite-gray">
              Future of Farming
              <br />
              <span className="text-4xl md:text-6xl bg-gradient-to-r from-bright-orange to-sunset-orange bg-clip-text text-transparent">
                Powered by AI
              </span>
            </h1>
            <p className="text-xl text-graphite-gray mb-8 max-w-3xl mx-auto leading-relaxed">
              Revolutionary agricultural platform combining AI intelligence, IoT sensors, blockchain technology, 
              and satellite monitoring to transform farming into a precision science.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 sm:mb-16 px-4">
            <Link to="/dashboard" className="btn-primary mobile-button flex items-center justify-center gap-3">
              <Zap className="w-5 h-5 sm:w-6 sm:h-6 icon-enhanced" />
              <span className="font-semibold">Launch Dashboard</span>
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 icon-enhanced" />
            </Link>
            <Link to="/voice" className="btn-secondary mobile-button flex items-center justify-center gap-3">
              <Mic className="w-5 h-5 sm:w-6 sm:h-6 icon-enhanced" />
              <span className="font-semibold">Try AI Assistant</span>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-16 px-2">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group card-enhanced p-4 sm:p-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-sky-blue/20 to-bright-blue/20 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 backdrop-blur-sm border border-deep-blue/10 icon-button">
                  <div className="text-sky-blue group-hover:text-bright-blue transition-colors icon-enhanced">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-deep-blue mb-2 text-enhanced">{stat.value}</div>
                <div className="text-sm sm:text-base text-graphite-gray font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-deep-blue">
              Comprehensive Solutions
            </h2>
            <p className="text-xl text-graphite-gray max-w-2xl mx-auto">
              Six powerful categories of agricultural technology solutions designed for modern farming
            </p>
          </div>

          {/* Category Navigation */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category, index) => (
              <Button
                key={category.id}
                variant={activeCategory === index ? "default" : "outline"}
                onClick={() => setActiveCategory(index)}
                className={`${
                  activeCategory === index 
                    ? `bg-gradient-to-r ${category.color} text-white shadow-2xl scale-105` 
                    : 'border-deep-blue/20 text-deep-blue hover:bg-deep-blue/10'
                } transition-all duration-300 backdrop-blur-sm`}
              >
                <div className="flex items-center gap-2">
                  {category.icon}
                  <span className="hidden sm:inline">{category.name}</span>
                </div>
              </Button>
            ))}
          </div>

          {/* Active Category Display */}
          <div className="mb-12">
            <Card className="bg-white/90 border-deep-blue/10 backdrop-blur-xl shadow-2xl">
              <CardHeader className="text-center">
                <div className={`w-20 h-20 bg-gradient-to-br ${categories[activeCategory].color} rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-2xl`}>
                  <div className="text-white">
                    {categories[activeCategory].icon}
                  </div>
                </div>
                <CardTitle className="text-2xl text-deep-blue mb-2">
                  {categories[activeCategory].name}
                </CardTitle>
                <CardDescription className="text-graphite-gray text-lg">
                  {categories[activeCategory].description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {categories[activeCategory].features.map((feature, index) => (
                    <Link key={index} to={feature.href}>
                      <Card className="bg-white/80 border-deep-blue/10 hover:bg-white transition-all duration-300 hover:scale-105 cursor-pointer group backdrop-blur-sm shadow-lg">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-deep-blue group-hover:text-sky-blue transition-colors">
                              {feature.name}
                            </h3>
                            <ChevronRight className="w-4 h-4 text-graphite-gray group-hover:text-sky-blue transition-colors" />
                          </div>
                          <p className="text-sm text-graphite-gray group-hover:text-deep-blue transition-colors">
                            {feature.desc}
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Quick Access Features */}
      <section className="relative z-10 py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-deep-blue">
              Quick Access Tools
            </h2>
            <p className="text-graphite-gray">Essential farming tools at your fingertips</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: 'AI Crop Health', icon: <Camera className="w-8 h-8" />, href: '/crop-health', color: 'from-green-500 to-emerald-500' },
              { name: 'Weather Advisory', icon: <Cloud className="w-8 h-8" />, href: '/weather', color: 'from-blue-500 to-cyan-500' },
              { name: 'Voice Assistant', icon: <Mic className="w-8 h-8" />, href: '/voice', color: 'from-purple-500 to-pink-500' },
              { name: 'Live Mandi Prices', icon: <TrendingUp className="w-8 h-8" />, href: '/prices', color: 'from-orange-500 to-red-500' },
              { name: 'Crop Calendar', icon: <Calendar className="w-8 h-8" />, href: '/crop-calendar', color: 'from-indigo-500 to-purple-500' },
              { name: 'AgriGame Learning', icon: <GamepadIcon className="w-8 h-8" />, href: '/agri-game', color: 'from-pink-500 to-rose-500' }
            ].map((tool, index) => (
              <Link key={index} to={tool.href}>
                <Card className="bg-white/90 border-deep-blue/10 hover:bg-white transition-all duration-300 hover:scale-105 cursor-pointer group backdrop-blur-xl shadow-lg">
                  <CardContent className="p-8 text-center">
                    <div className={`w-16 h-16 bg-gradient-to-br ${tool.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl group-hover:scale-110 transition-transform duration-300`}>
                      <div className="text-white">
                        {tool.icon}
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-deep-blue mb-2 group-hover:text-sky-blue transition-colors">
                      {tool.name}
                    </h3>
                    <div className="flex items-center justify-center text-graphite-gray group-hover:text-sky-blue transition-colors">
                      <span className="text-sm">Launch Tool</span>
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-4 border-t border-deep-blue/20 bg-deep-blue backdrop-blur-xl">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-sky-blue to-bright-blue rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">
              Kisan Sathi Digital Bharat
            </h3>
          </div>
          <p className="text-sky-blue/80 mb-6">
            Empowering farmers through cutting-edge AI technology • Built with ❤️ for Digital India
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-sky-blue/60">
            <span>© 2024 Kisan Sathi Digital Bharat</span>
            <span>•</span>
            <span>Made in India</span>
            <span>•</span>
            <span>For Farmers, By Technology</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default EnhancedIndex;