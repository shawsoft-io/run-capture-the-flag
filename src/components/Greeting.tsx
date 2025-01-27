import React from "react";

const Greeting = ({ name  } : {name : string}) => {
  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) {
      return "Good morning";
    } else if (hour < 18) {
      return "Good afternoon";
    } else {
      return "Good evening";
    }
  };

  return (
    <h1 className="text-4xl font-bold pb-10">
      {getGreeting()}, {name}!
    </h1>
  );
};

export default Greeting;