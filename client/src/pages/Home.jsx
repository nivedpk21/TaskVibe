import React, { Suspense } from "react";
import { Link } from "react-router-dom";
import "./home.css";
import { injectSpeedInsights } from "@vercel/speed-insights";

import Navigation from "../layout/Navigation";
import Footer from "../layout/Footer";

injectSpeedInsights();

/*chat gpt scanned and optimised*/
//CODE
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
                Smart Solutions <br />
                for Digital <br /> Success
              </h1>
              <p className="landing-sub-text">
                Boost Your Campaigns, Amplify Your Reach, <br /> and Grow Your Online Presence Instantly!
              </p>
              <p className="landing-start-text">Get Started !</p>
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
              <div className="feature text-center border rounded-3">
                <h3>Promote Content</h3>
                <p className="feature-text">
                  Create and share shortUrl, direct link, microtask to drive targeted traffic
                </p>
              </div>
              <div className="feature text-center border rounded-3">
                <h3>Earn Credit</h3>
                <p className="feature-text">
                  Earn credits by clicking shortUrl, direct link, completing microtask and More...
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
