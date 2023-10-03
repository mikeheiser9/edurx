import React from 'react';
import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';

export default function CompTwo() {
  return (
    <div className='relative w-screen h-full flex flex-col justify-center items-center'>
    <div className='w-full text-center'>
      <h2 className='text-[50px] font-headers'>What We've Built</h2>
    </div>
    <div className='w-full px-[50px] py-[80px] flex flex-col'>
      <VerticalTimeline
        lineColor='#13222a'
        animate='true'
        className='before:!w-[0px] before:!border-dashed before:!border-2'

      >
        <VerticalTimelineElement
          className='!padding-0 '
          iconStyle={{display: 'none'}}
        >
          <div>
            <h1>Cunty cunt hole</h1>
          </div>

        </VerticalTimelineElement>
      </VerticalTimeline>
    </div>
  </div>
    
  );
};