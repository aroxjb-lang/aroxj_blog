import AboutUsPage from '@/app/components/AdminsComponents/AboutUsPage'
import { getAboutUs } from '@/app/lib/actions/aboutUs'
import React from 'react'

export default async function AboutUs() {
  const data= await getAboutUs()
  
  return (
    <AboutUsPage data={data}/>
  )
}
