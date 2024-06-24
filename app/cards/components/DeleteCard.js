import React from 'react';
import { doc, deleteDoc } from 'firebase/firestore';
import { Button } from '@nextui-org/react';
import { db } from '../../lip/firebase/clientApp';
import useAuth from '../../lip/hooks/useAuth';

const DeleteCard = ({ deckId, cardId }) => {
  const auth = useAuth();

  const handleDelete = async () => {
    if (!auth) return;

    const cardRef = doc(db, 'Deck', auth.uid, 'title', deckId, 'cards', cardId);
    try {
      await deleteDoc(cardRef);
      console.log('Card deleted successfully');
    } catch (error) {
      console.error('Error deleting card:', error);
    }
  };

  return (
    <Button color="error" onPress={handleDelete}>
      Delete
    </Button>
  );
};

export default DeleteCard;
