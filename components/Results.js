/* eslint-disable @next/next/no-page-custom-font */
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import hljs from "highlight.js";
import dynamic from 'next/dynamic';
import Confetti from "../components/Confetti";
import Modal from 'react-modal';
import { parse } from 'node-html-parser';
import { Tadpole } from "react-svg-spinners";
import { useState, useRef, useEffect } from 'react';



const AudioVisualizer = dynamic(
  () => import('../components/AudioVisualizer'),
  { ssr: false }
);

function delay(time) {
  return new Promise(function(resolve) {
      setTimeout(resolve, time);
  })
}

export default function Results() {

  // for the shooting stars
  const [firstTime, setFirstTime] = useState(false);

  /// Listen for any clicks to the PDF Button
  const [PDFClicked, setPDFClicked] = useState(false);

  /// isOpen for the modal
  const [modalIsOpen, setIsOpen] = useState(false)

  /// check if this a Kindle for React Modal
  const [isKindle, setIsKindle] = useState(false);

  /// The body, or content coming from the backend
  const [body, setBody] = useState(false);

  /// play audio
  const [audio, setAudio] = useState(false)

  /// keep track of the body element
  const contentRef = useRef()

  // this is for getting the data from contentScript
  // and setting the 'body' to be rendered
  // accordingly

  if (typeof window !== 'undefined') {
    window.addEventListener('message', (event) => {
      console.log('Message event received:', event);
    });
  }

  useEffect(() => {
    console.log('handle');

    async function handleMessage(event) {
      console.log('Inside handle message');
      if (event.data.type === 'dataReady') {
        setFirstTime(true);
        setBody(event.data.data);
        await delay(2500);
        setFirstTime(false);
      }
    }

    // Set up the event listener
    window.addEventListener('message', handleMessage);

    // Send the "ready" message
    window.postMessage({ type: 'ready' }, '*');

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);



  /// This is applied on content containing code
  /// Highlight.JS automatically detect the Prog
  /// languages and styles it accordingly
  useEffect(() => {
    if (contentRef && contentRef.current) {
      const codeElements = contentRef.current.querySelectorAll("code");
      codeElements.forEach((codeElement) => {
        console.log('Highligiting code element...')
        hljs.highlightElement(codeElement)
      })
    }
  }, [body])


  /////////// Format Code in Body if Any ///////////

  function formatCodeInString(str) {

    const codeRegex = /<code>([\s\S]*?)<\/code>/g;
    let formattedStr = str;

    formattedStr = formattedStr.replace(codeRegex, (match, codeContent) => {

      const lines = codeContent.split('\n');
      const minIndent = Math.min(...lines.map(line => line.search(/\S/)).filter(num => num !== -1));

      const formattedLines = lines.map(line => (line.startsWith(' ') ? line.slice(minIndent) : line)).join('\n');
      const trimmedCode = formattedLines.trimStart();
      return `<code>${trimmedCode}</code>`;

    });

    return formattedStr;
  }


  ////////// Confetti: the stars splashing out //////////

  const defaults = {
    spread: 360,
    ticks: 50,
    gravity: 0,
    decay: 0.94,
    startVelocity: 30,
    shapes: ["star"],
    colors: ["#FFE400", "#FFBD00", "#E89400", "#FFCA6C", "#FDFFB8"],
  };

  const shootOptions = [
    {
      ...defaults,
      particleCount: 40,
      scalar: 1.2,
      shapes: ["star"],
    },
    {
      ...defaults,
      particleCount: 10,
      scalar: 0.75,
      shapes: ["circle"],
    },
  ]


  /////////// style for the react-modal /////////
  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      fontFamily: 'Ubuntu',
    },
  };


  /////////// PDF Export ///////////

  async function handlePDFExportClick() {

    // obvious
    setPDFClicked(true)

    // the html-based doc to be generate in PDF format
    const html = `<!DOCTYPE html>
    <html>
      <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
          <link href="https://fonts.googleapis.com/css2?family=Merriweather+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700&display=swap" rel="stylesheet" />
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/default.min.css">
        <style>

          body {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }

          /* area */
          #content-area {
            width: 80%;
            font-family: 'Merriweather Sans', sans-serif;
            line-height: 1.9;
            font-size: larger;
          }

          #content-area h1 {
              margin-top: 3%;
          }

          #content-area img {
            width: 100%;
            border-radius: 7px;
          }

          #content-area pre code {
              word-wrap: break-word;
              white-space: pre-wrap;
              overflow-wrap: break-word;
              padding: 20px;
              margin: 0;
              display: block;
              border-radius: 7px;
          }

          #content-area code {
              padding: 5px;
              border-radius: 4px;
          }

          @media print {
            /* Adjust the margins for the entire document */
            @page {
                margin-top: 7mm;
                margin-bottom: 7mm;
            }
          }
        </style>
      </head>
      <body>
        <div id='content-area'>
          ${contentRef.current.innerHTML}
        </div>
      </body>
    </html>`;

    //// send the HTML to the server to be
    //// generated and get back a PDFBuffer
    async function sendHtmlToServer(html) {
      try {
        const response = await fetch('http://localhost:4050/api/save-pdf', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "html": html,
            "filename": body.match(/<h1>([\s\S]*?)<\/h1>/)[1].split('\n').join("").trim().toLowerCase().replace(/(^\w|\s\w)/g, (m) => m.toUpperCase())
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to send HTML to the server.');
        }

        const arrBuffer = await response.arrayBuffer();
        const pdfBlob = new Blob([arrBuffer], { type: 'application/pdf' });
        const pdfUrl = URL.createObjectURL(pdfBlob);

        // Create a temporary anchor element to trigger the download
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = body.match(/<h1>([\s\S]*?)<\/h1>/)[1].split('\n').join("").trim().toLowerCase().replace(/(^\w|\s\w)/g, (m) => m.toUpperCase()) + '.pdf';
        link.style.display = 'none';

        document.body.appendChild(link);
        link.click();
        setPDFClicked(false)
        document.body.removeChild(link);

        // Give the browser some time to start the download before trying to open the file
        setTimeout(() => {
          window.open(pdfUrl, '_blank');
        }, 200)
      } catch (error) {
        console.error('Error:', error);
      }
    }
    sendHtmlToServer(html)
  }

  // closing the Modal
  function closeModal() {
    setIsOpen(false);
  }


  // sending to Kindle
  function sendToKindle() {
    setIsOpen(true)
    setIsKindle(true)
  }

  /////////// get audio ///////////
  async function getAudio() {
    const dt = contentRef.current.innerHTML
    const fDt = dt.includes('<img') ? dt.replace(/<img[^>]*>/g, '') : dt
    try {
      const response = await fetch('http://localhost:4050/api/get-audio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "content": fDt
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send HTML to the server.');
      }

      const data = await response.json()

      setAudio(data.audio64)

    } catch (error) {
      console.error('Error:', error);
    }

  }


  /////////// editing content ///////////

  // check if the user clicked on Edit
  const [isEditable, setIsEditable] = useState(false);

  // when focus is away from the content
  const handleBlur = () => {
    setBody(contentRef.current.innerHTML);
  };

  // obvious
  const toggleEditable = () => {
    // turn off the confetti
    setFirstTime(false);
    setIsEditable(!isEditable);
  };

  // place the cursor at the beginning of the 'body'
  useEffect(() => {
    if (isEditable) {
      contentRef.current.focus();
      const selection = window.getSelection();
      const range = document.createRange();
      range.setStart(contentRef.current, 0);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }, [isEditable])


  // bind to the main parent element
  Modal.setAppElement('#__next')

  return (<>
    <Head>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link href="https://fonts.googleapis.com/css2?family=Merriweather+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700&display=swap" rel="stylesheet" />
    </Head>
    <div id='main'>
      {body ?
      <>
        { firstTime ? shootOptions.map((options, index) => (
          <Confetti key={index} options={options} />
        )) : '' }
        <div className='leftSectionActive'>
          <div className='buttonContainer'>
            <button onClick={toggleEditable}><img src="./edit.svg" alt="editing"/>{isEditable ? 'Disable Editing' : 'Enable Editing'}</button>
            <button onClick={handlePDFExportClick} disabled={PDFClicked ? true : false} style={{
              backgroundColor: PDFClicked ? '#73739a' : '#1465e7',
            }}>{ PDFClicked ? <Tadpole color='white' height='70%' /> : <img src='./download.svg' alt='download' /> }Download PDF</button>
            <button onClick={sendToKindle}><img src="./book.svg" alt="book"/>Send To Kindle</button>
            <button onClick={getAudio}><img src="./audioWaves.svg" alt="audio"/>Get Audio</button>
          </div>
          {audio ?
            <div id='audioHolder'>
              <AudioVisualizer audioSrc={`data:audio/wav;base64,${audio}`} filename={body.match(/<h1>([\s\S]*?)<\/h1>/)[1].split('\n').join("").trim().toLowerCase().replace(/(^\w|\s\w)/g, (m) => m.toUpperCase())} />
            </div>
            : ''}
        </div>
        <div
          ref={contentRef}
          id='content-area'
          dangerouslySetInnerHTML={{__html: body}}
          contentEditable={isEditable}
          onBlur={handleBlur}
          style={{
            border: isEditable ? '2px solid #1c1c57' : 'none',
            cursor: isEditable ? 'text' : 'default',
          }}
        />
      </>
       : <>
       <Image src='./loading.svg' alt='loading-ghost' width={200} height={200} />
     </>}
    </div>
      <Modal
        isOpen={modalIsOpen}
        style={customStyles}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
      >
        {modalIsOpen && isKindle ?
        <>
          <ol>
            <li className='ItemsOfModal'><div>
              <button onClick={handlePDFExportClick} disabled={PDFClicked ? true : false} style={{
                backgroundColor: PDFClicked ? '#73739a' : '#1465e7',
              }}>{ PDFClicked ? <Tadpole width={17} color='white' /> : <Image src='./download.svg' width={17} height={17} alt='download' /> }Download PDF</button> If you haven&apos;t already.
              </div>
              </li>
            <li className='ItemsOfModal'>Go to <a target="_blank" href="https://www.amazon.com/sendtokindle" style={{
              cursor: 'pointer',
              color: '#075edd'
            }}>Amazon Send To Kindle</a> page, and sign in.</li>
            <li className='ItemsOfModal'>Upload the PDF you downloaded.</li>
          </ol>
        </>
        :
        <>
          <p>
            Oh no! 😟 It looks like we hit a snag and couldn&apos;t process your request. No worries, it happens sometimes! 😊 Please try again and we&apos;re confident it&apos;ll work this time. Thank you for your understanding and patience! 🙏
          </p>
          <button onClick={getAudio}>Try Again</button>
        </>  }
      </Modal>
    </>
  )
}
