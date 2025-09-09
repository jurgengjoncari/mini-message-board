
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'groupByDate',
  standalone: true,
  pure: false // Make it impure to handle updates to the array
})
export class GroupByDatePipe implements PipeTransform {
  transform(messages: any[]): { key: string; value: any[] }[] {
    if (!messages?.length) return [];

    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
    const dateFormatter = new Intl.DateTimeFormat('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });

    const groups = messages.reduce((acc, message) => {
      const date = new Date(message.createdAt);
      date.setHours(0, 0, 0, 0);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const diffDays = Math.floor((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      let dateStr: string;
      if (diffDays === 0) {
        dateStr = 'Today';
      } else if (diffDays === -1) {
        dateStr = 'Yesterday';
      } else if (diffDays === 1) {
        dateStr = 'Tomorrow';
      } else if (diffDays > -7 && diffDays < 7) {
        dateStr = rtf.format(diffDays, 'day');
      } else {
        dateStr = dateFormatter.format(date);
      }

      if (!acc.has(dateStr)) {
        acc.set(dateStr, []);
      }
      acc.get(dateStr)?.push(message);
      return acc;
    }, new Map<string, any[]>());

    // @ts-ignore
    return Array.from(groups.entries()).map(([key, value]) => ({ key, value }));
  }
}
