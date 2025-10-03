
import { nanoid } from 'nanoid';

export const calendarPages = [
  {
    id: 'cover',
    title: 'Cover',
    layout: {
      type: 'cover',
      image: null,
      text: 'Calendar 2025',
    },
    elements: [],
  },
  ...Array.from({ length: 12 }, (_, i) => ({
    id: nanoid(),
    title: new Date(0, i).toLocaleString('default', { month: 'long' }),
    layout: {
      type: 'month',
      rows: 2,
      cols: 2,
      grid: Array.from({ length: 4 }, () => ({ id: nanoid(), image: null })),
    },
    elements: [],
    selectedDates: [],
  })),
];
