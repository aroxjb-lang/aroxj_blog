import SocialMediaPage from "@/app/components/AdminsComponents/socialMediaPage";
import { getSocials } from "@/app/lib/actions/socialMedias";
import React from "react";

export default async function Socials() {
  const data = await getSocials();

  return <SocialMediaPage data={data}/>;
}
