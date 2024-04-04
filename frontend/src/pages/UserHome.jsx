import axios from 'axios'
import { useState, useEffect } from "react"

import UserMenuItem from '../components/UserMenuItem'
import Cart from '../components/Cart'

export default function UserHome() {

    const [menu, setMenu] = useState([]);
    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {

        const fetchData = async () => {

            try {
                const token = localStorage.getItem('token');

                const response = await axios.get("http://localhost:3000/api/v1/user/home", {
                    headers: {
                        'Authorization': token,
                        'Content-Type': 'application/json'
                    }
                })

                setMenu(response.data.menu);
            }
            catch (error) {
                console.log("Error in fetching menu items")
            }
        }

        fetchData();

        return () => {
            setMenu([]);
        }

    }, [])

    useEffect(() => {

        let sum = 0;
        cart.map(menuItem => {
            sum += menuItem.item.price * menuItem.quantity;
        })

        setTotal(sum);

    }, [cart])

    return (
        <div className='grid grid-cols-12 gap-6 min-h-[100vh] h-full'>
            <section className='col-span-8 flex flex-col items-center'>
                <div className='m-4 flex flex-col items-center h-full w-[80%] rounded-md'>
                    {
                        menu.map(item => (
                            <UserMenuItem key={item._id} item={item} cart={cart} setCart={setCart} />
                        ))
                    }
                </div>
            </section>
            <div className='col-span-4 mt-[1px] bg-slate-100'>
                <div className='m-4 p-4 min-h-[150px] flex flex-col items-center rounded-lg border border-solid border-gray-400'>
                    <h1 className='font-bold text-slate-700'>My Order</h1>
                    <div>
                        <Cart cart={cart} />
                    </div>
                    <div className='mt-4'>
                        <Total total={total} />
                    </div>
                    <Pay />
                </div>
            </div>
        </div>
    );
}

function Total({ total }) {
    return <div className='text-black font-bold'>Total: {total}</div>
}

function Pay() {
    return <button className="m-4 px-8 py-2 font-bold bg-orange-400 rounded-lg">Proceed to Pay</button>
}