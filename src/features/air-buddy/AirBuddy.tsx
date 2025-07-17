import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wind, Activity, Shield, AlertTriangle, Thermometer, Droplets, RefreshCw } from 'lucide-react';

const AirBuddy = () => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [aqiData, setAqiData] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const [currentTip, setCurrentTip] = useState('');
  const [loading, setLoading] = useState(false);

  const descriptions = ["Good", "Fair", "Moderate", "Poor", "Very Poor"];
  const messages = [
    "Enjoy your day outside!",
    "Air is fine today.",
    "Be cautious, especially for sensitive individuals.",
    "Limit outdoor activities.",
    "Stay indoors and use air purifiers."
  ];

  const ecoTips = [
    "🌱 Add air-purifying indoor plants like spider plant or peace lily.",
    "🚲 Reduce pollution by biking or walking for short trips.",
    "💧 Stay hydrated when the air is dry.",
    "🧼 Keep windows closed on poor AQI days.",
    "🌍 Recycle and reduce waste to help reduce pollution."
  ];

  const getAQIColor = (aqi) => {
    const colors = {
      1: 'text-green-500',
      2: 'text-green-400',
      3: 'text-yellow-500',
      4: 'text-orange-500',
      5: 'text-red-500'
    };
    return colors[aqi] || 'text-gray-500';
  };

  const showRandomTip = () => {
    const tip = ecoTips[Math.floor(Math.random() * ecoTips.length)];
    setCurrentTip(tip);
  };

  const startCountdown = (seconds = 300) => {
    setCountdown(seconds);
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          getAQI();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const requestNotificationPermission = () => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  };

  const showNotification = (aqi) => {
    if (aqi >= 4 && Notification.permission === "granted") {
      new Notification("AirBuddy Alert", {
        body: `Air quality is ${descriptions[aqi - 1]}. ${messages[aqi - 1]}`,
        icon: "/placeholder.svg"
      });
    }
  };

  const getAQI = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    setLoading(true);
    
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      const apiKey = "85e6a8487f1530f75af6214fff82beb7";
      const aqiUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

      try {
        const [aqiResponse, weatherResponse] = await Promise.all([
          fetch(aqiUrl),
          fetch(weatherUrl)
        ]);
        
        const aqiResult = await aqiResponse.json();
        const weatherResult = await weatherResponse.json();
        
        const aqi = aqiResult.list[0].main.aqi;
        
        setAqiData({
          level: aqi,
          description: descriptions[aqi - 1],
          message: messages[aqi - 1]
        });
        
        setWeatherData({
          temperature: Math.round(weatherResult.main.temp),
          humidity: weatherResult.main.humidity,
          windSpeed: weatherResult.wind.speed
        });

        showNotification(aqi);
        showRandomTip();
        startCountdown();
        
      } catch (error) {
        console.error("Failed to fetch data:", error);
        alert("Failed to fetch air quality data");
      } finally {
        setLoading(false);
      }
    }, () => {
      alert("Unable to access location");
      setLoading(false);
    });
  };

  const handleStartMonitoring = () => {
    setIsMonitoring(true);
    requestNotificationPermission();
    getAQI();
  };

  useEffect(() => {
    if (isMonitoring) {
      getAQI();
    }
  }, []);

  if (!isMonitoring) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        
        <div className="pt-20 pb-12">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <div className="w-20 h-20 bg-gradient-eco rounded-full flex items-center justify-center mx-auto mb-6">
                <Wind className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
                Air Buddy
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Real-time air quality monitoring, breathing recommendations, and health insights for cleaner living.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <Card className="feature-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="w-6 h-6 mr-2 text-primary" />
                    Health Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Personalized breathing exercises and health recommendations based on current air quality.
                  </p>
                  <Badge variant="secondary">Breathing Exercises</Badge>
                </CardContent>
              </Card>

              <Card className="feature-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="w-6 h-6 mr-2 text-primary" />
                    Protection Tips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Smart alerts and protective measures for when air quality drops in your area.
                  </p>
                  <Badge variant="secondary">Smart Alerts</Badge>
                </CardContent>
              </Card>

              <Card className="feature-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="w-6 h-6 mr-2 text-primary" />
                    Pollution Sources
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Identify and avoid pollution hotspots with real-time environmental data.
                  </p>
                  <Badge variant="secondary">Pollution Mapping</Badge>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <Button size="lg" className="btn-eco" onClick={handleStartMonitoring}>
                Start Air Monitoring
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-eco rounded-full flex items-center justify-center mx-auto mb-4">
              <Wind className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold gradient-text mb-2">
              Air Buddy Monitor
            </h1>
          </div>

          {/* Main AQI Card */}
          <Card className="glass-card mb-8">
            <CardContent className="p-8 text-center">
              {loading ? (
                <div className="text-xl">Loading AQI...</div>
              ) : aqiData ? (
                <>
                  <div className={`text-4xl font-bold mb-2 ${getAQIColor(aqiData.level)}`}>
                    AQI Level: {aqiData.level} ({aqiData.description})
                  </div>
                  <div className="text-lg text-muted-foreground mb-6">
                    {aqiData.message}
                  </div>
                  
                  {/* Air Quality Icon */}
                  <div className="w-20 h-20 mx-auto mb-6">
                    <img 
                      src={`/lovable-uploads/${
                        aqiData.level <= 2 ? 'c01fcfe8-bad9-4603-822f-b08a9e1cb189.png' : 
                        aqiData.level === 3 ? '5d8c3e15-37a1-497a-9437-650e1a120cb7.png' :
                        'b5840b42-f508-459f-8320-311ce9518490.png'
                      }`}
                      alt={aqiData.description}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Weather Info */}
                  {weatherData && (
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="text-center">
                        <Thermometer className="w-6 h-6 mx-auto mb-2 text-primary" />
                        <div className="text-lg font-semibold">{weatherData.temperature}°C</div>
                        <div className="text-sm text-muted-foreground">Temperature</div>
                      </div>
                      <div className="text-center">
                        <Droplets className="w-6 h-6 mx-auto mb-2 text-primary" />
                        <div className="text-lg font-semibold">{weatherData.humidity}%</div>
                        <div className="text-sm text-muted-foreground">Humidity</div>
                      </div>
                      <div className="text-center">
                        <Wind className="w-6 h-6 mx-auto mb-2 text-primary" />
                        <div className="text-lg font-semibold">{weatherData.windSpeed} m/s</div>
                        <div className="text-sm text-muted-foreground">Wind Speed</div>
                      </div>
                    </div>
                  )}

                  {/* Alert for poor air quality */}
                  {aqiData.level >= 4 && (
                    <div className="bg-destructive/20 border border-destructive/30 rounded-lg p-4 mb-6">
                      <div className="flex items-center justify-center gap-2 text-destructive">
                        <img 
                          src="/lovable-uploads/5179f9f8-f9b9-460d-ac8c-8eafead5e247.png"
                          alt="Alert"
                          className="w-6 h-6"
                        />
                        <span className="font-semibold">Air quality is poor! Stay safe!</span>
                      </div>
                    </div>
                  )}

                  {/* Tips */}
                  {currentTip && (
                    <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
                      <div className="text-sm text-primary font-medium">
                        💡 Eco Tip: {currentTip}
                      </div>
                    </div>
                  )}

                  {/* Countdown */}
                  {countdown > 0 && (
                    <div className="text-sm text-muted-foreground mb-4">
                      Next update in {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}
                    </div>
                  )}

                  <Button onClick={getAQI} disabled={loading} className="btn-eco">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh AQI
                  </Button>
                </>
              ) : (
                <div className="text-xl">Unable to load AQI data</div>
              )}
            </CardContent>
          </Card>

          {/* Character Image */}
          <div className="text-center">
            <img 
              src="/lovable-uploads/b900263b-cd23-4b86-b924-242686c18618.png"
              alt="Eco Character"
              className="w-24 h-24 mx-auto opacity-80"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AirBuddy;