import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { GraphVisualizerContainer } from "@/components/GraphVisualizerContainer";
import { DPVisualizerContainer } from "@/components/DPVisualizerContainer";
import { Network, Brain } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

const Index = () => {
  const [activeTab, setActiveTab] = useState("graph");

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                DSA Visualizer
              </h1>
              <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                Interactive algorithm visualization
              </p>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <Card className="border-border bg-card/80 backdrop-blur-sm p-3 sm:p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-4 sm:mb-8">
              <TabsTrigger value="graph" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                <Network className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Graph Algorithms</span>
                <span className="sm:hidden">Graph</span>
              </TabsTrigger>
              <TabsTrigger value="dp" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                <Brain className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Dynamic Programming</span>
                <span className="sm:hidden">DP</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="graph" className="mt-0">
              <GraphVisualizerContainer />
            </TabsContent>

            <TabsContent value="dp" className="mt-0">
              <DPVisualizerContainer />
            </TabsContent>
          </Tabs>
        </Card>

        {/* Info Section */}
        <div className="mt-4 sm:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <Card className="p-4 sm:p-6 border-primary/20 bg-primary/5">
            <h3 className="font-semibold text-primary mb-2 text-sm sm:text-base">Step-by-Step</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Watch algorithms execute with animated visualizations
            </p>
          </Card>
          <Card className="p-4 sm:p-6 border-secondary/20 bg-secondary/5">
            <h3 className="font-semibold text-secondary mb-2 text-sm sm:text-base">Interactive Controls</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Play, pause, and adjust speed to learn at your pace
            </p>
          </Card>
          <Card className="p-4 sm:p-6 border-accent/20 bg-accent/5">
            <h3 className="font-semibold text-accent mb-2 text-sm sm:text-base">Educational</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Perfect for students and developers learning DSA
            </p>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;
