import React, { useContext, useEffect, useState } from "react";
import { LanguageContext } from "../../context/LanguageContext";
import translations from "../../translations";
import "../../styles/JobsPage/JobList.css";

const JobCard = ({ job }) => {
  return (
    <a href={`/jobs/${job.id_Jobs}`} className="job-card-custom full-width">
      <img src={job.image} alt={job.title} className="job-image-custom" />
      <div className="job-info-custom">
        <h2 className="job-title-custom">{job.title}</h2>
        <p className="job-company-custom">{job.company}</p>
      </div>
      <div className="job-action-custom">
        <p className="job-location-custom">{job.city}</p>
        {job.salary !== "Not Provided Not Provided" && (
          <div className="job-salary-custom">{job.salary}</div>
        )}
      </div>
    </a>
  );
};

const JobList = ({ jobs }) => (
  <div className="job-list-custom">
    {jobs.map((job, index) => (
      <JobCard key={index} job={job} />
    ))}
  </div>
);

const ResultsPage = () => {
  const { language } = useContext(LanguageContext);
  const t = translations[language];
  const [jobs, setJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 20;

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("http://localhost:8000/jobs/all_jobs");
        const data = await response.json();
        setJobs(data);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      }
    };

    // Get page from URL if exists
    const urlParams = new URLSearchParams(window.location.search);
    const pageFromUrl = parseInt(urlParams.get("page"));
    if (!isNaN(pageFromUrl)) {
      setCurrentPage(pageFromUrl);
    }

    fetchJobs();
  }, []);


  const totalPages = Math.ceil(jobs.length / jobsPerPage);
  const currentJobs = jobs.slice(
    (currentPage - 1) * jobsPerPage,
    currentPage * jobsPerPage
  );

  const goToPage = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
      const newUrl = new URL(window.location);
      newUrl.searchParams.set("page", pageNum);
      window.history.pushState(null, "", newUrl);
    }
  };


  return (
    <div className="job-container">
      <h2 className="job-container-title">{t.jobs}</h2>
      <JobList jobs={currentJobs} />

      {jobs.length > jobsPerPage && (
        <div className="pagination-container">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-arrow"
          >
            ‹
          </button>

          {[...Array(totalPages)].map((_, index) => {
            const page = index + 1;
            return (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`pagination-page ${currentPage === page ? "active" : ""}`}
              >
                {page}
              </button>
            );
          })}

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-arrow"
          >
            ›
          </button>
        </div>
      )}

    </div>
  );
};

export default ResultsPage;
