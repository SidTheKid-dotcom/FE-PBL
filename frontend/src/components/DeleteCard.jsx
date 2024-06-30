import { useParams, useNavigate } from "react-router-dom"
import axios from "axios";
import { useState } from "react";
import ActionSuccessful from "./ActionSuccessful";
import LoadingSpinner from "../assets/animations/LoadingSpinner";

export default function DeleteCard() {

    const { itemID, itemTitle } = useParams();
    const [loading, setLoading] = useState(false);
    const [deleteSuccess, setDeleteSuccess] = useState(false);

    const deleteItem = async () => {

        try {

            const token = localStorage.getItem('token');
            setLoading(true);

            await axios.delete(`http://localhost:3000/api/v1/admin/deleteMenuItem`, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                },
                data: {
                    itemID: itemID
                }
            });

            setDeleteSuccess(true);
            setLoading(false);
        }
        catch (error) {
            console.error('Error deleting item:', error);
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen" >
                <LoadingSpinner />
            </div>
        )
    }

    if (!deleteSuccess) {

        return (
            <div className="m-4 p-4 w-[40%] min-h-[150px] flex flex-col justify-between items-center bg-slate-100 rounded-lg text-black font-bold">
                <h1>Confrim to Delete</h1>
                <p>Item: {itemTitle}</p>
                <button onClick={deleteItem} className="m-2 p-2 bg-red-300 w-[40%] rounded-lg">Confirm</button>
            </div>
        )
    }
    else {
        return <ActionSuccessful action="deleted" />
    }
}