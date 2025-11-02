"use client";

import { Link } from "@/i18n/navigation";
import KeyboardArrowDownRounded from "@mui/icons-material/KeyboardArrowDownRounded";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Collapse from "@mui/material/Collapse";
import React from "react";
import styles from "./styles.module.css";
import clx from "classnames";
import { usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Routes } from "@/app/lib/routes";
import { IconButton, TextField } from "@mui/material";
import CloseRounded from "@mui/icons-material/CloseRounded";
import SearchRounded from "@mui/icons-material/SearchRounded";
import LanguageSwitcher from "../LanguageSwitcher";

export default function index({
  routes,
  onClose,
}: {
  routes: (
    | {
        title: string;
        slug: Routes;
      }
    | { title: string; subpages: { title: string; slug: Routes }[] }
  )[];
  onClose: () => void;
}) {
  const t = useTranslations();
  const pathname = usePathname();
  const [title, setTitle] = useState<string | null>(null);

  return (
    <div className={styles.mobileMenu}>
      {" "}
      <div>
        {" "}
        <IconButton onClick={onClose}>
          <CloseRounded fontSize="large" />
        </IconButton>
      </div>
      <TextField
        size="small"
        placeholder="Search..."
        slotProps={{
          input: { endAdornment: <SearchRounded /> },
        }}
      />
      <ClickAwayListener onClickAway={() => setTitle(null)}>
        <nav className={clx(styles.nav)}>
          {routes.map((item) => {
            if ("slug" in item) {
              return (
                <Link
                  key={item.slug}
                  href={item.slug}
                  className={clx(styles.link, {
                    [styles.active]: pathname === item.slug,
                  })}
                  onClick={() => setTitle(null)}
                >
                  {t(item.title)}
                </Link>
              );
            } else {
              return (
                <div
                  className={styles.dropdown}
                  key={item.title}
                  onClick={() =>
                    setTitle(title === item.title ? null : item.title)
                  }
                >
                  <div
                    className={clx(styles.link, {
                      [styles.active]:
                        item.subpages &&
                        item.subpages.find((sub) => sub.slug === pathname),
                    })}
                  >
                    {t(item.title)}{" "}
                    <KeyboardArrowDownRounded
                      className={clx(styles.chevron, {
                        [styles.rotate]: item.title === title,
                      })}
                    />
                  </div>
                  <Collapse
                    in={item.title === title}
                    className={styles.collapse}
                  >
                    {item.subpages?.map((sub) => (
                      <Link
                        href={sub.slug}
                        key={sub.slug}
                        className={clx(styles.sublink, {
                          [styles.active]: pathname === sub.slug,
                        })}
                        onClick={() => setTitle(null)}
                      >
                        {t(sub.title)}
                      </Link>
                    ))}
                  </Collapse>
                </div>
              );
            }
          })}
        </nav>
      </ClickAwayListener>
      <LanguageSwitcher />
    </div>
  );
}
