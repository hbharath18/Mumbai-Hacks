import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Dashboard } from "@/components/Dashboard";
import { ChatBot } from "@/components/ChatBot";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <div id="features">
          <Features />
        </div>
        <div id="dashboard">
          <Dashboard />
        </div>
        <div id="chat">
          <ChatBot />
        </div>
      </main>
      <footer className="border-t border-border/40 py-8 mt-20">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2025 FinWise AI. AI That Guides, Tracks, and Grows Your Money.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;