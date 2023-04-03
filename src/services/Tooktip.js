import React, { useState } from 'react';

const Tooltip = ({ content, children }) => {
  const [isTooltipVisible, setTooltipVisible] = useState(false);

  const toggleTooltip = () => {
    setTooltipVisible(!isTooltipVisible);
  };

  const handleMouseLeave = e => {
    if (!e.relatedTarget || !e.currentTarget.contains(e.relatedTarget)) {
      setTooltipVisible(false);
    }
  };

  return (
    <div
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseLeave={handleMouseLeave}
    >
      <span
        style={{ cursor: 'pointer' }}
        onMouseEnter={toggleTooltip}
      >
        {children}
      </span>
      {isTooltipVisible && (
        <div
          style={{
            position: 'absolute',
            bottom: 'auto',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'black',
            color: 'white',
            padding: '0.25rem',
            borderRadius: '0.25rem',
            fontSize: '0.75rem',
            zIndex: 5
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
