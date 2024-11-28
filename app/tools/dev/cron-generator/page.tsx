'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Copy, Wand2 } from 'lucide-react';
import { validateCronExpression } from '@/lib/utils/cron';

const RETRY_LIMIT = 3;

interface GenerateResponse {
  expression: string;
  retryCount?: number;
}

export default function CronGenerator() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const validateAndCleanExpression = (text: string): string | null => {
    // Extract potential cron expression using regex
    const cronRegex = /(\d+|\*|\*/\d+)(\s+(\d+|\*|\*/\d+)){4,5}/g;
    const matches = text.match(cronRegex);
    
    if (!matches) return null;
    
    // Validate each potential match
    for (const match of matches) {
      if (validateCronExpression(match)) {
        return match.trim();
      }
    }
    
    return null;
  };

  const generateCronExpression = async (
    userPrompt: string,
    retryCount: number = 0
  ): Promise<GenerateResponse> => {
    // This is a placeholder for the actual API call
    // Replace with your OpenAI API implementation
    const response = await fetch('/api/generate-cron', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: userPrompt }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate cron expression');
    }

    const data = await response.json();
    const expression = validateAndCleanExpression(data.text);

    if (!expression && retryCount < RETRY_LIMIT) {
      return generateCronExpression(userPrompt, retryCount + 1);
    }

    if (!expression) {
      throw new Error('Failed to generate valid cron expression');
    }

    return { expression, retryCount };
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a description');
      return;
    }

    setLoading(true);
    try {
      const { expression, retryCount } = await generateCronExpression(prompt);
      setResult(expression);
      toast.success(
        retryCount
          ? `Generated after ${retryCount + 1} attempts`
          : 'Generated successfully'
      );
    } catch (error) {
      toast.error('Failed to generate cron expression');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('Copied to clipboard');
  };

  return (
    <div className="space-y-6 gradient-bg p-6 rounded-lg">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
          Natural Language Cron Generator
        </h1>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe when you want the task to run (e.g., 'Every Monday at 9 AM')"
              className="min-h-[100px] resize-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="flex justify-end">
            <div className="gradient-border">
              <Button
                variant="ghost"
                onClick={handleGenerate}
                disabled={loading}
                className="group"
              >
                <Wand2 className="mr-2 h-4 w-4" />
                {loading ? 'Generating...' : 'Generate'}
              </Button>
            </div>
          </div>

          {result && (
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold mb-1">Generated Expression</h3>
                  <p className="font-mono text-lg">{result}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(result)}
                  className="group"
                >
                  <Copy className="h-4 w-4 transition-opacity group-hover:opacity-70" />
                </Button>
              </div>
            </Card>
          )}
        </div>
      </Card>

      <div className="text-center text-sm text-muted-foreground">
        <p>Enter a natural language description of your schedule, and we&apos;ll convert it to a cron expression</p>
      </div>
    </div>
  );
}