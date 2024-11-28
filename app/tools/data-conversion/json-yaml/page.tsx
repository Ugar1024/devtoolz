'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Copy, ArrowLeftRight } from 'lucide-react';
import yaml from 'js-yaml';

export default function JsonYamlConverter() {
  const [leftContent, setLeftContent] = useState('');
  const [rightContent, setRightContent] = useState('');
  const [mode, setMode] = useState<'json2yaml' | 'yaml2json'>('json2yaml');

  const handleConvert = () => {
    try {
      if (mode === 'json2yaml') {
        const jsonObj = JSON.parse(leftContent);
        const yamlStr = yaml.dump(jsonObj, {
          indent: 2,
          lineWidth: -1,
          noRefs: true,
        });
        setRightContent(yamlStr);
      } else {
        const jsonObj = yaml.load(leftContent);
        setRightContent(JSON.stringify(jsonObj, null, 2));
      }
      toast.success('Conversion successful');
    } catch (error) {
      toast.error('Invalid format. Please check your input.');
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
          JSON ↔ YAML Converter
        </h1>
        <div className="gradient-border">
          <Button
            variant="ghost"
            onClick={() => setMode(mode === 'json2yaml' ? 'yaml2json' : 'json2yaml')}
            className="group"
          >
            <ArrowLeftRight className="mr-2 h-4 w-4 transition-transform group-hover:rotate-180" />
            Switch Mode
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-4 card-hover">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
              {mode === 'json2yaml' ? 'JSON' : 'YAML'}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCopy(leftContent)}
              className="group"
            >
              <Copy className="h-4 w-4 transition-opacity group-hover:opacity-70" />
            </Button>
          </div>
          <Textarea
            value={leftContent}
            onChange={(e) => setLeftContent(e.target.value)}
            placeholder={`Enter ${mode === 'json2yaml' ? 'JSON' : 'YAML'} here...`}
            className="min-h-[400px] font-mono resize-none focus:ring-2 focus:ring-primary/20"
          />
        </Card>

        <Card className="p-4 card-hover">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
              {mode === 'json2yaml' ? 'YAML' : 'JSON'}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCopy(rightContent)}
              className="group"
            >
              <Copy className="h-4 w-4 transition-opacity group-hover:opacity-70" />
            </Button>
          </div>
          <Textarea
            value={rightContent}
            readOnly
            placeholder={`Converted ${mode === 'json2yaml' ? 'YAML' : 'JSON'} will appear here...`}
            className="min-h-[400px] font-mono resize-none bg-muted/50"
          />
        </Card>
      </div>

      <div className="flex justify-center">
        <div className="gradient-border">
          <Button
            size="lg"
            variant="ghost"
            onClick={handleConvert}
            className="group font-semibold"
          >
            Convert
          </Button>
        </div>
      </div>
    </div>
  );
}