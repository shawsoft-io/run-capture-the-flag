export const formatDate = (dateString: string): string => {
    // Parse the date string in `dd/mm/yyyy` format
    const [day, month, year] = dateString.split('/').map(Number);
    const date = new Date(year, month - 1, day); // Month is 0-based in JavaScript
  
    // Validate the parsed date
    if (isNaN(date.getTime())) {
      console.warn(`Invalid date: ${dateString}`);
      return 'Invalid date';
    }
  
    const formatter = new Intl.DateTimeFormat('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  
    const parts = formatter.formatToParts(date);
  
    const weekday = parts.find(part => part.type === 'weekday')?.value || '';
    const dayWithSuffix = `${day}${getDaySuffix(day)}`;
    const monthName = parts.find(part => part.type === 'month')?.value || '';
  
    return `${weekday}, ${dayWithSuffix} ${monthName}`;
  };
  
  const getDaySuffix = (day: number): string => {
    if (day >= 11 && day <= 13) return 'th'; // Handle 11th, 12th, 13th
    switch (day % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  };