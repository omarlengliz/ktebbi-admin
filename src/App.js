import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import AuthGuard from "./AuthGuard";
import Register from "./Screens/Register";
import Login from './Screens/Login';
import HomePage from './Screens/HomeScreen';
import AddBook from './Screens/AddBook';
import OTP from './Screens/Otp';
import EditBook from './Screens/EditBook';
import GenrateBook from './Screens/AiScreen';
import AdminNavbar from './Component/AdminNav';
import AuthorNavbar from './Component/AuthorNav';
import Navbar from './Component/AuthorNav';
import { useEffect } from 'react';
import UserManagementTable from './Component/UserList';
import BookPage from './Screens/Admin-Books';
import BookGenreList from './Component/Genre';
import BookDetails from './Screens/BookDetails';
import Dashboard from './Screens/AdminDashbord';
import AuthorDashboard from './Screens/AuthorDashboard';
import BadWordsHistory from './Screens/badWordHistory';

const App = () => {
  

  return (
   
    <Router>
          <div className="min-h-screen bg-gray-100">

 
        <Routes>
          <Route path="/" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/otp" element={<OTP />} />


          <Route
            path="/admin/dashboard"
            element={
              <AuthGuard>
                  <Dashboard/>
               </AuthGuard>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AuthGuard>
                  <UserManagementTable/>
               </AuthGuard>
            }
          />
          <Route
            path="/admin/books"
            element={
              <AuthGuard>
                  <BookPage/>
               </AuthGuard>
            }
          />
          <Route
            path="/admin/books/:id"
            element={
              <AuthGuard>
                  <BookDetails/>
               </AuthGuard>
            }
          />
          <Route
            path="/admin/users/:id/history"
            element={
              <AuthGuard>
                  <BadWordsHistory/>
               </AuthGuard>
            }
          />
          <Route
            path="/admin/genres"
            element={
              <AuthGuard>
                  <BookGenreList/>
               </AuthGuard>
            }
          />
          <Route
            path="/author/dashboard"
            element={
              <AuthGuard>
                  <AuthorDashboard />
               </AuthGuard>
            }
          />
          <Route
            path="/author/books"
            element={
              <AuthGuard>
                  <HomePage/>
               </AuthGuard>
            }
          />
          <Route
            path="/author/add-book"
            element={
              <AuthGuard>
                  <AddBook/>
               </AuthGuard>
            }
          />
          <Route path='/author/edit-book/:bookId' element={<EditBook />} />
          <Route path='genrate-book' element={<GenrateBook />} />
        </Routes>
        </div>

    </Router>

  );
};

export default App;