type Props = {
  label: string;
};

const Badge = ({ label }: Props) => {
  const color =
    label === "High"
      ? "bg-red-500"
      : label === "Medium"
      ? "bg-orange-400"
      : "bg-yellow-400";

  return (
    <span className={`${color} text-white px-2 py-1 rounded-full text-sm`}>
      {label}
    </span>
  );
};

export default Badge;