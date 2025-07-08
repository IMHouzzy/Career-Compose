import React from "react";
import { useLocation, useOutletContext } from "react-router-dom";
import CVRecommendations from "../../components/ResultPage/CV-recommendations";
import CareerPathsDisplay from "../../components/ResultPage/CareerPathsDisplay";
import Top5Jobs from "../../components/ResultPage/Top5Jobs";
const CVRecommendationsPage = () => {
  const location = useLocation();
  const analysisData = useOutletContext();
  const fileUrl = analysisData?.fileUrl || localStorage.getItem("fileUrl");

  return (
    <div>
      <Top5Jobs />
      <CareerPathsDisplay />
      
     
    </div>
    
  );
};

export default CVRecommendationsPage;
