// AdminNavbar.js
import { Link } from 'react-router-dom';

const AdminNavbar = () => (
  <nav className="bg-gray-800 p-4">
    <ul className="flex z">
      <li>
        <Link to="/home" className="text-white px-3 py-2 rounded hover:bg-gray-700">
          Dashboard
        </Link>
      </li>
      <li>
        <Link to="/users-list" className="text-white px-3 py-2 rounded hover:bg-gray-700">
          Users List
        </Link>
      </li>
      <li>
        <Link to="/books-list" className="text-white px-3 py-2 rounded hover:bg-gray-700">
          Books List
        </Link>
      </li>
      <li>
        <Link to="/genre" className="text-white px-3 py-2 rounded hover:bg-gray-700">
          Genre
        </Link>
      </li>
    </ul>
  </nav>
);

export default AdminNavbar;
