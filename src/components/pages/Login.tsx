import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Center,
  Container,
  Flex,
  Space,
  Title,
  TextInput,
  PasswordInput,
  Anchor
} from '@mantine/core';
import { useForm } from '@mantine/form';
import {
  AtIcon,
  PasswordIcon
} from '@phosphor-icons/react';
import type { LoginParameters } from '../../api/generated/types.gen';
import { login } from '../../api/generated/sdk.gen';
import { notifications } from '@mantine/notifications';

export function Login() {
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      email: '',
      password: '',
    },
    validateInputOnBlur: true,
    validate: {
      email: (value) => {
        if (!/^\S+@\S+$/.test(value) || value === '') {
          return 'Bitte gib eine gültige E-Mail-Adresse ein.';
        }
        return null;
      },
      password: (value) => {
        if (value === '') {
          return 'Bitte gib ein Passwort ein.';
        }
        return null;
      }
    }
  });

  const [submitDisabled, setSubmitDisabled] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmitLoginForm = async (event: LoginParameters) => {

    setSubmitDisabled(true);

    const loginResult = await login({ body: event });

    if (loginResult.status === 401) {
      // When the status is 401, the message is always set
      // See API app.ts - there is a handling for thrown HttpErrors
      const message = (loginResult as any).data!.message;
      notifications.show({
        title: 'Login fehlgeschlagen',
        message: message,
        color: 'red'
      });
    }
  };

  return (
    <React.Fragment>
      <Space h={160} />
      <Center>
        <Container w={300}>
          <Flex
            direction='column'
            justify='flex-start'
            align='stretch'
          >
            <Center>
              <Title order={2} mb='sm'>Login</Title>
            </Center>
            <form onSubmit={form.onSubmit(onSubmitLoginForm)}>
              <TextInput
                w='100%'
                mb='sm'
                leftSection={<AtIcon size={16} />}
                placeholder='E-Mail-Adresse'
                key={form.key('email')}
                {...form.getInputProps('email')}
              />
              <PasswordInput
                w='100%'
                mb='sm'
                leftSection={<PasswordIcon size={16} />}
                placeholder='Passwort'
                key={form.key('password')}
                {...form.getInputProps('password')}
              />
              <Button w='100%' type='submit' disabled={submitDisabled}>Anmelden</Button>
            </form>
            <Anchor mt='md' ta='center' component={Link} to='/user/reset-password'>Passwort vergessen?</Anchor>
            <Anchor ta='center' component={Link} to='/user/register'>Neu hier? Registrieren</Anchor>
          </Flex>
        </Container>
      </Center>

    </React.Fragment>
  );
}