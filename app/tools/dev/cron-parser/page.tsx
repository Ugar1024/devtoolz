'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Copy, Clock, RefreshCw } from 'lucide-react';
import { parseCronExpression, generateNextExecutions, CronExplanation } from '@/lib/utils/cron';
import { format } from 'date-fns';

export default function CronParser() {
  const [expression, setExpression] = useState('');
  const [explanation, setExplanation] = useState<CronExplanation | null>(null);
  const [nextExecutions, setNextExecutions] = useState<Date[]>([]);

  const handleParse = () => {
    try {
      const parsedExplanation = parseCronExpression(expression);
      const executions = generateNextExecutions(expression);
      setExplanation(parsedExplanation);
      setNextExecutions(executions);
      toast.success('Cron expression parsed successfully');
    } catch (error) {
      toast.error('Invalid cron expression');
      setExplanation(null);
      setNextExecutions([]);
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
          Cron Expression Parser
        </h1>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Input
                value={expression}
                onChange={(e) => setExpression(e.target.value)}
                placeholder="Enter cron expression (e.g., '* * * * *' or '* * * * * *')"
                className="font-mono"
              />
            </div>
            <div className="gradient-border">
              <Button
                variant="ghost"
                onClick={handleParse}
                className="group"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Parse
              </Button>
            </div>
          </div>

          {explanation && (
            <Card className="p-4 space-y-4">
              <h2 className="text-lg font-semibold">Explanation</h2>
              <div className="space-y-2">
                {explanation.seconds && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Seconds:</span>
                    <span>{explanation.seconds}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Minutes:</span>
                  <span>{explanation.minutes}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Hours:</span>
                  <span>{explanation.hours}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Day of Month:</span>
                  <span>{explanation.dayOfMonth}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Month:</span>
                  <span>{explanation.month}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Day of Week:</span>
                  <span>{explanation.dayOfWeek}</span>
                </div>
              </div>
            </Card>
          )}

          {nextExecutions.length > 0 && (
            <Card className="p-4 space-y-4">
              <h2 className="text-lg font-semibold">Next 5 Executions</h2>
              <div className="space-y-2">
                {nextExecutions.map((date, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-muted-foreground">#{index + 1}:</span>
                    <span className="font-mono">
                      {format(date, 'yyyy-MM-dd HH:mm:ss')}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </Card>

      <div className="text-center text-sm text-muted-foreground">
        <p>Supports both 5-part (standard) and 6-part (with seconds) cron expressions</p>
      </div>
    </div>
  );
}