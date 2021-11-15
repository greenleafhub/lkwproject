document.addEventListener("DOMContentLoaded", function () {
    //reference: https://stackoverflow.com/questions/52556833/d3-multiline-chart-from-json//
    var margin = {
            top: 20,
            right: 20,
            bottom: 50,
            left: 40
        },
        svgWidth = 600,
        svgHeight = 300,
        width = svgWidth - margin.left - margin.right,
        height = svgHeight - margin.top - margin.bottom;

    d3.json("https://api.npoint.io/cdbb11536e0322ac5f2c").then(function (data) {

        // Set the ranges
        var x = d3.scaleLinear().range([0, width]);

        var y = d3.scaleLinear().range([height, 0]);

        // Define the axes
        var xAxis = d3.axisBottom()
            .scale(x)
        //.tickSize(-height);

        var yAxis = d3.axisLeft()
            .scale(y)
        //.tickSize(-width);

        var valueline = d3.line()
            .curve(d3.curveBasis)
            .x(d => x(d.month))
            .y(d => y(d.Sunshine));

        // Adds the svg canvas
        var g = d3.select("#sunshineChart")
            .append("svg")
            .attr("width", svgWidth)
            .attr("height", svgHeight)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        drawGraph(null, data);

        function drawGraph(error, data) {

            x.domain(d3.extent(data[0].weather, d => d.month));
            y.domain([0, d3.max(data, d => d3.max(d.weather, g => g.Sunshine)) + 1]);

            // Add the X Axis
            g.append("g")
                .attr("class", "x axis")
                .attr("transform", `translate(0,${height})`)
                .call(xAxis)
                .selectAll("text")
                .attr("y", 15)
                .attr("x", 0)
                .attr("dy", ".35em");

            // Add the Y Axis
            g.append("g")
                .attr("class", "y axis")
                .call(yAxis)
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("x", -6)
                .attr("y", 6)
                .attr("dy", "0.5em")
                .attr("fill", "#000")
                .text("Sunshine per month (hours)");

            g.selectAll(".city")
                .data(data)
                .enter()
                .append("path")
                .attr('class', d => 'city' + ' ' + d.city)
                .attr("d", d => valueline(d.weather));



        }

        //ref: https://gist.github.com/jwilber/799a23329e5335cdc5d0bafdf8855cd8//
        const colDict = {
            HK: "palevioletred",
            London: "slateblue",
            Sydney: "goldenrod",
            Toronto: "lightseagreen"
        }
        var legend_keys = ["HK", "London", "Sydney", "Toronto"]

        var lineLegend = g.selectAll(".lineLegend").data(legend_keys)
            .enter().append("g")
            .attr("class", "lineLegend")
            .attr("transform", function (d, i) {
                return "translate(" + (margin.left) + "," + (i * 14) + ")";
            });

        lineLegend.append("text").text(function (d) {
                return d;
            })
            .attr("transform", "translate(15, 6)"); //align texts with boxes

        lineLegend.append("rect")
            .attr("fill", d => colDict[d])
            .attr("width", 12).attr('height', 4);



    })
})