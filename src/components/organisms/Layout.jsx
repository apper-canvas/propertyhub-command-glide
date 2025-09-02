import React, { useContext } from "react";
import { useSelector } from 'react-redux';
import Header from "@/components/organisms/Header";
import { AuthContext } from "../../App";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Layout = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.user);
  const { logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {isAuthenticated && (
        <div className="bg-white border-b border-gray-200 px-4 py-2">
          <div className="max-w-7xl mx-auto flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="flex items-center space-x-2"
            >
              <ApperIcon name="LogOut" className="w-4 h-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      )}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default Layout;