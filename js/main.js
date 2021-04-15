d3.csv("data/cleaned_data.csv").then((csv) => {
  const { records, budgetQuartileDefs, grossEarningQuartileDefs } = processData(
    csv
  );
  const cf = initCrossfilter(records);
  const dispatch = d3.dispatch("filtered", "resetall");
  renderYearChart(
    "year-chart",
    cf.moviesByYear,
    cf.movieGroupsByYear,
    dispatch
  );
  renderGenreChart(
    "genre-chart",
    cf.moviesByGenre,
    cf.movieGroupsByGenre,
    dispatch
  );
  renderMotionPictureRatingChart(
    "motion-picture-rating-chart",
    cf.moviesByMotionPictureRating,
    cf.movieGroupsByMotionPictureRating,
    dispatch
  );
  renderRunTimeChart(
    "runtime-chart",
    cf.moviesByRuntime,
    cf.movieGroupsByRuntime,
    dispatch
  );
  renderBudgetGrossEarningChart(
    "budget-gross-earning-chart",
    cf.moviesByBudgetGrossEarning,
    cf.movieGroupsByBudgetGrossEarning,
    budgetQuartileDefs,
    grossEarningQuartileDefs,
    dispatch
  );
  renderMoviesTable("movies-table", cf.movies, dispatch);
  dispatch.call("filtered");
});
