import React from "react";
import styles from "./admin.module.css"
import SideBar from "@/app/components/AdminsComponents/SideBar";
import { ToastContainer } from 'react-toastify';

export default function Layoute({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className={styles.layout}>
    <ToastContainer/>
    <SideBar/>
    {children}
  </div>;
}
