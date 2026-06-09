import React from 'react';
import Hero from '../../components/Hero/Hero';
import LatestTuitions from '../../components/LatestTuitions/LatestTuitions';
import LatestTutors from '../../components/LatestTutors/LatestTutors';
import HowItWorks from '../../components/HowItWorks/HowItWorks';
import Features from '../../components/Why Choose Us/Features';
import StatsCounter from '../../components/StatsCounter/StatsCounter';
import FAQSection from '../../components/FAQSection/FAQSection';
import CategoriesGrid from '../../components/CategoriesGrid/CategoriesGrid';

const Home = () => {
    return (
        <div>
            <Hero></Hero>
            <StatsCounter></StatsCounter>
            <CategoriesGrid></CategoriesGrid>
            <LatestTuitions>
            </LatestTuitions>
            <LatestTutors></LatestTutors>
            <HowItWorks></HowItWorks>
            <Features></Features>
            <FAQSection></FAQSection>
        </div>
    );
};

export default Home;