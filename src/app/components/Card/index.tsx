import React from 'react';
import styles from './styles.module.css';
import Image from 'next/image';

import {Locales, PostInterface} from '@/app/lib/schemas';
import {useTranslations} from 'next-intl';
import Link from 'next/link';
import cls from 'classnames';
import {addZero} from '@/app/lib/utilits';

export default function Card({
                                 locale, post,
                             }: {
    locale: Locales; post: PostInterface;
}) {
    const t = useTranslations();
    const date = new Date(post.updatedAt ? (post.publishing_date && new Date(post.publishing_date).getTime() > new Date(post.updatedAt).getTime() ? post.publishing_date : post.updatedAt) : (post.publishing_date ? post.publishing_date : post.date));
    return (<Link href={post.slug}>
        <div className={styles.wrapper}>
            <div className={styles.imageWrapper}>
                { !!(Array.isArray(post.featured_media_paths) ? post.featured_media_paths[0] : post.featured_media_paths)&&<Image
                    src={'/wp-content/'+ (Array.isArray(post.featured_media_paths) ? post.featured_media_paths[0] : post.featured_media_paths)}
                    width={300}
                    height={200}
                    alt="banner"
                />}
            </div>
            <div className={styles.textContent}>
                <h3 className={styles.postTitle}>
                    {post.title[locale] || post.title['am']}
                </h3>
                {/* <p className={styles.content}>
            {post.content[locale]?.substring(0, 200) ||
              post.content["am"].substring(0, 200)}
            ...
          </p> */}
                <p className={styles.views}>
                    {post.views} {t('views')}
                </p>
                <p className={cls(styles.views, {[styles.unpublished]: post.publishing_date && new Date(post.publishing_date).getTime() > new Date().getTime()})}>
                    {addZero(date.getDate())} {date.toLocaleString(locale === 'am' ? 'hy' : locale, {month: 'long'}).toUpperCase()}{' '}{date.getFullYear()}{' '}{addZero(date.getHours())}:{addZero(date.getMinutes())}
                </p>

            </div>
        </div>
    </Link>);
}
