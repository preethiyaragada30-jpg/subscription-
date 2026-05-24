type Props = {
  text: string;
};

const Button = ({ text }: Props) => {
  return (
    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
      {text}
    </button>
  );
};

export default Button;