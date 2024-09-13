// app/Play/components/CardRendering.js
import styles from "../Play.module.css";

export const renderCardContent = (card, side) => {
    if (!card) return null;

    const layout = side === "front" ? card.layoutFront : card.layoutBack;

    switch (layout) {
        case "text":
            return (
                <div className={styles.textContent}>
                    <p>{side === "front" ? card.questionFront : card.questionBack}</p>
                </div>
            );
        case "image":
            return (
                <div className={styles.imageContent}>
                    <img
                        src={side === "front" ? card.imageUrlFront : card.imageUrlBack}
                        alt={`${side} image`}
                    />
                </div>
            );
        case "TextImage":
            return (
                <div className={styles.textImageContent}>
                    <p>{side === "front" ? card.questionFront : card.questionBack}</p>
                    <img
                        src={side === "front" ? card.imageUrlFront : card.imageUrlBack}
                        alt={`${side} image`}
                    />
                </div>
            );
        case "ImageText":
            return (
                <div className={styles.imageTextContent}>
                    <img
                        src={side === "front" ? card.imageUrlFront : card.imageUrlBack}
                        alt={`${side} image`}
                    />
                    <p>{side === "front" ? card.questionFront : card.questionBack}</p>
                </div>
            );
        default:
            return null;
    }
}
