import React, { useState, useEffect, useContext } from "react";
import { LanguageContext } from "../context/LanguageContext";
import { useError } from "../ErrorContext";
import translations from "../translations";
import { useNavigate } from "react-router-dom";
import "../styles/DragAndDrop/DragAndDrop.css";
import axios from "axios";
import LoadingScreen from "../components/DragAndDropPage/LoadingScreen";
import DotLoader from "../components/General/Loader";
import JobSelection from "../components/DragAndDropPage/JobSelection";
import FileUpload from "../components/DragAndDropPage/FileUpload";
import ToggleButtons from "../components/DragAndDropPage/ToggleButtons";

const DragAndDrop = () => {
  const { language } = useContext(LanguageContext);
  const t = translations[language];
  const navigate = useNavigate();
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [file, setFile] = useState(null);
  const [activeButton, setActiveButton] = useState("general");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidLoading, setIsValidLoading] = useState(true);

  const [showResults, setShowResults] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [showComponents, setShowComponents] = useState(false);
  const [fileUrl, setFileUrl] = useState(null);
  const token = localStorage.getItem("token");

  const [hasCredits, setHasCredits] = useState(true);
  const [plan_fk, setPlan_fk] = useState(null);
  const [cvTips, setCvTips] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [skills, setSkills] = useState([]);
  const [top5Jobs, setTop5Jobs] = useState([]);
  const [careerPaths, setCareerPaths] = useState([]); // Added to store career paths

  const { showError } = useError();

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(`http://localhost:8000/user/verify-token/${token}`, {
          headers: { "Accept-Charset": "utf-8" },
        });
        if (!response.ok) throw new Error("Invalid token");

        setIsValidLoading(false);
        setTimeout(() => setShowComponents(true), 100);
        checkCredits();
      } catch (error) {
        console.error("Authentication failed:", error);
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    const checkCredits = async () => {
      try {
        const res = await fetch(`http://localhost:8000/subscription/has-credits/${token}`, {
          headers: { "Accept-Charset": "utf-8" },
        });
        const data = await res.json();
        setPlan_fk(data.plan_id);

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

    verifyToken();
  }, [navigate, t, token, showError]);

  const handleJobSelection = (job) => {
    setSelectedJobs((prev) =>
      prev.includes(job) ? prev.filter((j) => j !== job) : [...prev, job]
    );
  };

  const handleSubmit = async () => {
    if (!file) {
      alert(t.NoFileSelected);
      return;
    }
    const selectedJobsString = selectedJobs.join(", ");
    const formData = new FormData();
    const lang = localStorage.getItem("lang") || "en";

    formData.append("file", file);
    formData.append("token", token);
    formData.append("selected_jobs", selectedJobsString);
    setIsLoading(true);

    try {
      // Analyze CV
      await axios.post(`http://127.0.0.1:8000/cv/analyze-cv/${lang}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Accept-Charset": "utf-8",
        },
      });

      // Fetch CV analysis
      const analysisRes = await fetch(`http://localhost:8000/cv/analysis/${token}`, {
        headers: { "Accept-Charset": "utf-8" },
      });
      if (!analysisRes.ok) {
        throw new Error("Failed to fetch CV analysis");
      }
      const analysisData = await analysisRes.json();

      // Process CV analysis data
      const tipsArray = Array.isArray(analysisData.cv_tips) ? analysisData.cv_tips : [];
      const careerPathsArray = Array.isArray(analysisData.career_paths) ? analysisData.career_paths : []; // Added career paths
      const skillsArray = Array.isArray(analysisData.skills) ? analysisData.skills : [];
      const top5JobsArray = Array.isArray(analysisData.job_recommendations) ? analysisData.job_recommendations : [];

      // Update local state
      setCvTips(tipsArray);
      setCareerPaths(careerPathsArray); // Update career paths state
      setSkills(skillsArray);
      setTop5Jobs(top5JobsArray);

      // Fetch recommended jobs
      const jobsRes = await fetch(`http://localhost:8000/jobs/match_jobs_from_token/${token}`, {
        method: "POST",
        headers: { "Accept-Charset": "utf-8" },
      });
      if (!jobsRes.ok) {
        throw new Error("Failed to fetch recommended jobs");
      }
      const jobsData = await jobsRes.json();
      console.log("fetch1")
      console.log(jobsData)
      const jobsArray = jobsData.matches || [];

      // Update recommended jobs state
      setRecommendedJobs(jobsArray);

      // Fetch recommended jobs
      const coursesRes = await fetch(`http://localhost:8000/courses/recommended_courses/${token}`, {
        method: "GET",
        headers: { "Accept-Charset": "utf-8" },
      });
      if (!coursesRes.ok) {
        throw new Error("Failed to fetch courses");
      }
      const coursesData = await coursesRes.json();
      console.log("fetch2")
      console.log(coursesData)
      


      // Update recommended jobs state
      setRecommendedCourses(coursesData);

      // Deduct one credit
      const deductRes = await fetch(`http://localhost:8000/subscription/deduct-one-credit/${token}`, {
        method: "POST",
        headers: { "Accept-Charset": "utf-8" },
      });
      if (!deductRes.ok) {
        const err = await deductRes.json();
        throw new Error(err.detail || "Credit deduction failed");
      }

      // Navigate to results page with all data
      navigate("/results/CVRecommendationsPage", {
        state: {
          fileUrl: URL.createObjectURL(file),
          cvTips: tipsArray,
          careerPaths: careerPathsArray, // Pass career paths
          skills: skillsArray,
          recommendedJobs: jobsArray,
          recommendedCourses: coursesData,
          top5Jobs: top5JobsArray,
        },
      });
    } catch (error) {
      console.error("Error during CV analysis or job fetching:", error);
      showError(t.AnalysisError || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (selectedFile) => {
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result;
        setFile(selectedFile);
        setFileUrl(base64data);
        localStorage.setItem("fileUrl", base64data);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setFileUrl(null);
    localStorage.removeItem("fileUrl");
  };

  if (isValidLoading) {
    return <DotLoader />;
  }

  return (
    <div className="drag-and-drop-container">
      {isLoading && <div className="fade-in"><LoadingScreen /></div>}

      {!isLoading && !showResults && showComponents && (
        <>


          <div className="fade-in">
            <FileUpload file={file} setFile={handleFileChange} removeFile={handleRemoveFile} />
          </div>

          <button
            className="submit-button fade-in"
            onClick={handleSubmit}
            disabled={!file || !hasCredits}
          >
            {t.Submit}
          </button>
          <div className="fade-in">
            {plan_fk === 1 && (
              <div className="comment-card">
                <div className="comment-icon">i</div>
                <p className="comment-text">
                  {language === "lt" ? (
                    <>
                      Norite daugiau kreditų? Žiūrėkite reklamas ir gaukite 2 papildomus kreditus kiekvieną dieną - <a href="/profile/user-data"> spauskite čia</a>
                    </>
                  ) : (<>
                    Want more credits? Watch ads and earn 2 extra credits per day -
                    <a href='/profile/user-data'> click here</a></>
                  )
                  }
                </p>
              </div>
            )}
          </div>

        </>
      )}
    </div>
  );
};

export default DragAndDrop;