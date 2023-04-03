import { useState } from "react";

import AbzHeader from "../AbzHeader/AbzHeader";
import AbzWelcome from "../AbzWelcome/AbzWelcome";
import AbzUserCards from "../AbzUserCards/AbzUserCards";
import AbzForm from "../AbzForm/AbzForm";

const App = () => {

  const [newUser, setNewUser] = useState(null);

  const getNewUser = (newUser) => {
    setNewUser(newUser)
  }

  console.log(newUser)

  return (
    <div>
      <header >
        <AbzHeader />
      </header>
      <main>
        <AbzWelcome />
        <AbzUserCards newUser={newUser}/>
        <AbzForm getNewUser={getNewUser}/>
      </main>
    </div>
  );
}

export default App;
