import React, { useState, useEffect, useContext } from "react";
import { LanguageContext } from "../../context/LanguageContext";
import translations from "../../translations";
import "../../styles/Courses/courseCard.css";

const ResultsPage = () => {
  const { language } = useContext(LanguageContext);
  const t = translations[language];

  const [recommendations, setRecommendations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 32;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("http://localhost:8000/courses/get_all_courses");
        const data = await response.json();
        console.log("Fetched courses:", data);
        setRecommendations(data);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
        setRecommendations([]);
      }
    };
    // Get page from URL if exists
    const urlParams = new URLSearchParams(window.location.search);
    const pageFromUrl = parseInt(urlParams.get("page"));
    if (!isNaN(pageFromUrl)) {
      setCurrentPage(pageFromUrl);
    }
    fetchCourses();
  }, []);

  const totalPages = Math.ceil(recommendations.length / coursesPerPage);
  const currentCourses = recommendations.slice(
    (currentPage - 1) * coursesPerPage,
    currentPage * coursesPerPage
  );

  const goToPage = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
      const newUrl = new URL(window.location);
      newUrl.searchParams.set("page", pageNum);
      window.history.pushState(null, "", newUrl);
    }
  };

  const CourseCard = ({ course }) => (
    <a href={`/courses/${course.id_Courses}`} className="course-card">
      <div className="course-card-image">
        <img src={course.Company_Logo} alt={course.Company} />
      </div>
      <div className="course-card-content">
        <p className="course-card-company">{course.Company}</p>
        <h3 className="course-card-title">{course.Title}</h3>

        <div className="course-card-skills">
          <div className="course-card-skill-list">
            <strong>{t.skilsGained}:</strong>{" "}
            {course.Skills.split(";").slice(0, 4).join(", ")}
            {course.Skills.split(";").length > 3 && " ..."}
          </div>
        </div>

        <div className="course-card-bottom">
          <div className="course-card-rating">
            <span className="course-card-stars">
              <span className="star-icon">★</span> {course.Stars}
            </span>
            <span className="course-card-reviews">({course.Reviews} reviews)</span>
          </div>
          <p className="course-card-level">{course.Level}</p>
        </div>
      </div>
    </a>
  );

  return (
    <div className="learning-results-container">
      <h2 className="learning-results-title">{t.courses}</h2>

      <div className="learning-cards-wrapper">
        {Array.isArray(currentCourses) && currentCourses.map((course, index) => (
          <CourseCard key={index} course={course} />
        ))}
      </div>

      {recommendations.length > coursesPerPage && (
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
