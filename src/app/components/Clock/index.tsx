'use client';
import React, {useEffect} from 'react';
import {addZero} from '@/app/lib/utilits';
export default function Clock() {
    const [date, setDate] = React.useState(new Date());
    useEffect(() => {
        const interval=setInterval(()=>setDate(new Date()),1000);
        return () => clearInterval(interval);
    },[])
    return (
        <div style={{width:'100px'}}>{addZero(date.getHours())}:{addZero(date.getMinutes())}:{addZero(date.getSeconds())}</div>
    );
}

