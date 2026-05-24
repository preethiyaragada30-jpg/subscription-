export const formatCurrency = (value: number): string => {
  return `$${value.toLocaleString()}`;
};

export const getRiskColor = (risk: string): string => {
  switch (risk.toLowerCase()) {
    case "high":
      return "bg-red-500";
    case "medium":
      return "bg-orange-400";
    default:
      return "bg-yellow-400";
  }
};