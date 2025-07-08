import React, { useState, useContext, useEffect } from "react";
import "../../styles/PlanPage/PlanCards.css";
import { LanguageContext } from "../../context/LanguageContext";
import translations from "../../translations";
import { loadStripe } from "@stripe/stripe-js";
import { useNavigate } from "react-router-dom";

const stripePromise = loadStripe("pk_test_51RJ8DPCLYZ6TCbKZznQQ2zYfQlxuhowuyorrHvaC5DpeU2KCGgVAHMRfgjFjVYMq8bdJGcGXS3tLpOlZM0kD3OnW00BPudO0wZ");

const Pricing = () => {
  const { language } = useContext(LanguageContext);
  const [selectedPlan, setSelectedPlan] = useState("Monthly");
  const [userEmail, setUserEmail] = useState(null);
  const [userPlanId, setUserPlanId] = useState(null);
  const [fetchedPlans, setFetchedPlans] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) return;

      try {
        const res = await fetch(`http://localhost:8000/user/get_User/${token}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });

        if (!res.ok) throw new Error("Failed to get user");

        const data = await res.json();
        setUserEmail(data.email);

        const userPlanRes = await fetch(`http://localhost:8000/subscription/get-plan/${token}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });

        if (!res.ok) throw new Error("Failed to get user plan");
        const userPlanData = await userPlanRes.json();
        setUserPlanId(userPlanData.id_Plan)

        console.log(userPlanData);

      } catch (err) {
        console.error("Failed to fetch user email:", err);
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    fetchUserData();
  }, [token, navigate]);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await fetch("http://localhost:8000/subscription/plans");
        const data = await res.json();
        setFetchedPlans(data);
      } catch (err) {
        console.error("Failed to fetch plans:", err);
      }
    };

    fetchPlans();
  }, []);

  const handleCheckout = async (planName) => {
    if (planName === "Free") {
      navigate("/dragAndDrop");
      return;
    }

    if (!token || !userEmail) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/payment/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: planName,
          email: userEmail,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Failed to create checkout session");

      const stripe = await stripePromise;
      await stripe.redirectToCheckout({ sessionId: data.id });
    } catch (err) {
      console.error("Checkout failed", err);
    }
  };

  const selectedPlans = translations[language].plan;

  return (
    <div className="pricing-cards-container">
      <div key={selectedPlan} className="pricing-container fade-effect">
        {selectedPlans.map((plan, index) => {
          const fetchedPlan = fetchedPlans[index];

          return (
            <div className="pricing-card" key={index}>
              {userPlanId == index + 1 &&
                <div className="plan-active-container">
                <p className="plan-active">{translations[language].planCurrentlyActive}</p>
                </div>
              }
              <p className="plan-name">{fetchedPlan?.plan_name}</p>
              {index + 1 == 3 || index + 1 == 4 ? (
                <div> 
                  {index + 1 == 3 ? (
                    <p className="plan-description">{translations[language].planStudent}</p>
                  ) : (
                    <p className="plan-description">{translations[language].planSemiAnnualDiscount}</p>
                  )}
                  <div className="plan-price-group">
                    <p className="plan-original-price">{fetchedPlan?.price.toFixed(2)} Eur</p>
                    <p className="plan-price">{(fetchedPlan?.price - fetchedPlan?.discount).toFixed(2)} Eur</p>
                  </div>
                </div>
              ) : (
                <p className="plan-price">
                  {fetchedPlan?.price.toFixed(2)} Eur
                </p>
              )}
              <hr className="plan-divider" />
              <ul className="plan-features">
                {plan.features.map((feature, i) => (
                  <li key={i}>
                    <img
                      src={require("../../images/check.png")}
                      alt="check"
                      className="plan-check-icon"
                    />
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="plan-footer">
                <button className="plan-button" onClick={() => handleCheckout(fetchedPlan?.plan_name)}>
                  {translations[language].planButton}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Pricing;
