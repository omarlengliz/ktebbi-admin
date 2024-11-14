import React, { useState, useEffect } from 'react';
import {  Pencil, Trash  , AlertTriangle} from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import userService from '../services/userservices';
import { Loader } from './Loader';
import { useNavigate } from 'react-router-dom';

const Switch = ({ checked, onChange, className }) => {
    return (
      <label className={`relative inline-block w-10 align-middle select-none ${className}`}>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="toggle-checkbox sr-only"
        />
        <span
          className={`block w-10 h-6 rounded-full cursor-pointer transition-colors ${
            checked ? 'bg-green-500' : 'bg-gray-300'
          }`}
        >
          <span
            className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${
              checked ? 'transform translate-x-4' : ''
            }`}
          ></span>
        </span>
      </label>
    );
  };

const UserManagementTable = () => {
  const navigate=useNavigate()
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [blockedUsers, setBlockedUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await userService.getUsers();
      setUsers(data.data);
      setBlockedUsers(users.filter((user) => user.isBlocked));
    } catch (error) {
      toast.error('Failed to fetch users');
      console.log(error)
    } finally {
      setLoading(false);
    }
  };

  const handleBlockToggle = async (userId) => {
    alert('Block toggle');
    setLoading(true);
    try {
      await userService.blockUser(userId);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, isBlocked: !user.isBlocked } : user
        )
      );
      setBlockedUsers((prevBlockedUsers) => {
        const updatedUser = users.find((user) => user._id === userId);
        if (updatedUser.isBlocked) {
          return [...prevBlockedUsers, updatedUser];
        } else {
          return prevBlockedUsers.filter((user) => user._id !== userId);
        }
      });
      fetchUsers();
      toast.success('User status updated successfully');
    } catch (error) {
      toast.error('Failed to update user status');
    } finally {
      setLoading(false);
    }
  };
  const goToHistory=(userId) =>{
    navigate(`/admin/users/${userId}/history`) ;
  }

  const handleDeleteUser = async (userId) => {
    setLoading(true);
    try {
      await userService.deleteUser(userId);
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      setBlockedUsers((prevBlockedUsers) =>
        prevBlockedUsers.filter((user) => user._id !== userId)
      );
      toast.success('User deleted successfully');
    } catch (error) {
      toast.error('Failed to delete user');
    } finally {
      setLoading(false);
    }
  };
  if(loading){
    return  <div className="flex justify-center items-center h-screen"><Loader/></div>
  }
  return (
    <div className="max-w-7xl mx-auto pt-10">
      <ToastContainer />
      <h2 className="text-2xl font-bold pb-5">Users list</h2>
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
          <tr>
            <th scope="col" className="px-6 py-3">Name &Last Name</th>
            <th scope="col" className="px-6 py-3">Email</th>
            
            <th scope="col" className="px-6 py-3">role</th>
            <th scope="col" className="px-6 py-3">Status</th>
            <th scope="col" className="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user._id}
              className={`border-b   ${
                user.isBlocked===true
                  ? 'bg-red-200'
                  : 'bg-white'
              }`}
            >
              <td className="px-6 py-4 " >
               <span className='cursor cursor-pointer ' onClick={()=>goToHistory(user._id)}>
               {user.badWordCount > 0 && user.badWordCount <= 5 && (
            <AlertTriangle className="text-yellow-500  inline-block " />
          )} {user.firstname} {user.lastname}
                </span>
               </td>
              <td className="px-6 py-4">{user.email}</td>
              <td className="px-6 py-4">{user.role}</td>
              <td className="px-6 py-4">
                <Switch
                  checked={user.isBlocked}
                  onChange={() => handleBlockToggle(user._id)}
                  className="transform scale-75"
                />
              </td>
              <td className="px-6 py-4 flex items-center space-x-3">
                <button className="text-yellow-500 hover:text-yellow-600">
                  <Pencil className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDeleteUser(user._id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagementTable;
