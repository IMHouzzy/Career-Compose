import React from "react";
import PlansHeroSection from "../components/PlansPage/PlanCards";
import PlansTable from "../components/PlansPage/PlanTable";

const PlanPage = () => {
  return (
    <div>
      <PlansTable />
      <PlansHeroSection />
    </div>
  );
};

export default PlanPage;
