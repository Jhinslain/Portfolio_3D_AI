import { useState } from 'react';
import CustomNavigation from '@/components/CustomNavigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/sonner';

const AIDemo = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([
    { 
      role: 'assistant', 
      content: 'Bonjour ! Je suis votre assistant personnel. Comment puis-je vous aider aujourd\'hui?' 
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ask', {
        method: 'POST',
        body: JSON.stringify({ question: input }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la communication avec l\'API');
      }

      const data = await response.json();
      
      // Add AI response
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (error) {
      console.error("Erreur lors de la génération de la réponse:", error);
      toast.error("Impossible de générer une réponse. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-b from-background to-background/95">
      <CustomNavigation />

      <main className="container mx-auto px-4 py-20">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-6 text-center">
            Démonstration <span className="text-primary">IA</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-10 text-center max-w-2xl">
            Interagissez avec notre IA de démonstration pour voir comment l'intelligence artificielle peut être intégrée à votre site.
          </p>

          <Card className="w-full max-w-3xl">
            <CardHeader>
              <CardTitle>Chat avec l'IA</CardTitle>
              <CardDescription>
                Cette démo simule une interaction avec une IA. Dans une implémentation réelle, vous pourriez connecter cette interface à une API comme OpenAI, Claude ou Gemini.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4 mb-4 h-[400px] overflow-y-auto p-4 border rounded-md bg-background/50">
                {messages.map((message, index) => (
                  <div 
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`px-4 py-2 rounded-lg max-w-[80%] ${
                        message.role === 'user' 
                          ? 'bg-primary text-primary-foreground ml-12' 
                          : 'bg-muted text-muted-foreground mr-12'
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="px-4 py-2 rounded-lg bg-muted text-muted-foreground">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 rounded-full bg-current animate-bounce" />
                        <div className="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:-.15s]" />
                        <div className="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:-.3s]" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
                <Textarea
                  placeholder="Posez une question..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="min-h-[100px]"
                  disabled={isLoading}
                />
                <Button 
                  type="submit" 
                  disabled={isLoading} 
                  className="ml-auto"
                >
                  Envoyer
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex justify-between text-sm text-muted-foreground">
              <div>Cette IA de démonstration n'est pas connectée à un modèle réel.</div>
              <div>Vous pouvez la personnaliser selon vos besoins.</div>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AIDemo;
