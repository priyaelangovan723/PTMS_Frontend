import React from 'react';
import '../../../styles/Ongoing Training/Ongoing.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuildingCircleCheck, faClipboardQuestion, faCode, faCodeCommit, faUserGear } from '@fortawesome/free-solid-svg-icons';
import { faGears } from '@fortawesome/free-solid-svg-icons/faGears';
import { faLanguage } from '@fortawesome/free-solid-svg-icons/faLanguage';
import { faPeopleGroup } from '@fortawesome/free-solid-svg-icons/faPeopleGroup';
import { faRocket } from '@fortawesome/free-solid-svg-icons';
import { faCogs } from '@fortawesome/free-solid-svg-icons';
import { faTools } from '@fortawesome/free-solid-svg-icons';
import { faCalculator } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const AdminOngoing = () => {
  const internalCards = [
    {name:"Aptitude", icon: faCalculator},
    {name:"Verbal",icon: faLanguage},
    {name:"Technical",icon: faCode},
    {name:"Mock Interview",icon: faClipboardQuestion},
    {name:"Group Discussion",icon: faPeopleGroup},
    {name:"Company Specific Training",icon:faBuildingCircleCheck}
] // Add data here if needed
const externalCards = [
    { name: 'BYTS', icon: faRocket },
    { name: 'Product-Fit', icon: faCogs },
    { name: 'Service-Fit', icon: faTools },
  ];
  

  return (
    <div className="dashboard-container">
      <div className="section">
        <h2>Internal</h2>
        <div className="card-grid">
          {internalCards.map((item, index) => (
            <Link to = '/admin/aptitude'>
            <div key={index} className="card">
                 
                <FontAwesomeIcon icon={item.icon} className='icon'/>
                
                <h3 className='description'>{item.name}</h3>
                
            </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="section">
        <h2>External</h2>
        <div className="card-grid">
          {externalCards.map((item1, index) => (
            <div key={index} className="card">
                <FontAwesomeIcon icon={item1.icon} className='icon'/>
                <h3 className='description'>{item1.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminOngoing;