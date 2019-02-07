var CombinationChart = {
	draw: function(selector, data, dataRange, options, color) {
		var cfg = {
			width: 360,
			height: 240,
			mTop: 40,
			mRight: 20,
			mBottom: 20,
			mLeft: 40,
			barwidth: 20,
			ticks: 6,
			medianData: 50
		};
		if ('undefined' !== typeof options) {
			for (var i in options) {
				if ('undefined' !== typeof options[i]) {
					cfg[i] = options[i];
				}
			}
		}
		// set width,height
		var width = cfg.w - (cfg.mRight + cfg.mLeft),
			height = cfg.h - (cfg.mTop + cfg.mBottom);

		// set the ranges
		var x = d3.scaleBand()
			.range([0, width])
			.padding(1);
		var y = d3.scaleLinear()
			.range([height, 0]);

		d3.select(selector).select('svg').remove();
		var svg = d3.select(selector).append('svg')
			.classed('combie_chart', true)
			.attr('width', width + cfg.mLeft + cfg.mRight)
			.attr('height', height + cfg.mTop + cfg.mBottom )
			.append('g')
			.attr('transform', 'translate(' + cfg.mLeft + ',' + cfg.mTop + ')');

		x.domain(data.map(function (d) { return d.key; }));
		y.domain([dataRange.min,dataRange.max]);

		// Axis 선 만들기
		var xAxis = d3.axisBottom(x);
		var yAxis = d3.axisLeft(y).ticks(cfg.ticks).tickSize(-width);
		svg.append('g')
			.attr('transform', 'translate(0,' + height + ')')
			.classed('xAxis',true)
			.call(customXAxis);

		svg.append('g')
			.classed('yAxis',true)
			.call(customYAxis);

		function customXAxis(g) {
			g.call(xAxis);
			g.select('.domain').remove();
			g.selectAll('line').remove();
			g.selectAll('.tick text')
				.attr('x', 8)
				.attr('y', -3)
				.attr('transform', 'rotate(-270)')
				.style('text-anchor', 'start')
				.style('fill', '#000');
		}

		function customYAxis(g) {
			g.call(yAxis);
			g.select('.domain').remove();
			g.selectAll('.tick line').attr('stroke', '#f0f0f0');
			g.selectAll('.tick text').attr('x', -4).attr('dy', 3);
		}

		// Bar 그리기
		var bar = svg.append('g')
			.classed('bargroup',true)
			.selectAll('.bar')
			.data(data)
			.enter()
			.append('rect')
			.classed('bar',true)
			.attr('transform', 'translate(' + cfg.mLeft/2 + ',0)')
			.attr('x', function (d, i) {
				return i * (cfg.barwidth + 5);
			})
			.attr('height',0)
			.attr('fill', function(d,i) { return color[i]; })
			.attr('width', function(d) {
				if(d.value !== 0) {
					return cfg.barwidth;
				}
				return 0;
			})
			.attr('y', function(d) { return y(d.value); })
			.attr('height', function (d) { return height - y(d.value); });



		svg.append('line')
			.classed('line_median', true)
			.attr('x1', 0)
			.attr('y1', y(cfg.medianData))
			.attr('x2', width)
			.attr('y2', y(cfg.medianData));

		svg.append('text')
			.classed('median_txt', true)
			.text(function(){
				return cfg.medianData + '점'
			})
			.attr('x', width)
			.attr('y', y(cfg.medianData))
			.attr('transform', 'translate(0,4)');


		var labelTxt = svg.append('g')
			.classed('label_group', true)
			.selectAll('.label_txt')
			.data(data)
			.enter()
			.append('text')
			.text(function (d) {
				return d.value;
			})
			.classed('lable_txt',true)
			.attr('transform', 'translate(' + cfg.mLeft/2 + ',0)')
			.attr('x', function (d, i) {
				return i * (cfg.barwidth + 5);
			})
			.attr('y', function (d) { return y(d.value) - 5;});
	}
};



