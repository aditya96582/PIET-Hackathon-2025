import { Link, useLocation } from 'react-router-dom';
import { Home, BarChart3, Camera, Cloud, Mic, Calendar, User } from 'lucide-react';

const MobileNav = () => {
  const location = useLocation();
  
  const navItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/dashboard', icon: User, label: 'Dashboard' },
    { href: '/crop-health', icon: Camera, label: 'Health' },
    { href: '/weather', icon: Cloud, label: 'Weather' },
    { href: '/prices', icon: BarChart3, label: 'Prices' },
    { href: '/voice', icon: Mic, label: 'Voice' },
    { href: '/crop-calendar', icon: Calendar, label: 'Calendar' }
  ];

  return (
    <nav className="mobile-nav md:hidden">
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex flex-col items-center py-2 px-1 rounded-lg transition-all duration-200 touch-target ${
                isActive 
                  ? 'text-bright-orange bg-bright-orange/10' 
                  : 'text-graphite-gray hover:text-bright-orange'
              }`}
            >
              <Icon className={`w-5 h-5 mb-1 icon-enhanced ${isActive ? 'scale-110' : ''}`} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNav;