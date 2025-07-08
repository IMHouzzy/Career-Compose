import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import "../../styles/Profile/Billing.css";
import { LanguageContext } from "../../context/LanguageContext";
import translations from "../../translations";
const PaymentHistory = () => {
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { subscriptionData } = useOutletContext();
  const { language } = useContext(LanguageContext);
  const t = translations[language];
  useEffect(() => {
        if (subscriptionData?.subscription?.fk_Plan === 1) {
      navigate("/profile/user-data");
    }

    const fetchHistory = async () => {
      if (!token) return navigate("/login");

      try {
        const res = await fetch(`http://localhost:8000/user/payment-history/${token}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch");

        const data = await res.json();
        setHistory(data);

      } catch (err) {
        console.error(err);
      }
    };

    fetchHistory();
  }, [token, navigate]);

  return (
    <div className="payment-history">
      <div className="payment-history-header">
        <h2 className="payment-history-title">{t.PaymentHistory}</h2>
      </div>
      <table className="payment-history-table">
        <thead>
          <tr>
            <th>{t.planName}</th>
            <th>{t.Price}</th>
            <th>{t.Currency}</th>
            <th>{t.date}</th>
          </tr>
        </thead>
        <tbody>
          {history.map((payment, i) => (
            <tr key={i}>
              <td>{payment.plan_name}</td>
              <td>{payment.amount.toFixed(2)}</td>
              <td>{payment.currency.toUpperCase()}</td>
              <td>{new Date(payment.date).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentHistory;
