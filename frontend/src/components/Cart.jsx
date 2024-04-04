import { useEffect } from "react";

export default function Cart({ cart }) {

    return (
        <div>
            {
                cart.map((menuItem, index) => (
                    <div key={index} className="m-4 p-4 relative grid grid-cols-12 border border-solid border-gray-400 text-black rounded-lg">
                        <div className="col-span-2"></div>
                        <div className="col-span-9">{menuItem.item.title}</div>
                        <div className="col-span-1 font-bold">x{menuItem.quantity}</div>
                        <div className="absolute w-[1px] h-full bg-gray-300 right-[50px]"></div>
                    </div>
                ))
            }
        </div>
    );
}
