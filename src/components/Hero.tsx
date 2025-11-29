import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-finance.jpg";

export const Hero = () => {
  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden bg-gradient-primary">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      {/* Lighten gradient so dark headings read well */}
      <div className="absolute inset-0 bg-white/40" />

      <div className="container relative z-10 px-4 py-20 mx-auto">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-white/90 border border-white/30">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">AI-Powered Financial Intelligence</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
            Your Smart Money
            <br />
            <span className="text-primary">Companion</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted mb-8 max-w-2xl mx-auto">
            AI that learns your spending habits, saves you money, and helps you invest smarter—all in one powerful app.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="group text-lg px-8 btn-primary">
              Get Started Free
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 border border-border bg-white/10 text-foreground hover:bg-white/20">
              Watch Demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
