import React, { useState, useEffect, useContext } from "react";
import { LanguageContext } from "../../context/LanguageContext";
import translations from "../../translations";
import "../../styles/Profile/CreditsAmountCard.css";
import { useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import AdModal from "./AdModal";
const CreditsCard = () => {
    const { userData, subscriptionData } = useOutletContext();
    const [credits, setCredits] = useState(0);
    const [maxCredits, setMaxCredits] = useState(0);
    const [isWatchingAd, setIsWatchingAd] = useState(false);
    const [canSkip, setCanSkip] = useState(false);
    const [adSession, setAdSession] = useState(false); // toggle whole ad session
    const [adsWatchedCount, setAdsWatchedCount] = useState(0);




    const { plan, subscription } = subscriptionData;
    const planName = plan?.plan_name || "Basic Plan";
    const adsLeft = subscription?.ads_amount_per_day;
    const maxAds = 4;

    const hasUnlimitedCredits = subscription?.user_credit_amount === null;

    const navigate = useNavigate();
    const { language } = useContext(LanguageContext);
    const t = translations[language];

    useEffect(() => {
        if (!subscriptionData || hasUnlimitedCredits) return;
        try {
            setCredits(subscription.user_credit_amount);
            setMaxCredits(plan.credit_amount);
            console.log(subscriptionData);
        } catch (error) {
            console.error("Failed to fetch combined subscription and plan data:", error);
        }
    }, [subscriptionData, hasUnlimitedCredits, plan]);
    const handleWatchAd = async () => {
        setAdSession(true); // This triggers the modal to show
        setIsWatchingAd(true); // Optionally set a state to track ad-watching status
    };

    const handleFinishAd = (newCredits) => {
        setCredits(newCredits); // Update credits with the new value from the backend
        setAdSession(false); // Close the modal
    };

    const getTimeUntilNextReset = (lastResetTimestamp) => {
        if (!lastResetTimestamp) return t.UnknownTimeUntilReset;

        const lastReset = new Date(lastResetTimestamp);
        const nextReset = new Date(lastReset.getTime() + 24 * 60 * 60 * 1000);
        const now = new Date();

        const diffMs = nextReset - now;
        if (diffMs <= 0) return t.restAvailableNow;

        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

        return `${hours}h ${minutes}m ${t.leftUntilAdReset}`;
    };



    const getBarColor = (value) => {
        if (value > 70) return "#4caf50";
        if (value > 30) return "#ffc107";
        return "#f44336";
    };

    return (
        <div className="credits-card">
            {adSession && (
                <AdModal
                    onCancel={() => {
                        setAdSession(false);
                        setIsWatchingAd(false);
                    }}
                    onFinishAd={handleFinishAd}
                    setAdsWatchedCount={setAdsWatchedCount} // pass setter
                    adsWatchedCount={adsWatchedCount}
                />

            )}
            {/* 1. SUBSCRIPTION TABLE */}
            {plan && subscription && (
                <>
                    <div className="credits-header">
                        <h2 className="credits-title">{t.subscriptionInfo}</h2>
                        <button className="get-plan-button" onClick={() => navigate("/Plan")}>
                            <svg className="plan-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="5" width="20" height="14" rx="2" />
                                <line x1="2" y1="10" x2="22" y2="10" />
                            </svg>
                            {t.getPlanButton}
                        </button>
                    </div>

                    <table className="subscription-table">
                        <thead>
                            <tr>
                                <th>{t.planName}</th>
                                <th>{t.creditAmount}</th>
                                <th>{t.dateFrom}</th>
                                <th>{t.dateTo}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{plan.plan_name}</td>
                                <td>{plan.credit_amount === null ? t.unlimitedCredits : plan.credit_amount}</td>
                                <td>{new Date(subscription.date_from).toLocaleDateString()}</td>
                                <td>{subscription.date_to ? new Date(subscription.date_to).toLocaleDateString() : "Active"}</td>
                            </tr>
                        </tbody>
                    </table>
                </>
            )}
            {plan.plan_name === "Free" && (
                <>
                    {/* 2. CREDITS SECTION */}
                    <div className="credits-header">
                        <h2 className="credits-title">{t.creditsTitle}</h2>
                    </div>

                    <div className="credits-amount">
                        <p className="credits-amount-text">
                            {credits === null || maxCredits === null
                                ? t.unlimitedCredits
                                : `${t.creditText1} ${credits} / ${maxCredits} ${t.creditText2}`
                            }
                        </p>
                    </div>

                    {credits !== null && maxCredits !== null && (
                        <div className="credits-progress-bar">
                            <div
                                className="credits-progress-fill"
                                style={{
                                    width: maxCredits > 0 ? `${(credits / maxCredits) * 100}%` : "0%",
                                    backgroundColor: getBarColor((credits / maxCredits) * 100),
                                }}
                            ></div>
                        </div>
                    )}

                    <div className="info-card">
                        <div className="info-icon">i</div>
                        <p className="info-text">
                            {language === "lt"
                                ? "Nemokamas planas suteikia ribotą kreditų kiekį, kuris atsinaujina kiekvieną mėnesį. Visi mokami planai suteikia neribotą naudojimą ir nereikalauja kreditų."
                                : "The free plan includes a limited number of credits that reset every month. All paid plans offer unlimited usage and don’t require credits to use our tools."
                            }
                        </p>
                    </div>

                    {/* 3. ADS SECTION (Free only) */}

                    <div className="credits-header">
                        <h2 className="credits-title">{t.adsTitle}</h2>
                    </div>

                    <div className="credits-amount">
                        <p className="credits-amount-text">
                            {t.adsLeftText1} {adsLeft- adsWatchedCount} / {maxAds} {t.adsLeftText2}
                        </p>
                    </div>


                    {maxAds > 0 && (
                        <div className="credits-progress-bar">
                            <div
                                className="credits-progress-fill"
                                style={{
                                    width: `${(((adsLeft - adsWatchedCount)/ maxAds) * 100)}%`,
                                    backgroundColor: getBarColor(((adsLeft - adsWatchedCount) / maxAds) * 100),
                                }}
                            ></div>
                        </div>
                    )}


                    <div className="info-card">
                        <div className="info-icon">i</div>
                        <p className="info-text">
                            {language === "lt"
                                ? "Šiuo metu naudoji nemokamą planą, kuris suteikia ribotą mėnesinį kreditų kiekį. Mūsų platformoje gali žiūrėti reklamas, kad gautum papildomų kreditų — peržiūrėjus 2 reklamas galite gauti 1 kreditą. Reklamų kiekis yra atnaujinamas kasdien!"
                                : "You're currently on the free plan, which includes a limited number of monthly credits. On our platform, you can watch ads to earn extra credits — for every 2 ads you watch, you receive 1 credit. Ad availability resets daily!"
                            }
                        </p>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "20px" }}>
                        <button
                            className="get-plan-button"
                            onClick={handleWatchAd}
                            disabled={adsLeft <= 0 || subscription.user_credit_amount >= 2}
                        >
                            {t.watchAdButton}
                        </button>
                        <p style={{ marginLeft: "20px", whiteSpace: "nowrap" }}>
                            {getTimeUntilNextReset(subscription?.last_ads_reset)}
                        </p>
                    </div>



                </>
            )}
        </div>
    );
};

export default CreditsCard;
