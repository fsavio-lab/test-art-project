import { useEffect, useState } from "react";

export const useCardWidth = () => {
  const [cardWidth, setCardWidth] = useState(() =>
    typeof window !== 'undefined' && window.innerWidth < 768 ? 280 : 400
  );

  useEffect(() => {
    const handleResize = () =>
      setCardWidth(window.innerWidth < 768 ? 280 : 400);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return cardWidth;
};

// export const useCardHeight = () => {
//   const [cardWidth, setCardWidth] = useState(() =>
//     typeof window !== 'undefined' && window.innerWidth < 768 ? 192 : 192
//   );

//   useEffect(() => {
//     const handleResize = () =>
//       setCardWidth(window.innerWidth < 768 ? 192 : 192);
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   return cardWidth;
// };