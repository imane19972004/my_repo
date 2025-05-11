import { User } from '../models/user.model';

// Liste des utilisateurs mockés
export const MOCK_USERS: User[] = [
  {
    id: '1',
    firstName: 'Alice',
    lastName: 'Johnson',
    age: 25,
    particularity: 'Aucune',
    role: 'Encadrant(e)'
  },
  {
    id: '2',
    firstName: 'Bob',
    lastName: 'Smith',
    age: 60,
    particularity: 'Agnosie',
    role: 'Accueilli(e)'
  },
  {
    id: '3',
    firstName: 'Charlie',
    lastName: 'Brown',
    age: 72,
    particularity: 'Oubli de vêtements adéquats aux saisons',
    role: 'Accueilli(e)'
  }
];
