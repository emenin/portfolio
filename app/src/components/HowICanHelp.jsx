import { useState } from 'react';
import { howICanHelpTabs } from '../content/home';

export function HowICanHelp() {
  const [activeId, setActiveId] = useState(howICanHelpTabs[0].id);
  const active = howICanHelpTabs.find((t) => t.id === activeId) || howICanHelpTabs[0];

  return (
    <section id="how-i-can-help" className="section light">
      <div className="container alignleft" style={{ flexDirection: 'column' }}>
        <div className="textcontainer">
          <h2>How I can help</h2>
        </div>
        <p className="marginbottom_24px">Turn strategy into action</p>
        <div className="tabs">
          <div className="tabsmenu">
            {howICanHelpTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`tablink ${activeId === tab.id ? 'active' : ''}`}
                onClick={() => setActiveId(tab.id)}
              >
                <div>{tab.label}</div>
              </button>
            ))}
          </div>
          <div className="tabcontent">
            {howICanHelpTabs.map((tab) => (
              <div
                key={tab.id}
                className={`tabpane ${activeId === tab.id ? 'active' : ''}`}
                role="tabpanel"
                hidden={activeId !== tab.id}
              >
                <div className="tabtitle">{tab.title}</div>
                <p className="marginbottom_24px">{tab.body}</p>
                <ul role="list">
                  {tab.items.map((item, i) => (
                    <li key={i} className="item_dark">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
