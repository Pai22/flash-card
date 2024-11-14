// app/cards/components/layoutCard
const layoutCard = (card, side) => {

  const layoutFront = card.layoutFront;
  const layoutBack = card.layoutBack;

  if (side === "front") {
    switch (layoutFront) {
      case "text":
        return (
          <div>
            <h4 className="font-semibold text-center">{card.questionFront}</h4>
            {card.audioUrlFront && (
              <audio controls className="w-5 absolute bottom-0 right-0">
                <source src={card.audioUrlFront} type="audio/mpeg" />
              </audio>
            )}
          </div>
        );
      case "image":
        return (
          <div>
            {card.imageUrlFront && (
              <img
                src={card.imageUrlFront}
                alt="Front"
                className="w-full h-20 object-cover"
              />
            )}
            {card.audioUrlFront && (
              <audio controls className="w-5 absolute bottom-0 right-0">
                <source src={card.audioUrlFront} type="audio/mpeg" />
              </audio>
            )}
          </div>
        );
      case "TextImage":
        return (
          <div>
            <h4 className="font-semibold text-center">{card.questionFront}</h4>
            {card.imageUrlFront && (
              <img
                src={card.imageUrlFront}
                alt="Front"
                className="w-full h-20 object-cover"
              />
            )}
            {card.audioUrlFront && (
              <audio controls className="w-5 absolute bottom-0 right-0">
                <source src={card.audioUrlFront} type="audio/mpeg" />
              </audio>
            )}
          </div>
        );
      case "ImageText":
        return (
          <div>
            {card.imageUrlFront && (
              <img
                src={card.imageUrlFront}
                alt="Front"
                className="w-full h-20 object-cover"
              />
            )}
            <h4 className="font-semibold text-center">{card.questionFront}</h4>
            {card.audioUrlFront && (
              <audio controls className="w-5 absolute bottom-0 right-0">
                <source src={card.audioUrlFront} type="audio/mpeg" />
              </audio>
            )}
          </div>
        );
      default:
        return <p>Unknown status.</p>;
    }
  }else{
   switch (layoutBack) {
      case "text":
        return (
          <div>
            <h4 className="font-semibold text-center">{card.questionBack}</h4>
            {card.audioUrlBack && (
              <audio controls className="w-5 absolute bottom-0 right-0">
                <source src={card.audioUrlBack} type="audio/mpeg" />
              </audio>
            )}
          </div>
        );
      case "image":
        return (
          <div>
            {card.imageUrlBack && (
              <img
                src={card.imageUrlBack}
                alt="Back"
                className="w-full h-20 object-cover"
              />
            )}
            {card.audioUrlBack && (
              <audio controls className="w-5 absolute bottom-0 right-0">
                <source src={card.audioUrlBack} type="audio/mpeg" />
              </audio>
            )}
          </div>
        );
      case "TextImage":
        return (
          <div>
            <h4 className="font-semibold text-center">{card.questionBack}</h4>
            {card.imageUrlBack && (
              <img
                src={card.imageUrlBack}
                alt="Back"
                className="w-full h-20 object-cover"
              />
            )}
            {card.audioUrlBack && (
              <audio controls className="w-5 absolute bottom-0 right-0">
                <source src={card.audioUrlBack} type="audio/mpeg" />
              </audio>
            )}
          </div>
        );
      case "ImageText":
        return (
          <div>
            {card.imageUrlBack && (
              <img
                src={card.imageUrlBack}
                alt="Back"
                className="w-full h-20 object-cover"
              />
            )}
            <h4 className="font-semibold text-center">{card.questionBack}</h4>
            {card.audioUrlBack && (
              <audio controls className="w-5 absolute bottom-0 right-0">
                <source src={card.audioUrlBack} type="audio/mpeg" />
              </audio>
            )}
          </div>
        );
      default:
        return <p>Unknown status.</p>;
    }
  }
};
export default layoutCard;
