import { UserHistory } from '../models/user-history.model';

export const MOCK_USER_HISTORY: UserHistory[] = [
  {
    userId: '1',
    exerciceId: '1',
    date: '2025-04-25T10:30:00Z',
    exerciceName: 'Rangeons notre maison !',
    success: 6,
    failure: 1
  },
  {
    userId: '2',
    exerciceId: '1',
    date: '2025-04-28T14:15:00Z',
    exerciceName: 'Rangeons notre maison !',
    success: 5,
    failure: 2
  },
  {
    userId: '3',
    exerciceId: '1',
    date: '2025-04-27T16:45:00Z',
    exerciceName: 'Rangeons notre maison !',
    success: 3,
    failure: 4
  }
];
