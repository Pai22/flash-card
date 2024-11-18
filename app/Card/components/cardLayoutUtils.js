// app/Card/components/cardLayoutUtils.js
export const cards = () => ({
  front: [
    { id: 1, type: "text" },
    { id: 2, type: "image" },
    {
      id: 3,
      type: "TextImage",
      top: null,
    },
    {
      id: 4,
      type: "ImageText",
      bottom: null,
    },
  ],
  back: [
    { id: 5, type: "text" },
    { id: 6, type: "image" },
    {
      id: 7,
      type: "TextImage",
      top: null,
    },
    {
      id: 8,
      type: "ImageText",
      bottom: null,
    },
  ],
});

export const handleLayoutSelect = (
  side,
  layout,
  setLayoutFront,
  setLayoutBack
) => {
  if (side === "front") {
    setLayoutFront(layout);
  } else {
    setLayoutBack(layout);
  }
};
