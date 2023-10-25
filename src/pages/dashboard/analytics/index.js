/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import { useEffect, useState } from "react";
import Select from 'react-select';
import GroupedBarChart from '../../../../components/viz/GroupedBarChart';
import StackedBarChart from '../../../../components/viz/StackedBarChart';
import MultiLineChart from '../../../../components/viz/MultiLineChart';
import StatsSummary from '../../../../components/viz/StatsSummary';


const Analytics = ({ windowWidth }) => {


  const DATA3 = [
      { day: 'Oct 2', 
        'pin enlargement clicks': 20,
        'destination link clicks': 30,
        'video start clicks': 5,
        saves: 23,
        likes: 10,
        comments: 1,
        'unengaged impressions': 40,
        impressions: 129 },
      { day: 'Oct 3', 
        'pin enlargement clicks': 30,
        'destination link clicks': 20,
        'video start clicks': 3,
        saves: 2,
        likes: 14,
        comments: 10,
        'unengaged impressions': 35,
        impressions: 114 },
      { day: 'Oct 4', 
        'pin enlargement clicks': 8,
        'destination link clicks': 10,
        'video start clicks': 30,
        saves: 25,
        likes: 13,
        comments: 10,
        'unengaged impressions': 23,
        impressions: 109 },
      { day: 'Oct 5', 
        'pin enlargement clicks': 8,
        'destination link clicks': 15,
        'video start clicks': 2,
        saves: 12,
        likes: 4,
        comments: 0,
        'unengaged impressions': 19,
        impressions: 60 },
      { day: 'Oct 6', 
        'pin enlargement clicks': 40,
        'destination link clicks': 10,
        'video start clicks': 20,
        saves: 9,
        likes: 6, 
        comments: 4,
        'unengaged impression': 21,
        impressions: 110 },
      { day: 'Oct 7', 
        'pin enlargement clicks': 20,
        'destination link clicks': 12,
        'video start clicks': 3,
        saves: 5,
        likes: 4, 
        comments: 18,
        'unengaged impressions': 38,
        impressions: 100 }
  ];

  const [data3New, setData3New] = useState(DATA3)
  
  const [data3, setData3] = useState(data3New)
  
  function handleMetricsData(selectedMetrics) {
    if (selectedMetrics && selectedMetrics.length > 0) {
      const selectedMetricsValues = selectedMetrics.map(metric => metric.value);
      const updatedData = data3New.map(dayData => {
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
      setData3(data3New);
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
      day: new Date(2023, 9, 2),
      Pinterest: {
        'Impressions (# of times your pin was on-screen)': 220,
        'Pin saves': 72,
        'Destination link clicks': 96,
      }
    },
    {
      day: new Date(2023, 9, 3),
      Pinterest: {
        'Impressions (# of times your pin was on-screen)': 320,
        'Pin saves': 110,
        'Destination link clicks': 96,
      }
    },
    {
      day: new Date(2023, 9, 4),
      Pinterest: {
        'Impressions (# of times your pin was on-screen)': 96,
        'Pin saves': 50,
        'Destination link clicks': 20,
      }
    },
    {
      day: new Date(2023, 9, 5),
      Pinterest: {
        'Impressions (# of times your pin was on-screen)': 250,
        'Pin saves': 82,
        'Destination link clicks': 136,
      }
    },
    {
      day: new Date(2023, 9, 6),
      Pinterest: {
        'Impressions (# of times your pin was on-screen)': 420,
        'Pin saves': 172,
        'Destination link clicks': 230,
      }
    },
    {
      day: new Date(2023, 9, 7),
      Pinterest: {
        'Impressions (# of times your pin was on-screen)': 80,
        'Pin saves': 20,
        'Destination link clicks': 25,
      }
    }
  ];

  const [data4New, setData4New] = useState(DATA4)

  const [data4, setData4] = useState(DATA4)
  
  function handleMetricsData1(selectedMetrics) {
    if (selectedMetrics && selectedMetrics.length > 0) {
      const selectedMetricsValues = selectedMetrics.map(metric => metric.value);
      const updatedData = data4New.map(dayData => {
        let updatedDayData = { day: dayData.day, Pinterest: {} };
        for (let key in dayData.Pinterest) {
          if (selectedMetricsValues.includes(key)) {
            updatedDayData.Pinterest[key] = dayData.Pinterest[key];
          }
        }
        return updatedDayData;
      });
      setData4(updatedData);
    } else {
      setData4(data4New);
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
      day: 'Oct 2',
      metrics: [
        { name: '# of people who viewed 95% of the video', value: 120 },
        { name: '# of video starts', value: 530 },
        { name: '# of people who viewed at least 10% of the video', value: 150 },
        { name: 'Total play time (in minutes)', value: 90 },
      ],
    },
    {
      day: 'Oct 3',
      metrics: [
        { name: '# of people who viewed 95% of the video', value: 130 },
        { name: '# of video starts', value: 250 },
        { name: '# of people who viewed at least 10% of the video', value: 160 },
        { name: 'Total play time (in minutes)', value: 100 },
      ],
    },
    {
      day: 'Oct 4',
      metrics: [
        { name: '# of people who viewed 95% of the video', value: 140 },
        { name: '# of video starts', value: 250 },
        { name: '# of people who viewed at least 10% of the video', value: 170 },
        { name: 'Total play time (in minutes)', value: 110 },
      ],
    },
    {
      day: 'Oct 5',
      metrics: [
        { name: '# of people who viewed 95% of the video', value: 150 },
        { name: '# of video starts', value: 250 },
        { name: '# of people who viewed at least 10% of the video', value: 180 },
        { name: 'Total play time (in minutes)', value: 120 },
      ],
    },
    {
      day: 'Oct 6',
      metrics: [
        { name: '# of people who viewed 95% of the video', value: 160 },
        { name: '# of video starts', value: 250 },
        { name: '# of people who viewed at least 10% of the video', value: 190 },
        { name: 'Total play time (in minutes)', value: 130 },
      ],
    },
    {
      day: 'Oct 7',
      metrics: [
        { name: '# of people who viewed 95% of the video', value: 170 },
        { name: '# of video starts', value: 250 },
        { name: '# of people who viewed at least 10% of the video', value: 200 },
        { name: 'Total play time (in minutes)', value: 140 },
      ],
    }
  ];
    
  const [data5, setData5] = useState(DATA5)

  const [data5New, setData5New] = useState(DATA5)
  
  function handleMetricsData2(selectedMetrics) {
    if (selectedMetrics && selectedMetrics.length > 0) {
      const selectedMetricsValues = selectedMetrics.map(metric => metric.value);
      const updatedData = data5New.map(dayData => {
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
      setData5(data5New);
    }
  }  

  /* Video stats Grap
    <GroupedBarChart data={data5} setMetrics2={handleMetricsData2} />
  */

  const DATA6 = [
    {
      day: 'Oct 2',
      'Impressions': 320,
      'Destination Link Clicks': 130,
      'User Follows (After Viewing The Pin)': 75,
      'Saves': 210 
    },
    {
      day: 'Oct 3',
      'Impressions': 520,
      'Destination Link Clicks': 230,
      'User Follows (After Viewing The Pin)': 94,
      'Saves': 410 
    },
    {
      day: 'Oct 4',
      'Impressions': 150,
      'Destination Link Clicks': 130,
      'User Follows (After Viewing The Pin)': 35,
      'Saves': 87 
    },
    {
      day: 'Oct 5',
      'Impressions': 1020,
      'Destination Link Clicks': 98,
      'User Follows (After Viewing The Pin)': 42,
      'Saves': 320
    },
    {
      day: 'Oct 6',
      'Impressions': 120,
      'Destination Link Clicks': 28,
      'User Follows (After Viewing The Pin)': 5,
      'Saves': 32
    },
    {
      day: 'Oct 7',
      'Impressions': 70,
      'Destination Link Clicks': 30,
      'User Follows (After Viewing The Pin)': 5,
      'Saves': 23
    }
  ] 

  const [data6, setData6] = useState(DATA6)

  const [data6New, setData6New] = useState(DATA6)

  function handleSummaryDays(options) {
    if (options && options.length > 0) {
      const selectedDays = options.map(metric => metric.value);
      const updatedData = data6New.filter(dayData => {
        let [[firstKey, firstValue]] = Object.entries(dayData);
        if (selectedDays.includes(firstKey)) {
          return dayData;
        }
      });
      setData6(updatedData);
    } else {
      setData6(data6New);
    }
  }

  const [targetPosts, setTargetPosts] = useState(null);

  function handlePosts(selectedOptions) {
    setTargetPosts(selectedOptions)
  }

  const options = [
    { 
      value: 'Oct 2', 
      label: `Food Inspiration to Spark Your Culinary Creativity - Oct 2` 
    },
    { 
      value: 'Oct 3', 
      label: 'Embracing the Bounty of Locally Sourced Ingredients - Oct 3'
    },
    { 
      value: 'Oct 4', 
      label: 'A Culinary Adventure from Every Corner of the World - Oct 4'
    },
    { 
      value: 'Oct 5',
      label: 'A Collection of Breads, Pastries, and Pies to Bake at Home - Oct 5'
    },
    { 
      value: 'Oct 6',
      label: 'Quick and Delicious Recipes for Busy Lives - Oct 6'
    },
    { 
      value: 'Oct 7',
      label: 'Feeling Great: Nutritious Choices for a Healthier You - Oct 7'
    }
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

  
  useEffect(() => {
    console.log('The targetPost', targetPosts)
    if (targetPosts) {
      const selectedDates = targetPosts.map(post => post.value);
      setData3New(DATA3.filter(dt => selectedDates.includes(dt.day)));
      setData4New(DATA4.filter(dt => selectedDates.includes(dt.day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))));
      setData6New(DATA6.filter(dt => selectedDates.includes(dt.day)));
      setData5New(DATA5.filter(dt => selectedDates.includes(dt.day)))
    }
  }, [targetPosts])
  
  
  // for DATA6: Stats summary
  useEffect(() => {
    if (targetPosts) {
      setData6(data6New);
    }
    if (data6New && data6New.length === 0) {
      setData6(DATA6)
    }
  }, [data6New])

  // for DATA3: Engagement graph
  useEffect(() => {
    if (targetPosts) {
      setData3(data3New);
    }
    if (data3New && data3New.length === 0) {
      setData3(DATA3)
    }
  }, [data3New])


  // for DATA4: Conversion Graph
  useEffect(() => {
    console.log('The data4 info', data4New)
    if (targetPosts) {
      setData4(data4New);
    }
    if (data4New && data4New.length === 0) {
      setData4(DATA4)
    }
  }, [data4New])


  // for DATA5: Video Statistics
  useEffect(() => {
    if (targetPosts) {
      setData5(data5New);
    }
    if (data5New && data5New.length === 0) {
      setData5(DATA5)
    }
  }, [data5New])


  return (
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
    </div>)

};

export default Analytics;


export async function getServerSideProps(context) {

  const jwt = require('jsonwebtoken');
  const connectDB = require('../../../../utils/connectUserDB');
  const mongoSanitize = require('express-mongo-sanitize');
  const User = require('../../../../utils/User').default;
  const mongoose = require('mongoose');

  // utils
  async function getAllPins(token) {
    const url = `https://api.pinterest.com/v5/pins`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      
      if (response.ok) {
        const result = await response.json();
        return result
      } else {
        console.error('Error:', response.status, response.statusText);
        return null
      }
    } catch (error) {
      console.error('Error getting pins', error);
      return null
    }
  }

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function getAccessToken(userId) {
    let user = await User.findOne({ _id: userId });
    const accToken = user.socialMediaLinks.find(link => link.platformName === "pinterest").accessToken;
    return accToken
  }


  async function getPinAnalytics(token, pinId, startDate, metricTypes) {

    const endDate = new Date().toISOString().split('T')[0];

    const url = `https://api.pinterest.com/v5/pins/${pinId}/analytics?start_date=${startDate}&end_date=${endDate}&metric_types=${encodeURIComponent(metricTypes.join(','))}&app_types=ALL&split_field=NO_SPLIT`;

    console.log('THE URL', url)

    try {

      const response = await fetch(url, { 
        method: 'GET', 
        headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
        }, 
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log(result)
        return result
      } else {

        console.error('Error:', response);
        return null
      }
    } catch (error) {
      console.error('Error getting pins', error);
      return null
    }
  }

  async function getAllAnalytics(recentPosts) {

    const metricTypes = [
      "IMPRESSION",
      "OUTBOUND_CLICK",
      "PIN_CLICK",
      "SAVE",
      "VIDEO_10S_VIEW",
      "QUARTILE_95_PERCENT_VIEW",
      "VIDEO_V50_WATCH_TIME",
      "VIDEO_START",
      "TOTAL_COMMENTS",
      "TOTAL_REACTIONS"
    ];

    try {
      const results = await Promise.all(recentPosts.map(async (post) => {
        const date = new Date(post.date);
        const formattedDate = date.toISOString().split('T')[0]; // yy-mm-dd
  
        // get the accessToken and the analytics
        const accTkn = await getAccessToken(post.hostId);
  
        // get the metrics for the existing postId
        const analyticsData = await getPinAnalytics(accTkn, post.postId, formattedDate, metricTypes);
        const { TOTAL_COMMENTS, TOTAL_REACTIONS } = analyticsData.all.lifetime_metrics;
        const dailyMetrics = analyticsData.all.daily_metrics; 

        let updatedAnalytics;

        // check if the analytics in the post.analytics actually exists before you proceed
        if (post.analytics && post.analytics.data) {

          updatedAnalytics = dailyMetrics.map(({ data_status, ...rest }) => {

            // the total number of reactions and comments from our Database
            const { totalReactions, totalComments } = post.analytics.data.reduce((acc, { reactions, comments }) => {
              acc.totalReactions += reactions;
              acc.totalComments += comments;
              return acc;
            }, { totalReactions: 0, totalComments: 0 });

            const foundDt = post.analytics.data.find(p => p.date === rest.date)
          
            // if not found, then this means that the CRON job 
            // hasn't run today's job
            if (foundDt) {
              return {
                ...rest,
                metrics: {
                  ...rest.metrics,
                  reactions: foundDt.reactions, 
                  comments: foundDt.comments 
                }
              };
            } else {
              return {
                ...rest,
                metrics: {
                  ...rest.metrics,
                  reactions: TOTAL_REACTIONS - totalReactions, 
                  comments: TOTAL_COMMENTS - totalComments
                }
              };
            }
          });
        } else {
          updatedAnalytics = dailyMetrics.map(({ data_status, ...rest }) => {
            return {
              ...rest,
              metrics: {
                ...rest.metrics,
                reactions: TOTAL_REACTIONS, 
                comments: TOTAL_COMMENTS 
              }
            };
          });
        }
  
        // this is for each post
        return {
          title: post.pinTitle,
          date: post.date,
          metrics: updatedAnalytics
        };

      }));
  
      return results;
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      throw error;
    }
  }
  


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

    // your token has already the userId
    const userId = decoded.userId;

    // here we are going to retrieve all the posts of the user 
    // just to calibrate the data, then we swtich it with the 
    // posts published in the last 7 days.

    await connectDB();

    // we will need the following to update the DB later on
    const sanitizedUserId = mongoSanitize.sanitize(userId);
    let user = await User.findOne({ _id: sanitizedUserId });

    // here are going to pull all the recent 7 days posts, 
    // get their pinTitle, date, and id
    
    const sevenDaysAgo = new Date(new Date().setDate(new Date().getDate() - 7));

    const pipeline = [
      { $match: { _id: new mongoose.Types.ObjectId(sanitizedUserId) } },
      { $unwind: '$socialMediaLinks' },
      { $match: { 'socialMediaLinks.platformName': 'pinterest' } },
      { $unwind: '$socialMediaLinks.posts' },
      { $match: { 'socialMediaLinks.posts.publishingDate': { $gte: sevenDaysAgo } } },
      {
        $project: {
          _id: 0,
          pinTitle: '$socialMediaLinks.posts.postTitle',
          date: '$socialMediaLinks.posts.publishingDate',
          postId: '$socialMediaLinks.posts.postId',
          hostId: '$socialMediaLinks.posts.hostUserId',
          analytics: '$socialMediaLinks.posts.analytics'
        }
      }
    ];
    
    const recentPosts = await User.aggregate(pipeline);

    console.log(recentPosts);

    /*

      [
        {
          pinTitle: 'The best ways to learn computer knoweldge',
          date: 2023-10-23T17:43:34.500Z,
          postId: '1024780090193746920',
          hostId: '23489712348966321976',
          analytics: { reactions: 0, comments: 0 }
        },
        {
          pinTitle: '10 ways to make money online',
          date: 2023-10-24T18:12:29.339Z,
          postId: '1024780090193747474',
          hostId: '23489712348966321976',
          analytics: { reactions: 0, comments: 0 }
        }
      ] 

    */

    // here we will subtract the reactions and the comments from the analytics from the 
    // totalReactionsAndComments, the remaining will be the new reactions and comments, and 
    // the analytics of the today.
    let analyticsOfToday;

    (async () => {
      const array = [1, 2, 3, 4, 5];
      const results = await Promise.all(array.map(async item => {
        // Simulate an async operation
        const result = await new Promise(resolve => setTimeout(() => resolve(item * 2), 1000));
        console.log('Processed:', item);
        return result;
      }));
      
      console.log('All items processed:', results);
    })();

  

    const finalAnalyticsPosts = await getAllAnalytics(recentPosts);

    
    // the following are the daily metrics from the last 7 days
    // you can easily append them to the the 'recentPosts'
    // but before you do, you have to add the react and comments to it
    // so you have a complete picture of the metrics


    // here return the final results, but it's better to do the 
    // calculations here and send the DATA constant from here
  

    return {
      props: {
        signedIn: true,
        dash: true
      }
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