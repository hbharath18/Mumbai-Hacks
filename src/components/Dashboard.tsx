import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingDown, 
  TrendingUp, 
  DollarSign, 
  PiggyBank,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

const spendingData = [
  { month: 'Jan', amount: 3200 },
  { month: 'Feb', amount: 2800 },
  { month: 'Mar', amount: 3500 },
  { month: 'Apr', amount: 2900 },
  { month: 'May', amount: 3100 },
  { month: 'Jun', amount: 2600 },
];

const categoryData = [
  { name: 'Food', value: 1200, color: '#ef4444' },       // red
  { name: 'Shopping', value: 800, color: '#fb923c' },   // orange
  { name: 'Travel', value: 600, color: '#3b82f6' },     // blue
  { name: 'Entertainment', value: 400, color: '#06b6d4' }, // cyan
  { name: 'Bills', value: 900, color: '#10b981' },      // green
];

const transactions = [
  { name: 'Grocery Shopping', amount: -85.50, category: 'Food', date: 'Today', trend: 'down' },
  { name: 'Salary Deposit', amount: 3500, category: 'Income', date: 'Yesterday', trend: 'up' },
  { name: 'Netflix Subscription', amount: -12.99, category: 'Entertainment', date: '2 days ago', trend: 'down' },
  { name: 'Coffee Shop', amount: -5.50, category: 'Food', date: '3 days ago', trend: 'down' },
];

const aiInsights = [
  { title: "Overspending Alert", message: "You've spent 15% more on food this month. Consider cooking at home.", type: "warning" },
  { title: "Savings Opportunity", message: "You can save ₹500 by switching to a different internet plan.", type: "success" },
  { title: "Investment Suggestion", message: "Based on your savings, consider investing ₹2000 in index funds.", type: "info" },
];

export const Dashboard = () => {
  return (
    <section className="py-20 px-4 bg-muted/20">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Your Financial
            <span className="bg-gradient-success bg-clip-text text-transparent"> Command Center</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Real-time insights powered by AI to keep you on track
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-gradient-card border-border/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground">Total Balance</span>
              <DollarSign className="w-5 h-5 text-primary" />
            </div>
            <div className="text-3xl font-bold">₹24,850</div>
            <Badge variant="secondary" className="mt-2 bg-success/10 text-success border-success/20">
              <TrendingUp className="w-3 h-3 mr-1" />
              +12.5%
            </Badge>
          </Card>

          <Card className="p-6 bg-gradient-card border-border/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground">This Month</span>
              <TrendingDown className="w-5 h-5 text-destructive" />
            </div>
            <div className="text-3xl font-bold">₹2,600</div>
            <Badge variant="secondary" className="mt-2 bg-success/10 text-success border-success/20">
              <ArrowDownRight className="w-3 h-3 mr-1" />
              -8.2% vs last month
            </Badge>
          </Card>

          <Card className="p-6 bg-gradient-card border-border/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground">Savings Goal</span>
              <PiggyBank className="w-5 h-5 text-accent" />
            </div>
            <div className="text-3xl font-bold">68%</div>
            <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-gradient-success" style={{ width: '68%' }} />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-card border-border/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground">Investments</span>
              <TrendingUp className="w-5 h-5 text-info" />
            </div>
            <div className="text-3xl font-bold">₹15,420</div>
            <Badge variant="secondary" className="mt-2 bg-success/10 text-success border-success/20">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              +18.3%
            </Badge>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Spending Trend Chart */}
          <Card className="lg:col-span-2 p-6 bg-gradient-card border-border/50">
            <h3 className="text-xl font-semibold mb-6">Spending Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={spendingData}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorAmount)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          {/* Category Breakdown */}
          <Card className="p-6 bg-gradient-card border-border/50">
            <h3 className="text-xl font-semibold mb-4">Categories</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Legend
                  verticalAlign="bottom"
                  height={48}
                  iconType="circle"
                  payload={categoryData.map((entry) => ({ value: entry.name, type: 'circle', color: entry.color }))}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Transactions */}
          <Card className="lg:col-span-2 p-6 bg-gradient-card border-border/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Recent Transactions</h3>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
            <div className="space-y-4">
              {transactions.map((transaction, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-background/50 hover:bg-background/80 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.trend === 'up' ? 'bg-success/10' : 'bg-destructive/10'
                    }`}>
                      {transaction.trend === 'up' ? (
                        <ArrowUpRight className="w-5 h-5 text-success" />
                      ) : (
                        <ArrowDownRight className="w-5 h-5 text-destructive" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{transaction.name}</div>
                      <div className="text-sm text-muted-foreground">{transaction.category} • {transaction.date}</div>
                    </div>
                  </div>
                  <div className={`font-semibold ${
                    transaction.amount > 0 ? 'text-success' : 'text-foreground'
                  }`}>
                    {transaction.amount > 0 ? '+' : ''}₹{Math.abs(transaction.amount).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* AI Insights */}
          <Card className="p-6 bg-gradient-card border-border/50">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-warning" />
              <h3 className="text-xl font-semibold">AI Insights</h3>
            </div>
            <div className="space-y-4">
              {aiInsights.map((insight, index) => (
                <div 
                  key={index} 
                  className={`p-4 rounded-lg border ${
                    insight.type === 'warning' ? 'bg-warning/5 border-warning/20' :
                    insight.type === 'success' ? 'bg-success/5 border-success/20' :
                    'bg-info/5 border-info/20'
                  }`}
                >
                  <div className="font-medium mb-1">{insight.title}</div>
                  <div className="text-sm text-muted-foreground">{insight.message}</div>
                </div>
              ))}
              <Button className="w-full" variant="outline">
                <Sparkles className="w-4 h-4 mr-2" />
                Get More Insights
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};