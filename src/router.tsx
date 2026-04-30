import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import SchedulePage from './pages/SchedulePage';
import ActivitiesPage from './pages/ActivitiesPage';
import FoodPage from './pages/FoodPage';
import BarPage from './pages/BarPage';
import ArtPage from './pages/ArtPage';
import AnnouncementsPage from './pages/AnnouncementsPage';
import FloydPage from './pages/FloydPage';
import PrivacyPage from './pages/PrivacyPage';
import NotFoundPage from './pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <SchedulePage /> },
      { path: '/activities', element: <ActivitiesPage /> },
      { path: '/food', element: <FoodPage /> },
      { path: '/bar', element: <BarPage /> },
      { path: '/art', element: <ArtPage /> },
      { path: '/announcements', element: <AnnouncementsPage /> },
      { path: '/floyd', element: <FloydPage /> },
      { path: '/privacy', element: <PrivacyPage /> },
      { path: '*', element: <NotFoundPage /> }
    ]
  }
]);
