import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const Card = ({ children }: Props) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      {children}
    </div>
  );
};

export default Card;