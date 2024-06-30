import { useNavigate } from "react-router-dom";

export default function AdminMenuItems({ item }) {

    const navigate = useNavigate();

    function editItem() {
        navigate(`/admin/editItem/${item._id}`, { state: { item: item } });
    }

    function deleteItem() {
        navigate('/admin/confirmDelete/'+item._id+'/'+item.title)
    }

    return (
        <div className="m-4 p-4 w-full min-h-[170px] grid grid-cols-12 bg-slate-100 text-black border border-solid border-gray-300 rounded-lg">
            <section className="col-span-4">
                <figure className="w-[80%] h-auto bg-purple-200 border border-solid border-black">
                    <img src={item.imageUrl} className="h-fill"></img>
                </figure>
            </section>
            <section className="col-span-5 text-sm">
                <h1 className="ml-[-15px] font-bold text-xl">{item.title}</h1>
                { /* The columns depends on screen size so modify it later */}
                {renderIngredients(item.ingredients, 2)}
            </section>
            <section className="col-span-3 flex flex-col text-center">
                <span className="font-bold text-lg">₹ {item.price}</span>
                <section className="h-full flex flex-col justify-end">
                    <button onClick={editItem} className="m-1 p-2 rounded-lg bg-yellow-300">Edit</button>
                    <button onClick={deleteItem} className="m-1 p-2 rounded-lg bg-red-400">Delete</button>
                </section>
            </section>
        </div>
    )
}

const renderIngredients = (ingredients, columns) => {
    
    const totalIngredients = ingredients.length;
    const midPoint = Math.floor((totalIngredients + 2) / 2);

    const firstHalf = ingredients.slice(0, midPoint);
    const secondHalf = ingredients.slice(midPoint);

    return (
        <div className={`mt-4 grid grid-cols-4 gap-8 w-[70%]`}>
            <div className="col-span-2">
                {
                    firstHalf.map((item, index) => {
                        return <ul key={index} className="list-disc">
                            <li>{item}</li>
                        </ul>
                    })
                }
            </div>
            <div className="col-span-2">
                {
                    secondHalf.map((item, index) => {
                        return <ul key={index} className="list-disc">
                            <li>{item}</li>
                        </ul>
                    })
                }
            </div>
        </div>
    )
};