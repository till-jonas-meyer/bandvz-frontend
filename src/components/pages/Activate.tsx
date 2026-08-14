import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { MessagePage } from './MessagePage';
import { Loader, Text, Anchor } from '@mantine/core';
import { XCircleIcon, CheckCircleIcon } from '@phosphor-icons/react';
import { activate } from '../../api/generated';

export function Activate() {

  const { activationCode } = useParams();

  const navigate = useNavigate();

  if (!activationCode) {
    navigate('/');
    return <div>Kein Activation-Code</div>
  }

  const [activateStatus, setActivateStatus] = useState<'loading' | 'error' | 'success'>('success');
  const [activateSuccessMessage, setActivateSuccessMessage] = useState('');

  useEffect(() => {
    if (!activationCode) {
      setActivateStatus('error');
      return;
    }

    const activateInner = async () => {
      const activateResult = await activate({ body: { activationCode } });
      if (activateResult.status !== 200) {
        setActivateStatus('error');
        return;
      } else {
        setActivateSuccessMessage(activateResult.data!.message);
        setActivateStatus('success');
      }
    };

    activateInner();
  }, [])

  if (activateStatus === 'loading') {
    return (
      <MessagePage
        icon={<Loader size={64} color='blue' />}
        title='Benutzerkonto wird aktiviert...'
      >
        <Text>Dein Benutzerkonto wird aktiviert.</Text>
      </MessagePage>
    )
  }

  if (activateStatus === 'error') {
    return (
      <MessagePage
        icon={<XCircleIcon size={64} color='red' />}
        title='Fehler'
      >
        <Text>Es ist ein Fehler beim Aktivieren aufgetreten.</Text>
      </MessagePage>
    )
  }

  if (activateStatus === 'success') {
    return (
      <MessagePage
        icon={<CheckCircleIcon size={64} color='green' />}
        title='Aktivierung erfolgreich'
      >
        <Text mb='sm'>{activateSuccessMessage}</Text>
        <Anchor component={Link} to='/user/login'>Zur Login-Seite</Anchor>
      </MessagePage>
    )
  }

}