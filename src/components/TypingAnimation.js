import React, { useEffect, useState } from "react";
const TypingAnimation = ({ words }) => {
  const [index, setIndex] = useState(0); // Index of the current word
  const [subIndex, setSubIndex] = useState(0); // Index of the current character
  const [reverse, setReverse] = useState(false); // Whether to reverse the animation (backspace)

  useEffect(() => {
    if (subIndex === words[index].length + 1 && !reverse) {
      setReverse(true);
      return;
    }

    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prevIndex) => (prevIndex + 1) % words.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prevSubIndex) => prevSubIndex + (reverse ? -1 : 1));
    }, 200); // Typing speed in milliseconds

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, words]);

  return <>{`${words[index].substring(0, subIndex)}`}</>;
};

export default TypingAnimation;
