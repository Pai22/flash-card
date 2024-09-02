import React, { useState } from 'react';
import { db } from '../../lip/firebase/clientApp';
import { addDoc, collection } from 'firebase/firestore';
import useAuth from '@/app/lip/hooks/useAuth';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input } from '@nextui-org/react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";


const AddToDeckComponent = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false); // Initialize loading state
  const auth = useAuth();

  const addToDeck = async (e) => {
    e.preventDefault();
    // Save Title to firebase
    const deckRef = collection(db, 'Deck', auth.uid, 'title');
    setLoading(true);
    try {
      const docRef = await addDoc(deckRef, {
        title: title,
        description: description,
        timestamp: new Date().getTime(),
        completed: false
      });
      console.log('Document ID:', docRef.id); // Log the Document ID
      setTitle(''); // Reset the input value
      setDescription('');
      onOpenChange(false); // Close the modal after adding the document
    } catch (error) {
      console.error('Error adding document:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        radius="full"
        className="font-semibold bg-sky-400 hover:bg-sky-400 focus:outline-none focus:ring focus:ring-sky-300 text-white text-[15px] shadow-lg my-5 ml-2" onPress={onOpen}>
         <FontAwesomeIcon
          style={{ fontSize: "20px"}}
          icon={faPlus}
        /><span>New Deck</span>
       
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
            <form onSubmit={addToDeck}>
              <ModalHeader className="flex flex-col gap-1">Add to deck</ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  label="Title"
                  name="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter your title"
                  variant="bordered"
                />
                <Input
                  label="Description"
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter your description"
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

export default AddToDeckComponent;
