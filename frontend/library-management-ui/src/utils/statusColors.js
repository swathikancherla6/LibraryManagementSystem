/** Chip color mappings for borrow and fine statuses. */
export const borrowStatusColor = (status) => {
  if (status === 'RETURNED') return 'success';
  if (status === 'OVERDUE') return 'error';
  if (status === 'REQUESTED') return 'warning';
  if (status === 'REJECTED') return 'default';
  return 'primary';
};

export const fineStatusColor = (status) => {
  if (status === 'PAID') return 'success';
  if (status === 'WAIVED') return 'default';
  return 'error';
};
