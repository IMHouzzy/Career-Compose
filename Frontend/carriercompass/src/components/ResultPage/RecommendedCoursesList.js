import React, { useState, useEffect, useContext } from "react";
import { LanguageContext } from "../../context/LanguageContext";
import translations from "../../translations";
import "../../styles/Courses/courseCard.css";
import { useOutletContext } from "react-router-dom";
import { useLocation } from "react-router-dom";

const RecommendedCoursesPage = () => {
  const { language } = useContext(LanguageContext);
  const t = translations[language];
  const { recommendedCourses, recommendedJobs } = useOutletContext() || {};
  const [recommendations, setRecommendations] = useState(recommendedCourses || []);
  const location = useLocation();

  console.log("Received state:", location.state);
  console.log("jobs", recommendedJobs);

  // Update recommendations if recommendedCourses changes
  useEffect(() => {
    setRecommendations(recommendedCourses || []);
  }, [recommendedCourses]);

  const CourseCard = ({ course }) => {
    // Safe split for Skills
    const skills = course.Skills ? course.Skills.split(";") : [];

    return (
      <a href={`/results/courses/${course.id_Courses}`} className="course-card">
        <div className="course-card-image">
          <img src={course.Company_Logo} alt={course.Company} />
        </div>
        <div className="course-card-content">
          <p className="course-card-company">{course.Company}</p>
          <h3 className="course-card-title">{course.Title}</h3>

          <div className="course-card-skills">
            <div className="course-card-skill-list">
              <strong>Skills you'll gain:</strong>{" "}
              {skills.slice(0, 4).join(", ")}
              {skills.length > 4 && " ..."}
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
  };

  return (
    <div className="learning-results-container">
      <h2 className="learning-results-title">{t.courseRecommendationsTitle}</h2>

      <div className="learning-cards-wrapper">
        {Array.isArray(recommendations) &&
          recommendations.map((course, index) => (
            <CourseCard key={index} course={course} />
          ))}
      </div>
    </div>
  );
};

export default RecommendedCoursesPage;
