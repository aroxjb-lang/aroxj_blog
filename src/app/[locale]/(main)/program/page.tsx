import PageComponent from '@/app/components/PageComponent';
import { getTopPost } from '@/app/lib/actions/posts';
import { Locales } from '@/app/lib/schemas';
import React from 'react'

export default async function Program({params}:{params:Promise<{locale:Locales}>}) {
    const { data } = await getTopPost({ limit: 47, page: 1 });
    const {locale}= await params
  
  return <div><PageComponent data={data} locale={locale}/></div>;
}