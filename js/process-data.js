function processData(csv) {
  const records = csv.map((d) =>
    Object.keys(columnDefs).reduce((r, key) => {
      r[key] = columnDefs[key].value(d);
      return r;
    }, {})
  );

  // Add runtime bins
  const getRuntimeBin = (runtime) => {
    if (runtime <= 90) return "<=90";
    if (runtime <= 120) return "90-120";
    if (runtime <= 150) return "120-150";
    if (runtime > 150) return ">150";
  };

  // Add budget bins
  const budgetQuartiles = getQuartiles(records.map((d) => d.budget));
  const getBudgetBin = getQuartile(budgetQuartiles);
  const budgetQuartileDefs = generateQuartileDefs(budgetQuartiles);

  // Add gross earning bins
  const grossEarningQuartiles = getQuartiles(
    records.map((d) => d.grossEarning)
  );
  const getGrossEarningBin = getQuartile(grossEarningQuartiles);
  const grossEarningQuartileDefs = generateQuartileDefs(grossEarningQuartiles);

  function getQuartiles(values) {
    const n = 4;
    const sorted = values.slice().sort(d3.ascending);
    const quartiles = d3
      .range(1, n)
      .map((d) => d3.quantileSorted(sorted, d / n));
    return quartiles;
  }
  function getQuartile(quartiles) {
    return (value) => {
      i = d3.bisectLeft(quartiles, value) + 1;
      if (i === 1) {
        return "1st";
      } else if (i === 2) {
        return "2nd";
      } else if (i === 3) {
        return "3rd";
      } else {
        return "4th";
      }
    };
  }
  function generateQuartileDefs(quartiles) {
    const format = d3.format(",.0s");
    const removeSuffix = (str) => str.slice(0, str.length - 1);
    return {
      "1st": `<=${format(quartiles[0])}`,
      "2nd": `${removeSuffix(format(quartiles[0]))}-${format(quartiles[1])}`,
      "3rd": `${removeSuffix(format(quartiles[1]))}-${format(quartiles[2])}`,
      "4th": `>${format(quartiles[2])}`,
    };
  }

  records.forEach((d, i) => {
    d.id = i;
    d.runtimeBin = getRuntimeBin(d.runtime);
    d.budgetBin = getBudgetBin(d.budget);
    d.grossEarningBin = getGrossEarningBin(d.grossEarning);
  });

  return { records, budgetQuartileDefs, grossEarningQuartileDefs };
}
