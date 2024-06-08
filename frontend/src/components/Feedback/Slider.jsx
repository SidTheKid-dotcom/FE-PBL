import React, { useState } from 'react';
import Reaction from './Reaction';

const Slider = () => {
    const [value, setValue] = useState(75); // Initial value
  
    const handleChange = (event) => {
      setValue(event.target.value);
    };
  
    return (
      <div>
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
        <p>Value: {value}</p>
      </div>
    );
  };
  
  export default Slider;
  