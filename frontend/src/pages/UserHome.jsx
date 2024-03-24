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
        <div>
            <section>
                {
                    menu.map(item => (
                        <UserMenuItem key={item._id} item={item} cart={cart} setCart={setCart} />
                    ))
                }
            </section>
            <div className="w-[20%]">
                <Cart cart={cart} />
            </div>
            <Total total={total} />
            <Pay />
        </div>
    );
}

function Total({ total }) {
    return <div>Total: {total}</div>
}

function Pay() {
    return <button className="m-4 px-8 py-2 font-bold bg-orange-400 rounded-lg">Proceed to Pay</button>
}