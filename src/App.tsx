import { useEffect } from 'react'
import './App.css'
import { login, profile } from './api/generated/sdk.gen';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { setUser } from './features/user/userSlice';

function App() {

  const dispatch = useAppDispatch();

  const userTest = useAppSelector((state) => {
    console.log(state.user);
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
        console.log(profileResult.data);
        dispatch(setUser(profileResult.data));
      }
    };
    getUser();
  }, []);

  return (
    <pre>{JSON.stringify(userTest)}</pre>
  );
}

export default App
