function renderTooltip(container) {
  let containerRect, tooltipRect;
  const tooltip = container.append("div").attr("class", "chart-tooltip");

  function show(content) {
    tooltip.html(content).classed("is-visible", true);
    containerRect = container.node().getBoundingClientRect();
    tooltipRect = tooltip.node().getBoundingClientRect();
  }

  function hide() {
    tooltip.classed("is-visible", false);
  }

  function move(event) {
    const pointer = d3.pointer(event, container.node());
    let x = pointer[0] - tooltipRect.width / 2;
    if (x < 0) {
      x = 0;
    } else if (x + tooltipRect.width > containerRect.width) {
      x = containerRect.width - tooltipRect.width;
    }
    let y = pointer[1] - tooltipRect.height - 8;
    if (y < 0) {
      y = pointer[1] + 8;
    }
    tooltip.style("transform", `translate(${x}px,${y}px)`);
  }

  return {
    show,
    hide,
    move,
  };
}
