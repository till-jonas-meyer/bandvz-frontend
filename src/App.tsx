import React, { useEffect } from 'react'
import './App.css'
import { login, logout, profile } from './api/generated/sdk.gen';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { setUser, unsetUser } from './features/user/userSlice';
import { MantineProvider, createTheme } from '@mantine/core';
import {
  ActionIcon,
  AppShell,
  Burger,
  Flex,
  Menu,
  Space,
  Text,
  NavLink,
  Title
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import '@mantine/core/styles.css';
import {
  UserIcon,
  SignOutIcon,
  SignInIcon,
  UserPlusIcon,
  UsersFourIcon,
  UsersThreeIcon,
} from '@phosphor-icons/react';
import {
  BrowserRouter,
  Route,
  Routes,
  Link,
  useNavigate
} from 'react-router-dom';
import { Notifications, notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';
import { Login } from './components/pages/Login';
import { Register } from './components/pages/Register';

const theme = createTheme({
  primaryColor: 'blue',
  scale: 1.125,
});

function App() {

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [navbarOpened, { toggle }] = useDisclosure();

  const user = useAppSelector((state) => {
    return state.user;
  });

  useEffect(() => {
    const loginUser = async () => {
      const result = await login({
        body: {
          email: 'weaveit@gmx.net',
          password: 'Test1234',
        }
      });
    };
    const getUser = async () => {
      const profileResult = await profile();
      if (profileResult.status === 200 && profileResult.data) {
        dispatch(setUser(profileResult.data));
      }
    };
    getUser();
  }, []);

  const logoutClicked = async () => {
    const logoutResult = await logout();
    if (logoutResult.status === 200 && logoutResult.data) {
      dispatch(unsetUser());
      navigate('/');
      notifications.show({
        title: 'Abgemeldet',
        message: 'Du wurdest abgemeldet.',
        color: 'green',
      });
    }
  }

  return (
    <MantineProvider theme={theme}>
      <Notifications />
      <AppShell
        padding='md'
        header={{ height: 80 }}
        navbar={{
          width: 300,
          breakpoint: 'sm',
          collapsed: { mobile: !navbarOpened }
        }}
      >
        <AppShell.Header p='md'>
          <Flex
            justify='flex-start'
            align='center'
          >
            <Burger
              opened={navbarOpened}
              onClick={toggle}
              hiddenFrom='sm'
              size='sm'
            />
            <Space
              w='md'
              hiddenFrom='sm'
            />
            <Title order={1}>BandVZ</Title>
            <Space flex='1' />
            <Menu shadow='md' width={200}>
              <Menu.Target>
                {user !== null ? (
                  <ActionIcon size='md' style={{ borderRadius: '50%' }}>
                    <UserIcon size={22} />
                  </ActionIcon>
                ) : (
                  <ActionIcon size='md' style={{ borderRadius: '50%' }}>
                    <UserPlusIcon size={22} />
                  </ActionIcon>
                )}
              </Menu.Target>
              <Menu.Dropdown>
                {user !== null ? (
                  <React.Fragment>
                    <Text m='sm'>{user.email}</Text>
                    <Menu.Item leftSection={<UserIcon size={18} />} component={Link} to='/user/profile'>Mein Profil</Menu.Item>
                    <Menu.Divider />
                    <Menu.Item leftSection={<SignOutIcon size={18} />} onClick={logoutClicked}>Logout</Menu.Item>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <Menu.Item leftSection={<SignInIcon size={18} />} component={Link} to='/user/login' >Login</Menu.Item>
                    <Menu.Item leftSection={<UserPlusIcon size={18} />} component={Link} to='/user/register'>Registrieren</Menu.Item>
                  </React.Fragment>
                )}
              </Menu.Dropdown>
            </Menu>
          </Flex>
        </AppShell.Header>
        <AppShell.Navbar pt='sm'>
          <NavLink component={Link} to='/' label='Bands' leftSection={<UsersFourIcon size={16} />} />
          {user !== null &&
            <NavLink component={Link} to='/my-bands' label='Meine Bands' leftSection={<UsersThreeIcon size={16} />} />
          }
        </AppShell.Navbar>
        <AppShell.Main>
          <Routes>
            <Route path='/user/login' element={<Login />} />
            <Route path='/user/register' element={<Register />} />
          </Routes>
        </AppShell.Main>
      </AppShell>
    </MantineProvider>
  );
}

export default App
