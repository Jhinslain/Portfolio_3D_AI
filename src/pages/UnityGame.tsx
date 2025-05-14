import { useState } from 'react';
import CustomNavigation from '@/components/CustomNavigation';
import { Button } from '@/components/ui/button';

const UnityGame = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [gameLoaded, setGameLoaded] = useState(false);

  const handleGameLoad = () => {
    setIsLoading(false);
    setGameLoaded(true);
  };

  const handleLoading = () => {
    setIsLoading(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
      <CustomNavigation />
      
      <div className="container mx-auto px-4 py-20">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-6 text-center">
            Unity <span className="text-primary">WebGL</span> Demo
          </h1>
          <p className="text-xl text-muted-foreground mb-10 text-center max-w-2xl">
            Experimente jogos diretamente no seu navegador, sem instalações adicionais.
          </p>

          <div className="relative w-full max-w-5xl aspect-video rounded-lg overflow-hidden">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
                <div className="flex items-center gap-4 text-lg text-muted-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-loader-2 animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                  Loading...
                </div>
              </div>
            )}
            {!gameLoaded && !isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
                <Button onClick={handleLoading}>Load Game</Button>
              </div>
            )}
            <iframe
              src="https://play.unity.com/webgl/425562a1-e199-4ca4-8941-94a63ca45c97"
              title="Unity WebGL Game"
              width="100%"
              height="100%"
              style={{border: 'none'}}
              onLoad={handleGameLoad}
            />
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              This is a Unity WebGL demo running directly in your browser.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnityGame;
