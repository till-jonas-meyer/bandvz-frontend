import React, { useState } from 'react';
import {
  Space,
  Center,
  Container,
  Flex,
  Alert,
  Text,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Box
} from '@mantine/core';
import { useForm } from '@mantine/form';
import {
  AtIcon,
  PasswordIcon,
  CheckCircleIcon
} from '@phosphor-icons/react';
import type { RegisterParameters } from '../../api/generated';
import { register } from '../../api/generated';
import { MessagePage } from './MessagePage';
import { isSecurePassword } from '../../helpers';
import { Turnstile } from '@marsidev/react-turnstile';

export function Register() {

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      email: '',
      password: '',
      passwordRepeat: '',
      turnstileToken: '',
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
        if (!isSecurePassword(value)) {
          return 'Das Passwort muss mindestens 8 Zeichen lang sein und einen Großbuchstaben, einen Kleinbuchstaben und eine Ziffer enthalten.';
        }
        return null;
      },
      passwordRepeat: (value) => {
        if (value === '') {
          return 'Bitte wiederhole dein Passwort.';
        }
        return null;
      },
      turnstileToken: (value) => {
        if (value === '') {
          return 'Bitte die Verifizierung durchführen.';
        }
        return null;
      }
    }
  });

  const [error, setError] = useState<string | null>(null);
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const [registerStatus, setRegisterStatus] = useState<'input' | 'success'>('input');
  const [submittedEmail, setSubmittedEmail] = useState('');

  const onSubmitRegisterForm = async (event: RegisterParameters & { passwordRepeat: string; }) => {

    setSubmitDisabled(true);
    setError(null);

    const { email, password, passwordRepeat, turnstileToken } = event;

    if (password !== passwordRepeat) {
      setError('Die beiden eingegebenen Passwörter stimmen nicht überein.');
      setSubmitDisabled(false);
      return;
    }

    const registerResult = await register({
      body: {
        email,
        password,
        turnstileToken
      }
    });

    if (registerResult.status !== 201) {
      setError(registerResult.error!.message);
      setSubmitDisabled(false);
    } else {
      setSubmitDisabled(false);
      setSubmittedEmail(email);
      setRegisterStatus('success');
    }

  };

  return registerStatus === 'input' ? (
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
              <Title order={2} mb='sm'>Registrieren</Title>
            </Center>
            <Text size='sm' mb='sm'>Bitte gib deine E-Mail-Adresse und ein Passwort, mit dem du dich später einloggen willst, ein, um dich als Benutzer zu registrieren.</Text>
            {error &&
              <Alert color='red' mb='sm'>{error}</Alert>
            }
            <form onSubmit={form.onSubmit(onSubmitRegisterForm)}>
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
              <PasswordInput
                w='100%'
                mb='sm'
                leftSection={<PasswordIcon size={16} />}
                placeholder='Passwort wiederholen'
                key={form.key('passwordRepeat')}
                {...form.getInputProps('passwordRepeat')}
              />
              <Box mb='sm' ta='center'>
                <Turnstile
                  siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
                  onSuccess={(token) => { form.setFieldValue('turnstileToken', token); }}
                  onExpire={() => { form.setFieldValue('turnstileToken', ''); }}
                  onError={() => { form.setFieldValue('turnstileToken', ''); }}
                />
              </Box>
              <Button w='100%' type='submit' disabled={submitDisabled}>Registrieren</Button>
            </form>
          </Flex>
        </Container>
      </Center>
    </React.Fragment>
  ) : (
    <MessagePage
      icon={<CheckCircleIcon color='green' size={64} />}
      title='Registrierung erfolgreich'
    >
      <Text>
        Du wurdest erfolgreich registriert. Bitte prüfe dein E-Mail-Postfach
        für die E-Mail-Adresse {submittedEmail}. Du hast eine E-Mail mit einem
        Aktivierungslink erhalten. Falls du keine Mail hast, prüfe auch deinen Spam-Ordner.
      </Text>
    </MessagePage>
  )
}