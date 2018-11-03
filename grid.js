// Based on this demo:
// https://bl.ocks.org/cagrimmett/07f8c8daea00946b9e704e3efcbd5739

var totalCost = 20869000; // $21 million est. for one week for Philly
//var totalCost = 1085188000; /// $21 million est. for one week per PERF presentation PDF
var costPerSquare = totalCost / 100;

// ~$210,000 per square, per week. Would be ~$11 million per square per year
console.log('cost per square is ' + costPerSquare);

function gridData() {
    var data = new Array();
    var idCounter = 0;
    var xpos = 1; //starting xpos and ypos at 1 so the stroke will show when we make the grid below
    var ypos = 1;
    var width = 50;
    var height = 50;
    var click = 0;

    // iterate for rows
    for (var row = 0; row < 10; row++) {
        data.push( new Array() );

        // iterate for cells/columns inside rows
        for (var column = 0; column < 10; column++) {
            data[row].push({
                x: xpos,
                y: ypos,
                width: width,
                height: height,
                click: click,
                id: idCounter
            })
            // increment the x position. I.e. move it over by 50 (width variable)
            xpos += width;
            idCounter++;
        }
        // reset the x position after a row is complete
        xpos = 1;
        // increment the y position for the next row. Move it down 50 (height variable)
        ypos += height;
    }
    return data;
}

var gridData = gridData();
// I like to log the data to the console for quick debugging
console.log(gridData);

var grid = d3.select("#grid")
    .append("svg")
    .attr("width","510px")
    .attr("height","510px");

var row = grid.selectAll(".row")
    .data(gridData)
    .enter().append("g")
    .attr("class", "row");

var column = row.selectAll(".square")
    .data(function(d) { return d; })
    .enter().append("rect")
    .attr("class","square")
    .attr("x", function(d) { return d.x; })
    .attr("y", function(d) { return d.y; })
    .attr("width", function(d) { return d.width; })
    .attr("height", function(d) { return d.height; })
    .style("fill", "#fff")
    .style("stroke", "#222")
    .on('click', function(d) {
       d.click++;
       console.log(d.id);
       if ((d.click)%4 == 0 ) { d3.select(this).style("fill","#fff"); }
       if ((d.click)%4 == 1 ) { d3.select(this).style("fill","#2C93E8"); }
       if ((d.click)%4 == 2 ) { d3.select(this).style("fill","#F56C4E"); }
       if ((d.click)%4 == 3 ) { d3.select(this).style("fill","#838690"); }
    });
