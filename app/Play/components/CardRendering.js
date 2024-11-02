import styles from "../Play.module.css";

export const renderCardContent = (card, side) => {
  const layout = side === "front" ? card.layoutFront : card.layoutBack;

  switch (layout) {
    case "text":
      return (
        <div className={styles.textContent }>
          <p>{side === "front" ? card.questionFront : card.questionBack}</p>
        </div>
      );
    case "image":
      return (
        <div className={styles.imageContent}>
          <img
            src={side === "front" ? card.imageUrlFront : card.imageUrlBack}
            alt={`${side} image`}
            className="size-1/2  object-contain"
          />
        </div>
      );
    case "ImageText":
      return (
        <div className={styles.imageTextContent}>
          <img
            src={side === "front" ? card.imageUrlFront : card.imageUrlBack}
            alt={`${side} image`}
            className="size-1/2 object-contain"
          />
          <p>{side === "front" ? card.questionFront : card.questionBack}</p>
        </div>
      );
    case "TextImage":
      return (
        <div className={styles.imageTextContent}>
          <p>{side === "front" ? card.questionFront : card.questionBack}</p>
          <img
            src={side === "front" ? card.imageUrlFront : card.imageUrlBack}
            alt={`${side} image`}
            className="size-1/2  object-contain"
          />
        </div>
      );
    default:
      return null;
  }
};
