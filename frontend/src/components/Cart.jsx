export default function Cart({ cart, setCart }) {

    console.log(cart);

    function removeFromCart({ cartItem }) {

        if (cartItem.quantity === 1) {
            const updatedCart = cart.filter(existingItem => existingItem.menuItem._id !== cartItem.menuItem._id)
            setCart(updatedCart)
        }
        else {
            const updatedCart = cart.map(existingItem => {
                if (existingItem.menuItem._id === cartItem.menuItem._id) {
                    return { ...existingItem, quantity: existingItem.quantity - 1 };
                }
                return existingItem;
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
