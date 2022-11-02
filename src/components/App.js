import { useEffect, useState } from "react";
import AppRouter from 'components/Router';
import { authService } from 'fbase';
import { onAuthStateChanged } from 'firebase/auth';

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    onAuthStateChanged(authService, (user) => {
      if (user) {
        setIsLoggedIn(user);
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    })
  },[]);
  console.log(authService.currentUser);
  return (
    <>
      {init ? <AppRouter isLoggedIn={isLoggedIn} />: "initializing ... "}
      <footer>&copy; {new Date().getFullYear()} Review App</footer>
    </>
  );
}

export default App;
