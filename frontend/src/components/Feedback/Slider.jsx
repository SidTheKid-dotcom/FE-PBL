import React, { useEffect, useState } from 'react';
import Reaction from './Reaction';

const Slider = ({ value, setValue }) => {
    const [message, setMessage] = useState('Amazing');
  
    const handleChange = (event) => {
      setValue(event.target.value);
    };

    useEffect(() => {
      if(value/25 < 1){
        setMessage('Could Improve 👎');
      }
      else if(value/25 <= 2){
        setMessage('Good 👍');
      }
      else if(value/25 <= 3){
        setMessage('Amazing 🎉');
      }
      else if(value/25 <= 4){
        setMessage('Excellent!! 🚀');
      }
    }, [value])
  
    return (
      <div className='flex flex-col items-center justify-center gap-5'>
        <div>
          <Reaction value={value}/>
        </div>
        <input
          type="range"
          min="1"
          max="100"
          value={value}
          onChange={handleChange}
          style={{ width: '50%'}}
        />
        <p className='mt-[1rem] font-bold text-xl bg-gray-300 px-[2rem] py-[0.5rem] rounded-lg'>{message}</p>
      </div>
    );
  };
  
  export default Slider;
  