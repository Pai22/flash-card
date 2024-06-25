"use client"
import React, { useState }  from 'react'
import { collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '../../lip/firebase/clientApp';
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Card, CardBody, Link } from '@nextui-org/react';
import useAuth from '../../lip/hooks/useAuth';
import AddCardFront from '../../cards/components/AddCardFront';
import AddCardBack from '../../cards/components/AddCardBack';

const CardPage = ({ deckId }) => {
    const auth = useAuth();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [questionFront, setQuestionFront] = useState('');
  const [imageFront, setImageFront] = useState(null);
  const [audioFront, setAudioFront] = useState(null);
  const [questionBack, setQuestionBack] = useState('');
  const [imageBack, setImageBack] = useState(null);
  const [audioBack, setAudioBack] = useState(null);
  const [loading, setLoading] = useState(false);
  const storage = getStorage();

  const handleFileUpload = async (file, path) => {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const addCardToDeck = async (e) => {
    e.preventDefault();
    if (!auth) return;

    setLoading(true);

    try {
      let imageUrlFront = '';
      let audioUrlFront = '';
      let imageUrlBack = '';
      let audioUrlBack = '';

      if (imageFront) {
        imageUrlFront = await handleFileUpload(imageFront, `images/${auth.uid}/${deckId}/ImageFront/${imageFront.name}`);
      }

      if (audioFront) {
        audioUrlFront = await handleFileUpload(audioFront, `audio/${auth.uid}/${deckId}/AudioFront/${audioFront.name}`);
      }

      if (imageBack) {
        imageUrlBack = await handleFileUpload(imageBack, `images/${auth.uid}/${deckId}/ImageBack/${imageBack.name}`);
      }

      if (audioBack) {
        audioUrlBack = await handleFileUpload(audioBack, `audio/${auth.uid}/${deckId}/AudioBack/${audioBack.name}`);
      }

      const cardsRef = collection(db, 'Deck', auth.uid, 'title', deckId, 'cards');
      await addDoc(cardsRef, {
        questionFront: questionFront,
        imageUrlFront: imageUrlFront,
        audioUrlFront: audioUrlFront,
        questionBack: questionBack,
        imageUrlBack: imageUrlBack,
        audioUrlBack: audioUrlBack,
        timestamp: new Date().getTime(),
      });

      console.log('Card added successfully');
      setQuestionFront('');
      setImageFront(null);
      setAudioFront(null);
      setQuestionBack('');
      setImageBack(null);
      setAudioBack(null);
      onOpenChange(false);
    } catch (error) {
      console.error('Error adding card:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      Card { deckId }

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
              <form onSubmit={addCardToDeck}>
                <ModalHeader className="flex flex-col gap-1">Add Card</ModalHeader>
                <ModalBody>
                  <AddCardFront
                    setQuestionFront={setQuestionFront}
                    setImageFront={setImageFront}
                    setAudioFront={setAudioFront}
                    questionFront={questionFront}
                    imageFront={imageFront}
                    audioFront={audioFront}
                  />
                  <AddCardBack
                    setQuestionBack={setQuestionBack}
                    setImageBack={setImageBack}
                    setAudioBack={setAudioBack}
                    questionBack={questionBack}
                    imageBack={imageBack}
                    audioBack={audioBack}
                  />
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="flat" onPress={onClose}>
                    Close
                  </Button>
                  <Button color="primary" type="submit" disabled={loading}>
                    {loading ? 'Adding...' : 'Add'}
                  </Button>
                </ModalFooter>
              </form>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}

export default CardPage
