import OpportunityCard from "./OpportunityCard";

const OpportunityList = ({ items, onSelect }) => {
  return (
    <>
      <div className="row">
        <div className="col-12">
          <h2 className="section-title">This Week's Opportunities</h2>
        </div>
      </div>

      <div className="row">
        {items.map((item) => (
          <OpportunityCard
            key={item.symbol}
            data={item}
            onSelect={onSelect}
          />
        ))}
      </div>
    </>
  );
};

export default OpportunityList;
