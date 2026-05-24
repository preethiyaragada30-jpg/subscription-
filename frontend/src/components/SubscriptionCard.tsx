import React from "react";

const SubscriptionCard = ({ data }: any) => {
  return (
    <div className="card">
      <h3>{data.name}</h3>
      <p>Price: ₹{data.price}</p>

      <p>
        Churn Risk:{" "}
        <span style={{ color: data.churnScore > 60 ? "red" : "green" }}>
          {data.churnScore}%
        </span>
      </p>
    </div>
  );
};

export default SubscriptionCard;  