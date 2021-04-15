function renderGenreChart(id, dimension, group, dispatch) {
  let displayData;
  const margin = {
    top: 16,
    right: 48,
    bottom: 16,
    left: 48,
  };
  let width, height, radius;
  const labelFactor = 1.1;
  const strokeWidth = 1.5;
  const circleRadius = 4;

  const axisNames = group.all().map((d) => d.key);
  const axisTotal = axisNames.length;
  const angleSlice = (Math.PI * 2) / axisTotal;

  let selected = emptySelected();
  function emptySelected() {
    return new Map(axisNames.map((d) => [d, false]));
  }

  const r = d3.scaleLinear();
  const line = d3
    .lineRadial()
    .curve(d3.curveLinearClosed)
    .radius((d) => r(d))
    .angle((d, i) => i * angleSlice);

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
  const gSpikes = svg.append("g").attr("class", "spikes-g axis");
  const gLevels = svg.append("g").attr("class", "levels-g axis");
  const gRadars = svg.append("g").attr("class", "radars-g");

  window.addEventListener("resize", resizeVis);
  resizeVis();
  wrangleData();

  function wrangleData() {
    displayData = group.all().map((d) => ({
      genre: d.key,
      rt: d3.median(d.value.records.values(), (d) => d.rtRating) || 0,
      imdb: d3.median(d.value.records.values(), (d) => d.imdbRating) || 0,
    }));

    r.domain([
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
    radius = Math.floor(
      Math.min(
        width - margin.left - margin.right,
        height - margin.top - margin.bottom
      ) /
        2 /
        labelFactor
    );

    r.range([0, radius]);

    svg.attr("viewBox", [-width / 2, -height / 2, width, height]);

    if (displayData) updateVis(false);
  }

  function updateVis(withTransition) {
    const gSpike = gSpikes
      .selectAll(".spike-g")
      .data(axisNames)
      .join((enter) =>
        enter
          .append("g")
          .attr("class", "spike-g")
          .call((g) => g.append("line").attr("class", "spike-line"))
          .call((g) =>
            g
              .append("text")
              .attr("class", "spike-label filter-trigger")
              .attr("dy", "0.32em")
              .attr("text-anchor", "middle")
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
      )
      .call((g) =>
        g
          .select(".spike-line")
          .attr(
            "x2",
            (d, i) =>
              (radius * labelFactor - 8) *
              Math.cos(angleSlice * i - Math.PI / 2)
          )
          .attr(
            "y2",
            (d, i) =>
              (radius * labelFactor - 8) *
              Math.sin(angleSlice * i - Math.PI / 2)
          )
      )
      .call((g) =>
        g
          .select(".spike-label")
          .attr(
            "x",
            (d, i) =>
              radius * labelFactor * Math.cos(angleSlice * i - Math.PI / 2)
          )
          .attr(
            "y",
            (d, i) =>
              radius * labelFactor * Math.sin(angleSlice * i - Math.PI / 2)
          )
          .classed(
            "muted",
            (d) => dimension.hasCurrentFilter() && !selected.get(d)
          )
      );

    const gLevel = gLevels
      .selectAll(".level-g")
      .data(r.ticks(radius / 40), (d) => d)
      .join((enter) =>
        enter
          .append("g")
          .attr("class", "level-g")
          .call((g) =>
            g.append("path").attr("class", "level-path").attr("fill", "none")
          )
          .call((g) =>
            g
              .append("text")
              .attr("class", (d, i) =>
                i ? "level-value" : "level-value axis-title"
              )
              .attr("y", (d) => -r(d))
              .attr("x", 4)
              .text((d, i) => (i ? d : "Rating"))
          )
      );
    gLevel
      .call((t) =>
        t.select(".level-path").attr("d", (d) => line(Array(axisTotal).fill(d)))
      )
      .call((t) => t.select(".level-value").attr("y", (d) => -r(d)));

    const gRadar = gRadars
      .selectAll(".radar-g")
      .data(["rt", "imdb"])
      .join((enter) =>
        enter
          .append("g")
          .attr("class", (d) => `radar-g ${d}`)
          .call((g) =>
            g
              .append("path")
              .attr("class", "radar-path")
              .attr("fill", "none")
              .attr("stroke", "currentColor")
              .attr("stroke-width", strokeWidth)
          )
      );
    gRadar
      .selectAll(".radar-circle")
      .data((d) => displayData.map((e) => [e.genre, e[d]]))
      .join((enter) =>
        enter
          .append("circle")
          .attr("class", "radar-circle tooltip-trigger")
          .attr("stroke", "currentColor")
          .attr("stroke-width", strokeWidth)
          .attr("r", circleRadius)
          .attr(
            "transform",
            (d, i) =>
              `translate(${r(d[1]) * Math.cos(angleSlice * i - Math.PI / 2)},${
                r(d[1]) * Math.sin(angleSlice * i - Math.PI / 2)
              })`
          )
          .on("mouseenter", function (event, d) {
            const key = d3.select(this.parentNode).datum();
            const genre = d[0];
            const rating = d[1];
            const content = `
              <div class="${key}">${key.toUpperCase()}</div>
              <div>Genre: ${genre}</div>
              <div>Median rating: ${d3.format(".1f")(rating)}</div>
            `;
            tooltip.show(content);
          })
          .on("mouseleave", tooltip.hide)
          .on("mousemove", tooltip.move)
      )
      .classed(
        "muted",
        (d) => dimension.hasCurrentFilter() && !selected.get(d[0])
      );
    gRadar
      .transition()
      .duration(withTransition ? 500 : 0)
      .call((t) =>
        t
          .select(".radar-path")
          .attr("d", (d) => line(displayData.map((e) => e[d])))
      )
      .call((t) =>
        t
          .selectAll(".radar-circle")
          .attr(
            "transform",
            (d, i) =>
              `translate(${r(d[1]) * Math.cos(angleSlice * i - Math.PI / 2)},${
                r(d[1]) * Math.sin(angleSlice * i - Math.PI / 2)
              })`
          )
      );
  }

  dispatch.on("filtered.genre-chart", () => {
    wrangleData();
    if (dimension.hasCurrentFilter()) {
      resetButton.style("visibility", "visible");
      filterStat.html(
        `Genres: <span>${axisNames
          .filter((d) => selected.get(d))
          .join(", ")}</span>`
      );
    } else {
      resetButton.style("visibility", "hidden");
      filterStat.html(`Genres: <span>${axisNames.join(", ")}</span>`);
    }
  });

  dispatch.on("resetall.genre-chart", () => {
    selected = emptySelected();
    dimension.filterAll();
  });
}
