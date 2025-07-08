
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import "./styles/App.css";

import { LanguageProvider } from "./context/LanguageContext";
import { ErrorProvider } from "./ErrorContext";

import Header from "./components/General/Header";
import Footer from "./components/General/footer";
import Copyright from "./components/General/copyright";

import Home from "./pages/HomePage";
import CVDraganddrop from "./pages/dragAndDropPage";
import ToolPlans from "./pages/PlanPage";

import ResultPageLayout from "./pages/PagesWithNavigationMenu/ResultsPageLayout";
import CVRecommendationsPage from "./pages/ToolPages/CVRecommendationsPage";

import RecommendedJobs from "./pages/ToolPages/RecommendedJobsPage";
import ALLJobList from "./components/JobsPage/JobList";
import JobListing from "./components/JobsPage/JobListing";

import RecommendedCourses from "./pages/ToolPages/RecommendedCoursesPage";
import AllCoursesList from "./components/CoursesPage/CoursesList";
import CourseInfoPage from "./components/CoursesPage/CourseInfoPage";

import Login from "./components/Login/LoginPage";
import Reg from "./components/Register/RegisterPage";
import ProfileLayout from "./pages/PagesWithNavigationMenu/ProfilePageLayout";
import ProfileDataPage from "./pages/ProfileRoutePages/ProfileDataPage";
import ProfileEditPage from "./pages/ProfileRoutePages/ProfileEditPage";
import PaymentSuccess from "./components/Payments/Success";
import PaymentCancel from "./components/Payments/Cancel";
import BillingPage from "./pages/ProfileRoutePages/ProfileBillingPage";



function Layout() {
  const location = useLocation();
  const isResultsPage = location.pathname.startsWith("/results");

  return (
    <div className={`App ${isResultsPage ? "with-sidebar" : ""}`}>
      <Header />
      <div className={`layout ${isResultsPage ? "with-sidebar-layout" : ""}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dragAndDrop" element={<CVDraganddrop />} />
          <Route path="/Plan" element={<ToolPlans />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Reg />} />


          <Route path="/PaymentSuccess" element={<PaymentSuccess />} />
          <Route path="/PayementCancel" element={<PaymentCancel />} /> 

          <Route path="ALLJobList" element={<ALLJobList />} />
          <Route path="AllCoursesList" element={<AllCoursesList />} />
          <Route path="jobs/:id_Jobs" element={<JobListing />} />
          <Route path="Courses/:id_Courses" element={<CourseInfoPage />} />
          {/* test page : */}

          <Route path="/PaymentSuccess" element={<PaymentSuccess />} />
          <Route path="/PayementCancel" element={<PaymentCancel />} />


          <Route path="/profile" element={<ProfileLayout />}>
            <Route index element={<ProfileDataPage />} />
            <Route path="user-data" element={<ProfileDataPage />} />
            <Route path="edit-profile" element={<ProfileEditPage />} />
            <Route path="billing" element={<BillingPage />} />
          </Route>

          {isResultsPage ? (
            <Route path="/results" element={<ResultPageLayout />}>
              <Route index element={<CVRecommendationsPage />} />
              <Route path="CVRecommendationsPage" element={<CVRecommendationsPage />} />
              <Route path="RecommendedJobs" element={<RecommendedJobs />} />
              <Route path="jobs/:id_Jobs" element={<JobListing />} />
              <Route path="RecommendedCourses" element={<RecommendedCourses />} />
              <Route path="Courses/:id_Courses" element={<CourseInfoPage />} />
            </Route>
          ) : null}
        </Routes>
      </div>
      <Footer />
      <Copyright />
    </div>
  );
}

function App() {
  return (
    <LanguageProvider> {/* Move LanguageProvider outside of Router */}
      <ErrorProvider>
        <Router>
          <Layout />
        </Router>
      </ErrorProvider>
    </LanguageProvider>
  );
}

export default App;
