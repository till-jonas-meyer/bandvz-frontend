import React, { useState } from 'react';
import { useForm } from '@mantine/form';
import {
  Space,
  Center,
  Container,
  Title,
  Text,
  TextInput,
  Button,
  Flex,
  Alert
} from '@mantine/core';
import type { ResetPasswordParameters } from '../../api/generated';
import { AtIcon, CheckCircleIcon } from '@phosphor-icons/react';
import { MessagePage } from './MessagePage';
import { resetPassword } from '../../api/generated';

export function ResetPassword() {
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      email: ''
    },
    validate: {
      email: (value) => {
        if (!/^\S+@\S+$/.test(value) || value === '') {
          return 'Bitte gib eine gültige E-Mail-Adresse ein.';
        }
        return null;
      }
    }
  });

  const [submitDisabled, setSubmitDisabled] = useState(false);
  const [resetPasswordStatus, setResetPasswordStatus] = useState<'input' | 'success'>('input');
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  const onSubmitResetForm = async (event: ResetPasswordParameters) => {

    setSubmitDisabled(true);
    setError(null);

    const { email } = event;

    setSubmittedEmail(email);

    const resetPasswordResult = await resetPassword({ body: { email } });

    if (resetPasswordResult.status === 200) {
      setSuccessMessage(resetPasswordResult.data!.message);
      setResetPasswordStatus('success');
      setSubmitDisabled(false);
      return;
    }

    setError(resetPasswordResult.error!.message);
    setSubmitDisabled(false);

  }

  return resetPasswordStatus === 'input' ? (
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
              <Title order={2} mb='sm'>Passwort zurücksetzen</Title>
            </Center>
            {error !== null &&
              <Alert variant='light' color='red' title='Fehler' mb='sm'>{error}</Alert>
            }
            <Text size='sm' mb='sm'>
              Bitte gib deine E-Mail-Adresse ein, um einen Link
              zum Zurücksetzen deines Passworts zu erhalten.
            </Text>
            <form onSubmit={form.onSubmit(onSubmitResetForm)}>
              <TextInput
                w='100%'
                mb='sm'
                leftSection={<AtIcon size={16} />}
                placeholder='E-Mail-Adresse'
                key={form.key('email')}
                {...form.getInputProps('email')}
              />
              <Button w='100%' type='submit' disabled={submitDisabled}>Rücksetzungscode anfordern</Button>
            </form>
          </Flex>
        </Container>
      </Center>
    </React.Fragment>
  ) : (
    <MessagePage
      icon={<CheckCircleIcon size={64} color='green' />}
      title='Rücksetzungslink verschickt'
    >
      <Text>{successMessage}</Text>
    </MessagePage>
  )
}