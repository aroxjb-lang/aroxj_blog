import React from "react";
import styles from "./styles.module.css";
import { Routes } from "@/app/lib/routes";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const routes: (
  | { title: string; subpages: { title: string; slug: Routes }[] }
  | {
    title: string;
    slug: Routes;
  }
)[] = [
    {
      title: "",
      subpages: [
        {
          title: "blog",
          slug: Routes.BLOG,
        },
        {
          title: "Archive",
          slug: Routes.ARCHIVE,
        },
        {
          title: "About us",
          slug: Routes.ABOUT_US,
        },
      ],
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
export default function Footer({
  socialMedias,
}: {
  socialMedias: {
    icon: string;
    url: string;
  }[];
}) {
  const t = useTranslations();

  return (
    <div className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.main}>
          <div className={styles.siteMap}>
            <h3 className={styles.footerTitle}>{t("Sitemap")}</h3>
            <div className={styles.footerNavigation}>
              {routes.map((route) => {
                if ("slug" in route) {
                  return (
                    <Link
                      key={route.slug}
                      href={route.slug}
                      className={styles.link}
                    >
                      {t(route.title)}
                    </Link>
                  );
                } else {
                  return (
                    <div className={styles.navColumn} key={route.title}>
                      <p className={styles.navTitle}>{route.title}</p>
                      {route.subpages.map((page) => (
                        <Link
                          key={page.slug}
                          href={page.slug}
                          className={styles.link}
                        >
                          {t(page.title)}
                        </Link>
                      ))}
                    </div>
                  );
                }
              })}
            </div>
          </div>
          <div className={styles.followUs}>
            <h3 className={styles.footerTitle}>{t("Follow us")}</h3>
            <div className={styles.icons}>
              {socialMedias.map((item) => (
                <Link
                  key={item.url}
                  href={item.url}
                  target="_blank"
                  className={styles.icon}
                >
                  <img src={'/wp-content/'+item.icon} alt={item.url} />
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.copyright}>
          <Link href={Routes.HOME} className={styles.logo}>
            &#9426;
            <Image src={"/logo.png"} width={64} height={64} alt="logo" />
            <p className={styles.title}>
              {t.rich("healthy blog", {
                br: () => <span> </span>,
              })}
            </p>
            {new Date().getFullYear()} | {t("All rights reserved")}
          </Link>{" "}
        </div>
      </div>
    </div>
  );
}
