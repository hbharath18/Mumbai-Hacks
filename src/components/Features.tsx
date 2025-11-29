import { Card } from "@/components/ui/card";
import { 
  Brain, 
  TrendingUp, 
  Target, 
  Gift, 
  Calendar, 
  Sparkles 
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Financial Coach",
    description: "Personalized insights that learn from your spending patterns and help you make smarter decisions.",
    gradient: "from-primary to-info"
  },
  {
    icon: TrendingUp,
    title: "Smart Categorization",
    description: "Automatically categorize transactions and visualize your spending with beautiful charts.",
    gradient: "from-success to-accent"
  },
  {
    icon: Target,
    title: "Goal-Based Budgeting",
    description: "Set budgets, track progress, and earn rewards when you hit your savings targets.",
    gradient: "from-warning to-destructive"
  },
  {
    icon: Gift,
    title: "Coupon Optimizer",
    description: "Never miss a deal—collect, manage, and trade coupons from all your favorite apps.",
    gradient: "from-destructive to-warning"
  },
  {
    icon: Calendar,
    title: "Festival Planning",
    description: "Predict upcoming expenses and create personalized savings plans for festivals and events.",
    gradient: "from-info to-primary"
  },
  {
    icon: Sparkles,
    title: "Investment Assistant",
    description: "AI-powered market analysis and investment suggestions to grow your wealth intelligently.",
    gradient: "from-accent to-success"
  }
];

export const Features = () => {
  return (
    <section className="py-20 px-4 bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Everything You Need to
            <span className="bg-gradient-primary bg-clip-text text-transparent"> Master Your Money</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to help you save more, spend wisely, and invest confidently.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] animate-scale-in border-border/50 bg-gradient-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
