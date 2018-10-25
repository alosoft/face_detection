import React from 'react';

const Rank = (props) => {
  console.log('from rank component', props);
  return (
      <div>
        <div className='white f3'>
          {`${props.user.name}, your current entry count is......... `}
        </div>
        <div className='white f2'>
          {`#${props.user.entries}`}
        </div>
      </div>
  )
};

export default Rank;