import { useCallback, useEffect, useState } from "react";
import { useDropzone } from 'react-dropzone';
import axios from "axios";
import { useLocation, useParams } from "react-router-dom";
import Categories from "./Categories";
import ActionSuccessful from "./ActionSuccessful";
import LoadingSpinner from "../assets/animations/LoadingSpinner";

export default function EditCard() {
    const location = useLocation();
    const { item } = location.state;
    const { itemID } = useParams();

    const [itemInfo, setItemInfo] = useState([item.title, item.ingredients, item.price]);
    const [itemCategory, setItemCategory] = useState(item.category);
    const [categories, setCategories] = useState([]);
    
    const [uploadedImage, setUploadedImage] = useState(item.imageUrl);
    const [displayImage, setDisplayImage] = useState(item.imageUrl);
    const [imageChanged, setImageChanged] = useState(false);

    const [allFilled, setAllFilled] = useState(true);
    const [sendRequest, setSendRequest] = useState(false);
    const [requestSuccess, setRequestSuccess] = useState(false);

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

    const handleUpdateClick = () => {
        setSendRequest(!sendRequest);
    };

    const updateItem = async () => {

        const formData = new FormData();
        formData.append('itemID', itemID);
        formData.append('title', itemInfo[0]);
        formData.append('category', itemCategory._id);
        formData.append('wrappedIngredients', JSON.stringify(itemInfo[1]));
        formData.append('price', itemInfo[2]);

        if (imageChanged) {
            formData.append('image', uploadedImage);
        }
        else {
            formData.append('imageURL', uploadedImage);
        }

        console.log(uploadedImage);

        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:3000/api/v1/admin/updateMenuItem`, formData,
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

    const updateItemInfo = (e, index) => {
        const newInfo = [...itemInfo];
        newInfo[index] = e.target.value;
        setItemInfo(newInfo);
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

    const onDrop = useCallback(async (acceptedFiles) => {
        const file = acceptedFiles[0];
        setUploadedImage(file);

        const reader = new FileReader();
        reader.onload = () => {
            setDisplayImage(reader.result);
        };

        reader.readAsDataURL(file);
        setImageChanged(true);

    }, [uploadedImage]);
    

    const { getRootProps, getInputProps } = useDropzone({ onDrop });
    
    if (sendRequest) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <LoadingSpinner />
            </div>
        );
    }

    {
        if (!requestSuccess) {
            return (
                <div className="m-4 p-2 flex flex-col justify-center items-center min-w-[100px] w-[30%] min-h-[200px] bg-slate-100 text-black rounded-md">
                    <section className="m-2">
                        <h1>Item name:</h1>
                        <input className="mt-2 p-2 bg-transparent border border-solid border-black rounded-md" value={`${itemInfo[0]}`} onChange={(e) => updateItemInfo(e, 0)}></input>
                    </section>
                    <section className="m-2">
                        <h1>Select Category:</h1>
                        <Categories
                            categories={categories}
                            selectedCategory={itemCategory}
                            setSelectedCategory={setItemCategory}
                        />
                    </section>
                    <section className="m-2 min-w-[237.6px]">
                        <h1>Ingredients:</h1>
                        <RenderIngredients ingredients={itemInfo[1]} updateIngredient={updateIngredient} deleteIngredient={deleteIngredient} addIngredient={addIngredient} />
                    </section>
                    <section className="m-2">
                        <h1>Price:</h1>
                        <input className="mt-2 p-2 bg-transparent border border-solid border-black rounded-md" value={`${itemInfo[2]}`} onChange={(e) => updateItemInfo(e, 2)}></input>
                    </section>

                    <section {...getRootProps({ className: 'dropzone' })}>
                        <h1>Image:</h1>
                        <input {...getInputProps()} />
                        {displayImage && (
                            <img src={displayImage.toString()} alt="Uploaded" width="150px" />
                        )}
                        {(!displayImage) && (
                            <div className="w-full min-h-[250px] flex flex-col items-center justify-center border-4 border-dashed border-gray-600 rounded-[7px]">
                                <img src="/image-regular.svg" alt="Tick" width="70px" />
                                <span className="mt-3 p-2 text-white text-center text-xl">
                                    Drag & Drop your images or videos here
                                </span>
                                <span className="p-2 text-gray-500 text-center text-md">
                                    or{" "}
                                    <u className="cursor-pointer text-white">browse</u> from gallery
                                </span>
                            </div>
                        )}
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
                    <input
                        className="mb-2 p-2 w-full bg-transparent border border-solid border-black rounded-md"
                        placeholder={ingredient === "< Enter Ingredient >" ? "< Enter Ingredient >" : ""}
                        value={ingredient !== "< Enter Ingredient >" ? ingredient : ""}
                        onChange={(e) => updateIngredient(e, index)}
                    />
                </div>
            ))}
            <button className="pl-1 text-blue-500 text-sm text-left underline" onClick={addIngredient}>Add ingredient</button>
        </div>
    );
};
