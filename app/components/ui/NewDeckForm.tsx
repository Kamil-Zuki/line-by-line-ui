"use client";

import { useState } from "react";
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Checkbox,
  Flex,
  Button,
} from "@chakra-ui/react";

interface NewDeckFormProps {
  onSubmit: (values: { title: string; description: string; isPublic: boolean }) => Promise<void> | void;
  isSubmitting?: boolean;
}

export default function NewDeckForm({ onSubmit, isSubmitting = false }: NewDeckFormProps) {
  const [form, setForm] = useState({ title: "", description: "", isPublic: false });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <VStack spacing={4} align="stretch">
        <FormControl isRequired>
          <FormLabel>Title</FormLabel>
          <Input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Enter deck title"
          />
        </FormControl>
        <FormControl>
          <FormLabel>Description</FormLabel>
          <Textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Optional description"
          />
        </FormControl>
        <FormControl>
          <Checkbox
            isChecked={form.isPublic}
            onChange={(e) => setForm({ ...form, isPublic: e.target.checked })}
          >
            Make public
          </Checkbox>
        </FormControl>
        <Flex justify="flex-end" pt={2}>
          <Button type="submit" colorScheme="brand" isLoading={isSubmitting} loadingText="Creating...">
            Create Deck
          </Button>
        </Flex>
      </VStack>
    </form>
  );
}


