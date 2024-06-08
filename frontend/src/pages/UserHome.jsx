import axios from 'axios'
import { useState, useEffect } from "react"

import Categories from "../components/Categories"
import UserMenuItem from '../components/UserMenuItem'
import Cart from '../components/Cart'

export default function UserHome() {

    const [menu, setMenu] = useState([]);
    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);

    const [categories, setCategories] = useState([]);
    const [filterCategory, setFilterCategory] = useState(null);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    useEffect(() => {

        const fetchData = async () => {

            try {
                const token = localStorage.getItem('token');

                const response = await axios.get("http://localhost:3000/api/v1/user/home", {
                    params: {
                        filter: filterCategory
                    },
                    headers: {
                        'Authorization': token,
                        'Content-Type': 'application/json'
                    }
                });

                setMenu(response.data.menu);
                setCategories(response.data.categories);
            }
            catch (error) {
                console.log("Error in fetching menu items")
            }
        }

        fetchData();

        return () => {
            setMenu([]);
            setCategories([]);
        }

    }, [filterCategory])

    useEffect(() => {

        let sum = 0;
        cart.map(cartItem => {
            sum += cartItem.menuItem.price * cartItem.quantity;
        })

        setTotal(sum);

    }, [cart])

    const handleRemoveFilter = () => {
        setFilterCategory(null);
    }

    return (
        <div className='relative grid grid-cols-12 gap-6 min-h-[100vh] h-full'>
            <section className='absolute top-0 left-0'>
                <Categories
                    categories={categories}
                    selectedCategory={filterCategory}
                    setSelectedCategory={setFilterCategory}
                />
                {
                    filterCategory && <button onClick={handleRemoveFilter} className='bg-red-200 p-2 rounded-md'>Discard</button>
                }
            </section>
            <section className='col-span-8 flex flex-col items-center'>
                <div className='m-4 flex flex-col items-center h-full w-[80%] rounded-md'>
                    {
                        menu.map(menuItem => (
                            <UserMenuItem key={menuItem._id} menuItem={menuItem} cart={cart} setCart={setCart} />
                        ))
                    }
                </div>
            </section>
            <div className='col-span-4 mt-[1px] bg-slate-100'>
                <div className='m-4 p-4 min-h-[150px] flex flex-col items-center rounded-lg border border-solid border-gray-400'>
                    <h1 className='font-bold text-slate-700'>My Order</h1>
                    <div>
                        <Cart cart={cart} setCart={setCart} />
                    </div>
                    <div className='mt-4'>
                        <Total total={total} />
                    </div>
                    <Pay cart={cart} total={total} />
                </div>
            </div>
        </div>
    );
}

function Total({ total }) {
    return <div className='text-black font-bold'>Total: {total}</div>
}

function Pay({ cart, total }) {

    const [orderID, setOrderID] = useState('');

    const handlePayment = async () => {

        try {
            const token = localStorage.getItem('token');

            const options = {
                key: 'rzp_test_YuGrLzykusvpEM', // Enter the Key ID generated from the Dashboard
                amount: total * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
                currency: "INR",
                name: "ProRestro.",
                description: "Test Transaction",
                image: "https://example.com/your_logo",
                order_id: orderID, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
                handler: async function (response) {

                    const res = await axios.post(`http://localhost:3000/api/v1/user/confirmPayment`,
                        {
                            order: {
                                orderID: Date.now(),
                                tokenNo: Date.now(),
                                items: cart,
                                price: total,
                                status: 'Pending',
                            }
                        },
                        {
                            headers: {
                                'Authorization': token,
                                'Content-Type': 'application/json'
                            }
                        });

                    setOrderID(res.data.orderID);

                    location.href = '/user/Todays-Menu';
                },
                prefill: {
                    "name": "Gaurav Kumar",
                    "email": "gaurav.kumar@example.com",
                    "contact": "9000090000"
                },
                notes: {
                    "address": "Razorpay Corporate Office"
                },
                theme: {
                    "color": "#f09951"
                }
            };

            // Create a new instance of Razorpay
            const rzp1 = new Razorpay(options);

            // Open the Razorpay checkout modal
            rzp1.open();
        }
        catch (error) {
            console.error('Error updating item:', error.message);
        }
    }

    return <button onClick={handlePayment} className="m-4 px-8 py-2 font-bold bg-orange-400 rounded-lg">Proceed to Pay</button>
}