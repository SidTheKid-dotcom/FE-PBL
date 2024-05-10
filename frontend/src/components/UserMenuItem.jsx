import { useState } from "react";

export default function UserMenuItems({ menuItem, cart, setCart}) {

    const [quantity, setQuantity] = useState(1);

    function addToCart(menuItem) { 

        setQuantity(1);

        if(cart.some(cartItem => cartItem.menuItem == menuItem))
        {
            const updatedCart = cart.map(cartItem => {
                if (cartItem.menuItem === menuItem) {
                    return { ...cartItem, quantity: cartItem.quantity + quantity };
                }
                return cartItem;
            });
            setCart(updatedCart);
            return;
        }

        setCart(prevCart => [...prevCart, {menuItem, quantity}]);
    }

    return (
        <div className="m-4 p-4 w-full min-h-[170px] grid grid-cols-12 bg-slate-100 text-black border border-solid border-gray-300 rounded-lg">
            <section className="col-span-4">
                <figure className="w-[80%] h-auto bg-purple-200 border border-solid border-black">
                    <img src={menuItem.imageUrl} className="h-fill"></img>
                </figure>
            </section>
            <section className="col-span-5">
                <h1 className="ml-[-15px] font-bold text-xl">{menuItem.title}</h1>
                { /* The columns depends on screen size so modify it later */}
                {renderIngredients(menuItem.ingredients, 2)}
            </section>
            <section className="col-span-3 flex flex-col text-center">
                <span className="font-bold text-lg">₹ {menuItem.price}</span>
                <div className="flex flex-col justify-end items-center w-full h-full">
                    <Quantity quantity={quantity} setQuantity={(setQuantity)} />
                    <button onClick={() => addToCart(menuItem)} className="mt-3 p-2 w-[70.5%] text-sm font-bold bg-orange-400 rounded-3xl">Add To Cart</button>
                </div>
            </section>
        </div>
    )
}

const renderIngredients = (ingredients, columns) => {
    const totalIngredients = ingredients.length;
    const midPoint = Math.floor((totalIngredients + 2) / 2);

    const firstHalf = ingredients.slice(0, midPoint);
    const secondHalf = ingredients.slice(midPoint);

    return (
        <div className={`mt-4 grid grid-cols-4 w-[70%]`}>
            <div className="col-span-2">
                {
                    firstHalf.map((item, index) => {
                        return <ul key={index} className="list-disc">
                            <li>{item}</li>
                        </ul>
                    })
                }
            </div>
            <div className="col-span-1"></div>
            <div className="col-span-1">
                {
                    secondHalf.map((item, index) => {
                        return <ul key={index} className="list-disc">
                            <li>{item}</li>
                        </ul>
                    })
                }
            </div>
        </div>
    )
};

function Quantity({ quantity, setQuantity }) {

    const increment = () => { setQuantity(c => c + 1) };
    const decrement = () => { setQuantity(c => (c == 1) ? c : c - 1) }

    return (
        <div className="grid grid-cols-8 min-h-8 w-[70%] h-[25%] border border-solid border-gray-500 rounded">
            <section className="col-span-5 flex justify-center items-center border-r border-solid border-gray-300">
                <h2>Qty</h2>
            </section>
            <section className="col-span-3 flex flex-col justify-center items-center relative">
                <button onClick={decrement} className="absolute h-1/3 w-full top-[-5px] font-light text-gray-600">^</button>
                <h1 className="text-xs w-full text-center">{quantity}</h1>
                <button onClick={increment} className="absolute h-1/3 w-full bottom-[10px] font-light text-gray-600">ᵥ</button>
            </section>
        </div>


    )
}