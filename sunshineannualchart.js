document.addEventListener("DOMContentLoaded", function () {

    //ref:https://bl.ocks.org/d3noob/183abfcee0670fa49998afc695a8f5ad//
    
    // set the dimensions and margins of the graph
    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 400 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;
    
    // set the ranges
    var x = d3.scaleBand()
              .range([0, width])
              .padding(0.1);
    var y = d3.scaleLinear()
              .range([height, 0]);
              
    // append the svg object to the body of the page
    // append a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3.select("#sunshineannualchart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")");
    
    // get the data
    d3.json("https://api.npoint.io/fc6715e641f9195fd7b5").then(function(data) {
    
      // format the data
      data.forEach(function(d) {
        d.Sunshine = +d.Sunshine;
      });
    
      // Scale the range of the data in the domains
      x.domain(data.map(function(d) { return d.City; }));
      y.domain([0, d3.max(data, function(d) { return d.Sunshine; })]);
    
      // append the rectangles for the bar chart
      svg.selectAll(".bar")
          .data(data)
        .enter().append("rect")
          .attr("class", "bar")
          .attr("x", function(d) { return x(d.City); })
          .attr("width", x.bandwidth())
          .attr("y", function(d) { return y(d.Sunshine); })
          .attr("height", function(d) { return height - y(d.Sunshine); });
    
      // add the x Axis
      svg.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x));
    
      // add the y Axis
      svg.append("g")
          .call(d3.axisLeft(y))
          .append("text")
          .attr("transform", "rotate(-90)")
          .attr("x", -6)
          .attr("y", 6)
          .attr("dy", "0.5em")
          .attr("fill", "#000")
          .text("Total Sunshine (hours)");
    
    });
    })