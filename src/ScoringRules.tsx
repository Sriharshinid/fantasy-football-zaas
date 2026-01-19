import { useState, useRef, useEffect } from 'react';

const ScoringRules = () => {
  const [open, setOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState('0px');

  useEffect(() => {
    if (contentRef.current) {
      setHeight(open ? `${contentRef.current.scrollHeight}px` : '0px');
    }
  }, [open]);

  return (
    <div style={{ marginTop: '20px', width: '100%%' }}>
      <button
        onClick={() => setOpen(!open)}
        id='scoring-button'
        style={{
          background: 'none',
          border: '0px solid #333',
          borderRadius: '0px',
          padding: '10px 15px',
          fontSize: '1rem',
          fontWeight: 100,
          cursor: 'pointer',
          width: '100%',
          textAlign: 'left',
          transition: 'background 0.2s',
        }}
      >
        Scoring Rules {open ? '▲' : '▼'}
      </button>

      <div
        ref={contentRef}
        className="ag-theme-alpine"
        style={{
          height: height,
          overflow: 'hidden',
          transition: 'height 0.3s ease',
          marginTop: '10px',
          color: 'rgba(0,0,0,0.7)',
          fontSize: '0.9rem',
          lineHeight: 1,
          textAlign: 'left',
        }}
      >
        <p style={{ margin: '4px 0' }}>🏈 6 points for Rushing/Receiving TDs</p>
        <p style={{ margin: '4px 0' }}>🏈 4 points for QB Passing TD</p>
        <p style={{ margin: '4px 0' }}>🏈 1 point for every 25 yards receiving or rushing (not combined)</p>
        <p style={{ margin: '4px 0' }}>🏈 5 point bonus at 100 yards and again at 200 for rushing and receiving yards (any offensive player)</p>
        <p style={{ margin: '4px 0' }}>🏈 1 point for every 50 yards passing for QB</p>
        <p style={{ margin: '4px 0' }}>🏈 3 bonus points at 300 yards and again at 400 for QB</p>
        <p style={{ margin: '4px 0' }}>🏈 -1 for INT/fumble</p>
        <p style={{ margin: '4px 0' }}>🏈 Defense/Special Teams: Defense 1 pt per sack, 2 pts for INT, fumble recovery, or blocked punt/kick, 5 pts for safety, 6 pts for TD</p>
        <p style={{ margin: '4px 0' }}>🏈 Kicker scoring: 1 pt for extra point (-1 for miss), 3 pts FG (-3 for miss), 1 bonus point for every FG &gt;50 yards</p>
      </div>
    </div>
  );
};

export default ScoringRules;
