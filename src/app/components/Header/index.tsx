"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./styles.module.css";
import LanguageSwitcher from "../LanguageSwitcher";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { Routes } from "@/app/lib/ruotes";
import { useTranslations } from "next-intl";
import Image from "next/image";
import clx from "classnames";
import { Tab, Tabs } from "@mui/material";

const routes = [
  {
    title: "news",
    slug: Routes.NEWS,
  },
];
export default function Header() {
  const t = useTranslations();
  const refheader = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  const [active, setActive] = useState(false);

  const onScroll = useCallback(() => {
    if (refheader.current)
      setActive(window.scrollY > refheader.current.scrollTop);
  }, [refheader]);
  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [refheader]);
  return (
    <div
      className={clx(styles.wrapper, {
        [styles.active]: active,
      })}
    >
      <div className={styles.header} ref={refheader}>
        <Link href={Routes.HOME} className={styles.logo}>
          <Image src={"/logo.png"} width={64} height={64} alt="logo" />
          <p className={styles.title}>{t("healthy blog")}</p>
        </Link>
        <nav>
          <Tabs
            value={
              routes.find((item) => item.slug === pathname) ? pathname : false
            }
            onChange={(_e, value) => {
              router.push(value);
            }}
            textColor="inherit"
            indicatorColor={active ? "secondary" : "primary"}
          >
            {routes.map((item) => (
              <Tab
                value={item.slug}
                label={t(item.title)}
                key={item.slug}
                sx={{ color: "inherit" }}
                className={styles.link}
              />
            ))}
          </Tabs>
        </nav>
        <LanguageSwitcher />
      </div>
    </div>
  );
}
