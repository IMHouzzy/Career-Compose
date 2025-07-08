import React, { useContext,useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../../styles/Courses/CourseInfoPage.css'; // You'll need to style it similar to the screenshot
import BannerImage from '../../images/courseBackground.png';
import { LanguageContext } from "../../context/LanguageContext";
import translations from "../../translations";
const CoursePage = () => {
    const { language } = useContext(LanguageContext);
  const t = translations[language];
    const { id_Courses } = useParams();
    const [course, setCourse] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:8000/courses/get_course/${id_Courses}`)
            .then((res) => res.json())
            .then((data) => setCourse(data))
            .catch(console.error);
    }, [id_Courses]);

    if (!course) return <div>Loading...</div>;

    return (
        <>
            <div className="course-detail-banner">
                <img
                    src={BannerImage}
                    alt="Course Banner"
                    className="course-detail-banner-img"
                />

                {/* ⬇ This is the overlay content on top of the banner */}
                <div className="course-detail-banner-overlay">
                    <div className="course-detail-header">
                        <div className="course-detail-instructor">{course.Category}</div>
                        <img src={course.Company_Logo} className="course-detail-logo" alt={course.Company} />
                        <h1 className="course-detail-title">{course.Title}</h1>
                        <div className="course-detail-instructor">{course.Company}</div>
                        <a
                            href={course.Link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="course-detail-enroll-button"
                        >
                            {t.EnrollForFree}
                        </a>
                    </div>

                    <div className="course-detail-info-boxes">
                        <div className="course-detail-info">
                            <div className="course-detail-info-title">{t.Modules}</div>
                            <div className="course-detail-info-value">{course.Modules}</div>
                        </div>
                        <div className="course-detail-info">
                            <div className="course-detail-info-title">{t.Rating}</div>
                            <div className="course-detail-info-value">★{course.Stars} ({course.Reviews} {t.Reviews})</div>
                        </div>
                        <div className="course-detail-info">
                            <div className="course-detail-info-title">{t.Level}</div>
                            <div className="course-detail-info-value">{course.Level}</div>
                        </div>
                        <div className="course-detail-info">
                            <div className="course-detail-info-title">{t.Schedule}</div>
                            <div className="course-detail-info-value">{course.Schedule}</div>
                        </div>
                        <div className="course-detail-info">
                            <div className="course-detail-info-title">{t.Duration}</div>
                            <div className="course-detail-info-value">{course.Duration}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="course-detail-wrapper">
                <div className="course-detail-skills">
                    <h1 className='listing-bold'>{t.skilsGained}:</h1>
                    {course.Skills
                        ? course.Skills.split(';').filter(skill => skill.trim() !== '').map((skill, i) => (
                            <span key={i} className="course-detail-skill-tag">{skill.trim()}</span>
                        ))
                        : <span className="course-detail-no-skills">{t.NoSkillsListed}</span>}
                </div>

                <div className="course-detail-description">
                    <h1 className='listing-bold'>{t.CourseDescription}:</h1>{course.Description}
                </div>
            </div>
        </>
    );
};

export default CoursePage;
