import React from "react";
import { useState, useRef } from "react";
import Select from 'react-select';


export default function ContentForm({ setText, 
  setPinTitle, setPinLink, setPostTitle, setVideoUrl, setImgUrl, submitPost, platform }) {

  const [titleChars, setTitleChars] = useState(0)  
  const [descChars, setDescChars] = useState(0)

  // for the tooltip
  const [style, setStyle] = useState({
    visibility: 'hidden'
  })
  function handleWarning() {
    setStyle({
        visibility: 'visible'
    })
    setTimeout(() => {
        setStyle({
            visibility: 'hidden'
        })
    }, 2000)
  }

  const [isOpen, setIsOpen] = useState(false);

  const [fileInfo, setFileInfo] = useState({ fileName: '', errors: [] });
  const fileInput = useRef();

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    submitPost();
  }

  const handleFileChange = async (e) => {
    
    const files = Array.from(e.target.files);

    if (files.length === 0) {
      return;
    }

    if (files.length > 1) {
      alert('Please select only one file.');
      e.target.value = '';
      return;
    }

    const file = files[0]

    const url = URL.createObjectURL(file);
    const mediaObject = {
      url: url,
      type: file.type.startsWith('image/') ? 'image' : 'video'
    };

    let errors = [];
    if (file.type.startsWith('image/')) {
      errors = await imageValidation(file);
      if (errors.length === 0) {
        setImgUrl(url)
      }
    } else if (file.type.startsWith('video/')) {
      errors = await videoValidation(file);
      if (errors.length === 0) {
        setVideoUrl(url)
      }
    }

    const fileInfo = { fileName: file.name, errors: errors };

    setFileInfo(fileInfo);

  }


  const handleFileClick = () => {
    fileInput.current.click();
  }

  function gcd(a, b) {
    return b ? gcd(b, a % b) : a;
  }

  function imageValidation(file) {

    return new Promise((resolve, reject) => {

      let errors = []

      const img = new Image();

      img.onload = function() {
        const aspectRatio = this.naturalWidth / this.naturalHeight;

        const divisor = gcd(this.naturalWidth, this.naturalHeight);

        const simplifiedWidth = this.naturalWidth / divisor;
        const simplifiedHeight = this.naturalHeight/ divisor;

        if ((file.size / 1048576) > 20) {
          errors.push(`Image size must not exceed 20MB. This image's size is ${file.size / 1048576}MB.`)
        }
        if (!['jpeg', 'jpg', 'bmp', 'png', 'tiff', 'webp'].includes(file.type.split('/')[1])) {
          errors.push(`Image type must be of a BMP/JPEG/PNG/TIFF/WEBP format. This is a ${file.type.split('/')[1].toUpperCase()} image.`)
        }
        if (Math.abs(2/3 - aspectRatio) > 0.2 || Math.abs(9/16 - aspectRatio) > 0.2) {
          errors.push(`Image aspect ratio must be 2:3 or 9:16. This image is ${simplifiedWidth}:${simplifiedHeight}.`);
        }
        if (this.naturalWidth < 1000 || this.naturalHeight < 1500) {
          errors.push(`Image resolution must be at least 1000px by 1500px. This image is ${this.naturalWidth}px by ${this.naturalHeight}px.`);
        }
        resolve(errors)
      };

      img.onerror = function(errorEvent) {
        console.error("Image loading error: ", errorEvent); // Log the error event
        reject(new Error('An error occurred while loading the image.'));
      };

      img.src = URL.createObjectURL(file);

    }

  )}


  function videoValidation(file) {

    return new Promise((resolve, reject) => {

      let errors = [];

      // Validate the file type
      if (file.type !== 'video/mp4' && file.type !== 'video/x-m4v') {
        errors.push(`Video must be in MP4 or M4V format. This is a ${file.type.split('/')[1].toUpperCase()} video.`);
      }

      // Validate the file size
      if (file.size > 2e9) {
        errors.push(`Video size must be less than 2GB. This video's is ${file.size / 1e9}GB`);
      }

      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = function() {
        URL.revokeObjectURL(video.src);

        // Validate the video dimensions
        const width = video.videoWidth;
        const height = video.videoHeight;
        const aspectRatio = width / height;

        const divisor = gcd(width, height);

        if (Math.abs(2/3 - aspectRatio) > 0.2 || Math.abs(9/16 - aspectRatio) > 0.2) {
          errors.push(`Video aspect ratio must be 9:16 or 2:3. This video has ${width/divisor}:${height/divisor} ratio.`);
        }

        if (width < 540 || height < 960) {
          errors.push(`Video resolution must be at least 540px by 960px. This video is ${width}px by ${height}px`);
        }

        // Validate the duration
        const duration = video.duration;

        if (duration > 300 || duration < 4) {
          errors.push(`Video duration must be at least 4 seconds or at most 5 minutes. This video is ${duration} seconds long.`);
        }
        resolve(errors);
      };

      video.onerror = function() {
        reject(new Error('An error occurred while loading the image.'))
      };

      video.src = URL.createObjectURL(file);

    });
  }


  const [targetMetrics, setTargetMetrics] = useState(null);

  function handleSelectedMetrics(selectedOptions) {
    setTargetMetrics(selectedOptions)
  }

  const options = [
    { value: 'test', label: 'Test' },
    { value: 'mothers gifts', label: 'Mothers Gifts' },
    { value: 'my people', label: 'My Family' },
    { value: 'travels', label: 'Travels' }
  ];

  const customStyles = {
    container: (provided) => ({
      ...provided,
      width: '100%',
      marginTop: '10px',
      fontFamily: 'Arial, Helvetica, sans-serif;'
    }),
    option: (provided, state) => ({
      ...provided,
      color: state.isSelected ? 'white' : '#1c1c57',
    })
  };

  if (platform) {
    return (
      <div className='requirementsDiv'>
        <div className='reqsTitle' onClick={toggleAccordion}>
          <div>
            <h1>3/ Post Details</h1>
          </div>
          <div>
            <img src='/arrow.svg' style={{ transform: isOpen ? 'rotate(0deg)' : 'rotate(180deg)' }} />
          </div>
        </div>
        {isOpen && <div className="publishBodyContainer">
          <ul>
            <li>You can easily copy/paste any emoji/emojis you want into the text box.</li>
            <li>You can select multiple files at once by using the <b>Shift + Click</b> command on Windows, or the <b>Command + Click</b> command on Mac.</li>
            <li>If all your files are not visible, on the file selection dialog box switch from <b>Custom Files</b> to <b>All Files</b>.</li>
            <li>The preview on the right provides a rough estimation of how your content will be displayed.</li>
          </ul>
          <form className='publishForm' onSubmit={handleFormSubmit}>
            <div className="inputElements">
              <label>Post Title</label>
              <p><em>This helps you to easily identify and locate your post within Sumbroo, but it will not be published.</em></p>
              <input type="text" placeholder="Enter post title" onChange={(e) => { setPostTitle(e.target.value) }} />
            </div>
            <div className="inputPinElement" style={{ position: 'relative' }}>
              <label>Pin Board</label>
                <Select
                  id="noBoxShadow"
                  value={targetMetrics}
                  onChange={handleSelectedMetrics}
                  options={options}
                  getOptionLabel={(option) => option.label}
                  getOptionValue={(option) => option.value}
                  styles={ customStyles }
                  theme={(theme) => ({
                      ...theme,
                      colors: {
                      ...theme.colors,
                        primary25: '#e8e8ee',  // color of the option when hovering
                        primary: '#1c1c57',  // color of the selected option
                      },
                  })}
                  placeholder='Select a board for your pin'
                />
            </div>
            <div className="inputElements" style={{ position: 'relative' }}>
              <label>Pin Title</label>
              <p>Title should be <b>40-100 characters</b>. Keep it concise and clear, ensuring it's relevant to your content.</p>
              <input type="text" maxLength='100' placeholder="Add your pin title" onChange={(e) => { setPinTitle(e.target.value); setTitleChars(e.target.value.length); }} />
              { titleChars > 0 ? 
              <span className="charsCounter" style={{ 
                position: 'absolute',
                fontFamily: 'Arial, Helvetica, sans-serif',
                bottom: '6px',
                right: '6px',
                width: '26px',
                height: '26px',
                backgroundColor: titleChars < 40 ? 'red' : '#1c1c57',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center', // Center the content vertically
                justifyContent: 'center', // Center the content horizontally
                fontSize: '12px', // You may need to adjust this value
                color: 'white'
                 }}>{100 - titleChars}</span> : ''
              }   
            </div>
            <div className="inputElements" style={{ position: 'relative' }}>
              <label>Pin Description</label>
              <p>Include a description of <b>100-500 characters</b> for your Pin, along with relevant hashtags. A detailed description helps Pinterest match your content with the right audience, amplifying its visibility and significance beyond just your host's current followers.</p>
              <textarea
                name="text"
                maxLength="500"
                placeholder="What your Pin is about"
                onChange={(e) => { setText(e.target.value); setDescChars(e.target.value.length); }}
              />
              { descChars > 0 ?
              <span className="charsCounter" style={{ 
                position: 'absolute',
                fontFamily: 'Arial, Helvetica, sans-serif',
                bottom: '10px',
                right: '10px',
                width: '26px',
                height: '26px',
                backgroundColor: descChars < 100 ? 'red' : '#1c1c57',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center', // Center the content vertically
                justifyContent: 'center', // Center the content horizontally
                fontSize: '12px', // You may need to adjust this value
                color: 'white'
                 }}>{500 - descChars}</span> : ''
              }   
            </div>
            <div className="inputElements">
              <label>Destination Link</label>
              <input type="text" placeholder="Your link here" onChange={(e) => { setPinLink(e.target.value) }} />
            </div>
            <div className="file-input-wrapper inputElements">
              <label>Media File</label>
              <button type="button" className="btn-file-input" onClick={handleFileClick}><img src="/upload.svg" alt="upload-icon" /> Upload File</button>
              <input
                type="file"
                name="media"
                ref={fileInput}
                style={{display: 'none'}}
                accept="image/*,video/*"
                onChange={handleFileChange}
              />
              { fileInfo.fileName.length > 0 ?
                (<>{fileInfo.errors.length > 0 ? fileInfo.errors.map((err, e) =>
                  <span className="file-upload-errors" key={e}>{err}</span>) : ''}
                <div className="file-name-wrapper" style={{ backgroundColor: fileInfo.errors.length > 0 ? '#e00520' : '#00d605' }}>
                  <p>{fileInfo.fileName}</p><img style={{ maxWidth: fileInfo.errors.length > 0 ? '3.5%' : '5%' }} src={fileInfo.errors.length > 0 ? '/wrong.svg' : '/correct.svg'} alt={fileInfo.errors.length > 0 ? 'wrong icon' : 'correct icon'} /></div></>)
                : <span>No file chosen</span>
              }
            </div>
          </form>
        </div>}
      </div>
    );
  } else {
    return (<div className='requirementsDiv'>
      <div className='reqsTitle' onClick={handleWarning}>
          <div>
              <h1>3/ Post Details</h1>
              <div className='reqsTooltip' style={style}>Please select a platform first!</div>
          </div>
          <div>
              <img src='/arrow.svg' style={{ transform: 'rotate(180deg)' }} />
          </div>
      </div>
    </div>)
  }

}