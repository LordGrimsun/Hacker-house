/**
 * Indian Rupee (Rs. / ₹) and Indian Telephony / Masked Identity Formatters
 */

export const formatINR = (amount: number): string => {
  return `Rs. ${Math.round(amount).toLocaleString("en-IN")}`;
};

export const formatINRWithDecimals = (amount: number): string => {
  return `Rs. ${amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const formatINRShort = (amount: number): string => {
  if (amount >= 10000000) {
    return `Rs. ${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (amount >= 100000) {
    return `Rs. ${(amount / 100000).toFixed(2)} Lakh`;
  }
  return `Rs. ${Math.round(amount).toLocaleString("en-IN")}`;
};

export const maskCardNumber = (cardSuffix: string | number = "4821"): string => {
  const digits = String(cardSuffix).slice(-4).padStart(4, "0");
  return `•••• •••• •••• ${digits}`;
};

export const maskAccountNumber = (acc: string = "4920"): string => {
  const digits = acc.slice(-4).padStart(4, "0");
  return `A/C ••••••${digits}`;
};

export const maskIndianMobile = (phone: string = "+91 98201 45892"): string => {
  // Shows only first 2 and last 2 digits for easy validation
  return phone.replace(/(\+91\s?)(\d{2})\d{4}(\d{4})/, "$1$2•••• $3");
};

export const DEFAULT_INDIAN_PHONE = "+91 98201 45892";
