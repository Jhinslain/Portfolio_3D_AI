
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const UnityGame = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // This simulates the Unity loading process
    if (isGameStarted) {
      const timer = setTimeout(() => {
        setIsLoading(false);
        toast({
          title: "Game loaded successfully",
          description: "Enjoy playing the Unity WebGL game!",
        });
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isGameStarted, toast]);

  const handleStartGame = () => {
    setIsGameStarted(true);
    toast({
      title: "Loading game...",
      description: "Please wait while the Unity game is being initialized.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Bar */}
      <nav className="w-full bg-background/80 backdrop-blur-md border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <a href="/" className="text-xl font-display font-bold text-glow">Portfolio</a>
          <a href="/" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
            Back to Home
          </a>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-4xl mx-auto text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Interactive <span className="text-glow text-primary">Unity WebGL</span> Game
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Experience an interactive 3D game built with Unity and exported to WebGL for browser play.
          </p>
        </div>

        {!isGameStarted ? (
          <div className="glass-card p-8 rounded-lg w-full max-w-4xl mx-auto text-center">
            <p className="mb-6 text-muted-foreground">
              This Unity WebGL game showcases interactive 3D environments directly in your browser.
              Click the button below to start the game experience.
            </p>
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-primary to-accent text-white"
              onClick={handleStartGame}
            >
              Launch Unity Game
            </Button>
          </div>
        ) : (
          <div className="relative w-full max-w-4xl aspect-[16/9] mx-auto glass-card overflow-hidden rounded-lg">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-background/90">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-muted-foreground">Loading game...</p>
                </div>
              </div>
            ) : (
              <>
                {/* Here we would normally embed the actual Unity WebGL game */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <div className="text-center p-6">
                    <h3 className="text-2xl font-bold mb-4">Unity Game Placeholder</h3>
                    <p className="text-muted-foreground mb-4">
                      This is where your actual Unity WebGL game would be rendered. 
                      In a real implementation, you would include the Unity-generated JavaScript files 
                      and canvas element here.
                    </p>
                    <div className="p-4 bg-white/5 rounded text-sm text-left font-mono">
                      <p className="text-muted-foreground">To implement a real Unity WebGL game:</p>
                      <ol className="list-decimal list-inside mt-2 space-y-1">
                        <li>Build your Unity project with WebGL target</li>
                        <li>Add the generated files to your public directory</li>
                        <li>Include the Unity loader script</li>
                        <li>Initialize the Unity instance with proper configuration</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {isGameStarted && !isLoading && (
          <div className="mt-8 w-full max-w-4xl mx-auto glass-card p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Game Controls</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="p-3 bg-white/5 rounded">
                <span className="font-mono text-primary">W, A, S, D</span> - Movement
              </div>
              <div className="p-3 bg-white/5 rounded">
                <span className="font-mono text-primary">Space</span> - Jump
              </div>
              <div className="p-3 bg-white/5 rounded">
                <span className="font-mono text-primary">Mouse</span> - Look around
              </div>
              <div className="p-3 bg-white/5 rounded">
                <span className="font-mono text-primary">E</span> - Interact
              </div>
              <div className="p-3 bg-white/5 rounded">
                <span className="font-mono text-primary">ESC</span> - Menu
              </div>
              <div className="p-3 bg-white/5 rounded">
                <span className="font-mono text-primary">1-5</span> - Select items
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="py-6 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Portfolio | Unity WebGL Integration</p>
        </div>
      </footer>
    </div>
  );
};

export default UnityGame;
