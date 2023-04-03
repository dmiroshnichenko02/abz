
// Style file
import "./abzWelcome.scss";
// Component render
const AbzWelcome = () => {
    return (
        <div className="welcome">
            <div className="container">
                <h1 className="welcome__title">Test assignment for front-end developer</h1>
                <p className="welcome__description">What defines a good front-end developer is one that has skilled knowledge of HTML, CSS, JS with a vast understanding of User design thinking as they'll be building web interfaces with accessibility in mind. They should also be excited to learn, as the world of Front-End Development keeps evolving.</p>
                <button className="btn btn__active welcome__btn" onClick={() => {
                            const element = document.getElementById("user-signUp");
                            element.scrollIntoView({ behavior: "smooth" });
                        }}>Sing up</button>
            </div>
        </div>
    )
}

export default AbzWelcome;