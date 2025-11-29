import { Button } from "@/components/ui/button";
import logoImage from "@/assets/finwise-logo.jpg";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <img 
            src={logoImage} 
            alt="FinWise AI Logo" 
            className="h-10 w-10 object-contain"
          />
          <div className="flex flex-col leading-tight">
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              FinWise AI
            </span>
            <span className="text-xs text-muted hidden sm:block">
              Guides, Tracks & Grows Your Money
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">
            Features
          </a>
          <a href="#dashboard" className="text-sm font-medium hover:text-primary transition-colors">
            Dashboard
          </a>
          <a href="#chat" className="text-sm font-medium hover:text-primary transition-colors">
            AI Chat
          </a>
          <a href="#about" className="text-sm font-medium hover:text-primary transition-colors">
            About
          </a>
        </nav>

        <div className="flex items-center gap-4">
          <Button variant="ghost">Sign In</Button>
          <Button>Get Started</Button>
        </div>
      </div>
    </header>
  );
};
