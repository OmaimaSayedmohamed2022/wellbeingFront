import './App.css';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import Layout from './components/layout/layout.jsx'; // Layout with sidebar and navbar
import MainPage from './components/MainPage/MainPage.jsx';
import Specialist from './components/Specialist/Specialist.jsx';
import Beneficiary from './components/Beneficiary/Beneficiary.jsx';
import Timeline from './components/Timeline/Timeline.jsx';
import Session from './components/Session/Session.jsx';
import AdListComponent from './components/Advertising/Advertizing.jsx';
import Payment from './components/Payment/Payment.jsx';
import Settings from './components/Settings/Settings.jsx';

import Login from './components/login/login.jsx'; // Import the Login component
import { AuthContext, AuthProvider } from './context/authContext.jsx'; // Import AuthProvider as default and AuthContext as named
import { useContext } from 'react'; // Import useContext from React
import Spinner from './components/Spinner/Spinner.jsx'; // Import the Spinner component
import DoctorDetails from './components/Doctors/DoctorDetails.jsx';
import NewSpecialistDetails from './components/NewSpecialistDetails/NewSpecialistDetails.jsx';
import BeneficiaryDetails from './components/BeneficiaryDetails/BeneficiaryDetails.jsx';


// Create the router
const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />, // Redirect to login by default
  },
  {
    path: '/login',
    element: <Login />, // Login page without Layout
  },
  {
    path: '/',
    element: <ProtectedLayout />, // Wrap protected routes with ProtectedLayout
    children: [
      {
        path: '/الرئيسية',
        element: <MainPage />,
      },
      {
        path: '/المتخصصين',
        element: <Specialist />,
      },
      {
        path: '/المستفيدين',
        element: <Beneficiary />,
      },
      {
        path: '/مستفيد/:benefName',
        element: <BeneficiaryDetails />,
      },
      {
        path: '/المواعيد',
        element: <Timeline />,
      },
      {
        path: '/الجلسات',
        element: <Session />,
      },
      {
        path: '/الاعلانات',
        element: <AdListComponent />,
      },
      {
        path: '/الدفع',
        element: <Payment />,
      },
      {
        path: '/الإعدادات',
        element: <Settings />,
      },
      {
        path: '/دكتور/:doctorName',
        element: <DoctorDetails />,
      },
      {
        path: "/متخصص-جديد/:name",
        element: <NewSpecialistDetails />,
      },
    ],
  },
]);

// ProtectedLayout component to handle route protection
function ProtectedLayout() {
  const { token } = useContext(AuthContext); // Get the token from the context

  // Show a spinner while checking for the token
  if (token === null) {
    return <Spinner />;
  }

  // If no token is present, redirect to the login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If the token exists, render the layout and nested routes
  return (
    <Layout>
      <Outlet /> {/* Render nested routes */}
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;