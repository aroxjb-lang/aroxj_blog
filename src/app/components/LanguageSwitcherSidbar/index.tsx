"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import Image from "next/image";
import styles from "./styles.module.css";

import { useEffect, useRef, useState } from "react";

const LanguageSwitcherSideBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale(); // Get the current locale
  const current = useRef<HTMLDivElement>(null);
  const [left, setLeft] = useState(current.current?.offsetLeft);
  useEffect(() => {
    if (current.current) setLeft(current.current?.offsetLeft);
  }, [current.current]);
  return (
    <div className={styles.dropdown}>
      <span className={styles.background} style={{ left: left }} />
      <div
        className={styles.language}
        ref={(ref) => {
          if (locale === "am" && ref) current.current = ref;
        }}
        onClick={() => router.push(pathname, { locale: "am", scroll: false })}
      >
        <Image
          src={"/assets/flags/Armenia.svg"}
          width={20}
          height={15}
          alt="Armenian_Flag"
        />{" "}
      </div>

      <div
        className={styles.language}
        onClick={() => router.push(pathname, { locale: "en", scroll: false })}
        ref={(ref) => {
          if (locale === "en" && ref) current.current = ref;
        }}
      >
        <Image
          src={"/assets/flags/UK.svg"}
          width={20}
          height={15}
          alt="UK_Flag"
        />{" "}
      </div>
      <div
        className={styles.language}
        onClick={() => router.push(pathname, { locale: "ru", scroll: false })}
        ref={(ref) => {
          if (locale === "ru" && ref) current.current = ref;
        }}
      >
        <Image
          src={"/assets/flags/Russia.svg"}
          width={20}
          height={15}
          alt="Russian_Flag"
        />{" "}
      </div>
    </div>
  );
};

export default LanguageSwitcherSideBar;
