export const CATEGORIES = [
  { id: 'groceries', label: 'Groceries', icon: 'ShoppingCart', color: '#10B981', bg: 'rgba(16, 185, 129, 0.15)' },
  { id: 'dining', label: 'Dining & Dates', icon: 'Utensils', color: '#EC4899', bg: 'rgba(236, 72, 153, 0.15)' },
  { id: 'rent_utilities', label: 'Rent & Utilities', icon: 'Home', color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.15)' },
  { id: 'travel', label: 'Travel & Vacations', icon: 'Plane', color: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.15)' },
  { id: 'household', label: 'Household', icon: 'Package', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.15)' },
  { id: 'entertainment', label: 'Entertainment', icon: 'Tv', color: '#06B6D4', bg: 'rgba(6, 182, 212, 0.15)' },
  { id: 'health', label: 'Health & Pharmacy', icon: 'HeartPulse', color: '#EF4444', bg: 'rgba(239, 68, 68, 0.15)' },
  { id: 'miscellaneous', label: 'Other / Misc', icon: 'MoreHorizontal', color: '#6B7280', bg: 'rgba(107, 114, 128, 0.15)' }
];

export const INITIAL_SETTINGS = {
  partner1: {
    id: 'p1',
    name: 'Dimitris',
    avatar: 'D',
    incomeRatio: 50
  },
  partner2: {
    id: 'p2',
    name: 'Tonia',
    avatar: 'T',
    incomeRatio: 50
  },
  currency: '$',
  monthlyBudget: 2500,
  theme: 'dark'
};

export const INITIAL_EXPENSES = [
  {
    id: 'exp-1',
    title: 'Weekly Trader Joe\'s Grocery Haul',
    amount: 145.80,
    date: '2026-08-28',
    category: 'groceries',
    paidBy: 'p1', // Dimitris paid
    splitType: 'equal', // 50/50
    notes: 'Bought fresh produce, milk, salmon, and snacks for the week',
    receiptAttached: true
  },
  {
    id: 'exp-2',
    title: 'Romantic Anniversary Dinner @ Bistro 9',
    amount: 185.00,
    date: '2026-08-26',
    category: 'dining',
    paidBy: 'p2', // Tonia paid
    splitType: 'equal',
    notes: 'Steak, wine, and chocolate lava cake!',
    receiptAttached: false
  },
  {
    id: 'exp-3',
    title: 'Monthly High-Speed Fiber Internet',
    amount: 79.99,
    date: '2026-08-20',
    category: 'rent_utilities',
    paidBy: 'p1',
    splitType: 'equal',
    notes: 'August Internet bill',
    receiptAttached: false
  },
  {
    id: 'exp-4',
    title: 'Weekend Cabin Trip Deposit',
    amount: 320.00,
    date: '2026-08-15',
    category: 'travel',
    paidBy: 'p2',
    splitType: 'equal',
    notes: 'Mountain cabin Airbnb deposit for upcoming getaway',
    receiptAttached: true
  },
  {
    id: 'exp-5',
    title: 'Target Household Supplies & Plants',
    amount: 64.50,
    date: '2026-08-12',
    category: 'household',
    paidBy: 'p1',
    splitType: 'equal',
    notes: 'Paper towels, laundry detergent, and a cute pothos plant',
    receiptAttached: false
  }
];

export const INITIAL_SETTLEMENTS = [
  {
    id: 'settle-1',
    date: '2026-08-01',
    payerId: 'p1',
    receiverId: 'p2',
    amount: 120.00,
    method: 'Venmo',
    note: 'July monthly settlement balance'
  }
];
