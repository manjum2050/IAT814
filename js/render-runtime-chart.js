function renderRunTimeChart(id, dimension, group, dispatch) {
  let displayData;
  const margin = {
    top: 24,
    right: 16,
    bottom: 24,
    left: 24,
  };
  let width, height;
  const strokeWidth = 1.5;

  const runtimeBins = ["<=90", "90-120", "120-150", ">150"];

  let selected = emptySelected();
  function emptySelected() {
    return new Map(runtimeBins.map((d) => [d, false]));
  }

  const xOuter = d3
    .scaleBand()
    .paddingInner(0.2)
    .paddingOuter(0.1)
    .domain(runtimeBins);
  const xInner = d3
    .scaleBand()
    .paddingInner(0.4)
    .paddingOuter(0.2)
    .domain(["rt", "imdb"]);
  const y = d3.scaleLinear();

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
  const gBoxes = svg.append("g").attr("class", "boxes-g");

  window.addEventListener("resize", resizeVis);
  resizeVis();
  wrangleData();

  function calculateBoxValues(values) {
    if (values.length) {
      values = values.sort(d3.ascending);
      const min = values[0];
      const max = values[values.length - 1];
      const q1 = d3.quantile(values, 0.25);
      const q2 = d3.quantile(values, 0.5);
      const q3 = d3.quantile(values, 0.75);
      const iqr = q3 - q1; // interquartile range
      const r0 = Math.max(min, q1 - iqr * 1.5);
      const r1 = Math.min(max, q3 + iqr * 1.5);
      values.quartiles = [q1, q2, q3];
      values.range = [r0, r1];
    } else {
      values.quartiles = [0, 0, 0];
      values.range = [0, 0];
    }
    return values;
  }

  function wrangleData() {
    displayData = group.all().map((d) => ({
      runtime: d.key,
      rt: calculateBoxValues(
        Array.from(d.value.records.values(), (d) => d.rtRating)
      ),
      imdb: calculateBoxValues(
        Array.from(d.value.records.values(), (d) => d.imdbRating)
      ),
    }));

    y.domain([
      0,
      d3.max([
        ...displayData.map((d) => d.rt.range[1]),
        ...displayData.map((d) => d.imdb.range[1]),
      ]) || 10,
    ]);

    updateVis(true);
  }

  function resizeVis() {
    width = chart.node().clientWidth;
    height = chart.node().clientHeight;

    xOuter.range([margin.left, width - margin.right]);
    xInner.range([0, xOuter.bandwidth()]);
    y.range([height - margin.bottom, margin.top]);

    svg.attr("viewBox", [0, 0, width, height]);

    if (displayData) updateVis(false);
  }

  function updateVis(withTransition) {
    gX.attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xOuter))
      .call((g) =>
        g
          .selectAll(".tick text")
          .classed("filter-trigger", true)
          .classed(
            "muted",
            (d) => dimension.hasCurrentFilter() && !selected.get(d)
          )
          .on("click", (event, d) => {
            selected.set(d, !selected.get(d));
            if (Array.from(selected.values()).every((d) => !d)) {
              dimension.filterAll();
            } else {
              dimension.filter((d) => selected.get(d));
            }
            dispatch.call("filtered");
          })
      );

    gY.attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks((height - margin.top - margin.bottom) / 60))
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
      );

    const gBoxGroups = gBoxes
      .selectAll(".box-group-g")
      .data(displayData, (d) => d.runtime)
      .join((enter) => enter.append("g").attr("class", "box-group-g"))
      .attr("transform", (d) => `translate(${xOuter(d.runtime)},0)`);

    const gBox = gBoxGroups
      .selectAll(".box-g")
      .data((d) => ["rt", "imdb"].map((key) => [d.runtime, d[key], key]))
      .join((enter) =>
        enter
          .append("g")
          .attr("class", (d) => `tooltip-trigger box-g ${d[2]}`)
          .attr("stroke", "currentColor")
          .attr("stroke-width", strokeWidth)
          .attr("fill", "none")
          .on("mouseenter", function (event, d) {
            const key = d[2];
            const runtime = d[0];
            const boxValues = d[1];
            const content = `
              <div class="${key}">${key.toUpperCase()}</div>
              <div>Runtime: ${runtime}</div>
              <div>Max rating: ${d3.format(".1f")(boxValues.range[1])}</div>
              <div>Upper quartile rating: ${d3.format(".1f")(
                boxValues.quartiles[2]
              )}</div>
              <div>Median rating: ${d3.format(".1f")(
                boxValues.quartiles[1]
              )}</div>
              <div>Lower quartile rating: ${d3.format(".1f")(
                boxValues.quartiles[0]
              )}</div>
              <div>Min rating: ${d3.format(".1f")(boxValues.range[0])}</div>
            `;
            tooltip.show(content);
          })
          .on("mouseleave", tooltip.hide)
          .on("mousemove", tooltip.move)
          .call((g) =>
            g
              .append("path")
              .attr("class", "box-range-path")
              .attr("d", rangePath)
          )
          .call((g) =>
            g.append("path").attr("class", "box-iqr-path").attr("d", iqrPath)
          )
          .call((g) =>
            g
              .append("path")
              .attr("class", "box-median-path")
              .attr("d", medianPath)
          )
      )
      .attr("transform", (d) => `translate(${xInner(d[2])},0)`)
      .classed(
        "muted",
        (d) => dimension.hasCurrentFilter() && !selected.get(d[0])
      );

    gBox
      .transition()
      .duration(withTransition ? 500 : 0)
      .call((g) => g.select(".box-range-path").attr("d", rangePath))
      .call((g) => g.select(".box-iqr-path").attr("d", iqrPath))
      .call((g) => g.select(".box-median-path").attr("d", medianPath));
  }

  function rangePath(d) {
    return `M${xInner.bandwidth() / 2},${y(d[1].range[1])} V${y(
      d[1].range[0]
    )}`;
  }

  function iqrPath(d) {
    return `
      M0,${y(d[1].quartiles[2])}
      H${xInner.bandwidth()}
      V${y(d[1].quartiles[0])}
      H0
      Z
    `;
  }

  function medianPath(d) {
    return `
      M0,${y(d[1].quartiles[1])}
      H${xInner.bandwidth()}
    `;
  }

  dispatch.on("filtered.runtime-chart", () => {
    wrangleData();
    if (dimension.hasCurrentFilter()) {
      resetButton.style("visibility", "visible");
      filterStat.html(
        `Runtime: <span>${runtimeBins
          .filter((d) => selected.get(d))
          .join(", ")}</span>`
      );
    } else {
      resetButton.style("visibility", "hidden");
      filterStat.html(`Runtime: <span>${runtimeBins.join(", ")}</span>`);
    }
  });

  dispatch.on("resetall.runtime-chart", () => {
    selected = emptySelected();
    dimension.filterAll();
  });
}
