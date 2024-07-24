// app/cards/components/DeleteCard.js
import React from 'react';
import { doc, deleteDoc } from 'firebase/firestore';
import { getStorage, ref, deleteObject } from 'firebase/storage';
import { Button } from '@nextui-org/react';
import { db } from '../../lip/firebase/clientApp';
import useAuth from '../../lip/hooks/useAuth';

const DeleteCard = ({ deckId, cardId, imageFront, imageBack, audioFront, audioBack }) => {
  const auth = useAuth();
  const storage = getStorage();

  const handleDelete = async () => {
    if (!auth) return;

    const cardRef = doc(db, 'Deck', auth.uid, 'title', deckId, 'cards', cardId);

    try {
      // Delete the document
      await deleteDoc(cardRef);

      // Delete images and audio from Firebase Storage
      if (imageFront) {
        const imageFrontRef = ref(storage, imageFront);
        await deleteObject(imageFrontRef);
      }

      if (imageBack) {
        const imageBackRef = ref(storage, imageBack);
        await deleteObject(imageBackRef);
      }

      if (audioFront) {
        const audioFrontRef = ref(storage, audioFront);
        await deleteObject(audioFrontRef);
      }

      if (audioBack) {
        const audioBackRef = ref(storage, audioBack);
        await deleteObject(audioBackRef);
      }

      console.log('Card and associated files deleted successfully');
    } catch (error) {
      console.error('Error deleting card and files:', error);
    }
  };

  return (
    <Button color="error" onPress={handleDelete}>
      Delete
    </Button>
  );
};

export default DeleteCard;
