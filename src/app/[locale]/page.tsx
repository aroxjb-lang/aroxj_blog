import Image from "next/image";
import styles from "./page.module.css";
import { getTranslations } from "next-intl/server";
import { getTopPost } from "../lib/actions";
import Hero from "../components/Hero";
export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const t = await getTranslations();
  const { locale } = await params;
  const data = await getTopPost({ limit: 20, page: 1 });
  const heroData = data.data.slice(0, 5);
  console.log(data);
  return (
    <div className={styles.page}>
      <Hero data={heroData} locale={locale} />
    </div>
  );
}
