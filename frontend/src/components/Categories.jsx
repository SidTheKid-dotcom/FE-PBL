import React, { memo } from 'react';
import Select, { components } from 'react-select';
import { FixedSizeList as List } from 'react-window';

// Custom MenuList component using react-window for virtualization
const height = 35; // Item height

const MenuList = (props) => {
  const { options, children, maxHeight, getValue, selectOption } = props;
  const [value] = getValue();
  const initialOffset = options.indexOf(value) * height;

  return (
    <components.MenuList {...props}>
      <List
        height={maxHeight}
        itemCount={children.length}
        itemSize={height}
        initialScrollOffset={initialOffset}
      >
        {({ index, style }) => (
          <div
            style={style}
            onClick={() => selectOption(children[index].props.data)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                selectOption(children[index].props.data);
              }
            }}
            role="option"
            tabIndex={0}
            aria-selected={options[index] === value ? 'true' : 'false'}
          >
            {options[index].name}
          </div>
        )}
      </List>
    </components.MenuList>
  );
};

const Categories = memo(({ categories, selectedCategory, setSelectedCategory }) => (
  <Select
    components={{ MenuList }}
    options={categories}
    value={selectedCategory}
    onChange={(selectedOption) => setSelectedCategory(selectedOption)}
    getOptionLabel={(category) => category.name}
    getOptionValue={(category) => category.name}
  />
));

export default Categories;
