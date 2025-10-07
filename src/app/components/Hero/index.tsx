"use client";

import { MultilangualContentInterface, PostInterface } from "@/app/lib/schemas";
import React from "react";
import styles from "./styles.module.css";
import Slider from "react-slick";

const settings = {
  dots: true,
  autoplay: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
};
export default function Hero({
  data,
  locale,
}: {
  data: PostInterface[];
  locale: string;
}) {
  return (
    <div className={styles.wrapper}>
      <Slider {...settings}>
        {data.map((item) => (
          <div className={styles.slide} key={item._id}>
            {item.title[locale as keyof MultilangualContentInterface]}
          </div>
        ))}
      </Slider>
    </div>
  );
}
