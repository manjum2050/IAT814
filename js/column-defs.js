const stringToArray = (str) =>
  str
    .replace(/['\[\]]+/g, "")
    .split(",")
    .map((w) => w.trim());
const columnDefs = {
  movieTitle: {
    title: "Movie Title",
    value: (d) => d.movie_title,
    width: 200,
  },
  rtRating: {
    title: "<span class='rt'>Rotten Tomatoes</span> Rating",
    value: (d) => +d.RT_rating,
    className: "text-right",
    render: $.fn.dataTable.render.number(",", ".", 1),
  },
  imdbRating: {
    title: "<span class='imdb'>IMDB</span> Rating",
    value: (d) => +d.IMDB_rating,
    className: "text-right",
    render: $.fn.dataTable.render.number(",", ".", 1),
  },
  movieInfo: {
    title: "Movie Info",
    value: (d) => d.movie_info,
    width: 400,
  },
  directors: {
    title: "Directors",
    value: (d) => stringToArray(d.directors),
    render: "[, ]",
    width: 200,
  },
  authors: {
    title: "Authors",
    value: (d) => stringToArray(d.authors),
    render: "[, ]",
    width: 200,
  },
  actors: {
    title: "Actors",
    value: (d) => stringToArray(d.actors),
    render: "[, ]",
    width: 400,
  },
  productionCompany: {
    title: "Production Company",
    value: (d) => d.production_company,
    width: 200,
  },
  motionPictureRating: {
    title: "MPAA",
    value: (d) => d.content_rating,
  },
  genre: {
    title: "Genre",
    value: (d) => d.genre,
  },
  year: {
    title: "Year",
    value: (d) => +d.year,
    className: "text-right",
  },
  runtime: {
    title: "Runtime",
    value: (d) => +d.duration,
    className: "text-right",
  },
  votes: {
    title: "Votes",
    value: (d) => +d.votes,
    className: "text-right",
    render: $.fn.dataTable.render.number(",", ".", 0),
  },
  budget: {
    title: "Budget",
    value: (d) => +d.budget,
    className: "text-right",
    render: $.fn.dataTable.render.number(",", ".", 0, "$"),
  },
  usaGrossIncome: {
    title: "USA Gross Income",
    value: (d) => +d.usa_gross_income,
    className: "text-right",
    render: $.fn.dataTable.render.number(",", ".", 0, "$"),
  },
  worldwideIncome: {
    title: "Worldwide Income",
    value: (d) => +d.worldwide_income,
    className: "text-right",
    render: $.fn.dataTable.render.number(",", ".", 0, "$"),
  },
  grossEarning: {
    title: "Gross Earning",
    value: (d) => +d.gross_earning,
    className: "text-right",
    render: $.fn.dataTable.render.number(",", ".", 0, "$"),
  },
  popularity: {
    title: "Popularity",
    value: (d) => +d.popularity,
    className: "text-right",
    render: $.fn.dataTable.render.number(",", ".", 1),
  }
};
