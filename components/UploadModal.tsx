import React, { useEffect, useState } from 'react';
import {
  Button,
  Stack,
  Center,
  Input,
  Textarea,
  Flex,
  Spinner,
  Text,
  SimpleGrid,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Link,
  HStack,
  Badge
} from '@chakra-ui/react';

import InjectedModal from "components/InjectedModal";
import MagicModal from "components/MagicModal";
import useUser from 'lib/useUser';

export default function UploadModal({transactions, NFT, contractAddress, modalParams, onSuccessfulTx}: any): JSX.Element {

  return (
    <>
      <Modal
        isOpen={modalParams.isOpen}
        onClose={modalParams.onClose}
        size={"xl"}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Choose method to upload your tokens.</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            
            <Text my="2">
              {`
                Both methods are non-custodial (we don't see your private keys).
              `}
            </Text>

            <Text my="2">
              {`
                We recommend using the email method when uploading multiple tokens.
              `}
            </Text>

            <Accordion allowToggle>
              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      <p className="text-gray-800 text-xl">
                        Metamask
                      </p>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>

                  <InjectedModal
                    NFT={NFT}
                    contractAddress={contractAddress} 
                    transactions={transactions} 
                    onSuccessfulTx={onSuccessfulTx}
                  />

                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      
                      <HStack>
                        <p className="text-gray-800 text-xl">
                          Email
                        </p>
                        <Link href="https://magic.link/" isExternal>
                          (magic.link)
                        </Link>                        
                      </HStack>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  
                  <MagicModal     
                    transactions={transactions}
                    contractAddress={contractAddress}                                    
                    NFT={NFT}
                    onSuccessfulTx={onSuccessfulTx}
                  />

                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </ModalBody>
          
        </ModalContent>
      </Modal>
    </>
  )
}