"use client";
import styles from "./styles.module.css";
import LanguageSwitcher from "../LanguageSwitcher";
import { Link, usePathname } from "@/i18n/navigation";
import { Routes } from "@/app/lib/routes";
import { useTranslations } from "next-intl";
import Image from "next/image";
import clx from "classnames";
import {
  ClickAwayListener,
  Collapse,
  Drawer,
  IconButton,
  TextField,
} from "@mui/material";
import { useState } from "react";
import SearchRounded from "@mui/icons-material/SearchRounded";
import KeyboardArrowDownRounded from "@mui/icons-material/KeyboardArrowDownRounded";
import MenuOpenRounded from "@mui/icons-material/MenuOpenRounded";
import MobileMenu from "../MobileMenu";

const routes: (
  | { title: string; subpages: { title: string; slug: Routes }[] }
  | {
      title: string;
      slug: Routes;
    }
)[] = [
  {
    title: "blog",
    slug: Routes.BLOG,
  },
  {
    title: "healthy lifestyle",
    subpages: [
      { title: "beauty", slug: Routes.BEAUTY },
      { title: "body care", slug: Routes.BODY_CARE },
      { title: "healthy food", slug: Routes.HEALTHY_FOOD },
    ],
  },
  {
    title: "diseases",
    subpages: [
      { title: "diseases", slug: Routes.DISEASES },
      { title: "psychology", slug: Routes.PSYCHOLOGY },
      { title: "interviews", slug: Routes.INTERVIEWS },
      { title: "child care", slug: Routes.CHILD_CARE },
      { title: "medicine of the future", slug: Routes.MEDICINE_OF_THE_FUTURE },
    ],
  },
  {
    title: "med info",
    subpages: [{ title: "program", slug: Routes.PROGRAM }],
  },
  {
    title: "entertainment",
    subpages: [
      { title: "announcements", slug: Routes.ANNOUNCEMENTS },
      { title: "culture", slug: Routes.CULTURE },
      { title: "sport", slug: Routes.SPORT },
      { title: "travel news", slug: Routes.TRAVEL_NEWS },
      { title: "recipe", slug: Routes.RECIPE },
    ],
  },
];
export default function Header() {
  const [title, setTitle] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const t = useTranslations();
  const pathname = usePathname();

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
        <div className={styles.desktop}>
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
                          [styles.active]: item.subpages.find(
                            (sub) => sub.slug === pathname
                          ),
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
                        orientation="vertical"
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
        </div>
        <div className={clx(styles.searchWrapper, styles.desktop)}>
          <ClickAwayListener onClickAway={() => setSearchOpen(false)}>
            <div className={styles.search}>
              <SearchRounded
                onClick={() => setSearchOpen(!searchOpen)}
                className={styles.searchIcon}
              />
              <Collapse
                in={searchOpen}
                className={styles.searchCollapse}
                orientation="horizontal"
              >
                <TextField
                  variant="outlined"
                  placeholder="Search..."
                  size="small"
                  className={styles.searchField}
                />
              </Collapse>
            </div>
          </ClickAwayListener>

          <LanguageSwitcher />
        </div>
        <div className={clx(styles.mobile)}>
          <IconButton onClick={() => setMenuOpen(true)}>
            <MenuOpenRounded fontSize="large" />
          </IconButton>
          <Drawer
            open={menuOpen}
            onClose={() => setMenuOpen(false)}
            anchor="right"
            className={styles.mobile}
          >
            <MobileMenu routes={routes} onClose={() => setMenuOpen(false)} />
          </Drawer>
        </div>
      </div>
    </div>
  );
}
