import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

import Home from './pages/Home';
import Explore from './pages/Explore';
import Categories from './pages/Categories';
import CategoryDetails from './pages/CategoryDetails';
import ContentDetails from './pages/ContentDetails';
import Characters from './pages/Characters';
import CharacterDetails from './pages/CharacterDetails';
import Merchandise from './pages/Merchandise';
import MerchandiseDetails from './pages/MerchandiseDetails';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import FanCreations from './pages/FanCreations';
import Media from './pages/Media';
import About from './pages/About';
import NotFound from './pages/NotFound';

import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Bookmarks from './pages/Bookmarks';
import Submit from './pages/Submit';
import Feedback from './pages/Feedback';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminCategories from './pages/admin/AdminCategories';
import AdminContent from './pages/admin/AdminContent';
import AdminCharacters from './pages/admin/AdminCharacters';
import AdminMerchandise from './pages/admin/AdminMerchandise';
import AdminEvents from './pages/admin/AdminEvents';
import AdminFanSubmissions from './pages/admin/AdminFanSubmissions';
import AdminFeedback from './pages/admin/AdminFeedback';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<Layout />}>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/category/:slug" element={<CategoryDetails />} />
                <Route path="/content/:slug" element={<ContentDetails />} />
                <Route path="/characters" element={<Characters />} />
                <Route path="/characters/:slug" element={<CharacterDetails />} />
                <Route path="/merchandise" element={<Merchandise />} />
                <Route path="/merchandise/:slug" element={<MerchandiseDetails />} />
                <Route path="/events" element={<Events />} />
                <Route path="/events/:slug" element={<EventDetails />} />
                <Route path="/media" element={<Media />} />
                <Route path="/articles" element={<FanCreations />} />
                <Route path="/fan-creations" element={<FanCreations />} />
                <Route path="/about" element={<About />} />

                {/* Authentication Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                {/* Protected User Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/bookmarks" element={<Bookmarks />} />
                  <Route path="/submit" element={<Submit />} />
                  <Route path="/feedback" element={<Feedback />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Route>

              {/* Admin Protected Routes */}
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="categories" element={<AdminCategories />} />
                  <Route path="content" element={<AdminContent />} />
                  <Route path="characters" element={<AdminCharacters />} />
                  <Route path="merchandise" element={<AdminMerchandise />} />
                  <Route path="events" element={<AdminEvents />} />
                  <Route path="fan-submissions" element={<AdminFanSubmissions />} />
                  <Route path="feedback" element={<AdminFeedback />} />
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
