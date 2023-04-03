import { useState, useEffect } from 'react';
import AbzServices from '../../services/AbzServices';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Tooltip from '../../services/Tooktip';
// Style file
import './abzUserCards.scss';
// Empty photo if suddenly there is no photo in the card
import coverPhoto from '../../assets/img/photo-cover.svg'
// Received new user after form submit, null before submit
const AbzUserCards = ({newUser}) => {
    // Creating a Component State
    const [cards, setCards] = useState([]);
    const [newCardsLoading, setNewCardsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [userEnd, setUserEnd] = useState(false);
    const [newUserLoad, setNewuserLoad] = useState(true)

    // Get the functions we need from the service
    const { getServerUsers, loading, error, clearError } = AbzServices();
    // Get users when creating a component
    useEffect(() => {
        getUsers()
        // The dependency involves changing the prop of the component, which means getting a new user and rerendering the component with the new user.
        // eslint-disable-next-line
    }, [newUser]);
    // User teaching function
    const getUsers = (page, initial) => {
        // If a new user is received, we remove the old ones
        if(newUser && newUserLoad) {
            setNewuserLoad(false)
            setCards([])
        }
        // If users are loaded after clicking, the button will be inactive
        initial ? setNewCardsLoading(false) : setNewCardsLoading(true)
        // Cleaning up errors if any
        clearError();
        getServerUsers(page)
        // Passing the received users to their enumeration function
            .then(onUserLoad)
    }

    const onUserLoad = (newCards) => {
        // Mini check to the last page
        let ended = false;
        if (newCards.length < 6) {
            ended = true
        }
        // Keeping old users, add new ones
        setCards(cards => [...cards, ...newCards]);
        setNewCardsLoading(false);
        // Add +1 to pages for next load
        setPage(page => page + 1);
        setUserEnd(ended)
    }
    // Enumerating user cards
    function renderUsers(arr) {
        const items = arr.map(item => {
            // Blank photo check
            let img = item.photo;
            if (img === 'https://frontend-test-assignment-api.abz.agency/images/placeholders/placeholder.png') {
                img = coverPhoto
            }
            return (
                <div className="cards__item" key={item.id}>
                    <img src={img} alt={item.position} className="cards__item_icon" />
                    <div className="cards__item_name"><Tooltip content={item.name}>{item.name.length > 35 ? item.name.slice(0, 35) + '...' : item.name}</Tooltip></div>
                    <div className="cards__item_position"><Tooltip content={item.position}>{item.position.length > 40 ? item.position.slice(0, 40) + '...' : item.position}</Tooltip></div>
                    <div className="cards__item_mail"><Tooltip content={item.email}>{item.email.length > 35 ? item.email.slice(0, 35) + '...' : item.email}</Tooltip></div>
                    <div className="cards__item_number">{item.phone}</div>
                </div>
            )
        })

        return (
            <div className="cards__wrapper">
                {items}
            </div>
        )
    }
    // Get items
    const viewUsers = renderUsers(cards)
    // Loading windows and errors
    const spinner = loading && !newCardsLoading ? <Spinner /> : null
    const errorMessage = error  ? <ErrorMessage /> : null

    return (
        <div className="cards" id="user-cards">
            <div className="container">
                <h2 className="cards__title">Working with GET request</h2>
                {errorMessage}
                {spinner}
                {viewUsers}
                <button
                    className="btn btn__active cards__btn"
                    disabled={newCardsLoading}
                    style={{ 'display': userEnd ? 'none' : 'block' }}
                    onClick={() => getUsers(page)}
                >Show more</button>
            </div>
        </div>
    )
}

export default AbzUserCards;