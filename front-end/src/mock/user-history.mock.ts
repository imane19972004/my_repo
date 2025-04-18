import { UserHistory } from '../models/user-history.model';

export const MOCK_USER_HISTORY: { [userId: string]: UserHistory[] } = {
  '1': [
    {
      category: {
        name: 'Math',
        description: 'Mathématiques',
        imagePath: '/assets/math.jpg'
      },
      items: [
        { name: 'Addition', description: 'Addition simple', imagePath: '', category: 'Math' }
      ],
      success: 5,
      failure: 2
    }
  ],
  '2': [
    {
      category: {
        name: 'Science',
        description: 'Sciences',
        imagePath: '/assets/science.jpg'
      },
      items: [
        { name: 'Chimie', description: 'Les bases', imagePath: '', category: 'Science' }
      ],
      success: 3,
      failure: 1
    }
  ]
};
