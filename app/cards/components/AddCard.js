import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '../../lip/firebase/clientApp';
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, useDisclosure } from '@nextui-org/react';
import useAuth from '../../lip/hooks/useAuth';

const AddNewCard = ({ deckId }) => {
  const auth = useAuth();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
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
      let imageUrl = '';
      let audioUrl = '';

      if (imageFile) {
        imageUrl = await handleFileUpload(imageFile, `images/${auth.uid}/${deckId}/${imageFile.name}`);
      }

      if (audioFile) {
        audioUrl = await handleFileUpload(audioFile, `audio/${auth.uid}/${deckId}/${audioFile.name}`);
      }

      const cardsRef = collection(db, 'Deck', auth.uid, 'title', deckId, 'cards');
      await addDoc(cardsRef, {
        question: question,
        answer: answer,
        imageUrl: imageUrl,
        audioUrl: audioUrl,
        timestamp: new Date().getTime(),
      });

      console.log('Card added successfully');
      setQuestion('');
      setAnswer('');
      setImageFile(null);
      setAudioFile(null);
      onOpenChange(false);
    } catch (error) {
      console.error('Error adding card:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button onPress={onOpen} color="default" variant="bordered" className="mt-4">
        Add New Card
      </Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
              <form onSubmit={addCardToDeck}>
                <ModalHeader className="flex flex-col gap-1">Add Card</ModalHeader>
                <ModalBody>
                  <Input
                    autoFocus
                    label="Question"
                    name="question"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Enter your question"
                    variant="bordered"
                  />
                  <Input
                    label="Answer"
                    name="answer"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Enter your answer"
                    variant="bordered"
                  />
                  <Input
                    type="file"
                    label="Upload Image"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    variant="bordered"
                  />
                  <Input
                    type="file"
                    label="Upload Audio"
                    accept="audio/*"
                    onChange={(e) => setAudioFile(e.target.files[0])}
                    variant="bordered"
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
    </>
  );
};

export default AddNewCard;
