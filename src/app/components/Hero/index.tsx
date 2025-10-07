"use client";

import {
  BLOB_URL,
  MultilangualContentInterface,
  PostInterface,
} from "@/app/lib/schemas";
import React from "react";
import styles from "./styles.module.css";
import Slider from "react-slick";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

const settings = {
  dots: true,
  autoplay: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  pauseOnHover: true,
  arrows: false,
};
export default function Hero({
  data,
  locale,
}: {
  data: PostInterface[];
  locale: string;
}) {
  const t = useTranslations();

  return (
    <div className={styles.wrapper}>
      <div className={styles.slider}>
        <Slider {...settings}>
          {data.map((item) => (
            <div className={styles.slide} key={item._id}>
              <div className={styles.text}>
                <h3 className={styles.title}>
                  <Image
                    src={"/assets/quotes.png"}
                    width={70}
                    height={90}
                    alt="qoutes"
                    className={styles.quote}
                  />
                  {item.title[locale as keyof MultilangualContentInterface] ||
                    item.title.am}
                </h3>
                <p className={styles.content}>
                  {item.content[locale as keyof MultilangualContentInterface] ||
                    item.content.am}{" "}
                </p>
                <Link href={item.slug} className={styles.link} prefetch={true}>
                  {t("read more")}
                </Link>
              </div>
              <div className={styles.image}>
                <Image
                  src={BLOB_URL + item.featured_media_path}
                  width={500}
                  height={300}
                  alt="banner"
                />
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}
