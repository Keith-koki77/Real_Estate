import { useContext } from "react";
import SearchBar from "../../components/searchBar/SearchBar";
import "./homePage.scss";
import { AuthContext } from "../../context/AuthContext";

function HomePage() {

  const {currentUser} = useContext(AuthContext)
  
  console.log(currentUser)

  return (
    <div className="homePage">
      <div className="textContainer">
        <div className="wrapper">
          <h1 className="title">Personalized to get you your dream home</h1>
          <p>
            Finding the perfect home can be a daunting task, but with our personalized approach, we make it easy and enjoyable. At [Your Company Name], we understand that everyone's dream home is unique, and we're here to help you find yours.
          
            Why Choose Us?

            1. Tailored Home Search
            We take the time to understand your specific needs, preferences, and lifestyle. Whether you're looking for a cozy apartment in the city, a spacious family home in the suburbs, or a peaceful retreat in the countryside, we tailor our search to match your criteria.

            2. Expert Real Estate Guidance
            Our team of experienced real estate professionals is dedicated to providing you with expert guidance every step of the way. From initial consultation to closing the deal, we're here to answer your questions, provide insights, and ensure a smooth and successful home-buying experience.

            3. Extensive Listings
            Explore a comprehensive range of listings that meet all your requirements. We offer access to the latest properties on the market, complete with detailed descriptions, high-quality photos, and virtual tours. Our goal is to give you a clear and comprehensive view of each potential home.

            4. Seamless Process
            We streamline the home-buying process, making it as hassle-free as possible. Our advanced search tools, personalized recommendations, and seamless communication ensure that you stay informed and confident throughout your journey.

            5. Unmatched Customer Service
            At [Your Company Name], we pride ourselves on our commitment to customer satisfaction. We go above and beyond to provide a personalized and supportive experience, ensuring that you feel valued and cared for.
          </p>
          <SearchBar />
          <div className="boxes">
            <div className="box">
              <h1>16+</h1>
              <h2>Years of Experience</h2>
            </div>
            <div className="box">
              <h1>200</h1>
              <h2>Award Gained</h2>
            </div>
            <div className="box">
              <h1>2000+</h1>
              <h2>Property Ready</h2>
            </div>
          </div>
        </div>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="" />
      </div>
    </div>
  );
}

export default HomePage;
