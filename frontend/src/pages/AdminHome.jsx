import axios from 'axios'
import { useState, useEffect } from "react"
import { useNavigate } from 'react-router-dom';

import AdminMenuItem from '../components/AdminMenuItem';

export default function AdminHome() {

    const [menu, setMenu] = useState([]);
    const navigate = useNavigate();

    const addMenuItem = () => {
        navigate('/admin/addItem')
    }

    useEffect(() => {

        const fetchData = async () => {

            try {
                const token = localStorage.getItem('token');

                const response = await axios.get("http://localhost:3000/api/v1/admin/home", {
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

    return (
        <div className='w-[50%] flex flex-col items-center'>
            <button className='m-4 p-2 w-[80%] bg-orange-400 rounded-md font-bold' onClick={addMenuItem}>Add Item</button>
            {
                menu.map(item => (
                    <AdminMenuItem key={item._id} item={item} />
                ))
            }
        </div>
    );
}