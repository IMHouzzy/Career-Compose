import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { LanguageContext } from "../../context/LanguageContext";
import { useError } from "../../ErrorContext";
import translations from "../../translations";
import '../../styles/JobsPage/JobListing.css';
import Loader from "../General/Loader";
import axios from "axios";
import CVRecommendations from "../../components/ResultPage/CV-recommendations";
import FileUpload from "./UploadCV";

const JobListing = () => {
  const { id_Jobs } = useParams();
  const [job, setJob] = useState(null);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const { language } = useContext(LanguageContext);
  const t = translations[language];
  const { showError } = useError();
  const [isLoading, setIsLoading] = useState(false);
  const [cvModalOpen, setCvModalOpen] = useState(false);
  const [uploadNewCv, setUploadNewCv] = useState(false);
  const [fileToUpload, setFileToUpload] = useState(null);
  const [hasCredits, setHasCredits] = useState(true);
  const [cvExists, setCvExists] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoggedIn(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:8000/user/verify-token/${token}`, {
          headers: { "Accept-Charset": "utf-8" },
        });

        if (!response.ok) throw new Error("Invalid token");
        setLoggedIn(true);
      } catch (error) {
        console.error("Authentication failed:", error);
        localStorage.removeItem("token");
        setLoggedIn(false);
      }
    };

    verifyToken();
  }, []);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await fetch(`http://localhost:8000/jobs/get_job/${id_Jobs}`);
        const data = await response.json();
        setJob(data);
      } catch (error) {
        console.error("Failed to fetch job:", error);
      }
    };
    fetchJob();
  }, [id_Jobs]);

  useEffect(() => {
    document.body.style.overflow = showRecommendations ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [showRecommendations]);
  useEffect(() => {
    if (cvModalOpen) {
      checkCredits();
      checkExistingCV(); // ✅ sets cvExists internally
      console.log("cvExists:", cvExists);
    }
  }, [cvModalOpen]);


  const checkExistingCV = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:8000/cv/check-cv/${token}`);
      const data = await res.json();
      setCvExists(data.exists); // <-- this is key
    } catch (err) {
      console.error("Error checking CV existence:", err);
      setCvExists(false);
    }
  };

  const checkCredits = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:8000/subscription/has-credits/${token}`, {
        headers: { "Accept-Charset": "utf-8" },
      });
      const data = await res.json();
      if (!data.has_credits) {
        setHasCredits(false);
        setTimeout(() => {
          showError(t.noCreditsError);
        }, 500);
      } else {
        setHasCredits(true);
      }
    } catch (err) {
      console.error("Error checking credits:", err);
      setHasCredits(false);
    }
  };

  const startRecommendation = async () => {
    setIsLoading(true);
    setShowRecommendations(true);
    setCvModalOpen(false);


    const token = localStorage.getItem("token");
    const lang = localStorage.getItem("lang") || "en";
    const formData = new FormData();
    formData.append("token", token);
    formData.append("jobDescription", job.description);

    if (uploadNewCv) {
      if (!fileToUpload) {
        showError("Please upload a file.");
        setIsLoading(false);
        return;
      }
      formData.append("file", fileToUpload);
    }

    try {
      await axios.post(
        `http://localhost:8000/cv/cv-recommendation/${lang}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" }
        }
      );

      const analysisRes = await fetch(`http://localhost:8000/cv/get-cv-recommendation/${token}`);
      if (!analysisRes.ok) throw new Error("Failed to get CV analysis");
      const data = await analysisRes.json();
      setAnalysisData(data);
      // Deduct one credit
      const deductRes = await fetch(`http://localhost:8000/subscription/deduct-one-credit/${token}`, {
        method: "POST",
        headers: { "Accept-Charset": "utf-8" },
      });
      if (!deductRes.ok) {
        const err = await deductRes.json();
        throw new Error(err.detail || "Credit deduction failed");
      }
    } catch (err) {
      showError(t.errorRecommendation);
      setShowRecommendations(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (!job) return <Loader />;
  const { title, image, company, city, salary, link, description } = job;

  return (
    <div className="listing-wrapper">
      <div className="listing-banner-bg"></div>
      <div className="listing-container">
        <div className="listing-header">
          <div className="listing-text">
            <h1 className="listing-title">{title}</h1>
            <div className="listing-subinfo">
              <span className="listing-company">{company}</span>
              <span className="listing-city">{city}</span>
            </div>
            {salary !== "Not Provided Not Provided" && (
              <div className="listing-salary">{salary}</div>
            )}

          </div>
          <img src={image} alt={title} className="listing-image" />
        </div>

        <hr className="listing-divider" />

        <div className="listing-description">
          {description.split('\n').map((line, i) => {
            if (line.endsWith(';')) {
              return <li key={i} className="listing-bullet">{line.replace(';', '').trim()}</li>;
            } else if (line.includes('**')) {
              return <p key={i} className="listing-bold">{line.replace(/\*\*/g, '').trim()}</p>;
            } else if (line.trim().length === 0) {
              return <br key={i} />;
            } else {
              return <p key={i}>{line}</p>;
            }
          })}
        </div>

        <div className='listing-button-header'>
          <div className="listing-button-box">
            <a href={link} className="listing-cta" target="_blank" rel="noopener noreferrer">
              {t.sendResume}
            </a>
          </div>
          {loggedIn && (
            <div className="listing-button-box">
              <button className="listing-cta" onClick={() => setCvModalOpen(true)}>
                {t.improveResume}
              </button>
            </div>
          )}

        </div>
      </div>

      {/* CV OPTION MODAL */}
      {cvModalOpen && (
        <div className="cv-overlay">
          <div className="cv-overlay-content">


            {uploadNewCv && (

              <div style={{ marginTop: "1rem" }}>
                <h2 className='job-container-title'>{t.uploadNewCv}</h2>
                <FileUpload file={fileToUpload} setFile={setFileToUpload} />
              </div>
            )}

            {!uploadNewCv && (
              <>
                <h2 className='job-container-title'>{t.chooseOption}</h2>
                <div className="fade-in">
                  <div className='choice-button-wrapper'>
                    <div className="choice-card">
                      <h3>{t.useExistingCv}</h3>
                      <p>{t.useExistingCvDesc}</p>
                      <button
                        className="listing-cta"
                        onClick={() => { startRecommendation(); }}
                        disabled={!hasCredits || !cvExists}
                      >
                        {t.useExistingCv2}
                      </button>
                    </div>

                    <div className="or-divider">{t.or}</div>

                    <div className="choice-card">
                      <h3>{t.uploadNewCv}</h3>
                      <p>{t.uploadNewCvDesc}</p>
                      <button
                        className="listing-cta"
                        onClick={() => setUploadNewCv(true)}
                        disabled={!hasCredits}
                      >
                        {t.uploadNewCv}
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}


            <div className="dnd-buttons">
              {uploadNewCv && (
                <button className="listing-cta" onClick={startRecommendation}>
                  {t.Submit}
                </button>
              )}
              <button
                className="listing-cta cancel"
                onClick={() => {
                  setCvModalOpen(false);
                  setUploadNewCv(false);
                  setFileToUpload(null);
                  setShowRecommendations(false);
                }}
              >
                {t.Cancel}
              </button>
            </div>

          </div>
        </div>

      )}

      {/* RECOMMENDATION OVERLAY */}
      {showRecommendations && (
        <div className="cv-overlay">
          <div className="cv-overlay-content">
            {!isLoading && (
              <button className="close-overlay-btn" onClick={() => {
                setCvModalOpen(false);
                setUploadNewCv(false);
                setFileToUpload(null);
                setShowRecommendations(false);
              }} aria-label="Close">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
            {isLoading ? <Loader /> : <CVRecommendations analysisData={analysisData} />}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobListing;