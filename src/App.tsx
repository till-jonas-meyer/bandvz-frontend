import React, { useEffect } from 'react'
import './App.css'
import { login, profile } from './api/generated/sdk.gen';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { setUser } from './features/user/userSlice';
import { MantineProvider, createTheme } from '@mantine/core';
import {
  ActionIcon,
  AppShell,
  Burger,
  Flex,
  Menu,
  Space,
  Text,
  NavLink
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
  Link
} from 'react-router-dom';

const theme = createTheme({
  fontFamily: 'Open-Sans, sans-serif',
  primaryColor: 'blue',
})

function App() {

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
      await loginUser();
      const profileResult = await profile();
      if (profileResult.status === 200 && profileResult.data) {
        console.log(profileResult.data);
        dispatch(setUser(profileResult.data));
      }
    };
    getUser();
  }, []);

  return (
    <MantineProvider theme={theme}>
      <BrowserRouter>
        <AppShell
          padding='md'
          header={{ height: 60 }}
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
              <Text size='xl'>BandVZ</Text>
              <Space flex='1' />
              <Menu shadow='md' width={200}>
                <Menu.Target>
                  {user !== null ? (
                    <ActionIcon variant='sublte' size='sm'>
                      <UserIcon size={22} />
                    </ActionIcon>
                  ) : (
                    <ActionIcon variant='sublte' size='sm'>
                      <UserPlusIcon size={22} />
                    </ActionIcon>
                  )}
                </Menu.Target>
                <Menu.Dropdown>
                  {user !== null ? (
                    <React.Fragment>
                      <Text m='sm'>{user.email}</Text>
                      <Menu.Item leftSection={<UserIcon size={18} />}>Mein Profil</Menu.Item>
                      <Menu.Divider />
                      <Menu.Item leftSection={<SignOutIcon size={18} />}>Logout</Menu.Item>
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <Menu.Item leftSection={<SignInIcon size={18} />}>Login</Menu.Item>
                      <Menu.Item leftSection={<UserPlusIcon size={18} />}>Registrieren</Menu.Item>
                    </React.Fragment>
                  )}
                </Menu.Dropdown>
              </Menu>
            </Flex>
          </AppShell.Header>
          <AppShell.Navbar>
            <NavLink component={Link} to='/' label='Bands' leftSection={<UsersFourIcon size={16} />} />
            {user !== null &&
              <NavLink component={Link} to='/my-bands' label='Meine Bands' leftSection={<UsersThreeIcon size={16} />} />
            }
          </AppShell.Navbar>
          <AppShell.Main>
            Main content
          </AppShell.Main>
        </AppShell>
      </BrowserRouter>
    </MantineProvider>
  );
}

export default App
