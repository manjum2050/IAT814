function initCrossfilter(records) {
  const movies = crossfilter(records);

  const reduceAdd = (p, v, nf) => {
    p.records.set(v.id, v);
    p.count = p.records.size;
    return p;
  };
  const reduceRemove = (p, v, nf) => {
    p.records.delete(v.id);
    p.count = p.records.size;
    return p;
  };
  const reduceInitial = () => ({
    records: new Map(),
  });

  // Year
  const moviesByYear = movies.dimension((d) => d.year);
  const movieGroupsByYear = moviesByYear
    .group()
    .reduce(reduceAdd, reduceRemove, reduceInitial);

  // Genre
  const moviesByGenre = movies.dimension((d) => d.genre);
  const movieGroupsByGenre = moviesByGenre
    .group()
    .reduce(reduceAdd, reduceRemove, reduceInitial);

  // Motion picture rating
  const moviesByMotionPictureRating = movies.dimension(
    (d) => d.motionPictureRating
  );
  const movieGroupsByMotionPictureRating = moviesByMotionPictureRating
    .group()
    .reduce(reduceAdd, reduceRemove, reduceInitial);

  // Runtime
  const moviesByRuntime = movies.dimension((d) => d.runtimeBin);
  const movieGroupsByRuntime = moviesByRuntime
    .group()
    .reduce(reduceAdd, reduceRemove, reduceInitial);

  // Budget & gross earning
  const moviesByBudgetGrossEarning = movies.dimension((d) => [
    d.budgetBin,
    d.grossEarningBin,
  ]);
  const movieGroupsByBudgetGrossEarning = moviesByBudgetGrossEarning
    .group()
    .reduce(reduceAdd, reduceRemove, reduceInitial);

  return {
    movies,
    moviesByYear,
    movieGroupsByYear,
    moviesByGenre,
    movieGroupsByGenre,
    moviesByMotionPictureRating,
    movieGroupsByMotionPictureRating,
    moviesByRuntime,
    movieGroupsByRuntime,
    moviesByBudgetGrossEarning,
    movieGroupsByBudgetGrossEarning,
  };
}
