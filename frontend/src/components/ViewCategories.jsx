import { useEffect, useState } from "react";
import axios from "axios";
import CategoryItem from "./CategoryItem";
import { Toaster, toast } from "sonner";

export default function ViewCategories() {
    const [categories, setCategories] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [addNew, setAddNew] = useState(false);
    const [newName, setNewName] = useState('');

    useEffect(() => {
        const getCategories = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:3000/api/v1/admin/getCategories', {
                    headers: {
                        'Authorization': token,
                        'Content-Type': 'application/json'
                    }
                });
                setCategories(response.data.categories);
            } catch (error) {
                console.error('Error fetching categories:', error.message);
            }
        };
        getCategories();
    }, []);

    const addCategory = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:3000/api/v1/admin/addCategory', { category: newName }, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            });
            setNewName(null);
            setAddNew(false);
            toast("Category Added Successfully", {
                position: "top-right",
                className:
                    "border border-solid border-green-400",
            });
            setCategories(prevCategories => [...prevCategories, {
                _id: response.data.category._id,
                name: response.data.category.name
            }]);
        } catch (error) {
            console.error('Error adding category:', error);
            toast("Couldn't Add Category", {
                position: "top-right",
                className:
                    "border border-solid border-red-400",
            });
        }
    }

    const handleChange = (e) => {
        setNewName(e.target.value);
    };

    const handleAddCategory = () => {
        setAddNew(true);
    }
    
    const cancelAddingCategory = () => {
        setAddNew(false);
        setNewName('');
    }

    const handleEditing = (id) => {
        setEditingId(prevId => (prevId === id ? null : id));
    };

    return (
        <div>
            <Toaster />
            <div className="bg-slate-200 sticky top-[4rem] z-10 ">
                <button className={`m-4 p-2 w-[350px] rounded-md font-bold ${addNew ? 'bg-gray-300 cursor-not-allowed' : 'bg-orange-400'}`} onClick={handleAddCategory}>Add Category</button>
            </div>
            {
                addNew && (
                    <div className={`flex flex-col m-4 p-4 w-[350px] bg-slate-100 text-black border border-solid border-gray-300 rounded-lg`}>
                        <div className="flex justify-between items-center">
                            <input value={newName} onChange={handleChange} className="m-1 p-2 rounded-lg font-bold text-xl w-[60%]" />
                            <button onClick={addCategory} disabled={!newName} className={`m-1 px-4 py-2 rounded-lg ${newName ? 'bg-green-300' : 'bg-gray-300 cursor-not-allowed'}`}>Done</button>
                            <button onClick={cancelAddingCategory} className={`m-1 px-4 py-2 rounded-lg bg-red-300`}>X</button>
                        </div>
                        {!newName && (
                            <div className="text-red-500">
                                * Category name cannot be empty
                            </div>
                        )}
                    </div>
                )
            }
            {categories.map(category => (
                <CategoryItem
                    key={category._id}
                    category={category}
                    setCategories={setCategories}
                    isEditing={editingId === category._id}
                    setEditingId={handleEditing}
                />
            ))}
        </div>
    );
}
