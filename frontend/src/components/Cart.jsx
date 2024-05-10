export default function Cart({ cart, setCart }) {

    function removeFromCart({ removeItem }) {

        if (removeItem.menuItem.quantity === 1) {
            const updatedCart = cart.filter(cartItem => cartItem.menuItem !== removeItem.menuItem)
            setCart(updatedCart)
        }
        else {

            const updatedCart = cart.map(cartItem => {
                if (cartItem.menuItem === removeItem.menuItem) {
                    return { ...cartItem, quantity: cartItem.quantity - 1 };
                }
                return cartItem;
            });

            setCart(updatedCart);
        }
    }

    return (
        <div>
            {
                cart.map((cartItem, index) => (
                    <div key={index} className="m-4 p-4 w-[225px] relative grid grid-cols-12 border border-solid border-gray-400 text-black rounded-lg">
                        <button className="col-span-2 flex flex-col justify-center" onClick={() => removeFromCart({ cartItem })}><img src='/trash-solid.svg' width='15px'></img></button>
                        <div className="col-span-9">{cartItem.menuItem.title}</div>
                        <div className="col-span-1 font-bold">x{cartItem.quantity}</div>
                        <div className="absolute w-[1px] h-full bg-gray-300 right-[50px]"></div>
                    </div>
                ))
            }
        </div>
    );
}
