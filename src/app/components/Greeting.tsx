import React from "react";

const Greeting = ({ name }: { name: string }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();

    const greetings: Record<"earlyMorning" | "morning" | "afternoon" | "evening" | "lateNight", string[]> = {
      earlyMorning: [
        `Still up, ${name}? You’re a night owl! 🌙`,
        `Early bird catches the worm, ${name}! 🐦`,
        `The world is quiet, and you’re already ahead, ${name}! 🌅`,
        `Hope your morning is peaceful and full of promise, ${name}.`,
        `Good morning, night owl ${name}! 🌙`,
      ],
      morning: [
        `Good morning, ${name}! 🌞 Hope you have an amazing day!`,
        `Rise and shine, ${name}! ☕ Time to seize the day!`,
        `Morning, sunshine! ☀️ How’s your day looking, ${name}?`,
        `Wakey wakey, eggs and bakey, ${name}! 🍳`,
        `Top of the morning to you, ${name}! ☘️`,
      ],
      afternoon: [
        `Hope your afternoon is going great, ${name}! ☀️`,
        `Good afternoon, ${name}! Keep up the amazing work! 💪`,
        `It’s a beautiful afternoon—hope you’re enjoying it, ${name}.`,
        `Happy afternoon, ${name}! Don’t forget to take a little break. 🍵`,
        `Keep crushing it this afternoon, ${name}! 🚀`,
      ],
      evening: [
        `Good evening, ${name}! 🌆 Time to unwind and relax!`,
        `Hope you had an awesome day, ${name}! 🌙`,
        `Winding down, ${name}? Enjoy your evening! 🍷`,
        `The stars are out—wishing you a peaceful night, ${name}. ✨`,
        `Relax and recharge, ${name}—tomorrow is a new day! 🌜`,
      ],
      lateNight: [
        `Burning the midnight oil, ${name}? Don’t forget to rest! 🌙`,
        `Still awake, ${name}? Hope you’re up to something great! 🦉`,
        `The night is young, ${name}! 🌌`,
        `Hope your late-night creativity is flowing, ${name}! 🎨`,
        `Good night, night owl ${name}! 🌜`,
      ],
    };


    let selectedCategory: keyof typeof greetings;

    if (hour < 5) selectedCategory = "earlyMorning";
    else if (hour < 12) selectedCategory = "morning";
    else if (hour < 17) selectedCategory = "afternoon";
    else if (hour < 21) selectedCategory = "evening";
    else selectedCategory = "lateNight";

 
    const randomGreeting =
      greetings[selectedCategory][
        Math.floor(Math.random() * greetings[selectedCategory].length)
      ];

    return randomGreeting;
  };

  return (
    <h1 className="text-6xl font-bold pb-10">
      {getGreeting()}
    </h1>
  );
};

export default Greeting;