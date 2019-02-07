/**
 * Created by rainguy1 on 2019-01-17.
 */
var RadarChart = {
	draw: function (selector, d, options) {

		var reformatData = d;
		var d = [];
		var textValue = [];
		for (var i = 0; i < reformatData.length; i++) {
			var area = reformatData[i].area;
			var area_keys = Object.keys(area);
			var tempArry = [];
			for (var j = 0; j < area_keys.length; j++) {
				tempArry.push({"area": area_keys[j], "value": area[area_keys[j]]});
			}
			d.push(tempArry);
		}

		var cfg = {
			radius: 2,
			w: 300,
			h: 300,
			factor: 1,
			factorLegend: .55,
			levels: 5,
			maxValue: 0,
			radians: 2 * Math.PI,
			TranslateX: 50,
			TranslateY: 50,
			ExtraWidthX: 100,
			ExtraWidthY: 100,
			lineColor: [],
			color: ['#7b91f8', '#fa6a71']
		};
		if ('undefined' !== typeof options) {
			for (var i in options) {
				if ('undefined' !== typeof options[i]) {
					cfg[i] = options[i];
				}
			}
		}

		var allAxis = (d[0].map(function (i, j) {
			return i.area
		}));

		var textAxis = (d[1].map(function (i, j) {
			textValue.push(i.value);
			return textValue;
		}));


		var total = allAxis.length;
		var radius = cfg.factor * Math.min(cfg.w / 2, cfg.h / 2);
		d3.select(selector).select("svg").remove();
		var g = d3.select(selector)
			.append("svg")
			.attr("width", cfg.w + cfg.ExtraWidthX)
			.attr("height", cfg.h + cfg.ExtraWidthY)
			.append("g")
			.attr("transform", "translate(" + cfg.TranslateX + "," + cfg.TranslateY + ")");

		//Circular segments
		for (var j = 0; j < cfg.levels; j++) {
			var levelFactor = cfg.factor * radius * ((j + 1) / cfg.levels);
			g.selectAll(".levels")
				.data(allAxis)
				.enter()
				.append("svg:line")
				.attr("x1", function (d, i) { return levelFactor * (1 - cfg.factor * Math.sin(i * cfg.radians / total)); })
				.attr("y1", function (d, i) { return levelFactor * (1 - cfg.factor * Math.cos(i * cfg.radians / total)); })
				.attr("x2", function (d, i) { return levelFactor * (1 - cfg.factor * Math.sin((i + 1) * cfg.radians / total)); })
				.attr("y2", function (d, i) { return levelFactor * (1 - cfg.factor * Math.cos((i + 1) * cfg.radians / total)); })
				.attr("class", "line line" + j)
				.style("stroke-opacity", "0.75")
				.style("stroke-width", "1px")
				.attr("transform", "translate(" + (cfg.w / 2 - levelFactor) + ", " + (cfg.h / 2 - levelFactor) + ")");
		}
		//Text indicating at what % each level is
		series = 0;
		var axis = g.selectAll(".axis")
			.data(allAxis)
			.enter()
			.append("g")
			.attr("class", "axis");

		axis.append("line")
			.attr("x1", cfg.w / 2)
			.attr("y1", cfg.h / 2)
			.attr("x2", function (d, i) { return cfg.w / 2 * (1 - cfg.factor * Math.sin(i * cfg.radians / total)); })
			.attr("y2", function (d, i) { return cfg.h / 2 * (1 - cfg.factor * Math.cos(i * cfg.radians / total)); })
			.attr("class", "line")
			.style("stroke", cfg.lineColor)
			.style("stroke-width", "1px");



		axis.append("text")
			.attr("class", "legend")
			.text(function(d) {
				return d;
			})
			.attr("text-anchor", "middle")
			.attr("dy", "2px")
			.attr("transform", "translate(-5, 0)")
			.attr("x", function (d, i) { return cfg.w / 2 * (1 - cfg.factorLegend * Math.sin(i * cfg.radians / total)) - 70 * Math.sin(i * cfg.radians / total); })
			.attr("y", function(d, i){return cfg.h/2*(1- Math.cos(i*cfg.radians/total))- 25 * Math.cos(i*cfg.radians/total);});


		axis.append("text")
			.attr("class", "legend legend_score")
			.text(function(d,i) {
				return textValue[i] + '점';
			})
			.attr("text-anchor", "middle")
			.attr("dy", "19px")
			.attr("transform", "translate(-5, 0)")
			.attr("x", function (d, i) { return cfg.w / 2 * (1 - cfg.factorLegend * Math.sin(i * cfg.radians / total)) - 70 * Math.sin(i * cfg.radians / total); })
			.attr("y", function(d, i){return cfg.h/2*(1- Math.cos(i*cfg.radians/total))- 25 * Math.cos(i*cfg.radians/total);});



		d.forEach(function (y, x) {
			dataValues = [];
			g.selectAll(".nodes")
				.data(y, function (j, i) {
					dataValues.push([
						cfg.w / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total)),
						cfg.h / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total))
					]);
				});

			dataValues.push(dataValues[0]);
			g.selectAll(".area")
				.data([dataValues])
				.enter()
				.append("polygon")
				.attr("class", "radar-chart-serie" + series)
				.style("stroke-width", "1")
				.style("stroke", cfg.color[series])
				.attr("points", function (d) {
					var str = "";
					for (var pti = 0; pti < d.length; pti++) {
						str = str + d[pti][0] + "," + d[pti][1] + " ";
					}
					return str;
				})
				.style("fill", function (j, i) { return cfg.color[series] })
				.style("fill-opacity", '0.4')
				.on('mouseover', function (d) {
					z = "polygon." + d3.select(this).attr("class");
					g.selectAll("polygon")
						.transition(200)
						.style("fill-opacity", .4);
					g.selectAll(z)
						.transition(200)
						.style("fill-opacity", .4);
				})
				.on('mouseout', function () {
					g.selectAll("polygon")
						.transition(200)
						.style("fill-opacity", .4);
				});
			series++;
		});

		series = 0;
		d.forEach(function (y, x) {
			if (series) {
				g.selectAll(".nodes")
					.data(y).enter()
					.append("polygon")
					.attr("class", "dot radar-oasis_chart-serie" + series)
					.attr("points", "100 94, 104 104, 94 104")
					.transition('trans')
					.duration(cfg.duration)
					.attr("points", function (j, i) {
						dataValues.push([cfg.w / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total)), cfg.h / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total))]);
						var cx = cfg.w / 2 * (1 - (Math.max(j.value, 0) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total));
						var cy = cfg.h / 2 * (1 - (Math.max(j.value, 0) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total));
						return (cx + ' ' + (cy - 3) + ',' + (cx + 4) + ' ' + (cy + 4) + ',' + (cx - 4) + ' ' + (cy + 4));
					})
					.attr("data-id", function (j) { return j.area })
					.style("fill", cfg.color[series])
					.style("stroke-width", "1")
					.style("stroke", cfg.color[series])
			} else {
				g.selectAll(".nodes")
					.data(y).enter()
					.append("svg:circle")
					.attr("class", "dot radar-oasis_chart-serie" + series)
					.attr("cx", 100)
					.attr("cy", 100)
					.transition('trans')
					.duration(cfg.duration)
					.attr('r', cfg.radius)
					.attr("alt", function (j) { return Math.max(j.value, 0) })
					.attr("cx", function (j, i) {
						dataValues.push([
							cfg.w / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total)),
							cfg.h / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total))
						]);
						return cfg.w / 2 * (1 - (Math.max(j.value, 0) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total));
					})
					.attr("cy", function (j, i) {
						return cfg.h / 2 * (1 - (Math.max(j.value, 0) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total));
					})
					.attr("data-id", function (j) { return j.area })
					.style("fill", cfg.color[series])
					.style("stroke-width", "1")
					.style("stroke", cfg.color[series])
			}

			series++;

		});
	}
};
