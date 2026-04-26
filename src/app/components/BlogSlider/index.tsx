'use client';

import React, { useEffect, useRef, useState } from "react";
import Slider, { Settings } from "react-slick";
import styles from "./styles.module.css";
import Image from "next/image";
import {  Locales, PostInterface } from "@/app/lib/schemas";
import { useTranslations } from "next-intl";
import { IconButton } from "@mui/material";
import ArrowBackRounded from "@mui/icons-material/ArrowBackRounded";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import { useRouter } from "@/i18n/navigation";

export default function BlogSlider({
  data,
  locale,
}: {
  data: PostInterface[];
  locale: Locales;
}) {
  const t = useTranslations();
  const [currentSlide, setCurrentSlide] = useState(0);
  const slider = useRef<Slider>(null);
  const router = useRouter()
  const [settings, setSettings] = useState<Settings | null>(null);
  const [width, setWidth] = useState<number | null>(null);
  useEffect(() => {
    const getWidth = () => {
      setWidth(window.innerWidth);
    };
    window.addEventListener("resize", getWidth);
    return () => {
      window.removeEventListener("resize", getWidth);
    };
  }, []);
  useEffect(() => {
    if (window.innerWidth < 480) {
      setSettings({
        infinite: false,
        dots: false,

        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        pauseOnHover: true,
        arrows: false,
        className: "videoSlidre",
        afterChange: (current: number) => {
          setCurrentSlide(current);
        },
      });
    } else if (window.innerWidth < 600) {
      setSettings({
        infinite: false,
        dots: false,

        speed: 500,
        slidesToShow: 2,
        slidesToScroll: 1,
        pauseOnHover: true,
        arrows: false,
        className: "videoSlidre",
        afterChange: (current: number) => {
          setCurrentSlide(current);
        },
      });
    } else if (window.innerWidth < 1024) {
      setSettings({
        infinite: false,
        dots: false,

        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        pauseOnHover: true,
        arrows: false,
        className: "videoSlidre",
        afterChange: (current: number) => {
          setCurrentSlide(current);
        },
      });
    } else {
      setSettings({
        infinite: false,
        dots: false,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        pauseOnHover: true,
        arrows: false,
        className: "videoSlidre",
        afterChange: (current: number) => {
          setCurrentSlide(current);
        },
      });
    }
  }, [width]);

  return (
    <div className={styles.sliderWrapper}>
      <Slider ref={slider} {...settings}>
        {data.map((item) => (
          <div className={styles.slide} key={item._id} onClick={()=>router.push('/'+item.slug)}>
            <div className={styles.wrapper}>
              <div className={styles.imageWrapper}>
                <Image
                  src={item.featured_media_paths[0]}
                  width={300}
                  height={200}
                  alt="banner"
                />
              </div>
              <div className={styles.textContent}>
                <h3 className={styles.postTitle}>
                  {item.title[locale] || item.title["am"]}
                </h3>
                {/* <p className={styles.content}>
            {post.content[locale]?.substring(0, 200) ||
              post.content["am"].substring(0, 200)}
            ...
          </p> */}
                <p className={styles.views}>
                  {item.views} {t("views")}
                </p>
              </div>
            </div>
          </div>
        ))}
      </Slider>
      <div>
        {" "}
        <IconButton
          onClick={() => slider.current?.slickGoTo(currentSlide - 1)}
          disabled={currentSlide === 0}
        >
          <ArrowBackRounded />
        </IconButton>
        <IconButton
          onClick={() => {
            console.dir(slider.current);
            slider.current?.slickGoTo(currentSlide + 1);
          }}
          disabled={
            currentSlide ===
            data.length -
              (slider.current &&
                // @ts-expect-error breakpoin error
                (slider.current.state.breakpoint
                  ? // @ts-expect-error breakpoin error
                    slider.current.props.responsive.find(
                      (item) =>
                        // @ts-expect-error breakpoin error
                        item.breakpoint === slider.current.state.breakpoint
                      // @ts-expect-error breakpoin error
                    )?.settings.slidesToShow
                  : slider.current.props.slidesToShow))
          }
        >
          {" "}
          <ArrowForwardRounded />
        </IconButton>
      </div>
    </div>
  );
}
