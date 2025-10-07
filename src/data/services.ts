import { Service } from '../types/booking';

export const services: Service[] = [
  {
    id: '1',
    name: 'Haircut & Styling',
    description: 'Professional haircut with styling and finishing',
    duration: 60,
    price: 45,
    category: 'Hair',
  },
  {
    id: '2',
    name: 'Beard Trim',
    description: 'Precise beard trimming and shaping',
    duration: 30,
    price: 25,
    category: 'Beard',
  },
  {
    id: '3',
    name: 'Hair Wash & Style',
    description: 'Complete hair wash with professional styling',
    duration: 45,
    price: 35,
    category: 'Hair',
  },
  {
    id: '4',
    name: 'Full Grooming Package',
    description: 'Complete grooming including haircut, beard trim, and styling',
    duration: 90,
    price: 75,
    category: 'Package',
  },
  {
    id: '5',
    name: 'Eyebrow Shaping',
    description: 'Professional eyebrow trimming and shaping',
    duration: 20,
    price: 15,
    category: 'Eyebrows',
  },
  {
    id: '6',
    name: 'Hair Coloring',
    description: 'Professional hair coloring service',
    duration: 120,
    price: 120,
    category: 'Hair',
  },
];
