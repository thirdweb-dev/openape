import React, { useEffect, useState, useCallback, useRef } from 'react';

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
  useToast
} from '@chakra-ui/react';
import { useDropzone } from "react-dropzone";
import { parseSkylink, SkynetClient } from "skynet-js";
import ethereum_address from 'ethereum-address';
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'

import { ContentWrapper } from './ContentWrapper';
import { ContentRenderer } from "./ContentRenderer"; 

import { uploadMetadataToSkynet } from "lib/skynet";
import { errorToast, successToast } from "lib/toast";

type UploadFormProps = {
  uploadToken: any;
  
  contractAddress: string;
  setContractAddress: any;
}

export default function UploadForm({
  uploadToken, 
  contractAddress, 
  setContractAddress
}: UploadFormProps): JSX.Element {

  const context = useWeb3React<Web3Provider>()
  const { account } = context

  const skyPortalRef = useRef<any>();
  const [mediaSkylink, setMediaskylink] = useState<string>('');

  const [skylinkLoading, setSkylinkLoading] = useState<boolean>(false);
  const [txLoading, setTxLoading] = useState<boolean>(false);
  const [txLoadingText, setTxLoadingText] = useState<string>('');

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [imageSrc, setImageSrc] = useState<string>('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);

  const toast = useToast();
  
  /// Set skynet portal
  useEffect(() => {
    const portal = "https://siasky.net/";
    skyPortalRef.current = new SkynetClient(portal);
  }, []);

  const onDrop = useCallback(async (acceptedFiles) => {
    setImageSrc('');
    setSkylinkLoading(true);

    const [file] = acceptedFiles;
    setMediaFile(file);

    try {
      const { skylink } = await skyPortalRef.current.uploadFile(file);
      const parsedSkylink: string | null = parseSkylink(skylink);

      setMediaskylink(skylink);
      setImageSrc(`https://siasky.net/${(parsedSkylink as string)}`);

    } catch (err) {
      console.log(err);
    }

    setSkylinkLoading(false);
  }, []);

  const handleError = (err: any) => {
    errorToast(toast, "Sorry, something went wrong. Please try again");
    console.log(err)
  }

  const handleMomentUpload = async () => {
    setTxLoadingText('Uploading to decentralised storage')
    setTxLoading(true);

    try {
      const metadataSkylink = await uploadMetadataToSkynet({
        name,
        description,
        image: mediaSkylink
      });

      console.log("Uploaded: ", metadataSkylink);
      setTxLoadingText('Minting');
      /// `uploadTokens` accepts an array of skylinks, even though we're uploading one at a time.
      const tx = await uploadToken(account, metadataSkylink as string);
      console.log(tx);

      successToast(
        toast,
        "Your collection has been deployed! Scroll down for a link to the transaction."
      )
      setName("");
      setDescription("");
      setImageSrc("");

    } catch(err) {
      handleError(err);
    }

    setTxLoading(false);
    setTxLoadingText('');
  };
  
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <>
      <ContentWrapper>

        <Center mt="16px">
          <>
            <label htmlFor="contract-address" className="mr-4">Contract:</label>
            <Input 
              value={contractAddress}
              isInvalid={!(contractAddress == '') && !ethereum_address.isAddress(contractAddress)}
              errorBorderColor="crimson"
              borderColor={ethereum_address.isAddress(contractAddress) ? "green.300" : ""}
              width="320px" 
              id="contract-address"
              onChange={(e) => setContractAddress(e.target.value)}
              placeholder={"Enter ERC721 contract address"}
            />
          </>
        </Center>
        <Center className="mt-8">

          <SimpleGrid columns={2} spacingX={"100px"}>

            <Stack>

              <Flex
                // mt="32px"
                mb="8px"
                bg="transparent"
                borderRadius="12px"
                border="2px dashed #333"
                height="160px"
                width="400px"
                align="center"
                justify="center"
                direction="column"
              >
                <Flex {...getRootProps()}>
                  <input {...getInputProps()} />
                  <Button
                    color="#444"
                    borderRadius="25px"
                    mt="8px"
                    boxShadow="none !important"
                  >
                    Choose File
                  </Button>
                </Flex>
              </Flex>

              

              <label htmlFor="collection-name">Name</label>
              <Input 
                value={name}
                onChange={(e) => setName(e.target.value)}
                id="collection-name" 
                placeholder="E.g. 'Zombie Punk'"
              />

              <label htmlFor="collection-name">Description</label>
              <Textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)} 
                id="collection-symbol" 
                placeholder="E.g. Dylan Field sold the zombie punk for millions."
              />

              <Button onClick={handleMomentUpload} isLoading={txLoading} loadingText={txLoadingText}>
                Mint
              </Button>
            </Stack>  
            {imageSrc ? (
                <ContentRenderer                                
                  src={imageSrc}
                  file={mediaFile}
                />
              ) : (
                <Flex              
                  height="300px"
                  width="320px"
                  bg="transparent"
                  borderRadius="12px"
                  border="2px dashed #333"
                  align="center"
                  justify="center"
                  direction="column"
                >
                  {skylinkLoading
                    ? (
                      <Stack>
                        <Center>
                          <p className="text-gray-400">
                            Uploading to decentralized storage
                          </p>
                        </Center>
                        <Center>
                          <Spinner />
                        </Center>                                                
                      </Stack>                      
                      )
                    : <Text variant="label" color="#333">Media preview</Text>
                  }
                </Flex>
              )}
          </SimpleGrid>  
        </Center>
      </ContentWrapper>
    </>
  )
}