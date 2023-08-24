/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import { useState, useEffect, useRef } from "react";
import Header from '../../../../components/Header';
import Footer from '../../../../components/Footer';
import HomeMenu from '../../../../components/HomeMenu';
import Select from 'react-select';
import GroupedBarChart from '../../../../components/viz/GroupedBarChart';
import StackedBarChart from '../../../../components/viz/StackedBarChart';
import MultiLineChart from '../../../../components/viz/MultiLineChart';
import StatsSummary from '../../../../components/viz/StatsSummary';


// Post Data Info
// Likes & Comments (Scrapped)

const Analytics = () => {

  const [windowWidth, setWindowWidth] = useState(null);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    // Update the window width when the window is resized
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    }

    window.addEventListener('resize', handleResize);

    // Cleanup: remove the event listener when the component is unmounted
    return () => {
      window.removeEventListener('resize', handleResize);
    }
  }, []);


  const DATA3 = [
      { day: 'Jun 6', 
        'pin enlargement clicks': 20,
        'destination link clicks': 30,
        'video start clicks': 5,
        saves: 23,
        likes: 10,
        comments: 1,
        'unengaged impressions': 40,
        impressions: 129 },
      { day: 'Jun 7', 
        'pin enlargement clicks': 30,
        'destination link clicks': 20,
        'video start clicks': 3,
        saves: 2,
        likes: 14,
        comments: 10,
        'unengaged impressions': 35,
        impressions: 114 },
      { day: 'Jun 8', 
        'pin enlargement clicks': 8,
        'destination link clicks': 10,
        'video start clicks': 30,
        saves: 25,
        likes: 13,
        comments: 10,
        'unengaged impressions': 23,
        impressions: 109 },
      { day: 'Jun 9', 
        'pin enlargement clicks': 8,
        'destination link clicks': 15,
        'video start clicks': 2,
        saves: 12,
        likes: 4,
        comments: 0,
        'unengaged impressions': 19,
        impressions: 60 },
      { day: 'Jun 10', 
        'pin enlargement clicks': 40,
        'destination link clicks': 10,
        'video start clicks': 20,
        saves: 9,
        likes: 6, 
        comments: 4,
        'unengaged impression': 21,
        impressions: 110 },
      { day: 'Jun 11', 
        'pin enlargement clicks': 20,
        'destination link clicks': 12,
        'video start clicks': 3,
        saves: 5,
        likes: 4, 
        comments: 18,
        'unengaged impressions': 38,
        impressions: 100 },
      { day: 'Jun 12', 
        'pin enlargement clicks': 30,
        'destination link clicks': 20,
        'video start clicks': 3,
        saves: 10,
        likes: 21,
        comments: 6,
        'unengaged impressions': 6,
        impressions: 96 }
  ];
  
  const [data3, setData3] = useState(DATA3)
  
  function handleMetricsData(selectedMetrics) {
    if (selectedMetrics && selectedMetrics.length > 0) {
      const selectedMetricsValues = selectedMetrics.map(metric => metric.value);
      const updatedData = DATA3.map(dayData => {
        let updatedDayData = { ...dayData };
        let totalSelectedMetrics = 0;
        for (let key in updatedDayData) {
          if (selectedMetricsValues.includes(key)) {
            totalSelectedMetrics += updatedDayData[key];
          } else if (key !=='day' && key !=='impressions') {
            delete updatedDayData[key];
          }
        }
        updatedDayData['other'] = updatedDayData['impressions'] - totalSelectedMetrics;
        return updatedDayData;
      });
      setData3(updatedData);
    } else {
      setData3(DATA3);
    }
  }
  
  /*
    <StackedBarChart
      data={data3}
      setMetrics2={handleMetricsData}
    />
  */



  const DATA4 = [
    {
      date: new Date(2023, 5, 6),
      Pinterest: {
        'Impressions (# of times your pin was on-screen)': 220,
        'Pin saves': 72,
        'Destination link clicks': 96,
      }
    },
    {
      date: new Date(2023, 5, 7),
      Pinterest: {
        'Impressions (# of times your pin was on-screen)': 320,
        'Pin saves': 110,
        'Destination link clicks': 96,
      }
    },
    {
      date: new Date(2023, 5, 8),
      Pinterest: {
        'Impressions (# of times your pin was on-screen)': 96,
        'Pin saves': 50,
        'Destination link clicks': 20,
      }
    },
    {
      date: new Date(2023, 5, 9),
      Pinterest: {
        'Impressions (# of times your pin was on-screen)': 250,
        'Pin saves': 82,
        'Destination link clicks': 136,
      }
    },
    {
      date: new Date(2023, 5, 10),
      Pinterest: {
        'Impressions (# of times your pin was on-screen)': 420,
        'Pin saves': 172,
        'Destination link clicks': 230,
      }
    },
    {
      date: new Date(2023, 5, 11),
      Pinterest: {
        'Impressions (# of times your pin was on-screen)': 80,
        'Pin saves': 20,
        'Destination link clicks': 25,
      }
    },
    {
      date: new Date(2023, 5, 12),
      Pinterest: {
        'Impressions (# of times your pin was on-screen)': 220,
        'Pin saves': 72,
        'Destination link clicks': 96,
      }
    },
  ];

  const [data4, setData4] = useState(DATA4)
  
  function handleMetricsData1(selectedMetrics) {
    if (selectedMetrics && selectedMetrics.length > 0) {
      const selectedMetricsValues = selectedMetrics.map(metric => metric.value);
      const updatedData = DATA4.map(dayData => {
        let updatedDayData = { date: dayData.date, Pinterest: {} };
        for (let key in dayData.Pinterest) {
          if (selectedMetricsValues.includes(key)) {
            updatedDayData.Pinterest[key] = dayData.Pinterest[key];
          }
        }
        return updatedDayData;
      });
      setData4(updatedData);
    } else {
      setData4(DATA4);
    }
  }
  
  /*
    Conversion Graph
    <MultiLineChart
      data={data4}
      setMetrics1={handleMetricsData1}
    />
  */
  

  const DATA5 = [
    {
      day: 'Jun 5',
      metrics: [
        { name: '# of people who viewed 95% of the video', value: 120 },
        { name: '# of video starts', value: 530 },
        { name: '# of people who viewed at least 10% of the video', value: 150 },
        { name: 'Total play time (in minutes)', value: 90 },
      ],
    },
    {
      day: 'Jun 6',
      metrics: [
        { name: '# of people who viewed 95% of the video', value: 130 },
        { name: '# of video starts', value: 250 },
        { name: '# of people who viewed at least 10% of the video', value: 160 },
        { name: 'Total play time (in minutes)', value: 100 },
      ],
    },
    {
      day: 'Jun 7',
      metrics: [
        { name: '# of people who viewed 95% of the video', value: 140 },
        { name: '# of video starts', value: 250 },
        { name: '# of people who viewed at least 10% of the video', value: 170 },
        { name: 'Total play time (in minutes)', value: 110 },
      ],
    },
    {
      day: 'Jun 8',
      metrics: [
        { name: '# of people who viewed 95% of the video', value: 150 },
        { name: '# of video starts', value: 250 },
        { name: '# of people who viewed at least 10% of the video', value: 180 },
        { name: 'Total play time (in minutes)', value: 120 },
      ],
    },
    {
      day: 'Jun 9',
      metrics: [
        { name: '# of people who viewed 95% of the video', value: 160 },
        { name: '# of video starts', value: 250 },
        { name: '# of people who viewed at least 10% of the video', value: 190 },
        { name: 'Total play time (in minutes)', value: 130 },
      ],
    },
    {
      day: 'Jun 10',
      metrics: [
        { name: '# of people who viewed 95% of the video', value: 170 },
        { name: '# of video starts', value: 250 },
        { name: '# of people who viewed at least 10% of the video', value: 200 },
        { name: 'Total play time (in minutes)', value: 140 },
      ],
    },
    {
      day: 'Jun 11',
      metrics: [
        { name: '# of people who viewed 95% of the video', value: 180 },
        { name: '# of video starts', value: 250 },
        { name: '# of people who viewed at least 10% of the video', value: 210 },
        { name: 'Total play time (in minutes)', value: 150 },
      ],
    },
  ];
    
  const [data5, setData5] = useState(DATA5)
  
  function handleMetricsData2(selectedMetrics) {
    if (selectedMetrics && selectedMetrics.length > 0) {
      const selectedMetricsValues = selectedMetrics.map(metric => metric.value);
      const updatedData = DATA5.map(dayData => {
        let updatedDayData = { day: dayData.day, metrics: [] };
        dayData.metrics.forEach(el => {
          if (selectedMetricsValues.includes(el.name)) {
            updatedDayData.metrics.push(el)
          }          
        })
        return updatedDayData;
      });
      setData5(updatedData);
    } else {
      setData5(DATA5);
    }
  }  

  /* Video stats Grap
    <GroupedBarChart data={data5} setMetrics2={handleMetricsData2} />
  */

  const DATA6 = [
    {
      day1: 'Jun 1',
      'Impressions': 320,
      'Destination Link Clicks': 130,
      'User Follows (After Viewing The Pin)': 75,
      'Saves': 210 
    },
    {
      day2: 'Jun 2',
      'Impressions': 520,
      'Destination Link Clicks': 230,
      'User Follows (After Viewing The Pin)': 94,
      'Saves': 410 
    },
    {
      day3: 'Jun 3',
      'Impressions': 150,
      'Destination Link Clicks': 130,
      'User Follows (After Viewing The Pin)': 35,
      'Saves': 87 
    },
    {
      day4: 'Jun 4',
      'Impressions': 1020,
      'Destination Link Clicks': 98,
      'User Follows (After Viewing The Pin)': 42,
      'Saves': 320
    },
    {
      day5: 'Jun 5',
      'Impressions': 120,
      'Destination Link Clicks': 28,
      'User Follows (After Viewing The Pin)': 5,
      'Saves': 32
    },
    {
      day6: 'Jun 6',
      'Impressions': 320,
      'Destination Link Clicks': 130,
      'User Follows (After Viewing The Pin)': 75,
      'Saves': 210 
    },
    {
      day7: 'Jun 7',
      'Impressions': 70,
      'Destination Link Clicks': 30,
      'User Follows (After Viewing The Pin)': 5,
      'Saves': 23
    }
  ] 

  const [data6, setData6] = useState(DATA6)

  function handleSummaryDays(options) {
    if (options && options.length > 0) {
      const selectedDays = options.map(metric => metric.value);
      const updatedData = DATA6.filter(dayData => {
        let [[firstKey, firstValue]] = Object.entries(dayData);
        if (selectedDays.includes(firstKey)) {
          return dayData;
        }
      });
      setData6(updatedData);
    } else {
      setData6(DATA6);
    }
  }

  const [targetPosts, setTargetPosts] = useState(null);

  function handlePosts(selectedOptions) {
    setTargetPosts(selectedOptions)
  }

  const options = [
    { value: 'post1', label: 'Post 1 Title' },
    { value: 'post2', label: 'Post 2 Title' },
    { value: 'post3', label: 'Post 3 Title' },
    { value: 'post4', label: 'Post 4 Title' },
    { value: 'post5', label: 'Post 5 Title' },
    { value: 'post6', label: 'Post 6 Title' },
    { value: 'post7', label: 'Post 7 Title' }
  ];

  const customStyles = {
    container: (provided) => ({
      ...provided,
      width: '95%',
    }),
    option: (provided, state) => ({
      ...provided,
      color: state.isSelected ? 'white' : '#1c1c57',
    })
  };

  return (<div id="parentWrapper">
    <Header signedIn={true}/>
    <div className="resultsSection">
      <div className="homeContainer">
        {
          windowWidth > 1215 ? <HomeMenu /> : ''
        }
        <div className="rightSectionAnalytics">
          <div className='postSelectorContainer'>
            <Select
                value={targetPosts}
                onChange={handlePosts}
                options={options}
                isMulti
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
                placeholder='Select Posts Title/Titles'
            /> 
          </div>
          <div className='analyticsContainer'>
            <div className='analyticsContainer1'>
              <StatsSummary 
                data={data6}
                setSummaryDays={handleSummaryDays}
              />
              <StackedBarChart
                data={data3}
                setMetrics2={handleMetricsData}
              /> 
            </div>
            <div className='analyticsContainer2'>
                <MultiLineChart
                    data={data4}
                    setMetrics1={handleMetricsData1}
                  />
                <GroupedBarChart 
                  data={data5}
                  setMetrics2={handleMetricsData2}
                />
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>)

};

export default Analytics;


export async function getServerSideProps(context) {

  const jwt = require('jsonwebtoken');

  try {

    // Get cookies from the request headers
    const cookies = context.req.headers.cookie;

    // Parse the cookies to retrieve the otpTOKEN
    const tokenCookie = cookies.split(';').find(c => c.trim().startsWith('token='));

    let tokenValue;
    if (tokenCookie) {
      tokenValue = tokenCookie.split('=')[1];
    }

    const decoded = jwt.verify(tokenValue, process.env.USER_JWT_SECRET);

    if (decoded.type !== 'sessionToken') {
      return {
        redirect: {
          destination: '/sign-in',
          permanent: false,
        },
      };
    }

    return {
      props: {}
    };


  } catch (error) {
    return {
      redirect: {
        destination: '/sign-in',
        permanent: false,
      },
    };
  }

}