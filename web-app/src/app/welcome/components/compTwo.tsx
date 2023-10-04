import React from 'react';
import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';

export default function CompTwo() {
  return (
    <div className='relative w-screen h-full flex flex-col justify-center items-center'>
    <div className='w-full px-[50px] py-[80px] flex flex-col'>
      <VerticalTimeline
        lineColor='#13222a'
      >
        <VerticalTimelineElement>

        </VerticalTimelineElement>
      </VerticalTimeline>
    </div>
  </div>
    
  );
};