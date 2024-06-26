import axios from 'axios'
import { useState, useEffect } from "react"

import Categories from "../components/Categories"
import UserMenuItem from '../components/UserMenuItem'
import Cart from '../components/Cart'
import LoadingSpinner from "../assets/animations/LoadingSpinner";

export default function UserHome() {

    const [menu, setMenu] = useState([]);
    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [transition, setTransition] = useState(true);

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

        setLoading(true);

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
                setLoading(false);
                setTimeout(() => setTransition(false), 500);
            }
            catch (error) {
                console.log("Error in fetching menu items")
                setLoading(false);
                setTransition(false);
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
        <div className='relative grid grid-cols-12 gap-6 min-h-[100vh] h-full w-full transition-opacity duration-300' style={{ opacity: loading ? 0.5 : 1 }} >

            <section className='col-span-8 flex flex-col items-center'>
                <div className='w-[80%] ml-[2rem] sticky top-[3.5rem] z-10 grid grid-cols-12 bg-slate-200'>
                    <section className='col-span-7'>
                        <h1 className='mt-[1rem] text-3xl p-4 font-bold'>{filterCategory ? filterCategory.name : 'All Items'}</h1>
                    </section>
                    <section className='mb-[-0.5rem] col-span-5 justify-end w-full py-3 mt-[1rem] flex flex-row gap-5 items-center'>
                        <Categories
                            categories={categories}
                            selectedCategory={filterCategory}
                            setSelectedCategory={setFilterCategory}
                        />
                        {filterCategory && (
                            <button
                                onClick={handleRemoveFilter}
                                className='bg-red-200 p-2 rounded-md z-10'
                                style={{ position: 'relative' }}
                            >
                                Discard
                            </button>
                        )}
                    </section>
                </div>
                <div className={`w-[80%] transition-opacity duration-300 ${transition ? 'opacity-0' : 'opacity-100'}`}>
                    {
                        loading && menu.length === 0 ? (
                            <div className='h-screen w-full mt-[-5rem] flex flex-col justify-center items-center'>
                                <LoadingSpinner />
                            </div>
                        ) : (
                            menu.length > 0 ? menu.map(menuItem => (
                                <UserMenuItem key={menuItem._id} menuItem={menuItem} cart={cart} setCart={setCart} />
                            )) : (
                                <div className='mt-[-6rem] h-screen w-full flex flex-col justify-center items-center'>
                                    <figure className='py-4 px-10 border-2 border-dashed border-gray-400 rounded-lg'>
                                        <img src='/no-item-found.svg' alt='No items found' width='100px'></img>
                                    </figure>
                                    <h1 className='font-bold text-xl m-2'>No items found</h1>
                                    <button onClick={() => setFilterCategory(null)}><u>Go Back</u></button>
                                </div>
                            )
                        )
                    }
                </div>
            </section>
            <div className='col-span-4 w-[25%] mt-[1px] bg-slate-100 fixed top-[6.5%] right-0 h-full'>
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