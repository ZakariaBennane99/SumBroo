/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import { useEffect, useState } from "react";
import Select from 'react-select';
import GroupedBarChart from '../../../../components/viz/GroupedBarChart';
import StackedBarChart from '../../../../components/viz/StackedBarChart';
import MultiLineChart from '../../../../components/viz/MultiLineChart';
import StatsSummary from '../../../../components/viz/StatsSummary';
import _, { update } from 'lodash';


const Analytics = ({ data, options }) => {

  const [targetPost, setTargetPost] = useState(null);
  // this is for react-select
  const [targetPostKey, setTargetPostKey] = useState(null);
  
  const [engagementsData, setEngagementsData] = useState(null)
  
  function engagementsDataChange(selectedMetrics) {
    const formatedEngData = targetPost.metrics.map(post => {
      const date = new Date(post.date);
      const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      return {
        day: formattedDate,
        'pin enlargement clicks': post.metrics.PIN_CLICK,
        'destination link clicks': post.metrics.OUTBOUND_CLICK,
        'video start clicks': post.metrics.VIDEO_START,
        saves: post.metrics.SAVE,
        reactions: post.metrics.REACTIONS,
        'unengaged impressions': post.metrics.IMPRESSION - (post.metrics.PIN_CLICK + post.metrics.OUTBOUND_CLICK + post.metrics.VIDEO_START + post.metrics.SAVE + post.metrics.REACTIONS),
        impressions: post.metrics.IMPRESSION
      }
    })
    if (selectedMetrics && selectedMetrics.length > 0) {
      const selectedMetricsValues = selectedMetrics.map(metric => metric.value);
      const updatedData = formatedEngData.map(dayData => {
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
      setEngagementsData(updatedData);
    } else {
      setEngagementsData(formatedEngData);
    }
  }
  

  const [summaryData, setSummaryData] = useState(null)
  
  const [conversionData, setConversionData] = useState(null)
  
  function conversionDataChange(selectedMetrics) {
    const formatedConversionData = targetPost.metrics.map(post => {
      const strippedDate = post.date.split('-');
      return {
        day: new Date(parseInt(strippedDate[0]), parseInt(strippedDate[1]) - 1, parseInt(strippedDate[2])),
        Pinterest: {
          'Impressions (# of times your pin was on-screen)': post.metrics.IMPRESSION,
          'Pin saves': post.metrics.SAVE,
          'Destination link clicks': post.metrics.OUTBOUND_CLICK,
        }
      }
    })
    if (selectedMetrics && selectedMetrics.length > 0) {
      const selectedMetricsValues = selectedMetrics.map(metric => metric.value);
      const updatedData = formatedConversionData.map(dayData => {
        let updatedDayData = { day: dayData.day, Pinterest: {} };
        for (let key in dayData.Pinterest) {
          if (selectedMetricsValues.includes(key)) {
            updatedDayData.Pinterest[key] = dayData.Pinterest[key];
          }
        }
        return updatedDayData;
      });
      setConversionData(updatedData);
    } else {
      setConversionData(formatedConversionData);
    }
  }  


  const [videoData, setVideoData] = useState(null)

  function videoDataChange(selectedMetrics) {
    console.log('The metric', selectedMetrics)
    const formattedVideoData = targetPost.metrics.map(post => {
      const date = new Date(post.date);
      const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      return {
        day: formattedDate,
        metrics: [
          { name: '# of people who viewed 95% of the video', value: post.metrics.QUARTILE_95_PERCENT_VIEW },
          { name: '# of video starts', value: post.metrics.VIDEO_START },
          { name: '# of people who viewed at least 10% of the video', value: post.metrics.VIDEO_10S_VIEW },
          { name: 'Total play time (in minutes)', value: post.metrics.VIDEO_V50_WATCH_TIME },
        ]
      }
    });
  
    if (selectedMetrics && selectedMetrics.length > 0) {
      const selectedMetricNames = selectedMetrics.map(metric => metric.value); // Assuming the label property holds the name of the metric
      const updatedData = formattedVideoData.map(dayData => {
        const updatedMetrics = dayData.metrics.filter(metric => selectedMetricNames.includes(metric.name));
        return { ...dayData, metrics: updatedMetrics };
      });
      setVideoData(updatedData);
    } else {
      setVideoData(formattedVideoData);
    }
  }
  
  


  // when selecting 
  function handlePostSelection(selectedOption) {
    const targetPost = data.filter(el => el.date === selectedOption.value);
    setTargetPostKey(selectedOption);
    setTargetPost(targetPost[0]);
  }

  
  useEffect(() => {


    /****  here where you construct data based on the post requested  ****/

    const vid = [
      "VIDEO_10S_VIEW",
      "QUARTILE_95_PERCENT_VIEW",
      "VIDEO_V50_WATCH_TIME",
      "VIDEO_START",
    ]

    if (targetPostKey) {

      const formatedEngData = targetPost.metrics.map(post => {
        const date = new Date(post.date);
        const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        return {
          day: formattedDate,
          'pin enlargement clicks': post.metrics.PIN_CLICK,
          'destination link clicks': post.metrics.OUTBOUND_CLICK,
          'video start clicks': post.metrics.VIDEO_START,
          saves: post.metrics.SAVE,
          reactions: post.metrics.REACTIONS,
          'unengaged impressions': post.metrics.IMPRESSION - (post.metrics.PIN_CLICK + post.metrics.OUTBOUND_CLICK + post.metrics.VIDEO_START + post.metrics.SAVE + post.metrics.REACTIONS),
          impressions: post.metrics.IMPRESSION
        }
      })

      const formatedSummaryData = targetPost.metrics.map(post => {
        const date = new Date(post.date);
        const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        return {
          day: formattedDate,
          'Impressions': post.metrics.IMPRESSION,
          'Destination Link Clicks': post.metrics.OUTBOUND_CLICK,
          'Saves': post.metrics.SAVE
        }
      })

      const formatedConversionData = targetPost.metrics.map(post => {
        const strippedDate = post.date.split('-');
        return {
          day: new Date(parseInt(strippedDate[0]), parseInt(strippedDate[1]) - 1, parseInt(strippedDate[2])),
          Pinterest: {
            'Impressions (# of times your pin was on-screen)': post.metrics.IMPRESSION,
            'Pin saves': post.metrics.SAVE,
            'Destination link clicks': post.metrics.OUTBOUND_CLICK,
          }
        }
      })

      // set the data for all
      setEngagementsData(formatedEngData)
      setSummaryData(formatedSummaryData)
      setConversionData(formatedConversionData)

      // set videoDate only if it is a video Pin
      if (!targetPost.metrics.every(entry => vid.every(key => entry.metrics[key] === 0))) {
        const formatedVideoData = targetPost.metrics.map(post => {
          const date = new Date(post.date);
          const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          return {
            day: formattedDate,
            metrics: [
              { name: '# of people who viewed 95% of the video', value: post.metrics.QUARTILE_95_PERCENT_VIEW },
              { name: '# of video starts', value: post.metrics.VIDEO_START },
              { name: '# of people who viewed at least 10% of the video', value: post.metrics.VIDEO_10S_VIEW },
              { name: 'Total play time (in minutes)', value: post.metrics.VIDEO_V50_WATCH_TIME },
            ]
          }
        })
        setVideoData(formatedVideoData)
      }

    }

  }, [targetPost])


  const customStyles = {
    container: (provided) => ({
      ...provided,
      width: '95%',
    }),
    option: (provided, state) => ({
      ...provided,
      color: state.isSelected ? 'white' : '#1c1c57',
    })
  }


  return (
    <div className="rightSectionAnalytics">
          <div style={{ backgroundColor: '#f5f6f7', 
            color: '#12123b',
            marginBottom: '20px',
            padding: '10px',
            borderRadius: '5px'
          }} className="righSectionAnalytics">
            When you choose a post, the data displayed will range from the <b> date of publication </b> (as indicated in the dropdown) up to the <b> current day.</b>
          </div>
          <div className='postSelectorContainer'>
            <Select
              value={targetPostKey}
                onChange={handlePostSelection}
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
                placeholder='Select A Post'
            /> 
          </div>
            <div className='analyticsContainer'>

              <div className='analyticsContainer1'>
                {
                  summaryData ? 
                  <StatsSummary 
                    data={summaryData}
                  /> : 
                  <div style={{ paddingTop: '150px', paddingBottom: '150px', color: '#12123b' }} className='statsSummary'>
                    No data
                  </div>
                }
                {
                  engagementsData ?
                  <StackedBarChart
                    data={engagementsData}
                    setEngagementData={engagementsDataChange}
                  /> : 
                  <div style={{ paddingTop: '150px', paddingBottom: '150px', color: '#12123b' }} className="stackedBarChart">
                    No data
                  </div>
                }
              </div>
              <div className='analyticsContainer2'>
                {
                  conversionData ? 
                  <MultiLineChart
                    data={conversionData}
                    setConversionData={conversionDataChange}
                  /> : 
                  <div style={{ paddingTop: '150px', paddingBottom: '150px', color: '#12123b' }} className='multiLineChart'>
                    No Data
                  </div>
                }

                {
                  videoData ? 
                    <GroupedBarChart 
                      data={videoData}
                      setVideoData={videoDataChange}
                    /> : 
                    <div style={{ paddingTop: '150px', paddingBottom: '150px', color: '#12123b' }} className='groupedBarChart'>
                      No Data
                    </div>
                }
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
  

    // const finalAnalyticsPosts = await getAllAnalytics(recentPosts);

    // to be removed
    const fakeConstant = [
        {
            "title": "The best ways to learn computer knoweldge",
            "date": "2023-10-19"
        },
        {
            "title": "10 ways to make money online",
            "date": "2023-10-20"
        },
        {
            "title": "creating the best knowledge graphs",
            "date": "2023-10-21"
        },
        {
            "title": "best ways to cook lentils",
            "date": "2023-10-22"
        },
        {
            "title": "cooking lentils without onions and other ingredients",
            "date": "2023-10-23"
        },
        {
            "title": "My moms recipe for potato chips",
            "date": "2023-10-24"
        },
        {
            "title": "the best cooking tray to grill salmon",
            "date": "2023-10-25"
        }
    ]  
    
    const options = fakeConstant.map(el => {
      const date = new Date(el.date);
      const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      return {
        value: el.date,
        label: _.startCase(el.title) + ' - ' + formattedDate
      }
    })
  
    const allPsts = [
      {
        title: 'The best ways to learn computer knoweldge',
        date: '2023-10-19',
        metrics: [
          {
            date: '2023-10-19',
            metrics: {
              VIDEO_V50_WATCH_TIME: 100,
              OUTBOUND_CLICK: 50,
              VIDEO_START: 20,
              QUARTILE_95_PERCENT_VIEW: 10,
              VIDEO_10S_VIEW: 30,
              SAVE: 5,
              IMPRESSION: 200,
              PIN_CLICK: 15,
              REACTIONS: 50,
              COMMENTS: 10
            }
          },
          {
            date: '2023-10-20',
            metrics: {
              VIDEO_V50_WATCH_TIME: 150,
              OUTBOUND_CLICK: 70,
              VIDEO_START: 30,
              QUARTILE_95_PERCENT_VIEW: 15,
              VIDEO_10S_VIEW: 40,
              SAVE: 10,
              IMPRESSION: 250,
              PIN_CLICK: 20,
              REACTIONS: 70,
              COMMENTS: 20
            }
          },
          {
            date: '2023-10-21',
            metrics: {
              VIDEO_V50_WATCH_TIME: 80,
              OUTBOUND_CLICK: 40,
              VIDEO_START: 15,
              QUARTILE_95_PERCENT_VIEW: 8,
              VIDEO_10S_VIEW: 25,
              SAVE: 3,
              IMPRESSION: 180,
              PIN_CLICK: 12,
              REACTIONS: 45,
              COMMENTS: 8
            }
          },
          {
            date: '2023-10-22',
            metrics: {
              VIDEO_V50_WATCH_TIME: 120,
              OUTBOUND_CLICK: 60,
              VIDEO_START: 25,
              QUARTILE_95_PERCENT_VIEW: 12,
              VIDEO_10S_VIEW: 35,
              SAVE: 8,
              IMPRESSION: 220,
              PIN_CLICK: 18,
              REACTIONS: 60,
              COMMENTS: 15
            }
          },
          {
            date: '2023-10-23',
            metrics: {
              VIDEO_V50_WATCH_TIME: 90,
              OUTBOUND_CLICK: 45,
              VIDEO_START: 18,
              QUARTILE_95_PERCENT_VIEW: 9,
              VIDEO_10S_VIEW: 28,
              SAVE: 4,
              IMPRESSION: 190,
              PIN_CLICK: 14,
              REACTIONS: 55,
              COMMENTS: 12
            }
          },
          {
            date: '2023-10-24',
            metrics: {
              VIDEO_V50_WATCH_TIME: 130,
              OUTBOUND_CLICK: 65,
              VIDEO_START: 28,
              QUARTILE_95_PERCENT_VIEW: 14,
              VIDEO_10S_VIEW: 38,
              SAVE: 12,
              IMPRESSION: 270,
              PIN_CLICK: 22,
              REACTIONS: 75,
              COMMENTS: 25
            }
          },
          {
            date: '2023-10-25',
            metrics: {
              VIDEO_V50_WATCH_TIME: 110,
              OUTBOUND_CLICK: 55,
              VIDEO_START: 22,
              QUARTILE_95_PERCENT_VIEW: 11,
              VIDEO_10S_VIEW: 32,
              SAVE: 6,
              IMPRESSION: 210,
              PIN_CLICK: 16,
              REACTIONS: 65,
              COMMENTS: 18
            }
          },
        ]
      },
      {
        title: '10 ways to make money online',
        date: '2023-10-20',
        metrics: [
          {
            date: '2023-10-20',
            metrics: {
              VIDEO_V50_WATCH_TIME: 100,
              OUTBOUND_CLICK: 50,
              VIDEO_START: 20,
              QUARTILE_95_PERCENT_VIEW: 10,
              VIDEO_10S_VIEW: 30,
              SAVE: 5,
              IMPRESSION: 200,
              PIN_CLICK: 15,
              REACTIONS: 50,
              COMMENTS: 10
            }
          },
          {
            date: '2023-10-21',
            metrics: {
              VIDEO_V50_WATCH_TIME: 150,
              OUTBOUND_CLICK: 70,
              VIDEO_START: 30,
              QUARTILE_95_PERCENT_VIEW: 15,
              VIDEO_10S_VIEW: 40,
              SAVE: 10,
              IMPRESSION: 250,
              PIN_CLICK: 20,
              REACTIONS: 70,
              COMMENTS: 20
            }
          },
          {
            date: '2023-10-22',
            metrics: {
              VIDEO_V50_WATCH_TIME: 80,
              OUTBOUND_CLICK: 40,
              VIDEO_START: 15,
              QUARTILE_95_PERCENT_VIEW: 8,
              VIDEO_10S_VIEW: 25,
              SAVE: 3,
              IMPRESSION: 180,
              PIN_CLICK: 12,
              REACTIONS: 45,
              COMMENTS: 8
            }
          },
          {
            date: '2023-10-23',
            metrics: {
              VIDEO_V50_WATCH_TIME: 120,
              OUTBOUND_CLICK: 60,
              VIDEO_START: 25,
              QUARTILE_95_PERCENT_VIEW: 12,
              VIDEO_10S_VIEW: 35,
              SAVE: 8,
              IMPRESSION: 220,
              PIN_CLICK: 18,
              REACTIONS: 60,
              COMMENTS: 15
            }
          },
          {
            date: '2023-10-24',
            metrics: {
              VIDEO_V50_WATCH_TIME: 90,
              OUTBOUND_CLICK: 45,
              VIDEO_START: 18,
              QUARTILE_95_PERCENT_VIEW: 9,
              VIDEO_10S_VIEW: 28,
              SAVE: 4,
              IMPRESSION: 190,
              PIN_CLICK: 14,
              REACTIONS: 55,
              COMMENTS: 12
            }
          },
          {
            date: '2023-10-25',
            metrics: {
              VIDEO_V50_WATCH_TIME: 130,
              OUTBOUND_CLICK: 65,
              VIDEO_START: 28,
              QUARTILE_95_PERCENT_VIEW: 14,
              VIDEO_10S_VIEW: 38,
              SAVE: 12,
              IMPRESSION: 270,
              PIN_CLICK: 22,
              REACTIONS: 75,
              COMMENTS: 25
            }
          },
        ]
      },
      {
        title: 'creating the best knowledge graphs',
        date: '2023-10-21',
        metrics: [
          {
            date: '2023-10-21',
            metrics: {
              VIDEO_V50_WATCH_TIME: 110,
              OUTBOUND_CLICK: 55,
              VIDEO_START: 22,
              QUARTILE_95_PERCENT_VIEW: 11,
              VIDEO_10S_VIEW: 32,
              SAVE: 6,
              IMPRESSION: 210,
              PIN_CLICK: 16,
              REACTIONS: 65,
              COMMENTS: 18
            }
          },
          {
            date: '2023-10-22',
            metrics: {
              VIDEO_V50_WATCH_TIME: 140,
              OUTBOUND_CLICK: 75,
              VIDEO_START: 35,
              QUARTILE_95_PERCENT_VIEW: 16,
              VIDEO_10S_VIEW: 45,
              SAVE: 9,
              IMPRESSION: 230,
              PIN_CLICK: 25,
              REACTIONS: 80,
              COMMENTS: 20
            }
          },
          {
            date: '2023-10-23',
            metrics: {
              VIDEO_V50_WATCH_TIME: 95,
              OUTBOUND_CLICK: 55,
              VIDEO_START: 20,
              QUARTILE_95_PERCENT_VIEW: 10,
              VIDEO_10S_VIEW: 30,
              SAVE: 5,
              IMPRESSION: 190,
              PIN_CLICK: 15,
              REACTIONS: 50,
              COMMENTS: 15
            }
          },
          {
            date: '2023-10-24',
            metrics: {
              VIDEO_V50_WATCH_TIME: 125,
              OUTBOUND_CLICK: 65,
              VIDEO_START: 30,
              QUARTILE_95_PERCENT_VIEW: 14,
              VIDEO_10S_VIEW: 40,
              SAVE: 10,
              IMPRESSION: 250,
              PIN_CLICK: 20,
              REACTIONS: 70,
              COMMENTS: 25
            }
          },
          {
            date: '2023-10-25',
            metrics: {
              VIDEO_V50_WATCH_TIME: 95,
              OUTBOUND_CLICK: 55,
              VIDEO_START: 20,
              QUARTILE_95_PERCENT_VIEW: 10,
              VIDEO_10S_VIEW: 30,
              SAVE: 5,
              IMPRESSION: 190,
              PIN_CLICK: 15,
              REACTIONS: 50,
              COMMENTS: 15
            }
          },
          {
            date: '2023-10-24',
            metrics: {
              VIDEO_V50_WATCH_TIME: 130,
              OUTBOUND_CLICK: 65,
              VIDEO_START: 28,
              QUARTILE_95_PERCENT_VIEW: 14,
              VIDEO_10S_VIEW: 38,
              SAVE: 12,
              IMPRESSION: 270,
              PIN_CLICK: 22,
              REACTIONS: 75,
              COMMENTS: 25
            }
          },
        ]
      },
      {
        title: 'best ways to cook lentils',
        date: '2023-10-22',
        metrics: [
          {
            date: '2023-10-22',
            metrics: {
              VIDEO_V50_WATCH_TIME: 115,
              OUTBOUND_CLICK: 50,
              VIDEO_START: 25,
              QUARTILE_95_PERCENT_VIEW: 10,
              VIDEO_10S_VIEW: 35,
              SAVE: 7,
              IMPRESSION: 200,
              PIN_CLICK: 15,
              REACTIONS: 55,
              COMMENTS: 12
            }
          },
          {
            date: '2023-10-23',
            metrics: {
              VIDEO_V50_WATCH_TIME: 85,
              OUTBOUND_CLICK: 35,
              VIDEO_START: 12,
              QUARTILE_95_PERCENT_VIEW: 6,
              VIDEO_10S_VIEW: 20,
              SAVE: 2,
              IMPRESSION: 160,
              PIN_CLICK: 10,
              REACTIONS: 40,
              COMMENTS: 5
            }
          },
          {
            date: '2023-10-24',
            metrics: {
              VIDEO_V50_WATCH_TIME: 125,
              OUTBOUND_CLICK: 65,
              VIDEO_START: 30,
              QUARTILE_95_PERCENT_VIEW: 14,
              VIDEO_10S_VIEW: 40,
              SAVE: 10,
              IMPRESSION: 250,
              PIN_CLICK: 20,
              REACTIONS: 70,
              COMMENTS: 25
            }
          },
          {
            date: '2023-10-25',
            metrics: {
              VIDEO_V50_WATCH_TIME: 95,
              OUTBOUND_CLICK: 55,
              VIDEO_START: 20,
              QUARTILE_95_PERCENT_VIEW: 10,
              VIDEO_10S_VIEW: 30,
              SAVE: 5,
              IMPRESSION: 190,
              PIN_CLICK: 15,
              REACTIONS: 50,
              COMMENTS: 15
            }
          },
        ]
      },
      {
        title: 'cooking lentils without onions and other ingredients',
        date: '2023-10-23',
        metrics: [
          {
            date: '2023-10-23',
            metrics: {
              VIDEO_V50_WATCH_TIME: 140,
              OUTBOUND_CLICK: 75,
              VIDEO_START: 35,
              QUARTILE_95_PERCENT_VIEW: 16,
              VIDEO_10S_VIEW: 45,
              SAVE: 9,
              IMPRESSION: 230,
              PIN_CLICK: 25,
              REACTIONS: 80,
              COMMENTS: 20
            }
          },
          {
            date: '2023-10-24',
            metrics: {
              VIDEO_V50_WATCH_TIME: 130,
              OUTBOUND_CLICK: 65,
              VIDEO_START: 28,
              QUARTILE_95_PERCENT_VIEW: 14,
              VIDEO_10S_VIEW: 38,
              SAVE: 12,
              IMPRESSION: 270,
              PIN_CLICK: 22,
              REACTIONS: 75,
              COMMENTS: 25
            }
          },
          {
            date: '2023-10-25',
            metrics: {
              VIDEO_V50_WATCH_TIME: 110,
              OUTBOUND_CLICK: 55,
              VIDEO_START: 22,
              QUARTILE_95_PERCENT_VIEW: 11,
              VIDEO_10S_VIEW: 32,
              SAVE: 6,
              IMPRESSION: 210,
              PIN_CLICK: 16,
              REACTIONS: 65,
              COMMENTS: 18
            }
          },
        ]
      },
      {
        title: 'My moms recipe for potato chips',
        date: '2023-10-24',
        metrics: [
          {
            date: '2023-10-24',
            metrics: {
              VIDEO_V50_WATCH_TIME: 120,
              OUTBOUND_CLICK: 60,
              VIDEO_START: 25,
              QUARTILE_95_PERCENT_VIEW: 12,
              VIDEO_10S_VIEW: 35,
              SAVE: 8,
              IMPRESSION: 220,
              PIN_CLICK: 18,
              REACTIONS: 60,
              COMMENTS: 15
            }
          },
          {
            date: '2023-10-25',
            metrics: {
              VIDEO_V50_WATCH_TIME: 80,
              OUTBOUND_CLICK: 40,
              VIDEO_START: 15,
              QUARTILE_95_PERCENT_VIEW: 8,
              VIDEO_10S_VIEW: 25,
              SAVE: 3,
              IMPRESSION: 180,
              PIN_CLICK: 12,
              REACTIONS: 45,
              COMMENTS: 8
            }
          },
        ]
      },
      {
        title: 'the best cooking tray to grill salmon',
        date: '2023-10-25',
        metrics: [
          {
            date: '2023-10-25',
            metrics: {
              OUTBOUND_CLICK: 70,
              VIDEO_START: 30,
              QUARTILE_95_PERCENT_VIEW: 15,
              VIDEO_10S_VIEW: 40,
              SAVE: 10,
              IMPRESSION: 250,
              PIN_CLICK: 20,
              REACTIONS: 70,
              COMMENTS: 20
            }
          }
        ]
      }
    ]

    return {
      props: {
        signedIn: true,
        dash: true,
        // return all the posts
        data: allPsts,
        options
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