import { useMemo } from "react";
import CardTypeOne from "./CardTypeOne";
import { transformExamStatsToCards } from "./helper";


const StatsCardTypes = (props: any) => {

  const cardsListOne = useMemo(() => transformExamStatsToCards(props.data), [props.data]);
  
  return (
    <div className="stats-card-types-container">
      <div className="row">
        {cardsListOne.map((card) => (
          <div className="col-12 col-md-6 col-xl-3" key={card.cardTitle}>
            <CardTypeOne card={card}></CardTypeOne>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsCardTypes;
