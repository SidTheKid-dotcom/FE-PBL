import { useState } from "react";
import axios from "axios";

export default function CategoryItem({ category, setCategories, isEditing, setEditingId }) {
    const [name, setName] = useState(category.name);

    const handleChange = (e) => {
        setName(e.target.value);
    };

    function toggleEdit() {
        setEditingId(category._id);
    }

    async function toggleDelete() {
        try {
            const token = localStorage.getItem('token');

            const response = await axios.delete(`http://localhost:3000/api/v1/admin/deleteCategory/${category._id}`, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                const deletedCategoryId = response.data.category._id;
                setCategories(prevCategories => prevCategories.filter(category => category._id !== deletedCategoryId));
            }
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    }

    async function submitCategory() {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`http://localhost:3000/api/v1/admin/updateCategory/${category._id}`,
                { category: name },
                {
                    headers: {
                        'Authorization': token,
                        'Content-Type': 'application/json'
                    }
                });

            if (response.status === 200) {
                setEditingId(null);
                console.log('Category updated');
            }
        } catch (error) {
            console.error('Error updating category:', error);
        }
    }

    return (
        <div className={`flex flex-col m-4 p-4 w-[300px] bg-slate-100 text-black border border-solid border-gray-300 rounded-lg transition-all ease-in-out duration-300 ${isEditing ? 'py-8' : 'py-4'}`}>
            <div className="flex justify-between items-center">
                {isEditing ? (
                    <input value={name} onChange={handleChange} className="m-1 p-2 rounded-lg font-bold text-xl w-[60%]" />
                ) : (
                    <span className="max-w-[170px] font-bold text-xl">{name}</span>
                )}
                {isEditing ? (
                    <button onClick={submitCategory} disabled={!name} className={`m-1 px-4 py-2 rounded-lg ${name ? 'bg-green-300' : 'bg-gray-300 cursor-not-allowed'}`}>Done</button>
                ) : (
                    <div>
                        <button onClick={toggleEdit} className="m-1 px-4 py-2 rounded-lg bg-blue-300">Edit</button>
                        <button onClick={toggleDelete} className="m-1 px-4 py-2 rounded-lg bg-red-300"><img src='/trash-solid.svg' alt='Delete Category' width='15px'></img></button>
                    </div>
                )}
            </div>
            {!name && isEditing && (
                <div className="text-red-500">
                    * Category name cannot be empty
                </div>
            )}
        </div>
    );
}
