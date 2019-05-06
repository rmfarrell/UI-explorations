import React from 'react';
import Dropdown from 'react-dropdown';
import { COUNTRIES } from '../lib/constants';

export default function(props) {
  const { className = '', initialValue = '', onChange = () => {} } = props,
    dropdownOptions = Object.keys(COUNTRIES).map(cc => {
      return {
        value: cc,
        label: COUNTRIES[cc]
      };
    });

  return (
    <Dropdown
      className={className}
      options={dropdownOptions}
      onChange={onChange}
      value={initialValue}
      placeholder="Select an option"
    />
  );
}
