function renderMoviesTable(id, cf, dispatch) {
  const container = d3.select(`#${id}`);
  const filterStat = container.select(".filter-stat");
  const resetButton = container.select(".reset-button").on("click", () => {
    dispatch.call("resetall");
  });
  const tableEl = container.select(".table-area table").node();

  const columns = Object.entries(columnDefs).map(([data, columnDef]) => {
    const d = Object.assign({ data }, columnDef);
    delete d.value;
    return d;
  });
  const dataTable = $(tableEl).DataTable({
    deferRender: true,
    scrollX: true,
    columns,
    data: [],
  });

  dispatch.on("filtered.movies-table", () => {
    const allFiltered = cf.allFiltered();
    filterStat.html(
      `<span>${d3.format(",")(
        allFiltered.length
      )}</span> selected out of <span>${d3.format(",")(
        cf.size()
      )}</span> movies`
    );
    resetButton.style(
      "visibility",
      allFiltered.length === cf.size() ? "hidden" : "visible"
    );
    dataTable.clear().rows.add(cf.allFiltered()).draw();
  });

  dispatch.on("resetall.movies-table", () => {
    dispatch.call("filtered");
  });
}
