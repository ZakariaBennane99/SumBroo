import React, { useState, useRef, useEffect } from 'react';
import Select from 'react-select';
import * as d3 from 'd3';

const MultiLineChart = ({ data, setMetrics1 }) => {

  const containerRef = useRef();
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {

    function handleResize() {
        if (containerRef.current) {
            setContainerWidth(containerRef.current.offsetWidth);
        }
    }

    handleResize(); // initial call

    window.addEventListener('resize', handleResize);

    return () => {
        window.removeEventListener('resize', handleResize);
    }

  }, []);

  const [targetMetrics, setTargetMetrics] = useState(null);

  const [showTooltip, setShowTooltip] = useState(false);

  const handleMouseEnter = () => {
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  const ref = useRef();

  const options = [
    { value: 'Impressions (# of times your pin was on-screen)', label: 'Impressions (# of times your pin was on-screen)' },
    { value: 'Pin saves', label: 'Pin saves' },
    { value: 'Destination link clicks', label: 'Destination Link Clicks' }
  ];

  const customStyles = {
    container: (provided) => ({
      ...provided,
      width: '100%',
    }),
    option: (provided, state) => ({
      ...provided,
      color: state.isSelected ? 'white' : '#1c1c57',
    })
  };

  function handleMetrics(selectedOptions) {
    setTargetMetrics(selectedOptions)
  }

  useEffect(() => {
    setMetrics1(targetMetrics)
  }, [targetMetrics]);


  useEffect(() => {

    const aspectRatioWidth = 2;
    const aspectRatioHeight = 1;

    const margin = { top: 20, right: 20, bottom: 30, left: 50 };
    const width = (containerWidth - 30) - margin.left - margin.right;
    const height = ((containerWidth / aspectRatioWidth) * aspectRatioHeight) - margin.top - margin.bottom;

    const svg = d3.select(ref.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create a div for the tooltip
    const tooltip = d3.select(ref.current.parentNode)
      .append('div')
      .style('width', '150px')
      .style('height', 'fit-content')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background', '#8383a4')
      .style('color', 'white')
      .style('padding', '5px')
      .style('border-radius', '3px');

    const xScale = d3.scaleTime()
      .domain(d3.extent(data, d => d.date))
      .range([0, width]);

    // Get all platforms and metrics from the data
    const platforms = Object.keys(data[0]).filter(key => key !== 'date');
    const metrics = platforms.reduce((acc, platform) => {
      return { ...acc, [platform]: Object.keys(data[0][platform]) };
    }, {});

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => {
        // Get the maximum value across all platforms and metrics
        return Math.max(...platforms.map(platform => {
          return Math.max(...metrics[platform].map(metric => d[platform][metric]));
        }));
      })])
      .range([height, 0]);

    const lineGenerator = platform => metric => d3.line()
      .x(d => xScale(d.date))
      .y(d => yScale(d[platform][metric]));

    const colorMapping = {
      'Impressions (# of times your pin was on-screen)': '#1f77b4',
      'Pin saves': '#ff7f0e',
      'Destination link clicks': '#d62728',
    };
      

    svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale)
    .tickFormat(d3.timeFormat("%B %d"))
    .tickValues(data.map(d => d.date))); // updated line

    svg.append("g")
      .call(d3.axisLeft(yScale));

    platforms.forEach(function (platform, platformIdx) {
      metrics[platform].forEach(function (metric, metricIdx) {
        svg.append("path")
          .datum(data)
          .attr("fill", "none")
          .attr("stroke", colorMapping[metric])
          .attr("stroke-linejoin", "round")
          .attr("stroke-linecap", "round")
          .attr("stroke-width", 1.5)
          .attr("d", lineGenerator(platform)(metric));

        // Add circles (data points)
        svg.selectAll(`.dot-${platform}-${metric.replace(/\s/g, '-').replace(/[()]/g, '')}`)
        .data(data)
        .enter().append("circle")
        .attr("class", `dot-${platform}-${metric.replace(/\s/g, '-').replace(/[()]/g, '')}`)
          .attr("cx", d => xScale(d.date))
          .attr("cy", d => yScale(d[platform][metric]))
          .attr("r", 3)
          .style("fill", colorMapping[metric])
          .on("mouseover", function (event, d) {
            // Show tooltip on mouseover
            const fillColor = d3.select(this).style('fill');
            tooltip.style('visibility', 'visible')
              .html(`${metric}<br>Value: <b>${d[platform][metric]}</b><br>Date: <b>${d.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</b>`)
              .style('top', `${event.pageY - 10}px`)
              .style('left', `${event.pageX + 10}px`)
              .style('font-family', 'Arial, Helvetica, sans-serif')
              .style('font-size', '1.1em')
              .style('padding', '6px')
              .style('background', fillColor);
              svg.append("circle")
                .attr("class", "halo")
                .attr("cx", xScale(d.date))
                .attr("cy", yScale(d[platform][metric]))
                .attr("r", 6)
                .style("fill", colorMapping[metric])
                .style("opacity", 0.3);
          })
          .on("mouseout", function () {
            // Hide tooltip on mouseout
            tooltip.style('visibility', 'hidden');
            svg.selectAll(".halo").remove();
          });
      });
    });


    // cleanup funtion
    return () => {
      svg.selectAll("*").remove();
    }

  }, [data, containerWidth]);

  return (
    <div ref={containerRef} className='multiLineChart'>
        <div className='topArea'>
          <div className='interactive'>
            <div className='title'>Conversions Graph</div>
            <div className="question-mark-container">
                <div
                  className="question-mark"
                  onMouseOver={handleMouseEnter}
                  onMouseOut={handleMouseLeave}
                >
                  ?
                </div>
                    {showTooltip ? <div className="graphInfoTooltip">
                    This graph provides a comprehensive view of your pin's performance. It allows you to track key metrics such as website clicks and new followers, all in one place. By comparing these metrics with the total impressions, you can easily gauge the effectiveness of your pin in driving your desired outcomes. Whether your goal is to increase website traffic or grow your follower base, this graph offers valuable insights into your conversion rates.
                </div> : ''}
            </div>
          </div> 
          <Select
            value={targetMetrics}
            onChange={handleMetrics}
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
            placeholder='Select Metric/Metrics'
          /> 
        </div>
        <svg ref={ref}></svg>
    </div>
  )
}

export default MultiLineChart;
