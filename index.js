import * as d3 from "d3"


const width = 650;
const height = 400;
const margin = { top: 20, right: 5, bottom: 20, left: 35 };


 async function getData() {
    
    
 const response = await fetch ('https://raw.githubusercontent.com/sxywu/react-d3-example/master/public/sf.json')
 
 const data = await response.json();

 return data.map(d => Object.assign(d, {date: new Date(d.date)}))

}
const data = await getData()


 //Data we are fetching -
 /*{
       date: Wed Apr 12 2017 00:00:00 GMT+0530 (India Standard Time), 
       high: 64, 
       avg: 59, 
       low: 54
}*/
const slicedData = data.slice(0,10);

const xExtent = d3.extent(slicedData, d => d.date);
const xScale = d3.scaleTime()
 .domain(xExtent)
 .range([margin.left, width - margin.right]);



 
//min: low temp , max: high temp

const highMax = d3.max(slicedData, d => d.high );

const lowMin = d3.min(slicedData, d => d.low);


const yScale = d3.scaleLinear()
  .domain([lowMin , highMax])
  .range([height - margin.bottom , margin.top])



  
const colorExtent = d3.extent(slicedData, d => d.avg).reverse()

//map avg temp to color
const colorScale = d3.scaleSequential()
 .domain(colorExtent)
 .interpolator(d3.interpolateRdYlBu)


  //create line generator
  const highLine = d3.line()
  .x(d => xScale(d.date))
  .y(d => yScale(d.avg))

// creating axes

  const yAxis = d3.axisLeft()
      .scale(yScale)

  const xAxis = d3.axisBottom()
     .scale(xScale)




function barChartData(){

return slicedData.map(d =>{
    return {
        x: xScale(d.date),
        y: yScale(d.high),
        height: yScale(d.low) - yScale(d.high),
        fill: colorScale(d.avg),
        path: highLine(slicedData)
    }
})
}






const svg = d3.select("svg")
 .attr("width", width)
 .attr("height", height)
  
  const bars = svg.selectAll('rect')
    .data(barChartData).enter().append('rect')
    .attr('x', d => d.x)
    .attr('y', d => d.y)
    .attr('width', 50)
    .attr('height', d => d.height)
    .attr("fill", d => d.fill)
   


const lines = svg.selectAll('path')
.data(barChartData).enter().append('path')
.attr('d', d => d.path)
.attr('fill', 'none')
.attr('stroke-width', 2)
.attr('stroke', d => d.fill)


 const drawXAxis = svg.append("g")
      .attr("transform" , `translate(0, ${height - margin.bottom})`)
     .call(xAxis)
 const drawYaxis = svg.append("g")
 .attr("transform" , `translate( ${margin.left}, 0)`)
     .call(yAxis)
   