import { createBrowserRouter } from "react-router-dom";

// Layout
import DashboardLayout from "../layouts/DashboardLayout";

// Auth Pages
import SignInPage from "../pages/auth/SignInPage";
import ForgotPassword from "../pages/auth/ForgotPassword";
import OTPVerification from "../pages/auth/OTPVerification";
import ResetPassword from "../pages/auth/ResetPassword";

// Dashboard Core
import DashboardOverview from "../pages/dashboardpages/DashboardOverview/DashboardOverview";
import AllBestSellingsProductsPage from "../pages/dashboardpages/DashboardOverview/AllBestSellingsProductsPage";
import AllNotifications from "../pages/dashboardpages/notification/AllNotifications";

// Users
import { AllUsers } from "../pages/dashboardpages/user/AllUsers";

// Orders
import AllOrder from "@/pages/dashboardpages/ordersPage/AllOrder";
import OrderConfirmationPage from "@/pages/dashboardpages/ordersPage/OrderConfirmationPage";
import ProductDetailsPage from "@/components/dashboardcomponents/ordersPagecomponents/ProductDetailsPage";
import AdminProfile from "@/pages/dashboardpages/adminProfile/AdminProfile";
import EditProfile from "@/pages/dashboardpages/adminProfile/EditProfile";
import RevenueReports from "@/pages/dashboardpages/revenueReports/RevenueReports";
import { ChangePassword } from "@/pages/auth/ChangePassword";
import PhotoAlbum from "@/pages/dashboardpages/photoAlbum/PhotoAlbum";
import Calendar from "@/pages/dashboardpages/calendar/Calendar";
import Gift from "@/pages/dashboardpages/gift/Gift";

// Admin Account
// import AdminAccount from "../pages/dashboardpages/admin/AdminAccount";

// Categories
// import PhotoAlbum from "../pages/dashboardpages/categories/PhotoAlbum";
// import Gifts from "../pages/dashboardpages/categories/Gifts";
// import PhotoPrints from "../pages/dashboardpages/categories/PhotoPrints";
// import Canvas from "../pages/dashboardpages/categories/Canvas";
// import Calendars from "../pages/dashboardpages/categories/Calendars";
// import StickerAlbum from "../pages/dashboardpages/categories/StickerAlbum";

// Settings
// import Profile from "../pages/dashboardpages/personalinformation/Profile";
// import EditProfile from "../pages/dashboardpages/personalinformation/Editprofile";
// import TermsAndConditions from "../pages/dashboardpages/terms/TermsAndConditions";
// import EditTermsAndConditions from "../pages/dashboardpages/terms/EditTermsAndConditions";
// import PrivacyPolicy from "../pages/dashboardpages/privacypolicy/PrivacyPolicy";
// import EditPrivacyPolicy from "../pages/dashboardpages/privacypolicy/EditPrivacyPolicy";
// import AboutUs from "../pages/dashboardpages/about/AboutUs";
// import EditAbout from "../pages/dashboardpages/about/EditAbout";

const routes = createBrowserRouter([
  // Public Auth Routes
  { path: "/", element: <SignInPage /> },
  { path: "/signin", element: <SignInPage /> },
  { path: "/forgotpass", element: <ForgotPassword /> },
  { path: "/otpverification", element: <OTPVerification /> },
  { path: "/resetPassword", element: <ResetPassword /> },

  // Protected Dashboard Routes
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      { index: true, element: <DashboardOverview /> },
      {
        path: "all-best-selling-products",
        element: <AllBestSellingsProductsPage />,
      },
      { path: "notifications", element: <AllNotifications /> },

      // Users
      { path: "users", element: <AllUsers /> },

      // Orders
      { path: "orders", element: <AllOrder /> },
      { path: "orders/:id", element: <OrderConfirmationPage /> },
      { path: "orders/:category/:id", element: <ProductDetailsPage /> }, // ✅ Dynamic Product Details

      // // Revenue Reports
      { path: "revenue-reports", element: <RevenueReports /> },

      // Admin Account
      { path: "admin-account", element: <AdminProfile /> },
      { path: "admin-account/edit", element: <EditProfile /> },
      { path: "admin-account/change-password", element: <ChangePassword /> },

      { path: "categories/photo-album", element: <PhotoAlbum /> },
      { path: "categories/calendars", element: <Calendar /> },
      { path: "categories/gifts", element: <Gift /> },
      // { path: "categories/gifts", element: <Gifts /> },
      // { path: "categories/photo-prints", element: <PhotoPrints /> },
      // { path: "categories/canvas", element: <Canvas /> },
      // { path: "categories/calendars", element: <Calendars /> },
      // { path: "categories/sticker-album", element: <StickerAlbum /> },

      // { path: "settings/profile", element: <Profile /> },
      // { path: "settings/editpersonal", element: <EditProfile /> },
      // { path: "settings/terms", element: <TermsAndConditions /> },
      // { path: "settings/editterms", element: <EditTermsAndConditions /> },
      // { path: "settings/privacy", element: <PrivacyPolicy /> },
      // { path: "settings/editprivacy", element: <EditPrivacyPolicy /> },
      // { path: "settings/about", element: <AboutUs /> },
      // { path: "settings/editabout", element: <EditAbout /> },
    ],
  },
]);

export default routes;
