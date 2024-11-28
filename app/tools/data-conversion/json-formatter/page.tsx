'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Copy, Minimize2, Maximize2 } from 'lucide-react';

export default function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isMinified, setIsMinified] = useState(false);

  const formatJson = (minify: boolean = false) => {
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, minify ? 0 : 2);
      setOutput(formatted);
      setIsMinified(minify);
      toast.success('JSON formatted successfully');
    } catch (error) {
      toast.error('Invalid JSON. Please check your input.');
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
          JSON Formatter
        </h1>
        <div className="flex space-x-2">
          <div className="gradient-border">
            <Button
              variant="ghost"
              onClick={() => formatJson(false)}
              className="group"
            >
              <Maximize2 className="mr-2 h-4 w-4" />
              Beautify
            </Button>
          </div>
          <div className="gradient-border">
            <Button
              variant="ghost"
              onClick={() => formatJson(true)}
              className="group"
            >
              <Minimize2 className="mr-2 h-4 w-4" />
              Minify
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-4 card-hover">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
              Input JSON
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCopy(input)}
              className="group"
            >
              <Copy className="h-4 w-4 transition-opacity group-hover:opacity-70" />
            </Button>
          </div>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your JSON here..."
            className="min-h-[400px] font-mono resize-none focus:ring-2 focus:ring-primary/20"
          />
        </Card>

        <Card className="p-4 card-hover">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
              {isMinified ? 'Minified' : 'Formatted'} JSON
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCopy(output)}
              className="group"
            >
              <Copy className="h-4 w-4 transition-opacity group-hover:opacity-70" />
            </Button>
          </div>
          <Textarea
            value={output}
            readOnly
            placeholder="Formatted JSON will appear here..."
            className="min-h-[400px] font-mono resize-none bg-muted/50"
          />
        </Card>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        <p>Tip: You can paste your JSON and click either Beautify or Minify to format it.</p>
      </div>
    </div>
  );
}