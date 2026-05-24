import React, { useState } from "react";

const SubscriptionForm = ({ addSubscription }: any) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const handleAdd = () => {
    if (!name || !price) return;

    const churnScore = Math.floor(Math.random() * 100); // fake ML output

    addSubscription({
      name,
      price,
      churnScore,
    });

    setName("");
    setPrice("");
  };

  return (
    <div className="form-box">
      <input
        placeholder="Subscription Name (Netflix, Spotify...)"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <button onClick={handleAdd}>Add Subscription</button>
    </div>
  );
};

export default SubscriptionForm;