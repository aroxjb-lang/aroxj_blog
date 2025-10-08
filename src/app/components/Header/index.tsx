"use client";
import styles from "./styles.module.css";
import LanguageSwitcher from "../LanguageSwitcher";
import { Link, redirect, usePathname, useRouter } from "@/i18n/navigation";
import { Routes } from "@/app/lib/ruotes";
import { useTranslations } from "next-intl";
import Image from "next/image";
import clx from "classnames";
import { Tab, Tabs } from "@mui/material";

const routes = [
  {
    title: "blog",
    slug: Routes.BLOG,
  },
];
export default function Header() {
  const t = useTranslations();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <Link href={Routes.HOME} className={styles.logo}>
          <Image src={"/logo.png"} width={64} height={64} alt="logo" />
          <p className={styles.title}>
            {t.rich("healthy blog", {
              br: () => <br />,
            })}
          </p>
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
