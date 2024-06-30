import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Categories from '../components/Categories';
import AdminMenuItem from '../components/AdminMenuItem';
import LoadingSpinner from '../assets/animations/LoadingSpinner';

export default function AdminHome() {
  const navigate = useNavigate();

  const [menu, setMenu] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filterCategory, setFilterCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [transition, setTransition] = useState(true);

  const addMenuItem = () => {
    navigate('/admin/addItem');
  };

  const handleRemoveFilter = () => {
    setFilterCategory(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');

        const response = await axios.get('http://localhost:3000/api/v1/admin/home', {
          params: {
            filter: filterCategory,
          },
          headers: {
            Authorization: token,
            'Content-Type': 'application/json',
          },
        });

        setMenu(response.data.menu || []); // Ensure menu is always an array
        setCategories(response.data.categories || []); // Ensure categories is always an array
        setLoading(false);
        setTimeout(() => setTransition(false), 500); // End transition after 500ms
      } catch (error) {
        console.log('Error in fetching menu items');
        setLoading(false);
        setTransition(false);
      }
    };

    fetchData();
  }, [filterCategory]);

  return (
    <div className='w-[50%] flex flex-col items-center'>
      <div className='grid grid-cols-12'>
        <button
          className={`col-span-7 w-[300px] m-4 p-2 bg-orange-400 rounded-md font-bold ${loading ? 'opacity-50 pointer-events-none' : ''}`}
          onClick={addMenuItem}
          disabled={loading || menu.length === 0} // Disable button when loading or menu is empty
        >
          Add Item
        </button>
        <section className='col-span-5 text-center flex flex-row gap-2 p-4 items-center justify-center'>
          <Categories categories={categories} selectedCategory={filterCategory} setSelectedCategory={setFilterCategory} />
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
      <div className={`w-full transition-opacity duration-300 ${transition ? 'opacity-0' : 'opacity-100'}`}>
        {loading && menu.length === 0 ? (
          <div className='h-screen w-full mt-[-5rem] flex flex-col justify-center items-center'>
            <LoadingSpinner />
          </div>
        ) : menu.length > 0 ? (
          menu.map((item) => <AdminMenuItem key={item._id} item={item} />)
        ) : (
          <div className='mt-[-6rem] h-screen w-full flex flex-col justify-center items-center'>
            <figure className='py-4 px-10 border-2 border-dashed border-gray-400 rounded-lg'>
              <img src='/no-item-found.svg' alt='No items found' width='100px' />
            </figure>
            <h1 className='font-bold text-xl m-2'>No items found</h1>
            <button
              onClick={() => setFilterCategory(null)}
              className='bg-red-200 p-2 rounded-md z-10'
              style={{ position: 'relative' }}
            >
              Go Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
