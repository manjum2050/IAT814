function renderBudgetGrossEarningChart(
  id,
  dimension,
  group,
  budgetQuartileDefs,
  grossEarningQuartileDefs,
  dispatch
) {
  let displayData;
  const margin = {
    top: 36,
    right: 32,
    bottom: 8,
    left: 36,
  };
  let width, height;
  const strokeWidth = 1.5;
  const circleRadius = 4;

  const quartiles = ["1st", "2nd", "3rd", "4th"];

  // Use d3 InternMap so we can use an array as a key
  let selected = emptySelected();
  function emptySelected() {
    const selected = {
      budget: new Map(quartiles.map((d) => [d, false])),
      grossEarning: new Map(quartiles.map((d) => [d, false])),
      get noBudgetFilter() {
        return Array.from(this.budget.values()).every((d) => !d);
      },
      get noGrossEarningFilter() {
        return Array.from(this.grossEarning.values()).every((d) => !d);
      },
      get noCombinedFilter() {
        return this.noBudgetFilter && this.noGrossEarningFilter;
      },
      get combined() {
        return new d3.InternMap(
          d3
            .cross(quartiles, quartiles)
            .map((d) => [
              d,
              (this.noBudgetFilter || this.budget.get(d[0])) &&
                (this.noGrossEarningFilter || this.grossEarning.get(d[1])),
            ]),
          JSON.stringify
        );
      },
    };
    return selected;
  }

  const xGrid = d3
    .scaleBand()
    .domain(quartiles)
    .paddingInner(0.1)
    .paddingOuter(0.05);
  const yGrid = d3
    .scaleBand()
    .domain(quartiles)
    .paddingInner(0.1)
    .paddingOuter(0.05);
  const x = d3
    .scaleBand()
    .paddingInner(0.6)
    .paddingOuter(0.8)
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
  const gYCell = svg.append("g").attr("class", "axis axis-y");
  const gGrid = svg.append("g").attr("class", "grid-g");

  window.addEventListener("resize", resizeVis);
  resizeVis();
  wrangleData();

  function wrangleData() {
    displayData = group.all().map((d) => ({
      key: d.key,
      budget: d.key[0],
      grossEarning: d.key[1],
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

    xGrid.range([margin.left, width - margin.right]);
    yGrid.range([margin.top, height - margin.bottom]);
    x.range([0, xGrid.bandwidth()]);
    y.range([yGrid.bandwidth(), 0]);

    svg.attr("viewBox", [0, 0, width, height]);

    if (displayData) updateVis(false);
  }

  function updateVis(withTransition) {
    gX.attr("transform", `translate(0,${margin.top})`)
      .call((g) =>
        g
          .selectAll(".axis-title")
          .data(["Budget"])
          .join("text")
          .attr("class", "axis-title")
          .attr("x", (xGrid.range()[0] + xGrid.range()[1]) / 2)
          .attr("y", -24)
          .attr("text-anchor", "start")
          .text((d) => d)
      )
      .call(d3.axisTop(xGrid).tickFormat((d) => budgetQuartileDefs[d]))
      .call((g) => g.select(".domain").style("display", "none"))
      .call((g) =>
        g
          .selectAll(".tick text")
          .attr("class", "filter-trigger")
          .classed(
            "muted",
            (d) => !selected.noBudgetFilter && !selected.budget.get(d)
          )
          .on("click", (event, d) => {
            selected.budget.set(d, !selected.budget.get(d));
            if (selected.noCombinedFilter) {
              dimension.filterAll();
            } else {
              dimension.filter((d) => selected.combined.get(d));
            }
            dispatch.call("filtered");
          })
      );

    gY.attr("transform", `translate(${margin.left},0)`)
      .call((g) =>
        g
          .selectAll(".axis-title")
          .data(["Gross Earning"])
          .join("text")
          .attr("class", "axis-title")
          .attr("transform", "rotate(-90)")
          .attr("x", -(yGrid.range()[0] + yGrid.range()[1]) / 2)
          .attr("y", -24)
          .text((d) => d)
      )
      .call(d3.axisLeft(yGrid).tickFormat((d) => grossEarningQuartileDefs[d]))
      .call((g) =>
        g
          .attr("text-anchor", "middle")
          .selectAll(".tick text")
          .attr("dy", null)
          .attr("x", null)
          .attr("y", -9)
          .attr("transform", "rotate(-90)")
          .attr("class", "filter-trigger")
          .classed(
            "muted",
            (d) =>
              !selected.noGrossEarningFilter && !selected.grossEarning.get(d)
          )
          .on("click", (event, d) => {
            selected.grossEarning.set(d, !selected.grossEarning.get(d));
            if (selected.noCombinedFilter) {
              dimension.filterAll();
            } else {
              dimension.filter((d) => selected.combined.get(d));
            }
            dispatch.call("filtered");
          })
      );

    gYCell
      .selectChildren()
      .data(quartiles)
      .join("g")
      .attr(
        "transform",
        (d) => `translate(${width - margin.right},${yGrid(d)})`
      )
      .call(d3.axisRight(y).ticks(yGrid.bandwidth() / 20))
      .call((g) =>
        g.selectAll(".tick").style("display", (d) => (d ? null : "none"))
      )
      .filter((d, i) => i === 0)
      .selectAll(".axis-title")
      .data(["Rating"])
      .join("text")
      .attr("class", "axis-title")
      .attr("text-anchor", "end")
      .attr("x", margin.right)
      .attr("y", -8)
      .text((d) => d);

    const cell = gGrid
      .selectAll(".cell-g")
      .data(displayData, (d) => JSON.stringify(d.key))
      .join((enter) =>
        enter
          .append("g")
          .attr("class", "cell-g")
          .call((g) => g.append("line").attr("class", "zero-line"))
      )
      .attr(
        "transform",
        (d) => `
        translate(${xGrid(d.key[0])},${yGrid(d.key[1])})
      `
      )
      .call((g) =>
        g
          .select(".zero-line")
          .attr("x2", xGrid.bandwidth())
          .attr("transform", `translate(0,${yGrid.bandwidth()})`)
      );
    const bar = cell
      .selectAll(".bar-g")
      .data((d) => ["rt", "imdb"].map((key) => [d, d[key], key]))
      .join((enter) =>
        enter
          .append("g")
          .attr("class", (d) => `bar-g ${d[2]}`)
          .attr("stroke", "currentColor")
          .call((g) =>
            g
              .append("rect")
              .attr("class", "bar-rect tooltip-trigger")
              .attr("stroke-width", strokeWidth)
              .attr("width", x.bandwidth())
              .attr("y", y(0))
              .attr("height", 0)
              .on("mouseenter", function (event, d) {
                const key = d[2];
                const budget = budgetQuartileDefs[d[0].budget];
                const grossEarning =
                  grossEarningQuartileDefs[d[0].grossEarning];
                const rating = d[1];
                const content = `
                  <div class="${key}">${key.toUpperCase()}</div>
                  <div>Budget: ${budget}</div>
                  <div>Gross Earning: ${grossEarning}</div>
                  <div>Median rating: ${d3.format(".1f")(rating)}</div>
                `;
                tooltip.show(content);
              })
              .on("mouseleave", tooltip.hide)
              .on("mousemove", tooltip.move)
          )
      )
      .attr("transform", (d) => `translate(${x(d[2])},0)`)
      .classed(
        "muted",
        (d) => !selected.noCombinedFilter && !selected.combined.get(d[0].key)
      );
    bar
      .transition()
      .duration(withTransition ? 500 : 0)
      .call((t) =>
        t
          .select(".bar-rect")
          .attr("y", (d) => y(d[1]))
          .attr("height", (d) => Math.max(1e-6, y(0) - y(d[1])))
      );
  }

  dispatch.on("filtered.budget-gross-earning-chart", function () {
    wrangleData();
    if (dimension.hasCurrentFilter()) {
      resetButton.style("visibility", "visible");
      filterStat.html(
        `Budget: <span>${quartiles
          .filter((d) => selected.noBudgetFilter || selected.budget.get(d))
          .map((d) => budgetQuartileDefs[d])
          .join(", ")}</span> Gross Earning: <span>${quartiles
          .filter(
            (d) => selected.noGrossEarningFilter || selected.grossEarning.get(d)
          )
          .map((d) => grossEarningQuartileDefs[d])
          .join(", ")}</span>`
      );
    } else {
      resetButton.style("visibility", "hidden");
      filterStat.html(
        `Budget: <span>${Object.values(budgetQuartileDefs).join(
          ", "
        )}</span> Gross Earning: <span>${Object.values(
          grossEarningQuartileDefs
        ).join(", ")}</span>`
      );
    }
  });

  dispatch.on("resetall.budget-gross-earning-chart", () => {
    selected = emptySelected();
    dimension.filterAll();
  });
}
