"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import Image from "next/image";
import { MenuItem, Select, SelectChangeEvent } from "@mui/material";
import styles from "./styles.module.css";

const LanguageSwitcher = () => {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale(); // Get the current locale

  const handleChange = (e: SelectChangeEvent) => {
    router.push(pathname, { locale: e.target.value });
  };

  return (
    <div>
      <Select
        value={locale}
        onChange={handleChange}
        variant="outlined"
        sx={{ background: "var(--background)" }}
      >
        <MenuItem value={"am"}>
          <div className={styles.language}>
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
          <div className={styles.language}>
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
          <div className={styles.language}>
            <Image
              src={"/assets/flags/Russia.svg"}
              width={20}
              height={15}
              alt="Russian_Flag"
            />{" "}
            RU
          </div>
        </MenuItem>
      </Select>
    </div>
  );
};

export default LanguageSwitcher;
