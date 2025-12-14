"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import Image from "next/image";
import {
  Collapse,
  Menu,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import styles from "./styles.module.css";
import KeyboardArrowDownRounded from "@mui/icons-material/KeyboardArrowDownRounded";
import { useState } from "react";
import clx from "classnames";

const LanguageSwitcher = () => {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale(); // Get the current locale
  const [open, setOpen] = useState(false);

  const handleChange = (e: SelectChangeEvent) => {
    router.push(pathname, { locale: e.target.value });
  };

  return (
    <div
      onMouseLeave={() => setOpen(false)}
      onMouseEnter={() => setOpen(true)}
      onClick={() => setOpen(!open)}
      className={styles.dropdown}
    >
      <div className={clx(styles.link)}>
        {locale}
        <KeyboardArrowDownRounded
          className={clx(styles.chevron, {
            [styles.rotate]: open,
          })}
        />
      </div>{" "}
      <Collapse in={open} orientation="vertical" className={styles.collapse}>
        <MenuItem>
          <div
            className={styles.language}
            onClick={() => router.push(pathname, { locale: "am" })}
          >
            <Image
              src={"/assets/flags/Armenia.svg"}
              width={20}
              height={15}
              alt="Armenian_Flag"
            />{" "}
            AM
          </div>
        </MenuItem>
        <MenuItem value={"en"}>
          <div
            className={styles.language}
            onClick={() => router.push(pathname, { locale: "en" })}
          >
            <Image
              src={"/assets/flags/UK.svg"}
              width={20}
              height={15}
              alt="UK_Flag"
            />{" "}
            EN
          </div>
        </MenuItem>
        <MenuItem value={"ru"}>
          <div
            className={styles.language}
            onClick={() => router.push(pathname, { locale: "ru" })}
          >
            <Image
              src={"/assets/flags/Russia.svg"}
              width={20}
              height={15}
              alt="Russian_Flag"
            />{" "}
            RU
          </div>
        </MenuItem>
      </Collapse>
    </div>
  );
};

export default LanguageSwitcher;
