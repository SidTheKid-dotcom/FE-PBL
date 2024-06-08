import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { useDropzone } from 'react-dropzone';

import Categories from "./Categories";
import ActionSuccessful from "./ActionSuccessful";

export default function AddCard() {

    const [itemInfo, setItemInfo] = useState(['', [], 0]);
    const [uploadedImage, setUploadedImage] = useState(null);
    const [displayImage, setDisplayImage] = useState(null);
    const [allFilled, setAllFilled] = useState(true);

    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);

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

    const addItem = async () => {
        try {
            const token = localStorage.getItem('token');

            const formData = new FormData();
            formData.append('title', itemInfo[0]);
            formData.append('wrappedIngredients', JSON.stringify(itemInfo[1]));
            formData.append('price', itemInfo[2]);
            formData.append('categoryID', selectedCategory._id);
            formData.append('image', uploadedImage);

            await axios.post(`http://localhost:3000/api/v1/admin/addMenuItem`, formData,
                {
                    headers: {
                        'Authorization': token,
                        'Content-Type': 'multipart/form-data'
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

    const onDrop = useCallback(async (acceptedImage) => {
        const file = acceptedImage[0];
        setUploadedImage(file);

        const isImage = file.type.startsWith('image/');

        if (isImage) {
            const reader = new FileReader();
            reader.onload = () => setDisplayImage(reader.result);
            reader.readAsDataURL(file);
        } else {
            setDisplayImage(null);
            console.error(`Unsupported file type: ${file.type}`);
        }

    }, [uploadedImage]);
    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:3000/api/v1/admin/getCategories', {
                    headers: {
                        'Authorization': token
                    }
                });
                setCategories(response.data.categories);
            } catch (error) {
                console.error('Error fetching categories:', error.message);
            }
        };

        fetchCategories();

    }, []);

    useEffect(() => {

        const checkAllFilled = () => {

            const hasEmptyIngredient = itemInfo[1].some(ingredient => ingredient === "< Enter Ingredient >" || ingredient === "");
            const hasEmptyTitle = itemInfo[0] === '';
            const hasEmptyPrice = itemInfo[2] === '';

            setAllFilled(!hasEmptyIngredient && !hasEmptyTitle && !hasEmptyPrice);
        }

        checkAllFilled();

    }, [itemInfo])

    useEffect(() => {
        if (sendRequest) {
            const timeoutID = setTimeout(() => {
                addItem();
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
                        <input className="mt-2 p-2 bg-transparent border border-solid border-black rounded-md" placeholder={"< Enter Title >"} onChange={(e) => updateItemInfo(e, 0)}></input>
                    </section>
                    <section className="m-2">
                        <h1>Select Category:</h1>
                        <Categories
                            categories={categories}
                            selectedCategory={selectedCategory}
                            setSelectedCategory={setSelectedCategory}
                        />
                    </section>
                    <section className="m-2 min-w-[237.6px]">
                        <h1>Ingredients:</h1>
                        <RenderIngredients ingredients={itemInfo[1]} updateIngredient={updateIngredient} deleteIngredient={deleteIngredient} addIngredient={addIngredient} />
                    </section>
                    <section className="m-2">
                        <h1>Price:</h1>
                        <input className="mt-2 p-2 bg-transparent border border-solid border-black rounded-md" placeholder={"< Enter Price >"} onChange={(e) => updateItemInfo(e, 2)}></input>
                    </section>
                    <section className="m-2">
                        <h2>Upload Image: </h2>
                        <div {...getRootProps({ className: 'dropzone' })} className="w-[197px]">
                            <input {...getInputProps()} />
                            {(uploadedImage && displayImage) ? (
                                <img src={displayImage} alt="Uploaded" width="150px" />
                            )
                                : (
                                    < div className="mt-2 p-10 w-full h-[40%] flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg"><img src="/cloud-arrow-up-solid.svg" alt="Tick" width="80px"></img>Drag & Drop</div>
                                )
                            }
                        </div>
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
        else {
            return <ActionSuccessful action="added" />
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
