export const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
export const formatDate = (date: string) => new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
export const generateId = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const isValidUuid = (id?: string): boolean => {
  if (!id || typeof id !== 'string') return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
};
export const getCurrentMonth = () => new Date().toISOString().substring(0, 7)
export const getTodayDate = () => new Date().toISOString().split('T')[0]
export const calculatePercentage = (value: number, total: number) => total === 0 ? 0 : Math.round((value / total) * 100)

export const getCardDigits = (id: string, customLast4?: string) => {
  if (customLast4 && customLast4.length === 4) return customLast4;
  if (id === '1') return '0000'; // Default cash account
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash).toString().substring(0, 4).padStart(4, '0');
};

export const getCardFullNumber = (id: string, last4: string) => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (id.charCodeAt(i) * 19 + i * 29) % 9000;
  }
  const prefix = (4000 + (hash % 1000)).toString().padStart(4, '4532');
  const mid1 = (1000 + ((hash * 3) % 9000)).toString().padStart(4, '8921');
  const mid2 = (1000 + ((hash * 7) % 9000)).toString().padStart(4, '4102');
  return `${prefix} ${mid1} ${mid2} ${last4}`;
};