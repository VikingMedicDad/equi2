import React, { useState, useRef } from 'react';
import { 
	FilterOutlined,
} from '@ant-design/icons';
import { AutoComplete, Input } from 'antd';


const SearchInput = props => {
	const { active, close, isMobile, mode, onSearchResult } = props
	const [value, setValue] = useState('');
	const [options, setOptions] = useState([])
	const inputRef = useRef(null);

	const onSelect = () => {
		setValue('')
		setOptions([])
		if(close) {
			close()
		}
  };

	const onSearch = searchText => {
		setValue(searchText)
		setOptions(!searchText ? [] : [])
		onSearchResult(searchText);
	};
	
	const autofocus = () => {
		inputRef.current.focus();
	}

	if(active) {
		autofocus()
	}

	return (
		<AutoComplete
			ref={inputRef} 
			className={`nav-search-input ${isMobile? 'is-mobile' : ''} ${mode === 'light' ? 'light' : ''}`}
			dropdownClassName="nav-search-dropdown"
			options={options}
			onSelect={onSelect}
			onSearch={onSearch}
			value={value}
			filterOption={(inputValue, option) => 
				option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
			}
		>
			<Input placeholder="Filter results..."  prefix={<FilterOutlined className="mr-0" />} />
		</AutoComplete>
	)
}

export default SearchInput
