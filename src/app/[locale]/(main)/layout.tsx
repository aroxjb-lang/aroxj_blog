import Header from "../../components/Header";
import { Suspense } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Loading from "./loading";
import Footer from "../../components/footer";
import { getSocials } from "@/app/lib/actions/socialMedias";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
   const socialMedias=await getSocials()
  return (
    <>
      <Header />
      <Suspense fallback={<Loading />}>{children}</Suspense>
      <Footer socialMedias={socialMedias}/>
    </>
  );
}
