import parser from 'cron-parser';

export interface CronExplanation {
  minutes: string;
  hours: string;
  dayOfMonth: string;
  month: string;
  dayOfWeek: string;
  seconds?: string;
}

export function parseCronExpression(expression: string): CronExplanation {
  try {
    const parts = expression.trim().split(' ');
    const isSecondsFormat = parts.length === 6;
    
    let interval;
    try {
      interval = parser.parseExpression(expression);
    } catch (error) {
      throw new Error('Invalid cron expression');
    }

    const explanation: CronExplanation = {
      minutes: explainCronPart(isSecondsFormat ? parts[1] : parts[0], 'minute'),
      hours: explainCronPart(isSecondsFormat ? parts[2] : parts[1], 'hour'),
      dayOfMonth: explainCronPart(isSecondsFormat ? parts[3] : parts[2], 'day'),
      month: explainCronPart(isSecondsFormat ? parts[4] : parts[3], 'month'),
      dayOfWeek: explainCronPart(isSecondsFormat ? parts[5] : parts[4], 'weekday'),
    };

    if (isSecondsFormat) {
      explanation.seconds = explainCronPart(parts[0], 'second');
    }

    return explanation;
  } catch (error) {
    throw new Error('Invalid cron expression');
  }
}

function explainCronPart(part: string, type: string): string {
  if (part === '*') return `Every ${type}`;
  if (part === '*/1') return `Every ${type}`;
  if (part.startsWith('*/')) return `Every ${part.substring(2)} ${type}s`;
  if (part.includes('-')) {
    const [start, end] = part.split('-');
    return `From ${formatValue(start, type)} to ${formatValue(end, type)}`;
  }
  if (part.includes(',')) {
    const values = part.split(',');
    return `At ${values.map(v => formatValue(v, type)).join(', ')}`;
  }
  return `At ${formatValue(part, type)}`;
}

function formatValue(value: string, type: string): string {
  const num = parseInt(value);
  if (type === 'month') {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                   'July', 'August', 'September', 'October', 'November', 'December'];
    return months[num - 1] || value;
  }
  if (type === 'weekday') {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[num] || value;
  }
  return value;
}

export function validateCronExpression(expression: string): boolean {
  try {
    parser.parseExpression(expression);
    return true;
  } catch (error) {
    return false;
  }
}

export function generateNextExecutions(expression: string, count: number = 5): Date[] {
  try {
    const interval = parser.parseExpression(expression);
    const executions: Date[] = [];
    
    for (let i = 0; i < count; i++) {
      executions.push(interval.next().toDate());
    }
    
    return executions;
  } catch (error) {
    throw new Error('Invalid cron expression');
  }
}