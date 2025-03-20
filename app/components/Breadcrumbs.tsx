"use client";

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";
import { usePathname } from "next/navigation";

export default function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname?.split("/").filter((seg) => seg) || [];

  return (
    <Breadcrumb
      px={4}
      py={2}
      bg="gray.50"
      borderBottom="1px solid"
      borderColor="gray.200"
    >
      {segments.map((segment, index) => {
        const href = "/" + segments.slice(0, index + 1).join("/");
        const isLast = index === segments.length - 1;
        return (
          <BreadcrumbItem key={segment} isCurrentPage={isLast}>
            <BreadcrumbLink
              href={href}
              color={isLast ? "teal.600" : "gray.600"}
            >
              {segment.charAt(0).toUpperCase() + segment.slice(1)}
            </BreadcrumbLink>
          </BreadcrumbItem>
        );
      })}
    </Breadcrumb>
  );
}
