'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Copy, Clock, RefreshCw } from 'lucide-react';

const timeZones = [
  { value: 'UTC', label: 'UTC+0', offset: 0 },
  { value: 'Asia/Shanghai', label: 'UTC+8 (China)', offset: 8 },
  { value: 'America/New_York', label: 'UTC-4 (New York)', offset: -4 },
  { value: 'America/Los_Angeles', label: 'UTC-7 (Los Angeles)', offset: -7 },
];

const formatTypes = [
  { value: 'yyyy-MM-dd HH:mm:ss', label: 'YYYY-MM-DD HH:mm:ss' },
  { value: 'yyyyMMdd HHmmss', label: 'YYYYMMDD HHmmss' },
];

export default function TimestampConverter() {
  const [timestamp, setTimestamp] = useState('');
  const [selectedTimeZone, setSelectedTimeZone] = useState('UTC');
  const [selectedFormat, setSelectedFormat] = useState(formatTypes[0].value);
  const [convertedTimes, setConvertedTimes] = useState<Record<string, string>>({});

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('Copied to clipboard');
  };

  const getCurrentTimestamp = () => {
    const now = Date.now();
    setTimestamp(now.toString());
    handleConvert(now.toString());
  };

  const formatDate = (date: Date, format: string, timeZone: string) => {
    const offset = timeZones.find(tz => tz.value === timeZone)?.offset || 0;
    const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
    const tzDate = new Date(utc + (3600000 * offset));

    const pad = (n: number) => n.toString().padStart(2, '0');
    
    if (format === 'yyyy-MM-dd HH:mm:ss') {
      return `${tzDate.getFullYear()}-${pad(tzDate.getMonth() + 1)}-${pad(tzDate.getDate())} ${pad(tzDate.getHours())}:${pad(tzDate.getMinutes())}:${pad(tzDate.getSeconds())}`;
    } else {
      return `${tzDate.getFullYear()}${pad(tzDate.getMonth() + 1)}${pad(tzDate.getDate())} ${pad(tzDate.getHours())}${pad(tzDate.getMinutes())}${pad(tzDate.getSeconds())}`;
    }
  };

  const handleConvert = (inputTimestamp: string = timestamp) => {
    try {
      let timeMs: number;
      
      // Handle different timestamp formats
      if (inputTimestamp.length === 13) {
        timeMs = parseInt(inputTimestamp); // Milliseconds
      } else if (inputTimestamp.length === 10) {
        timeMs = parseInt(inputTimestamp) * 1000; // Seconds to milliseconds
      } else if (inputTimestamp.length === 19) {
        timeMs = parseInt(inputTimestamp) / 1000000; // Nanoseconds to milliseconds
      } else {
        throw new Error('Invalid timestamp format');
      }

      const date = new Date(timeMs);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid timestamp');
      }

      const results: Record<string, string> = {};
      timeZones.forEach(tz => {
        results[tz.value] = formatDate(date, selectedFormat, tz.value);
      });

      setConvertedTimes(results);
      toast.success('Timestamp converted successfully');
    } catch (error) {
      toast.error('Invalid timestamp. Please check your input.');
    }
  };

  return (
    <div className="space-y-6 gradient-bg p-6 rounded-lg">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
          Timestamp Converter
        </h1>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Input
                value={timestamp}
                onChange={(e) => setTimestamp(e.target.value)}
                placeholder="Enter timestamp (ms, s, or ns)"
                className="font-mono"
              />
            </div>
            <div className="gradient-border">
              <Button
                variant="ghost"
                onClick={getCurrentTimestamp}
                className="group"
              >
                <Clock className="mr-2 h-4 w-4" />
                Current Time
              </Button>
            </div>
            <div className="gradient-border">
              <Button
                variant="ghost"
                onClick={() => handleConvert()}
                className="group"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Convert
              </Button>
            </div>
          </div>

          <div className="flex space-x-4">
            <Select
              value={selectedFormat}
              onValueChange={setSelectedFormat}
            >
              <SelectTrigger className="w-[240px]">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                {formatTypes.map((format) => (
                  <SelectItem key={format.value} value={format.value}>
                    {format.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 mt-6">
            {timeZones.map((tz) => (
              <Card key={tz.value} className="p-4 card-hover">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{tz.label}</h3>
                    <p className="font-mono text-lg">
                      {convertedTimes[tz.value] || '-'}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(convertedTimes[tz.value] || '')}
                    className="group"
                  >
                    <Copy className="h-4 w-4 transition-opacity group-hover:opacity-70" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Card>

      <div className="text-center text-sm text-muted-foreground">
        <p>Supports milliseconds (13 digits), seconds (10 digits), and nanoseconds (19 digits) timestamps</p>
      </div>
    </div>
  );
}