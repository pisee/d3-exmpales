var d3 = require("d3");
axios = require('axios');

var svgWidth = 320;
var svgHeight = 240;
var offsetX = 30;
var offsetY = 20;

// 풍선도움말
var tooltip = d3.select("body")
    .append("div")
    .attr("class", "tip")

var dataSet = []
axios.get('http://localhost:3000/example2')
    .then(response => {
        dataSet = response.data
        d3.select("#myGraph")
            .selectAll("circle")
            .data(dataSet)
            .enter()
            .append("circle")
            .attr("class", "mark")
            .attr("cx", svgWidth/2+offsetX)
            .attr("cy", svgHeight/2-offsetY)
            .attr("r",100)
            .attr("opacity", 0)
            .transition()
            .duration(2000)
            .ease(d3.easeBounce)
            .attr("cx", (d,i)=>{return d[0]+offsetX})
            .attr("cy", (d,i)=>{return svgHeight-d[1]-offsetY})
            .attr("r",5)
            .attr("opacity", 1.0)

        drawScale();
        setTooltip();
    })
    
function updateData(data){
    var result = data.map(function(d,i){
        var x = Math.random() * (svgWidth-offsetX);
        var y = Math.random() * (svgHeight-offsetY);
        return [x,y];
    })
    console.log(result, "")
    return result;
}

function updateGraph(){

    d3.select("#myGraph")
        .selectAll("circle")
        .remove()
    
    d3.select("#myGraph")
        .selectAll("circle")
        .data(dataSet)
        .enter()
        .append("circle")
        .attr("class", "mark")
        .attr("cx", svgWidth/2+offsetX)
        .attr("cy", svgHeight/2-offsetY)
        .attr("r",100)
        .attr("opacity", 0)
        .transition()
        .ease(d3.easeBounce)
        .duration(2000)
        .attr("cx", (d,i)=>{return d[0]+offsetX})
        .attr("cy", (d,i)=>{return svgHeight-d[1]-offsetY})
        .attr("r",5)
        .attr("opacity", 1.0)
    
    tooltip.style("visibility", "hidden")
    setTooltip()
}

function drawScale(){
    // 눈금
    var maxX = d3.max(dataSet, d=>d[0])
    var maxY = d3.max(dataSet, d=>d[1])

    var yScale = d3.scaleLinear()
        .domain([0,maxY])
        .range([maxY, 0])
    var yAxis = d3.axisLeft(yScale)
  
    var xScale = d3.scaleLinear()
        .domain([0,maxX])
        .range([0,maxX])
    var xAxis = d3.axisBottom(xScale).ticks(6)
    
    d3.select("#myGraph")
        .append("g")
        // .attr("class", "axis")
        .attr("transform", "translate("+ offsetX +", "+ (svgHeight-maxY-offsetY) + ")")
        .call(yAxis)
    
    d3.select("#myGraph")
        .append("g")
        // .attr("class", "axis")
        .attr("transform", "translate("+ offsetX +", "+ (svgHeight-offsetY) + ")")
        .call(xAxis)

    // 그리드
    var grid = d3.select("#myGraph").append("g")
    var rangeX = d3.range(50, maxX, 50)
    var rangeY = d3.range(20, maxY, 20)

    grid.selectAll("line.y")
        .data(rangeY)
        .enter()
        .append("line")
        .attr("class", "grid")
        .attr("x1", offsetX)
        .attr("y1", function(d,i){
            return svgHeight - d - offsetY
        })
        .attr("x2", maxX + offsetX)
        .attr("y2", function(d,i){
            return svgHeight - d -offsetY
        })

    grid.selectAll("line.x")
        .data(rangeX)
        .enter()
        .append("line")
        .attr("class", "grid")
        .attr("x1", function(d,i){
            return d + offsetX
        })
        .attr("y1", svgHeight - offsetY)
        .attr("x2", function(d,i){
            return d + offsetX
        })
        .attr("y2", svgHeight - offsetY - maxY)
        
}

function setTooltip(){
    d3.select("#myGraph")
        .selectAll("circle")
        .on("mouseover", function(d,i){
            var x = parseInt(d[0]);
            var y = parseInt(d[1]);
            var data = d3.select(this).datum()
            var dx = parseInt(data[0])
            var dy = parseInt(data[1])

            tooltip
                .style("left", offsetX + x + "px")
                .style("top", svgHeight + offsetY - y + "px")
                .style("visibility", "visible")
                .text(dx + ", " + dy)
        })
        .on("mouseout", function(){
            tooltip.style("visibility", "hidden")
        })
}


setInterval(function(){
    dataSet = updateData(dataSet);
    updateGraph();
}, 4000);

