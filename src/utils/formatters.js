export const formatPrice = (price) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export const formatSquareFeet = (sqft) => {
  return new Intl.NumberFormat("en-US").format(sqft);
};

export const formatDate = (date) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
};

export const truncateText = (text, maxLength = 150) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
};

export const getPropertyTypeLabel = (type) => {
  const labels = {
    house: "House",
    condo: "Condo",
    townhouse: "Townhouse",
    apartment: "Apartment",
    land: "Land",
    commercial: "Commercial",
  };
  return labels[type] || type;
};