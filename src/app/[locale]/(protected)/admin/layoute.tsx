import React from "react";
import styles from "./admin.module.css"
import SideBar from "@/app/components/AdminsComponents/SideBar";

export default function Layoute({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className={styles.layout}>
    <SideBar/>
    {children}
  </div>;
}
