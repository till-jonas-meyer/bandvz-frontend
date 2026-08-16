import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Alert,
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
  PasswordIcon,
} from '@phosphor-icons/react';
import type { LoginParameters } from '../../api/generated/types.gen';
import { login } from '../../api/generated';
import { notifications } from '@mantine/notifications';
import { useAppDispatch } from '../../app/hooks';
import { setUser } from '../../features/user/userSlice';

export function Login() {

  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      email: '',
      password: '',
    },
    validateInputOnBlur: true,
    validate: {
      email: (value: string) => {
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
    setError(null);

    const loginResult = await login({ body: event });

    if (loginResult.status === 401) {
      setError(loginResult.error!.message);
      setSubmitDisabled(false);
      return;
    }

    if (loginResult.status === 500) {
      setError(loginResult.error!.message);
      setSubmitDisabled(false);
      return;
    }

    // Too many requests (see rateLimiter in backend)
    if (loginResult.status === 429) {
      setError(loginResult.error!.message);
      return;
    }

    if (loginResult.status === 200) {
      dispatch(setUser(loginResult.data!));
      navigate('/my-bands');
      notifications.show({
        title: 'Eingeloggt',
        message: 'Du wurdest eingeloggt.',
        color: 'green',
      });
      return;
    }
  };

  return (
    <React.Fragment>
      <Space h={{ base: 40, xs: 40, sm: 80, md: 80, lg: 160, xl: 200 }} />
      <Center>
        <Container w={{ base: 300, xs: 300, sm: 300, md: 360, lg: 360, xl: 360 }}>
          <Flex
            direction='column'
            justify='flex-start'
            align='stretch'
          >
            <Center>
              <Title order={2} mb='sm'>Login</Title>
            </Center>
            {error !== null &&
              <Alert variant='light' color='red' title='Fehler' mb='sm'>{error}</Alert>
            }
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