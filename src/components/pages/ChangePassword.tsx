import React, { useState } from 'react';
import type { ReactNode } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm } from '@mantine/form';
import {
  Space,
  Center,
  Container,
  Flex,
  Title,
  Text,
  Alert,
  PasswordInput,
  Button,
  Anchor
} from '@mantine/core';
import type { ChangePasswordParameters } from '../../api/generated';
import { changePassword } from '../../api/generated';
import { PasswordIcon, CheckCircleIcon } from '@phosphor-icons/react';
import { MessagePage } from './MessagePage';

export function ChangePassword() {

  const { resetCode } = useParams();
  const navigate = useNavigate();

  if (!resetCode) {
    navigate('/');
    return <div>Kein Reset-Code</div>
  }

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      password: '',
      passwordRepeat: '',
    },
    validate: {
      password: (value) => {
        if (value === '') return 'Bitte gib ein Passwort ein.'
        return null;
      },
      passwordRepeat: (value) => {
        if (value === '') return 'Bitte wiederhole dein Passwort.'
      }
    }
  });

  const [error, setError] = useState<ReactNode | null>(null);
  const [changePasswordStatus, setChangePasswordStatus] = useState<'input' | 'success'>('input');
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const onSubmitChangePasswordForm = async (event: { password: string; passwordRepeat: string; resetCode: string }) => {

    setSubmitDisabled(true);
    setError(null);

    if (event.password !== event.passwordRepeat) {
      const errorMessage = <Text size='sm'>Die Passwörter stimmen nicht überein.</Text>;
      setError(errorMessage);
      setSubmitDisabled(false);
      return;
    }

    const { password, resetCode } = event;

    const changePasswordResult = await changePassword({
      body: { password, resetCode }
    });

    if (changePasswordResult.status === 404) {
      const errorMessage = <React.Fragment>
        <Text mb='sm' size='sm'>Benutzer mit diesem Reset-Code nicht gefunden.</Text>
        <Anchor size='sm' component={Link} to='/user/reset-password'>Link erneut anfordern</Anchor>
      </React.Fragment>
      setError(errorMessage);
      return;
    }

    if (changePasswordResult.status === 200) {
      setError(null);
      setSuccessMessage(changePasswordResult.data!.message);
      setChangePasswordStatus('success');
      return;
    }

    const errorMessage = <Text size='sm'>{changePasswordResult.error!.message}</Text>;
    setError(errorMessage);
    setSubmitDisabled(false);

  };

  return changePasswordStatus === 'input' ? (
    <React.Fragment>
      <Space h={{ base: 40, xs: 40, sm: 80, md: 80, lg: 160 }} />
      <Center>
        <Container w={{ base: 300, xs: 300, sm: 300, md: 360, lg: 360, xl: 360 }}>
          <Flex
            direction='column'
            justify='flex-start'
            align='stretch'
          >
            <Center>
              <Title order={2} mb='sm'>Passwort ändern</Title>
            </Center>
            <Text size='sm' mb='sm'>
              Bitte gib ein neues Passwort ein und wiederhole es im zweiten Feld.
            </Text>
            {error &&
              <Alert color='red' mb='sm'>{error}</Alert>
            }
            <form onSubmit={
              form.onSubmit((event) => onSubmitChangePasswordForm({ ...event, resetCode }))
            }>
              <PasswordInput
                w='100%'
                mb='sm'
                leftSection={<PasswordIcon size={16} />}
                placeholder='Passwort'
                key={form.key('password')}
                {...form.getInputProps('password')}
              />
              <PasswordInput
                w='100%'
                mb='sm'
                leftSection={<PasswordIcon size={16} />}
                placeholder='Passwort wiederholen'
                key={form.key('passwordRepeat')}
                {...form.getInputProps('passwordRepeat')}
              />
              <Button w='100%' type='submit' disabled={submitDisabled}>Passwort ändern</Button>
            </form>
          </Flex>
        </Container>
      </Center>
    </React.Fragment>
  ) : (
    <MessagePage
      icon={<CheckCircleIcon color='green' size={64} />}
      title='Passwort wurde geändert'
    >
      <Text mb='sm'>{successMessage}</Text>
      <Anchor component={Link} to='/user/login'>Zur Login-Seite</Anchor>
    </MessagePage>
  )
}