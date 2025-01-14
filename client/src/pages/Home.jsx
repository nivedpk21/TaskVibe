import React, { Suspense } from "react";
import { Link } from "react-router-dom";
import "./home.css";
import { injectSpeedInsights } from "@vercel/speed-insights";

import Navigation from "../layout/Navigation";
import Footer from "../layout/Footer";

injectSpeedInsights();

/*chat gpt scanned and optimised*/
/**testing deployment railway */
//client changes

export default function Home() {
  return (
    <>
      <Suspense fallback={<div>...loading</div>}>
        <Navigation />
        {/* FIRST SECTION */}
        <section>
          <div className="landing-section">
            <div className="first-section-div ">
              <h1 className="landing-text">
                Digital Marketing <br /> And Earnings <br />
                Platform
              </h1>
              <p className="landing-sub-text">
                Receive instant traffic for your affiliate links and <br /> earn money by completing micro
                tasks
              </p>
              <div className="landing-btn-div mb-3">
                <Link type="button" className="btn btn-lg btn-primary rounded-5 me-4" to="/signup">
                  Sign up
                </Link>
                <Link type="button" className="btn btn-lg btn-outline-light rounded-5" to="/signin">
                  sign in
                </Link>
              </div>
            </div>
          </div>
        </section>
        {/* SECOND SECTION */}
        <section>
          <div className="second-section">
            <h1 className="text-center">Features</h1>
            <div className="second-section-div  d-flex">
              <div className="features text-center border rounded-3 border-light bg-light">
                <h3>Micro Tasks</h3>
                <p>
                  Love games ? Sounds great! Win big in our <br /> games: Dice, Crash, Limbo, Plinko and
                  <br />
                  Roulette
                </p>
              </div>
              <div className="features text-center border rounded-3 border-light bg-light">
                <h3 className="">Payed To Click</h3>
                <p>
                  Love games ? Sounds great! Win big in our <br /> games: Dice, Crash, Limbo, Plinko and
                  <br />
                  Roulette
                </p>
              </div>
              <div className="features text-center   border rounded-3 border-light bg-light">
                <h3>ShortUrl</h3>
                <p>
                  Love games ? Sounds great! Win big in our <br /> games: Dice, Crash, Limbo, Plinko and
                </p>
              </div>
              <div className="features text-center   border rounded-3 border-light bg-light">
                <h3>Surveys</h3>
                <p>
                  Love games ? Sounds great! Win big in our <br /> games: Dice, Crash, Limbo, Plinko and
                  <br />
                  Roulette
                </p>
              </div>
              <div className="features text-center   border rounded-3 border-light bg-light">
                <h3>Games</h3>
                <p>
                  Love games ? Sounds great! Win big in our <br /> games: Dice, Crash, Limbo, Plinko and
                  <br />
                  Roulette
                </p>
              </div>
              <div className="features text-center  border rounded-3 border-light bg-light">
                <h3>Advertising</h3>
                <p>
                  Love games ? Sounds great! Win big in our <br /> games: Dice, Crash, Limbo, Plinko and
                  <br />
                  Roulette
                </p>
              </div>
            </div>
          </div>
        </section>
        {/**THIRD SECTION */}
        <section>
          <div className="third-section">
            <div className="third-section-div border">
              <div className="get-started text-center">
                <h2 className="m-0">Get Started</h2>
                <p className="">
                  Join TaskVibe now for digital <br /> marketing solutions
                </p>
                <Link type="button" class="btn btn-dark rounded-pill" to="/signup">
                  Create Your Account
                </Link>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </Suspense>
    </>
  );
}
