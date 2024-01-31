import { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";
import angelPhoto from "../assets/angel.jpg"
import tomiPhoto from "../assets/tomi.jpg"
import nicoPhoto from "../assets/nico.jpg"
import ignaPhoto from "../assets/igna.jpg"
import santiPhoto from "../assets/santi.jpg"
import santi2Photo from "../assets/santi2.jpg"


const About = () => {
    // Definir el estado 'results' utilizando useState
    const [results, setResults] = useState([
        { name: "Angel Tena", link: "https://www.linkedin.com/in/angel-tena-4b6a14222/", photo: angelPhoto, position: "Front"},
        { name: "Fernando Nicolás", link: "https://www.linkedin.com/in/fernando-nicol%C3%A1s-balbuena-562748218/", photo: nicoPhoto, position: "Front"},
        { name: "Tomas Ivani", link: "https://www.linkedin.com/in/tomas-ivani-9a0865115/", photo: tomiPhoto, position: "Back" },
        { name: "Ignacio Martinez", link: "https://www.linkedin.com/in/ignaciomartinez1/ ", photo: ignaPhoto, position: "Back"},
        { name: "Santiago Delebecq", link: "https://www.linkedin.com/in/santiago-delebecq-8630a2215/", photo: santiPhoto, position: "Back"},
        { name: "Santiago Alzogaray", link: "https://www.linkedin.com/in/santiago-alzogaray-003825289/", photo: santi2Photo, position: "Back"},
    ]);

    return (
        <div className='grid grid-cols-3 mx-auto gap-20 p-4 items-center mt-10 w-auto'>
            {results.map((result, index) => (
                <div key={index} className='flex flex-col items-center' >
                    <img src={result.photo} alt="image.jpg" className='w-48 h-48 object-cover rounded-2xl' />
                    <h1>{result.name}</h1>
                    <strong>{result.position}</strong>
                    <a href={result.link} target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faLinkedin} className='size-8 text-blue-600'/>
                    </a>
                </div>
            ))}
        </div>
    );
}

export default About;
