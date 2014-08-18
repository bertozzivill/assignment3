// Goal: make a scatterplot of disaster data, 
// with color by class of data (complex, natural, or technological)

//Mike: this dataset is quite large, and its values are incredibly variable. 
// With that in mind, the point of this interactivity is to be able to set the
// maximum axis values you want, so you can see the data that are mostly hidden
// in the far corner of the plot.  
// (basically, this is a really bad 'zoom' function.)

//to use: type build(desired xMax, desired yMax) into the console.

//Width and height settings
var settings = {
	width: 500,
	height: 500,
	radius: 4,
	xPadding: 125,
	yPadding: 50,
	xVar: 'deaths',
	yVar: 'total_affected'
}


//create G element to hold circles/axes
myG=d3.select('#my-svg')
	.append('g')
	.attr('id', 'plotG')
	.attr('transform', 'translate(' + settings.xPadding + ',' + settings.yPadding + ')')


//Make a function that lets you pick the maximum axis values

var setCutoffs = function(xCutoff, yCutoff){
	var data_subset = data.filter(function(d){return (d[settings.xVar]<xCutoff) & (d[settings.yVar]<yCutoff)})
	return data_subset
}

var build = function(xCutoff, yCutoff){

	var current_data = setCutoffs(xCutoff, yCutoff)

	console.log(current_data.length)

	//SetScales()

	var xMax = d3.max(current_data, function(d){return d[settings.xVar]})
	var xMin = d3.min(current_data, function(d){return d[settings.xVar]})
	var yMax = d3.max(current_data, function(d){return d[settings.yVar]})
	var yMin = d3.min(current_data, function(d){return d[settings.yVar]})

	//create scales
	var xScale = d3.scale.linear().domain([xMin-5,xMax+5]).range([settings.radius, settings.width-settings.radius])
	var yScale = d3.scale.linear().domain([yMin-5,yMax+5]).range([settings.height-settings.radius, settings.radius])

	//axes
	var xAxisFunction = d3.svg.axis()
		.scale(xScale)
		.orient('bottom')
		.ticks(7)

	var yAxisFunction = d3.svg.axis()
		.scale(yScale)
		.orient('left')
		.ticks(10)

	colorScale = d3.scale.category10()

	d3.select('#my-svg').selectAll('.axis').remove()
	xAxis = d3.select('#my-svg')
		.append('g')
		.attr('class', 'axis')
		.attr('id', 'xAxis')
		.attr('transform', 'translate(' + (settings.xPadding) + ',' + (settings.height + settings.yPadding) + ')')
		.call(xAxisFunction)

	yAxis = d3.select('#my-svg')
		.append('g')
		.attr('id', 'yAxis')
		.attr('class', 'axis')
		.attr('transform', 'translate(' + (settings.xPadding) + ',' + (settings.yPadding) + ')')
		.call(yAxisFunction)

	//Function for circles
	// inside the 'build' function because it needs to use xScale... until I find a better way...
	var makeCircle = function(circle){
		circle
		.attr('r', settings.radius)
		.style('fill', function(d){return colorScale(d.class)})
		.style('opacity', '0.7')
		.attr('class', 'point')
		}

	var moveCircle = function(circle){
		circle
		.attr('cx', function(d){return xScale(d[settings.xVar])})
		.attr('cy', function(d){return yScale(d[settings.yVar])})
	}

	//d3.select('#plotG').selectAll('circle').remove()
	var circles = myG.selectAll('.point')
		.data(current_data)
	
	//console.log(circles[0].length)

	circles.exit().remove()

	circles.enter()
		.append('circle')
		.call(makeCircle)

	circles.transition().duration(500).call(moveCircle)


	drawLabels()
	drawLegend()

	}

//labels
var drawLabels = function(){
	var title = d3.select('#my-svg')
				.append('text')
				.attr('class', 'label')
				.attr('id', 'plotTitle')
				.attr('transform', 'translate(' + (settings.width/3 + settings.xPadding) + ',' + 25 + ')')
				.text('Global disasters: ' + settings.xVar + ' vs ' + settings.yVar)

	var xAxisLabel = d3.select('#my-svg')
					.append('text')
					.attr('class', 'label')
					.attr('transform', 'translate(' + (settings.width/2 + settings.xPadding) + ',' + (550 + settings.yPadding) + ')')
					.text(settings.xVar)

	var yAxisLabel = d3.select('#my-svg')
				.append('text')
				.attr('class', 'label')
				.attr('transform', 'translate(' + 25 + ',' + (settings.height/1.75 + settings.yPadding) + ') rotate(270)')
				.text(settings.yVar)
}

//legend (taken straight from your example, Mike-- but I typed it all out again myself, if that 
// makes me any less of a plagiarist ;)
var drawLegend = function(){

	//get unique classes
	//it would have taken me probably months to figure this method out.
	// does JS not have a unique() method of any sort?
	var classes = []
	data.map(function(d){
		if(classes.indexOf(d.class)== -1) classes.push(d.class)
	})
	console.log(classes)

	//make a legend G
	var legendG = d3.select('#my-svg')
				.append('g')
				.attr('class', 'label')
				.attr('id', 'legend')
				.attr('transform', 'translate(' + 650 + ',' + 150 + ')' )
				
	legendG.selectAll('text')
			.data(classes)
			.enter()
			.append('text')
			.text(function(d){return d})
			.attr('transform', function(d,i) {return 'translate(0, ' + i*20 + ')'})
			.style('fill', function(d) {return colorScale(d)})
}

build(500000000, 50000000)
