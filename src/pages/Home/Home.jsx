import React from 'react';
import Hero from '../../components/Hero/Hero';
import LatestTuitions from '../../components/LatestTuitions/LatestTuitions';
import LatestTutors from '../../components/LatestTutors/LatestTutors';
import HowItWorks from '../../components/HowItWorks/HowItWorks';
import Features from '../../components/Why Choose Us/Features';

const Home = () => {
    return (
        <div>
            <Hero></Hero>
        
            <LatestTuitions>
            </LatestTuitions>
            <LatestTutors></LatestTutors>
            <HowItWorks></HowItWorks>
            <Features></Features>
        </div>
    );
};

export default Home;