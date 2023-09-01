/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import Select from 'react-select'
import { useState, useEffect } from "react";


const capitalize = (string) => {
  return string.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

const Targeting = ({ nichesAndTags }) => {

  const options = nichesAndTags.map(el => {
    return {
      value: el.niche, label: capitalize(el.niche)
    }
  });

  const [isOpen, setIsOpen] = useState(false);
  const [targetField, setTargetField] = useState(null);
  const [tags, setTags] = useState([])

  const selectedStyle = {
    backgroundColor: '#8383a4',
    outline: 'none',
    color: 'white'
  }

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  function handleFieldChange(selectedOption) {
    setTags([])
    setTargetField(selectedOption)
  }

  function handleTags(e) {
    const tag = e.target.dataset.value
    const isInTags = tags.includes(tag)
    if (!isInTags) {
      setTags(prev => [
        ...prev,
        tag
      ])
    } else {
      const index = tags.indexOf(tag)
      if (index !== -1) {
        setTags(prev => [...prev.slice(0, index), ...prev.slice(index + 1)]);
      }
    }
  }

  const renderTags = () => {

    const target = nichesAndTags.find(el => el.niche === targetField.label);

    return ( <>
      { target.tags.map(el => {
        return (<span 
          data-value={el} 
          onClick={handleTags} 
          style={tags.includes(el) ? selectedStyle : {}}
        >
          {capitalize(el)}
        </span>)
      }) }
    </>);
  };

  console.log(targetField, tags)

  return (<div className='requirementsDiv'>
      <div className='reqsTitle' onClick={toggleAccordion}>
          <div>
              <h1>4/ Audience Targeting</h1>
          </div>
          <div>
              <img src='/arrow.svg' style={{ transform: isOpen ? 'rotate(0deg)' : 'rotate(180deg)' }} />
          </div>
      </div>
      {isOpen && <div className='targetingBodyContainer'>
          <ul>
              <li>After selecting the field, you can refine your audience selection based on specific interests. A range of tags or subfields will appear, enabling you to target more precisely.</li>
              <li>Each post permits targeting of one specific audience segment.</li>
              <li>Select an audience that closely aligns with both your account theme and the content of the post.</li>
          </ul>
          <div className='target-audience-wrapper'>
              <Select
                value={targetField}
                onChange={handleFieldChange}
                options={options}
                theme={(theme) => ({
                  ...theme,
                  colors: {
                  ...theme.colors,
                    primary25: '#e8e8ee',  // color of the option when hovering
                    primary: '#a4a4bb',  // color of the selected option
                  },
                })}
                styles={{
                  option: (provided, state) => ({
                      ...provided,
                      color: state.isSelected ? 'white' : '#1c1c57',
                  }),
                  singleValue: (provided) => {
                      const color = '#1c1c57';
                      return { ...provided, color };
                  }
                }}
              />
          </div>
              { targetField ?
                <div className='sub-fields-wrapper'>
                  {renderTags()}
                </div>
               : ""
              }
      </div>}
  </div>)

};

export default Targeting;
