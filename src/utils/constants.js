export const CATEGORIES = [
  { name: 'Roads', color: '#E58A00' },
  { name: 'Water', color: '#1F7FD1' },
  { name: 'Electricity', color: '#7B4FD8' },
  { name: 'Waste', color: '#4E9F3D' },
  { name: 'Public lighting', color: '#E0529C' },
  { name: 'Safety', color: '#D8352A' },
  { name: 'Other', color: '#5B6B7F' },
];

export function categoryMeta(name) {
  return CATEGORIES.find((c) => c.name === name) || CATEGORIES[CATEGORIES.length - 1];
}

export const SEVERITIES = ['Low', 'Medium', 'High'];

export const STATUSES = ['Reported', 'Verified', 'Assigned', 'Being fixed', 'Resolved'];

export const STATUS_COLORS = {
  Reported: '#5B6B7F',
  Verified: '#1F7FD1',
  Assigned: '#7B4FD8',
  'Being fixed': '#E58A00',
  Resolved: '#0B6B4F',
};

export const STATUS_NOTES = {
  Reported: 'Someone has logged the problem.',
  Verified: 'Neighbours have confirmed it is real.',
  Assigned: 'The right team has picked it up.',
  'Being fixed': 'Work is under way.',
  Resolved: 'The repair is done and stays on record.',
};