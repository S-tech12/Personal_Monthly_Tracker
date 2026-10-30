export const formatMemberSince = (dateString?: string): string => {
  if (!dateString) return 'Member since unknown';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Member since unknown';

  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();

  return `Member since ${day} ${month} ${year}`;
};
