import React from 'react';

interface BrailleCellProps {
  dots: string; // A string representing the braille dots (e.g., "100000" for dot 1)
  onClick?: () => void; // Optional click handler
}

const BrailleCell: React.FC<BrailleCellProps> = ({ dots, onClick }) => {
  const dotArray = dots.split('').map((dot, index) => (
    <div key={index} className={`dot ${dot === '1' ? 'active' : ''}`} />
  ));

  return (
    <div className="braille-cell" onClick={onClick}>
      {dotArray}
    </div>
  );
};

export default BrailleCell;