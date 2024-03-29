import React, {useState, createContext, useEffect} from 'react';
import Footer from './components/Footer';
import Header from './components/Header';
import VotingPlatform from './components/VotingPlatform';
import { db } from './backend/Firebase';
import { getAuth, signInAnonymously } from "firebase/auth";
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

import './App.css'

export const DogsContext = createContext();

function App() {

  const auth = getAuth();

  const [dogList, setDogList] = useState([]);

  //Logs users automatically to prevent multiple votes
  signInAnonymously(auth);
  const [user] = useAuthState(auth);

  //if user doesn't exists (is new), add user and set vote numbers
  useEffect(() => {
    if(user){
      const docRef = doc(db, "users", user.uid);
      const docCheck = async () => {
        const docSnap = await getDoc(docRef);
        if(!docSnap.exists()){
          setDoc(docRef, {
            votes: 0
          }).then(() => window.location.reload(false));
        }
      };
      docCheck().catch((err) => console.log(err));
    }
  })

  //initialize dog list
  useEffect(() => {
    if(user){
      const docRef = doc(db, "doglist", "doglist");
      const docCheck = async () => {
        const docSnap = await getDoc(docRef);
        if(docSnap.exists()){
          setDogList(docSnap.data().dogs);
        }
        else{
          console.log("error");
        }

        const unsubscribe = onSnapshot(docRef, (doc) => {
          setDogList(doc.data().dogs);
        })

        return unsubscribe;
      };
      docCheck().catch((err) => console.log(err));
    }
  }, [user]);

  if(!user){
    return;
  }

  return (
    <DogsContext.Provider value={dogList}>
      <div className="App">
        <Header />
        <VotingPlatform user={user}/>
        <Footer />
      </div>
    </DogsContext.Provider>
  );
}

export default App;
