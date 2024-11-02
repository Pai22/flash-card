// app/EditCard/components/cardLayoutUtils.js
export const cards = (imageUrlFront, handleFileChange, setImageFront, imageUrlBack, setImageBack) => ({
    front: [
      { id: 1, type: "text" },
      { id: 2, type: "image" },
      {
        id: 3,
        type: "TextImage",
        top: null,
        bottom: (
          <>
            <input
              type="file"
              label="อัปโหลดรูปภาพ (ด้านหน้า)"
              accept="image/*"
              onChange={handleFileChange(setImageFront)}
              variant="bordered"
              fullWidth
              className="mt-4"
            />
            {imageUrlFront && (
              <div className="mt-2">
                <img
                  src={imageUrlFront}
                  alt="Image Front"
                  className="max-h-40"
                />
              </div>
            )}
          </>
        ),
      },
      {
        id: 4,
        type: "ImageText",
        top: (
          <>
            <input
              type="file"
              label="อัปโหลดรูปภาพ (ด้านหน้า)"
              accept="image/*"
              onChange={handleFileChange(setImageFront)}
              variant="bordered"
              fullWidth
              className="mt-4"
            />
            {imageUrlFront && (
              <div className="mt-2">
                <img
                  src={imageUrlFront}
                  alt="Image Front"
                  className="max-h-40"
                />
              </div>
            )}
          </>
        ),
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
        bottom: (
          <>
            <input
              type="file"
              label="อัปโหลดรูปภาพ (ด้านหลัง)"
              accept="image/*"
              onChange={handleFileChange(setImageBack)}
              variant="bordered"
              fullWidth
              className="mt-4"
            />
            {imageUrlBack && (
              <div className="mt-2">
                <img src={imageUrlBack} alt="Image Back" className="max-h-40" />
              </div>
            )}
          </>
        ),
      },
      {
        id: 8,
        type: "ImageText",
        top: (
          <>
            <input
              type="file"
              label="อัปโหลดรูปภาพ (ด้านหลัง)"
              accept="image/*"
              onChange={handleFileChange(setImageBack)}
              variant="bordered"
              fullWidth
              className="mt-4"
            />
            {imageUrlBack && (
              <div className="mt-2">
                <img src={imageUrlBack} alt="Image Back" className="max-h-40" />
              </div>
            )}
          </>
        ),
        bottom: null,
      },
    ],
  });
  
  export const handleLayoutSelect = (side, layout, setLayoutFront, setLayoutBack) => {
    if (side === "front") {
      setLayoutFront(layout);
    } else {
      setLayoutBack(layout);
    }
  };
  