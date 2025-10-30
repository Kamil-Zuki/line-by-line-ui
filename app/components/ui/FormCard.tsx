"use client";

import { ReactNode } from "react";
import { Card, CardBody, Container } from "@chakra-ui/react";

interface FormCardProps {
  children: ReactNode;
  maxW?: string | number;
  padding?: number | string;
}

export default function FormCard({ children, maxW = "lg", padding = 8 }: FormCardProps) {
  return (
    <Container maxW={maxW}>
      <Card>
        <CardBody p={padding}>{children}</CardBody>
      </Card>
    </Container>
  );
}

