import React, { useState, useEffect, useContext } from "react";
import { LanguageContext } from "../../context/LanguageContext";
import translations from "../../translations";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import Loader from "../../components/General/Loader";
import "../../styles/Profile/ProfileSidebarLayout.css";

const SidebarLayout = () => {
  const navigate = useNavigate();
  const { language } = useContext(LanguageContext);
  const t = translations[language];

  const [userData, setUserData] = useState(null);
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const verifyAndFetchUser = async () => {
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const UserResponse = await fetch(`http://localhost:8000/user/get_User/${token}`);
        if (!UserResponse.ok) throw new Error("Invalid token");
        const data = await UserResponse.json();
        setUserData(data);

        const fk_Subscription = data.fk_Subscription;
        console.log(fk_Subscription);
        const response = await fetch(`http://localhost:8000/subscription/full/${fk_Subscription}`);
        if (!response.ok) throw new Error("Invalid subscription");
        const data2 = await response.json();
        setSubscriptionData(data2);
        setIsLoading(false);
      } catch (error) {
        console.error("Authentication failed:", error);
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    verifyAndFetchUser();
  }, [navigate, token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (isLoading) return <Loader />;

  return (
    <div className="profile-container">
      <div className="profile-wrapper">
        <div className="profile-sidebar">
          <h2 className="profile-top-section">{t.navTitle}</h2>
          <nav className="profile-nav">
            <NavLink to="/profile/user-data" className="profile-title-section">{t.myData}</NavLink>
            <NavLink to="/profile/edit-profile" className="profile-title-section">{t.editProfile}</NavLink>
            { subscriptionData?.subscription?.fk_Plan !== 1 && <NavLink to="/profile/billing" className="profile-title-section">{t.payments}</NavLink> }

          </nav>
          <button className="logout-button" onClick={handleLogout}>
            {t.logout}
          </button>
        </div>
        <div className="profile-main-content">
          <div className="profile-content-wrapper">
            <Outlet context={{ userData, subscriptionData, paymentData }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarLayout;
