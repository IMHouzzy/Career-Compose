import React, { useEffect, useState } from "react";
import "../../styles/Profile/AdModal.css";

const AdModal = ({ onCancel, onFinishAd, setAdsWatchedCount, adsWatchedCount }) => {
    const [canClose, setCanClose] = useState(false);
    const [adStep, setAdStep] = useState(1); // 1st or 2nd ad
    const [iframeKey, setIframeKey] = useState(0); // forces iframe reload
    const token = localStorage.getItem("token");

    useEffect(() => {
        const timer = setTimeout(() => {
            setCanClose(true);
        }, 1000); // 15 seconds

        return () => clearTimeout(timer);
    }, [adStep]);

    const handleFirstAdDone = () => {
        setAdsWatchedCount(prev => prev + 1);
        setAdStep(2); // move to next ad
        setCanClose(false);
        setIframeKey(prev => prev + 1); // force reload of video
    };

    const handleFinishAd = async () => {
        try {
            const res = await fetch(`http://localhost:8000/subscription/watched-ad/${token}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ watched_ads: 2 })
            });

            const data = await res.json();
            if (res.ok) {
                setAdsWatchedCount(prev => prev + 1);
                onFinishAd(data.new_credit_amount);
                onCancel(); // close modal
            } else {
                alert(data.detail || "Failed to add credit");
            }
        } catch (err) {
            console.error(err);
            alert("Server error while adding credit");
        }
    };

    return (
        <div className="ad-modal-overlay">
            <div className="ad-modal-content">
                <iframe
                    key={iframeKey} // this forces reload
                    width="100%"
                    height="315"
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                    title="Ad video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>

                <div >
                    {adStep === 1 ? (
                        <button onClick={handleFirstAdDone} disabled={!canClose} className="ad-buttons">
                            {canClose ? "Finish First Ad" : "Waiting..."}
                        </button>
                    ) : (
                        <button onClick={handleFinishAd} disabled={!canClose} className="ad-buttons">
                            {canClose ? "Finish Ad" : "Waiting..."}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdModal;
