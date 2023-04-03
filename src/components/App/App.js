import { useState } from "react";

import AbzHeader from "../AbzHeader/AbzHeader";
import AbzWelcome from "../AbzWelcome/AbzWelcome";
import AbzUserCards from "../AbzUserCards/AbzUserCards";
import AbzForm from "../AbzForm/AbzForm";

const App = () => {
  // Component state
  const [newUser, setNewUser] = useState(null);
  // Getting a new user from the form and sending it further to the cards component
  const getNewUser = (newUser) => {
    setNewUser(newUser)
  }

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
