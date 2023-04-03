import { useState, useEffect } from 'react';
import AbzServices from '../../services/AbzServices';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './abzUserCards.scss';

import coverPhoto from '../../assets/img/photo-cover.svg'

const AbzUserCards = () => {

    const [cards, setCards] = useState([]);
    const [newCardsLoading, setNewCardsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [userEnd, setUserEnd] = useState(false);

    const { getServerUsers, loading, error, clearError } = AbzServices();

    useEffect(() => {
        getUsers()
        // eslint-disable-next-line
    }, []);

    const getUsers = (page, initial) => {
        initial ? setNewCardsLoading(false) : setNewCardsLoading(true)
        clearError();
        getServerUsers(page)
            .then(onUserLoad)
    }

    const onUserLoad = (newCards) => {
        let ended = false;
        if (newCards.length < 6) {
            ended = true
        }

        setCards(cards => [...cards, ...newCards]);
        setNewCardsLoading(false);
        setPage(page => page + 1);
        setUserEnd(ended)
    }

    function renderUsers(arr) {
        const items = arr.map(item => {
            let img = item.photo;
            if (img === 'https://frontend-test-assignment-api.abz.agency/images/placeholders/placeholder.png') {
                img = coverPhoto
            }
            return (
                <div className="cards__item" key={item.id}>
                    <img src={img} alt={item.position} className="cards__item_icon" />
                    <div className="cards__item_name">{item.name}</div>
                    <div className="cards__item_position">{item.position}</div>
                    <div className="cards__item_mail">{item.email}</div>
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

    const viewUsers = renderUsers(cards)

    const spinner = loading && !newCardsLoading ? <Spinner /> : null
    const errorMessage = error  ? <ErrorMessage /> : null

    return (
        <div className="cards">
            <div className="container">
                <h2 className="cards__title">Working with GET request</h2>
                {errorMessage}
                {spinner}
                {viewUsers}
                <button
                    className="btn cards__btn"
                    disabled={newCardsLoading}
                    style={{ 'display': userEnd ? 'none' : 'block' }}
                    onClick={() => getUsers(page)}
                >Show more</button>
            </div>
        </div>
    )
}

export default AbzUserCards;