import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'groupByDate',
  standalone: true,
  pure: false
})
export class GroupByDatePipe implements PipeTransform {
  transform(messages: any[]): { key: string; value: any[] }[] {
    if (!messages?.length) return [];

    const dateFormatter = new Intl.DateTimeFormat('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });

    const currentYearFormatter = new Intl.DateTimeFormat('en-US', {
      day: '2-digit',
      month: 'short'
    });

    const weekdayFormatter = new Intl.DateTimeFormat('en-US', {
      weekday: 'long'
    });

    const weekdayShortFormatter = new Intl.DateTimeFormat('en-US', {
      weekday: 'short'
    });

    const groups = messages.reduce((acc, message) => {
      const date = new Date(message.createdAt);
      date.setHours(0, 0, 0, 0);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const diffDays = Math.floor((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      const isThisYear = date.getFullYear() === today.getFullYear();
      const isThisWeek = diffDays > -7 && diffDays <= 0;

      let dateStr: string;
      if (diffDays === 0) {
        dateStr = 'Today';
      } else if (diffDays === -1) {
        dateStr = 'Yesterday';
      } else if (isThisWeek) {
        dateStr = weekdayFormatter.format(date); // Full weekday name
      } else if (isThisYear) {
        // Current year date with abbreviated weekday
        dateStr = `${weekdayShortFormatter.format(date)}, ${currentYearFormatter.format(date)}`;
      } else {
        dateStr = dateFormatter.format(date); // Full date with year
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
