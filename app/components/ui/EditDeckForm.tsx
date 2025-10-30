"use client";

import { useState } from "react";
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Switch,
  HStack,
  Tag,
  TagLabel,
  TagCloseButton,
  InputGroup,
  InputRightElement,
  Button,
  Flex,
  Text,
} from "@chakra-ui/react";

export interface DeckFormValues {
  title: string;
  description?: string;
  isPublic: boolean;
  tags: string[];
}

interface EditDeckFormProps {
  initialValues: DeckFormValues;
  isSubmitting?: boolean;
  onSubmit: (values: DeckFormValues) => Promise<void> | void;
  onCancel?: () => void;
}

export default function EditDeckForm({
  initialValues,
  isSubmitting = false,
  onSubmit,
  onCancel,
}: EditDeckFormProps) {
  const [values, setValues] = useState<DeckFormValues>(initialValues);
  const [newTag, setNewTag] = useState("");
  const [errors, setErrors] = useState<{ title?: string; tags?: string }>({});

  const addTag = () => {
    const t = newTag.trim();
    if (!t) return;
    if (values.tags.length >= 10) {
      setErrors((e) => ({ ...e, tags: "Maximum 10 tags allowed." }));
      return;
    }
    if (values.tags.includes(t)) {
      setErrors((e) => ({ ...e, tags: "Tag already exists." }));
      return;
    }
    setValues((v) => ({ ...v, tags: [...v.tags, t] }));
    setNewTag("");
    setErrors((e) => ({ ...e, tags: undefined }));
  };

  const removeTag = (tag: string) => {
    setValues((v) => ({ ...v, tags: v.tags.filter((x) => x !== tag) }));
    setErrors((e) => ({ ...e, tags: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!values.title.trim()) {
      setErrors((e) => ({ ...e, title: "Title is required." }));
      return;
    }
    await onSubmit({
      ...values,
      title: values.title.trim(),
      description: values.description?.trim() || "",
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <VStack spacing={4} align="stretch">
        <FormControl isRequired isInvalid={!!errors.title}>
          <FormLabel>Title</FormLabel>
          <Input
            value={values.title}
            maxLength={100}
            onChange={(e) => {
              setValues((v) => ({ ...v, title: e.target.value }));
              setErrors((er) => ({ ...er, title: undefined }));
            }}
            placeholder="Enter deck title"
          />
          {errors.title && (
            <Text color="red.400" fontSize="sm" mt={1}>
              {errors.title}
            </Text>
          )}
        </FormControl>

        <FormControl>
          <FormLabel>Description</FormLabel>
          <Textarea
            value={values.description}
            rows={4}
            maxLength={500}
            onChange={(e) => setValues((v) => ({ ...v, description: e.target.value }))}
            placeholder="Enter deck description (optional)"
          />
        </FormControl>

        <FormControl display="flex" alignItems="center">
          <FormLabel mb={0}>Public</FormLabel>
          <Switch
            isChecked={values.isPublic}
            onChange={() => setValues((v) => ({ ...v, isPublic: !v.isPublic }))}
            colorScheme="brand"
          />
        </FormControl>

        <FormControl isInvalid={!!errors.tags}>
          <FormLabel>Tags</FormLabel>
          <HStack wrap="wrap" spacing={2} mb={2}>
            {values.tags.map((tag) => (
              <Tag key={tag} size="md">
                <TagLabel>{tag}</TagLabel>
                <TagCloseButton onClick={() => removeTag(tag)} />
              </Tag>
            ))}
          </HStack>
          <InputGroup>
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add a tag (e.g., Spanish)"
              maxLength={50}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag();
                }
              }}
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={addTag}>
                Add
              </Button>
            </InputRightElement>
          </InputGroup>
          {errors.tags && (
            <Text color="red.400" fontSize="sm" mt={1}>
              {errors.tags}
            </Text>
          )}
        </FormControl>

        <Flex justify="flex-end" gap={3} pt={2}>
          {onCancel && (
            <Button variant="ghost" onClick={onCancel} isDisabled={isSubmitting}>
              Cancel
            </Button>
          )}
          <Button type="submit" colorScheme="brand" isLoading={isSubmitting} loadingText="Saving...">
            Save Changes
          </Button>
        </Flex>
      </VStack>
    </form>
  );
}


