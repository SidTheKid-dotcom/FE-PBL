import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"

export default function UserNavbar() {

    const location = useLocation();

    const [pathname, setPathname] = useState('');

    useEffect(() => {
        setPathname(location.pathname.split('/')[2].split('-').join(' '));
    }, [location])

    return (
        <section className="sticky top-0 p-4 grid grid-cols-12 gap-10 bg-slate-100 font-bold text-gray-700">

            {/* <figure className="flex justify-center col-span-2">
                <img title="Company logo" alt="Company Logo"></img>
            </figure> */}
            <h1 className="ml-2 flex justify-center col-span-2 font-bold">ProRestro.</h1>

            <div className="flex justify-center col-span-8">{pathname}</div>

            <button className="ml-10 flex items-center justify-center col-span-2">
                <figure>
                    <img src="/user-solid.svg" title="User" alt="User" className="h-[18px]"></img>
                </figure>
                <h1 className="ml-3">USER</h1>
            </button>

        </section>
    )
}