import React from 'react';
import type { ReactNode } from 'react';
import {
  Space,
  Container,
  Flex,
  Title
} from '@mantine/core';

type MessagePageProps = {
  icon: ReactNode;
  title: string;
  children: ReactNode;
};

export function MessagePage({ icon, title, children }: MessagePageProps) {
  return (
    <React.Fragment>
      <Space h={{ base: 40, xs: 140 }} />
      <Container w={{ base: 300, xs: 360, sm: 360, md: 480, lg: 640 }}>
        <Flex direction='column' align='center' justify='flex-start'>
          <Container mb='sm'>{icon}</Container>
          <Title order={2} mb='sm' ta='center'>{title}</Title>
          {children}
        </Flex>
      </Container>
    </React.Fragment>
  )
}