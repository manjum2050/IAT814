function renderMotionPictureRatingChart(id, dimension, group, dispatch) {
  let displayData;
  const margin = {
    top: 24,
    right: 16,
    bottom: 36,
    left: 16,
  };
  const gap = 48;
  let width, height;
  const strokeWidth = 1.5;

  const ratingNames = ["G", "PG", "PG-13", "R", "NC17", "NR"];

  let selected = emptySelected();
  function emptySelected() {
    return new Map(ratingNames.map((d) => [d, false]));
  }

  const x = {
    rt: d3.scaleLinear(),
    imdb: d3.scaleLinear(),
  };
  const y = d3
    .scaleBand()
    .domain(ratingNames)
    .paddingOuter(0.2)
    .paddingInner(0.4);

  const container = d3.select(`#${id}`);
  const filterStat = container.select(".filter-stat");
  const resetButton = container.select(".reset-button").on("click", () => {
    selected = emptySelected();
    dimension.filterAll();
    dispatch.call("filtered");
  });
  const chart = container.select(".chart-area");
  const tooltip = renderTooltip(chart);
  const svg = chart.append("svg");
  const gX = svg.append("g").attr("class", "axis axis-x");
  const gY = svg.append("g").attr("class", "axis axis-y");
  const gBars = svg.append("g").attr("class", "bars-g");

  window.addEventListener("resize", resizeVis);
  resizeVis();
  wrangleData();

  function wrangleData() {
    displayData = group.all().map((d) => ({
      motionPictureRating: d.key,
      rt: d3.median(d.value.records.values(), (d) => d.rtRating) || 0,
      imdb: d3.median(d.value.records.values(), (d) => d.imdbRating) || 0,
    }));
    x.rt
      .domain([
        0,
        d3.max([
          ...displayData.map((d) => d.rt),
          ...displayData.map((d) => d.imdb),
        ]) || 10,
      ])
      .nice();
    x.imdb.domain(x.rt.domain());

    updateVis(true);
  }

  function resizeVis() {
    width = chart.node().clientWidth;
    height = chart.node().clientHeight;

    x.rt.range([width / 2 - gap / 2, margin.left]);
    x.imdb.range([width / 2 + gap / 2, width - margin.right]);
    y.range([margin.top, height - margin.bottom]);

    svg.attr("viewBox", [0, 0, width, height]);

    if (displayData) updateVis(false);
  }

  function updateVis(withTransition) {
    gX.attr("transform", `translate(0,${height - margin.bottom})`)
      .selectChildren()
      .data(["rt", "imdb"])
      .join("g")
      .each(function (d, i) {
        d3.select(this)
          .call((g) =>
            g
              .selectAll(".axis-title")
              .data(["Rating"])
              .join("text")
              .attr("class", "axis-title")
              .attr("text-anchor", i ? "start" : "end")
              .attr("x", i ? width / 2 + gap / 2 : width / 2 - gap / 2)
              .attr("y", margin.bottom - 8)
              .text((d) => d)
          )
          .call(
            d3
              .axisBottom(x[d])
              .tickFormat(d3.format("d"))
              .ticks((width - margin.left - margin.right - gap) / 2 / 80)
          );
      });
    gY.attr("transform", `translate(${width / 2},0)`)
      .selectChildren()
      .data(ratingNames)
      .join((enter) =>
        enter
          .append("text")
          .attr("class", "filter-trigger")
          .attr("text-anchor", "middle")
          .attr("dy", "0.32em")
          .text((d) => d)
          .on("click", (event, d) => {
            selected.set(d, !selected.get(d));
            if (Array.from(selected.values()).every((d) => !d)) {
              dimension.filterAll();
            } else {
              dimension.filter((d) => selected.get(d));
            }
            dispatch.call("filtered");
          })
      )
      .attr("transform", (d) => `translate(0,${y(d) + y.bandwidth() / 2})`)
      .classed(
        "muted",
        (d) => dimension.hasCurrentFilter() && !selected.get(d)
      );

    const gBar = gBars
      .selectAll(".bars-g")
      .data(["rt", "imdb"])
      .join((enter) =>
        enter
          .append("g")
          .attr("class", (d) => `bars-g ${d}`)
          .call((g) =>
            g
              .append("text")
              .attr("class", "bars-label")
              .attr("fill", "currentColor")
              .attr("text-anchor", (d, i) => (i ? "start" : "end"))
              .text((d) => d.toUpperCase())
          )
      )
      .call((g) =>
        g
          .select(".bars-label")
          .attr("y", y.range()[0])
          .attr("x", (d, i) => (i ? width / 2 + gap / 2 : width / 2 - gap / 2))
      );
    const bar = gBar
      .selectAll(".bar-rect")
      .data((d) => displayData.map((e) => [e.motionPictureRating, e[d]]))
      .join((enter) =>
        enter
          .append("rect")
          .attr("class", "bar-rect tooltip-trigger")
          .attr("stroke", "currentColor")
          .attr("stroke-width", strokeWidth)
          .attr("x", function (d, i) {
            const key = d3.select(this.parentNode).datum();
            return Math.min(x[key](0), x[key](d[1]));
          })
          .attr("width", function (d) {
            const key = d3.select(this.parentNode).datum();
            return Math.abs(x[key](d[1]) - x[key](0));
          })
          .on("mouseenter", function (event, d) {
            const key = d3.select(this.parentNode).datum();
            const motionPictureRating = d[0];
            const rating = d[1];
            const content = `
              <div class="${key}">${key.toUpperCase()}</div>
              <div>Motion Picture Rating: ${motionPictureRating}</div>
              <div>Median rating: ${d3.format(".1f")(rating)}</div>
            `;
            tooltip.show(content);
          })
          .on("mouseleave", tooltip.hide)
          .on("mousemove", tooltip.move)
      )
      .attr("transform", (d) => `translate(0,${y(d[0])})`)
      .attr("height", y.bandwidth())
      .classed(
        "muted",
        (d) => dimension.hasCurrentFilter() && !selected.get(d[0])
      );
    bar
      .transition()
      .duration(withTransition ? 500 : 0)
      .attr("x", function (d, i) {
        const key = d3.select(this.parentNode).datum();
        return Math.min(x[key](0), x[key](d[1]));
      })
      .attr("width", function (d) {
        const key = d3.select(this.parentNode).datum();
        return Math.max(1e-6, Math.abs(x[key](d[1]) - x[key](0)));
      });
  }

  dispatch.on("filtered.motion-picture-rating-chart", () => {
    wrangleData();
    if (dimension.hasCurrentFilter()) {
      resetButton.style("visibility", "visible");
      filterStat.html(
        `Motion picture rating: <span>${ratingNames
          .filter((d) => selected.get(d))
          .join(", ")}</span>`
      );
    } else {
      resetButton.style("visibility", "hidden");
      filterStat.html(
        `Motion picture rating: <span>${ratingNames.join(", ")}</span>`
      );
    }
  });

  dispatch.on("resetall.motion-picture-rating-chart", () => {
    selected = emptySelected();
    dimension.filterAll();
  });
}
