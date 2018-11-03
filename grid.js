// Based on this demo:
// https://bl.ocks.org/cagrimmett/07f8c8daea00946b9e704e3efcbd5739

var totalCost = 20869000; // $21 million est. for one week for Philly
// var totalCost = 1085188000; // $21 million est. for one week per PERF presentation PDF
var costPerSquare = totalCost / 100;

// ~$210,000 per square, per week. Would be ~$11 million per square per year
console.log('cost per square is ' + costPerSquare);

var accumulatedCost = 0;
var fillBoxes = 0;

var options = [
  {
    "name": "Skatepark",
    "description": "8,000 square feet of neighborhood skatepark will serve a neighborhood of about 25,000 residents.",
    "cost": 320000,
    "quantity": null
  },
  {
    "name": "Computers",
    "description": "Buy Macbooks for students of Northeast Philadelphia High School (3600 students).",
    "cost": 2764800,
    "quantity": null
  },
  {
    "name": "Music Education Program",
    "description": "Fund a K-12 Music Education program for Northeast Philadelphia, 3600 students",
    "cost": 673200,
    "quantity": null
  },
  {
    "name": "Science Lab",
    "description": "NSTA recommends 1,440 square feet for one lab serving 24 students.",
    "cost": 342500,
    "quantity": null
  },
  {
    "name": "Math Camp Tuition",
    "description": "Send one student to summer math camp.",
    "cost": 1522,
    "quantity": null
  },
  {
    "name": "Home Renovation",
    "description": "Renovate a Northeast Philly Home.",
    "cost": 127000,
    "quantity": null
  },
  {
    "name": "Home Construction",
    "description": "Build a Northeast Philly Home.",
    "cost": 295000,
    "quantity": null
  },
  {
    "name": "Cultural Center",
    "description": "Build a Cultural or Performing Arts Center.",
    "cost": 18500000,
    "quantity": null
  },
  {
    "name": "Philadelphia Works",
    "description": "Philadelphia Works connects employers to a skilled workforce and helps individuals develop the skills needed to thrive in the workplace. Cover one year of their operational costs.",
    "cost": 100000000,
    "quantity": null
  },
  {
    "name": "Playground",
    "description": "One acre of a Philadelphia playground.",
    "cost": 3600,
    "quantity": null
  }
];

// https://stackoverflow.com/a/2901298
function commify(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function gridData(cost) {
    console.log('gridData adding cost ' + cost);
    accumulatedCost += cost;
    console.log('accumulated cost: ' + accumulatedCost);
    document.getElementById('totalDisplay').innerHTML = "$" + commify(accumulatedCost);

    var remaining = totalCost - accumulatedCost;
    document.getElementById('remainder').innerHTML = "$" + commify(remaining);

    fillBoxes = accumulatedCost / costPerSquare;
    console.log('fills boxes: ' + fillBoxes);

    var data = new Array();
    var idCounter = 1;
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

// Start at 0
var data = gridData(0);
// I like to log the data to the console for quick debugging
console.log(data);

var grid = d3.select("#grid")
    .append("svg")
    .attr("width","510px")
    .attr("height","510px");

var row = grid.selectAll(".row")
    .data(data)
    .enter().append("g")
    .attr("class", "row");

// Define the div for the tooltip
var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var column = row.selectAll(".square")
    .data(function(d) { return d; })
    .enter().append("rect")
    .attr("class","square")
    .attr("x", function(d) { return d.x; })
    .attr("y", function(d) { return d.y; })
    .attr("width", function(d) { return d.width; })
    .attr("height", function(d) { return d.height; })
    .style("fill", function(d) {
        console.log('fillBoxes: ' + fillBoxes);
        return d.id >= fillBoxes ? "#fff" : "#2C93E8";
    })
    .style("stroke", "#222")
    .on("mouseover", function(d) {
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div .html(d.id + "<br/>")
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
            })
        .on("mouseout", function(d) {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        });

// TODO: update with a supplied amount
function updateButton() {
    console.log('update costs');
    gridData(300000);

    row.selectAll(".square")
    .data(function(d) { return d; })
    .style("fill", function(d) {
        return d.id >= fillBoxes ? "#fff" : "#2C93E8";
    });
}

document.getElementById('updateBtn').onclick = updateButton;
var container = document.getElementById('spendOptions');

for (var i=0; i < options.length; i++) {
    var opt = options[i];
    console.log(opt);

    var checkboxDiv = document.createElement('div');
    checkboxDiv.classList.add('checkbox');
    var checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    checkbox.name = opt.name;
    checkbox.value = opt.cost;
    checkbox.id = i;
    checkbox.onclick = function() {
        console.log('clicked for ' + opt.name);
        gridData(opt.cost);
    }

    var label = document.createElement('label')
    label.htmlFor = i;
    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(opt.name + ": $" + commify(opt.cost)));

    checkboxDiv.appendChild(label);
    container.appendChild(checkboxDiv);

    var descDiv = document.createElement('div');
    descDiv.appendChild(document.createTextNode(opt.description));
    descDiv.classList.add('option-desc');
    container.appendChild(descDiv);
    container.appendChild(document.createElement('br'));
}