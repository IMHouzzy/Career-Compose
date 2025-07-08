import React, { useState, useEffect, useContext } from "react";
import { LanguageContext } from "../../context/LanguageContext";
import translations from "../../translations";
import Loader from "../../components/General/Loader";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import "../../styles/ResultsPage/ResultsPageLayout.css";

// SVG Icons (unchanged)
const CVRecommendationsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-user-pen-icon sidebar-icons"
  >
    <path d="M11.5 15H7a4 4 0 0 0-4 4v2" />
    <path d="M21.378 16.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z" />
    <circle cx="10" cy="7" r="4" />
  </svg>
);

const CaseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-briefcase-icon sidebar-icons"
  >
    <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    <rect width="20" height="14" x="2" y="6" rx="2" />
  </svg>
);

const BooksIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-book-copy-icon sidebar-icons"
  >
    <path d="M2 16V4a2 2 0 0 1 2-2h11" />
    <path d="M22 18H11a2 2 0 1 0 0 4h10.5a.5.5 0 0 0 .5-.5v-15a.5.5 0 0 0-.5-.5H11a2 2 0 0 0-2 2v12" />
    <path d="M5 14H4a2 2 0 1 0 0 4h1" />
  </svg>
);

const ResultsPage = () => {
  const { language } = useContext(LanguageContext);
  const t = translations[language];
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [analysisData, setAnalysisData] = useState(null);
  const token = localStorage.getItem("token");

  // Verify token and fetch data if necessary
  useEffect(() => {
  const verifyTokenAndFetchData = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    // STEP 1: Verify token
    const verifyRes = await fetch(`http://localhost:8000/user/verify-token/${token}`, {
      headers: { "Accept-Charset": "utf-8" },
    });

    if (!verifyRes.ok) {
      console.error("Token verification failed");
      localStorage.removeItem("token");
      navigate("/login");
      return;
    }

    // STEP 2: Use existing state if passed
    if (location.state) {
      setAnalysisData(location.state);
      setIsLoading(false);
      return;
    }

    // STEP 3: Safe fetches (these should not remove token if they fail)
    try {
      const tipsRes = await fetch(`http://localhost:8000/cv/analysis/${token}`);
      const jobsRes = await fetch(`http://localhost:8000/jobs/match_jobs_from_token/${token}`, {
        method: "POST",
      });
      const coursesRes = await fetch(`http://localhost:8000/courses/recommended_courses/${token}`);

      const tipsData = tipsRes.ok ? await tipsRes.json() : {};
      const jobsData = jobsRes.ok ? await jobsRes.json() : {};
      const coursesData = coursesRes.ok ? await coursesRes.json() : [];

      setAnalysisData({
        fileUrl: null,
        cvTips: tipsData.cv_tips || [],
        tipsDescriptions: (tipsData.cv_tips || []).map(t => t.description || ""),
        careerPaths: tipsData.career_paths || [],
        skills: tipsData.skills || [],
        top5Jobs: tipsData.job_recommendations || [],
        recommendedJobs: jobsData.matches || [],
        recommendedCourses: Array.isArray(coursesData) ? coursesData : [],
      });

      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching one or more data endpoints:", err);
      // ✅ Don't kill the token here — just show fallback state or error UI
    }
  };

  verifyTokenAndFetchData();
}, [navigate, token, location.state]);


  // Navigate to default tab
  useEffect(() => {
    if (location.pathname === "/results" && analysisData) {
      navigate("/results/CVRecommendationsPage", { state: analysisData });
    }
  }, [location.pathname, navigate, analysisData]);

  if (isLoading) {
    return <Loader />;
  }

  const validAnalysisData = {
    fileUrl: analysisData?.fileUrl || null,
    cvTips: Array.isArray(analysisData?.cvTips) ? analysisData.cvTips : [],
    tipsDescriptions: Array.isArray(analysisData?.tipsDescriptions) ? analysisData.tipsDescriptions : [],
    careerPaths: Array.isArray(analysisData?.careerPaths) ? analysisData.careerPaths : [],
    recommendedJobs: Array.isArray(analysisData?.recommendedJobs) ? analysisData.recommendedJobs : [],
    recommendedCourses: Array.isArray(analysisData?.recommendedCourses) ? analysisData.recommendedCourses : [], // ✅ ADD THIS
    top5Jobs: Array.isArray(analysisData?.top5Jobs) ? analysisData.top5Jobs : [],
  };

  return (
    <div className="result-page-container">
      {/* Sidebar */}
      <div className={`result-page-sidebar ${isSidebarOpen ? "result-page-open" : "result-page-closed"}`}>
        <div className="sidebar-top-line"></div>
        <div className={`${isSidebarOpen ? "" : "sidebar-closed-icons"}`}>
          <button className="result-page-toggle-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? "«" : "»"}
          </button>
        </div>
        {isSidebarOpen && <div className="sidebar-section-title">{t.Recommendations}</div>}
        <nav className={isSidebarOpen ? "" : "hidden"}>
          <ul>
            <li>
              <NavLink to="/results/CVRecommendationsPage" className={({ isActive }) => (isActive ? "active" : "")}>
                <div className="sidebar-item-content">
                  <CVRecommendationsIcon />
                  {isSidebarOpen && <span>{t.GeneralAnalysis}</span>}
                </div>
              </NavLink>
            </li>
            <li>
              <NavLink to="/results/RecommendedJobs" className={({ isActive }) => (isActive ? "active" : "")}>
                <div className="sidebar-item-content">
                  <CaseIcon />
                  {isSidebarOpen && <span>{t.jobNavTitle}</span>}
                </div>
              </NavLink>
            </li>
            <li>
              <NavLink to="/results/RecommendedCourses" className={({ isActive }) => (isActive ? "active" : "")}>
                <div className="sidebar-item-content">
                  <BooksIcon />
                  {isSidebarOpen && <span>{t.courseRecommendationsTitle}</span>}
                </div>
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="result-page-main-content">
        <Outlet context={validAnalysisData} />
      </div>
    </div>
  );
};

export default ResultsPage;