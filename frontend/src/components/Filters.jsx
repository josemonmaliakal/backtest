const Filters = ({ onFilterChange }) => {
  const filters = [
    "All Signals",
    "Buy Only",
    "Sell Only",
    "High Confidence",
    "This Week",
  ];

  const handleClick = (filter) => {
    console.log("Filter applied:", filter);
    onFilterChange(filter);   // ❗ requires prop
  };

  return (
    <div className="row mb-4">
      <div className="col-12">
        {filters.map((filter) => (
          <button
            key={filter}
            className="filter-btn"
            onClick={() => handleClick(filter)}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Filters;
