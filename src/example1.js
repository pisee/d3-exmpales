var d3 = require("d3");
axios = require('axios');

// var dataSet = [300, 150, 5, 60, 240]

/*
d3.select("#myGraph")
    .append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", dataSet[0])
    .attr("height", "20px")
*/

dataSet = []
axios.get('http://localhost:3000/example1')
    .then(response => {
        dataSet = response.data
        console.log(dataSet)
        
        d3.select("#myGraph")
            .selectAll("rect")
            .data(dataSet)
            .enter()
            .append("rect")
            .attr("x", 10)
            .attr("y", (d,i)=>{return i*25})
            .attr("height", "20")
            .attr("width", "0")
            .transition()
            .delay((d,i)=>{return i*500})
            .duration(2500)
            .attr("width", (d,i)=>{return d})
        
        d3.select("#myGraph")
            .selectAll("rect")
            .on("click", function() {
                d3.select(this)
                  .style('fill', 'orange');
              });

        var xScale = d3.scaleLinear()
                .domain([0,300])
                .range([0,300])

        var xAxis = d3.axisBottom()
                        .scale(xScale);

        d3.select("#myGraph")
            .append("g")
            .attr("class", "axis")
            .attr("transform", "translate(10, "+((1+dataSet.length) * 20 +5) + ")")
            .call(xAxis)
    })


d3.select("#updateButton")
    .on("click", ()=>{
        for(var i=0; i<dataSet.length; i++){
            dataSet[i] = Math.floor(Math.random()*320);
        }
        d3.select("#myGraph")
            .selectAll("rect")
            .data(dataSet)
            .transition()
            .attr("width", (d,i)=>{return d})
    })

