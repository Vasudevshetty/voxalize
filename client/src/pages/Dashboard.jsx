import { useEffect, useRef, useState } from "react";
import { GrMysql } from "react-icons/gr";
import { BiLogoPostgresql } from "react-icons/bi";
import { Link } from "react-router-dom";
import Databases from "../components/Databases";
import SessionHistory from "../components/SessionHistory";

function Dashboard() {
  return (
    <div className="bg-black min-h-screen flex text-white overflow-y-scroll font-sans relative">
      {/* Toggle Button when Sidebar is closed */}
      {/* Left Sidebar - Static History */}

      <SessionHistory />
      <Databases />
    </div>
  );
}
export default Dashboard;
