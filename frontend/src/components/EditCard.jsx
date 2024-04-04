import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useParams } from "react-router-dom";
import ActionSuccessful from "./ActionSuccessful";

export default function EditCard() {
    const location = useLocation();
    const { item } = location.state;
    const { itemID } = useParams();

    const [itemInfo, setItemInfo] = useState([item.title, item.ingredients, item.price]);
    const [allFilled, setAllFilled] = useState(true);
    const [sendRequest, setSendRequest] = useState(false);
    const [requestSuccess, setRequestSuccess] = useState(false);

    const handleUpdateClick = () => {
        setSendRequest(!sendRequest);
    };

    const updateItemInfo = (e, index) => {
        const newInfo = [...itemInfo];
        newInfo[index] = e.target.value;
        setItemInfo(newInfo);
    };

    const updateItem = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:3000/api/v1/admin/updateMenuItem`, {
                itemID,
                title: itemInfo[0],
                ingredients: itemInfo[1],
                price: itemInfo[2]
            },
                {
                    headers: {
                        'Authorization': token,
                        'Content-Type': 'application/json'
                    }
                });
            setSendRequest(false);
            setRequestSuccess(true);
        } catch (error) {
            console.error('Error updating item:', error.message);
        }
    };

    const updateIngredient = (e, index) => {
        const newIngredients = [...itemInfo[1]];
        newIngredients[index] = e.target.value;
        setItemInfo([itemInfo[0], newIngredients, itemInfo[2]]);
    };

    const deleteIngredient = (index) => {
        const newIngredients = [...itemInfo[1]];
        newIngredients.splice(index, 1);
        setItemInfo([itemInfo[0], newIngredients, itemInfo[2]]);
    }

    const addIngredient = () => {
        const newIngredients = [...itemInfo[1]];
        newIngredients.push("< Enter Ingredient >");
        setItemInfo([itemInfo[0], newIngredients, itemInfo[2]]);
    }

    useEffect(() => {

        const checkAllFilled = () => {

            const hasEmptyIngredient = itemInfo[1].some(ingredient => ingredient === "< Enter Ingredient >" || ingredient === "");

            setAllFilled(!hasEmptyIngredient);
        }

        checkAllFilled();

    }, [itemInfo[1]])

    useEffect(() => {
        if (sendRequest) {
            const timeoutID = setTimeout(() => {
                updateItem();
            }, 1000);
            return () => clearTimeout(timeoutID);
        }
    }, [sendRequest]);

    {
        if (!requestSuccess) {
            return (
                <div className="m-4 p-2 flex flex-col justify-center items-center min-w-[100px] w-[30%] min-h-[200px] bg-slate-100 text-black rounded-md">
                    <section className="m-2">
                        <h1>Item name:</h1>
                        <input className="mt-2 p-2 bg-transparent border border-solid border-black rounded-md" placeholder={`${itemInfo[0]}`} onChange={(e) => updateItemInfo(e, 0)}></input>
                    </section>
                    <section className="m-2 min-w-[237.6px]">
                        <h1>Ingredients:</h1>
                        <RenderIngredients ingredients={itemInfo[1]} updateIngredient={updateIngredient} deleteIngredient={deleteIngredient} addIngredient={addIngredient} />
                    </section>
                    <section className="m-2">
                        <h1>Price:</h1>
                        <input className="mt-2 p-2 bg-transparent border border-solid border-black rounded-md" placeholder={`${itemInfo[2]}`} onChange={(e) => updateItemInfo(e, 2)}></input>
                    </section>
                    <section className="mt-3 text-center">
                        {
                            !allFilled && (
                                <div className="pl-1 text-xs text-red-500">
                                    Please fill the empty fields
                                </div>)
                        }
                        <button disabled={!allFilled} className={`m-2 p-2 min-w-[100px] rounded-md ${allFilled ? 'bg-green-300' : 'bg-gray-300 cursor-not-allowed'}`} onClick={handleUpdateClick}>Done</button>
                    </section>
                </div>
            );
        }
        else
        {
            return <ActionSuccessful action="updated" />
        }
    }
}

const RenderIngredients = ({ ingredients, updateIngredient, deleteIngredient, addIngredient }) => {

    return (
        <div className={`mt-2 w-full flex flex-col justify-center`}>
            {ingredients.map((ingredient, index) => (
                <div key={index} className="relative">
                    <button className="absolute w-[18px] h-[18px] top-2.5 right-3.5" onClick={() => deleteIngredient(index)}>
                        <img src="/trash-solid.svg" alt="Tick"></img>
                    </button>
                    <input className="mb-2 p-2 w-full bg-transparent border border-solid border-black rounded-md" placeholder={`${ingredient}`} onChange={(e) => updateIngredient(e, index)}></input>
                </div>
            ))}
            <button className="pl-1 text-blue-500 text-sm text-left underline" onClick={addIngredient}>Add ingredient</button>
        </div>
    );
};
