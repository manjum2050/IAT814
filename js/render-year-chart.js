function renderYearChart(id, dimension, group, dispatch) {
  let displayData;
  const margin = {
    top: 24,
    right: 40,
    bottom: 24,
    left: 24,
  };
  let width, height;
  const strokeWidth = 1.5;
  const circleRadius = 4;

  const x = d3.scaleLinear().domain(d3.extent(group.all(), (d) => d.key));
  const y = d3.scaleLinear();
  const line = d3
    .line()
    .x((d) => x(d[0]))
    .y((d) => y(d[1]));

  const brush = d3.brushX().on("brush", brushed).on("end", brushEnded);

  const container = d3.select(`#${id}`);
  const filterStat = container.select(".filter-stat");
  const resetButton = container.select(".reset-button").on("click", () => {
    dimension.filterAll();
    dispatch.call("filtered");
  });
  const chart = container.select(".chart-area");
  const tooltip = renderTooltip(chart);
  const svg = chart.append("svg");
  const gX = svg.append("g").attr("class", "axis axis-x");
  const gY = svg.append("g").attr("class", "axis axis-y");
  const gBrush = svg.append("g").attr("class", "brush");
  const gLines = svg.append("g").attr("class", "lines-g");

  window.addEventListener("resize", resizeVis);
  resizeVis();
  wrangleData();

  function wrangleData() {
    displayData = group.all().map((d) => ({
      year: d.key,
      rt: d3.median(d.value.records.values(), (d) => d.rtRating) || 0,
      imdb: d3.median(d.value.records.values(), (d) => d.imdbRating) || 0,
    }));
    y.domain([
      0,
      d3.max([
        ...displayData.map((d) => d.rt),
        ...displayData.map((d) => d.imdb),
      ]) || 10,
    ]).nice();

    updateVis(true);
  }

  function resizeVis() {
    width = chart.node().clientWidth;
    height = chart.node().clientHeight;

    x.range([margin.left, width - margin.right]);
    y.range([height - margin.bottom, margin.top]);
    brush.extent([
      [margin.left, margin.top],
      [width - margin.right, height - margin.bottom],
    ]);

    svg.attr("viewBox", [0, 0, width, height]);

    if (displayData) updateVis(false);
  }

  function updateVis(withTransition) {
    gX.attr("transform", `translate(0,${height - margin.bottom})`).call(
      d3
        .axisBottom(x)
        .tickFormat(d3.format("d"))
        .ticks((width - margin.left - margin.right) / 80)
    );

    gY.attr("transform", `translate(${margin.left},0)`)
      .call((g) =>
        g
          .selectAll(".axis-title")
          .data(["Rating"])
          .join("text")
          .attr("class", "axis-title")
          .attr("text-anchor", "start")
          .attr("x", -margin.left)
          .attr("y", margin.top - 8)
          .text((d) => d)
      )
      .call(d3.axisLeft(y).ticks((height - margin.top - margin.bottom) / 60));

    gBrush.call(brush);

    const gLine = gLines
      .selectAll(".line-g")
      .data(["rt", "imdb"])
      .join(
        (enter) =>
          enter
            .append("g")
            .attr("class", (d) => `line-g ${d}`)
            .call((g) =>
              g
                .append("path")
                .attr("class", "line-path")
                .attr("fill", "none")
                .attr("stroke", "currentColor")
                .attr("stroke-width", strokeWidth)
                .attr("pointer-events", "none")
            )
            .call((g) =>
              g
                .append("text")
                .attr("class", "line-label")
                .attr("fill", "currentColor")
                .attr("x", width - margin.right + 8)
                .attr("y", (d) => y(displayData[displayData.length - 1][d]))
                .attr("dy", "0.32em")
                .text((d) => d.toUpperCase())
            ),
        (update) =>
          update.call((g) =>
            g.select(".line-label").attr("x", width - margin.right + 8)
          )
      );
    gLine
      .selectAll(".line-circle")
      .data((d) => displayData.map((e) => [e.year, e[d]]))
      .join((enter) =>
        enter
          .append("circle")
          .attr("class", "line-circle tooltip-trigger")
          .attr("stroke", "currentColor")
          .attr("stroke-width", strokeWidth)
          .attr("r", circleRadius)
          .attr("transform", (d) => `translate(${x(d[0])},${y(d[1])})`)
          .on("mouseenter", function (event, d) {
            const key = d3.select(this.parentNode).datum();
            const year = d[0];
            const rating = d[1];
            const content = `
              <div class="${key}">${key.toUpperCase()}</div>
              <div>Year: ${year}</div>
              <div>Median rating: ${d3.format(".1f")(rating)}</div>
            `;
            tooltip.show(content);
          })
          .on("mouseleave", tooltip.hide)
          .on("mousemove", tooltip.move)
      )
      .classed(
        "muted",
        (d) =>
          dimension.hasCurrentFilter() &&
          (d[0] < dimension.currentFilter()[0] ||
            d[0] > dimension.currentFilter()[1])
      );

    gLine
      .transition()
      .duration(withTransition ? 500 : 0)
      .call((t) =>
        t
          .select(".line-path")
          .attr("d", (d) => line(displayData.map((e) => [e.year, e[d]])))
      )
      .call((t) =>
        t
          .select(".line-label")
          .attr("y", (d) => y(displayData[displayData.length - 1][d]))
      )
      .call((t) =>
        t
          .selectAll(".line-circle")
          .attr("transform", (d) => `translate(${x(d[0])},${y(d[1])})`)
      );
  }

  function brushed(event) {
    if (!event.sourceEvent) return;
    const d0 = event.selection.map(x.invert);
    const d1 = [Math.floor(d0[0]), Math.ceil(d0[1])];
    // If empty when rounded, use x domain instead
    if (d1[0] >= d1[1]) {
      d1 = x.range();
    }
    d3.select(this).call(brush.move, d1.map(x));
    dimension.filter(d1);
    dispatch.call("filtered");
  }

  function brushEnded(event) {
    if (!event.sourceEvent) return;
    if (event.selection === null) {
      dimension.filterAll();
      dispatch.call("filtered");
    }
  }

  dispatch.on("filtered.year-chart", () => {
    wrangleData();
    if (dimension.hasCurrentFilter()) {
      resetButton.style("visibility", "visible");
      gBrush.call(brush.move, dimension.currentFilter().map(x));
      filterStat.html(
        `Release year range: <span>${dimension.currentFilter()[0]}-${
          dimension.currentFilter()[1]
        }</span>`
      );
    } else {
      resetButton.style("visibility", "hidden");
      gBrush.call(brush.clear);
      filterStat.html(
        `Release year range: <span>${x.domain()[0]}-${x.domain()[1]}</span>`
      );
    }
  });

  dispatch.on("resetall.year-chart", () => {
    dimension.filterAll();
  });
}
