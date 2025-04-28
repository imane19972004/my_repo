import { UserHistory } from '../models/user-history.model'

// Liste des historiques d'utilisateurs mockés
export const MOCK_USER_HISTORY: UserHistory[] = [
  {
    userId: '1',
    category: {
      name: 'Logic Puzzles',
      description: 'Solve different types of logic puzzles.',
      imagePath: '/assets/images/logic-puzzles.jpg'
    },
    items: [
      {
        name: 'Sudoku',
        description: 'Complete the grid with numbers 1-9 without repetition.',
        imagePath: '/assets/images/sudoku.jpg',
        category: 'Logic Puzzles'
      },
      {
        name: 'Crossword',
        description: 'Fill the words according to clues.',
        imagePath: '/assets/images/crossword.jpg',
        category: 'Logic Puzzles'
      }
    ],
    success: 10,
    failure: 3
  },
  {
    userId: '2',
    category: {
      name: 'Math Challenges',
      description: 'Advanced mathematical problems.',
      imagePath: '/assets/images/math-challenges.jpg'
    },
    items: [
      {
        name: 'Algebra Problem',
        description: 'Solve x in complex equations.',
        imagePath: '/assets/images/algebra.jpg',
        category: 'Math Challenges'
      },
      {
        name: 'Geometry Puzzle',
        description: 'Find missing angles or side lengths.',
        imagePath: '/assets/images/geometry.jpg',
        category: 'Math Challenges'
      }
    ],
    success: 15,
    failure: 2
  },
  {
    userId: '3',
    category: {
      name: 'Board Games',
      description: 'Master strategies for board games.',
      imagePath: '/assets/images/board-games.jpg'
    },
    items: [
      {
        name: 'Chess Puzzle',
        description: 'Find the best move for checkmate.',
        imagePath: '/assets/images/chess.jpg',
        category: 'Board Games'
      }
    ],
    success: 8,
    failure: 5
  }
];
