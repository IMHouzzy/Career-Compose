import React, { useContext, useEffect, useState } from "react";
import { LanguageContext } from "../../context/LanguageContext";
import translations from "../../translations";
import "../../styles/JobsPage/JobList.css";
import { useOutletContext } from "react-router-dom";

const JobCard = ({ job }) => {
  return (
    <a href={`/results/jobs/${job.id_Jobs}`} className="job-card-custom full-width">
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

const RecommendedJobList = () => {
  const { language } = useContext(LanguageContext);
  const t = translations[language]; 
    const { recommendedJobs } = useOutletContext() || {};

  return (
    <div className="job-container">
      <h2 className="job-container-title">{t.jobNavTitle}</h2>
      <JobList jobs={recommendedJobs} />
    </div>
  );
};

export default RecommendedJobList;
