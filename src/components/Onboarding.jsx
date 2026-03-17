import React, { useState, useEffect } from 'react';
import Joyride, { STATUS } from 'react-joyride';

const Onboarding = ({ run, setRun }) => {
  const [steps] = useState([
    {
      target: 'body',
      content: 'Welcome to Limbra! Let\'s take a quick tour of your new AI-powered wellness assistant.',
      placement: 'center',
      disableBeacon: true,
      title: 'Welcome!'
    },
    {
      target: '.credit-display',
      content: 'Here are your Limbra Credits. Every time you generate a personalized AI routine, it costs 1 credit. New users get 5 free credits to start!',
      placement: 'bottom',
    },
    {
      target: '.preferences-form',
      content: 'Tell the AI what you need! Select your goal, the body parts you want to focus on, and how much time you have.',
      placement: 'top',
    },
    {
      target: '.generate-btn',
      content: 'Click here, and our AI will build a custom routine perfectly tailored to your current needs. Give it a try!',
      placement: 'top',
    },
    {
      target: '.nav-bar',
      content: 'Use this menu to access your saved routines and manage your profile. Enjoy your wellness journey!',
      placement: 'top',
    }
  ]);

  const handleJoyrideCallback = (data) => {
    const { status } = data;
    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRun(false);
      localStorage.setItem('has_seen_onboarding', 'true');
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous={true}
      showProgress={true}
      showSkipButton={true}
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: 'var(--primary-green)',
          textColor: '#334155',
          backgroundColor: '#ffffff',
          zIndex: 10000,
        },
        buttonNext: {
          backgroundColor: 'var(--primary-green)',
        },
        buttonBack: {
          color: '#64748b',
        }
      }}
    />
  );
};

export default Onboarding;
