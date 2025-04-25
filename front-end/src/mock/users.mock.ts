import { User } from '../models/user.model';

export const MOCK_USERS: User[] = [
  { id: '1', firstName: 'Alice', lastName: 'Dupont', age: 28, particularity: "Agnosie", role: "Encadrant" },
  { id: '2', firstName: 'Bob', lastName: 'Martin', age: 65, particularity: "Agnosie", role: "Accueilli" },
  { id: '3', firstName: 'Charlie', lastName: 'Durand', age: 60, particularity: "Agnosie", role: "Accueilli" }
];
