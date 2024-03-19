import '../assets/css/pages/Home.css'
import image from '../assets/img/image.png';

const Home = () => {
    return (
        <main>
            <div className="home">
                <img className="image" src={image} alt="Quick Invoice"/>
            </div>
        </main>
    )
}

export default Home