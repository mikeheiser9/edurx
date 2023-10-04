import React from 'react';
import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import Arrow from '@/assets/svg-components/arrow';
import Image from 'next/image';
import HubElement from '@/assets/imgs/hub-elements.png';
import ResearchElement from '@/assets/imgs/researchElements.png';
import ForumElement from '@/assets/imgs/forumElement.png';
import CeElement from '@/assets/imgs/ceElement.png';



export default function CompThree() {
  return (
    <div className='relative w-screen h-full flex flex-col justify-center items-center'>
    <div className='w-full text-center flex flex-col justify-center items-center'>
      <h2 className='text-[50px] font-headers'>Coming Soon</h2>
      <h4 className='font-body font-semibold mt-[10px] text-[24px]'>Q1 2024</h4>
      <p className='font-body font-light text-eduBlack/60 w-[60%] mt-[20px] max-w-[1000px]'>EduRx is relentlessly innovating to further streamline your experience as a medical professional. Explore below as we unveil our upcoming features designed for your continued growth and convenience.</p>
    </div>
    <div className='w-full px-[50px] py-[80px] flex flex-col'>
      
    <VerticalTimeline
        lineColor='#13222a'
        animate='true'
        className='before:!w-[0px] before:!border-dashed before:!border-2 before:!bg-eduLightGray before:!border-eduBlack'
      >

        <VerticalTimelineElement
          className='!padding-0 '
          iconStyle={{display: 'none'}}
        >
          <div className='relative w-full flex flex-col justify-start items-start h-[800px]'>
            <div className='relative w-full flex flex-row flex-nowrap justify-start items-center'>
              <h2 className='font-headers !text-[50px]'>CE Tracking</h2>
              <div className='border-dashed border-eduBlack border-2 w-[200px] absolute right-[-13%]'></div>
            </div>
            <div className='relative flex flex-col'>
              <div className='relative w-full h-full flex flex-col justify-between rounded-[15px] py-[50px] px-[35px] after:content-[" "] after:absolute after:w-full after:h-full after:left-0 after:top-0 after:z-10 after: after:rounded-[15px] after:bg-gradient-to-br after:from-white after:to-eduDarkGray after:blur-sm after:inner-shadow after:backdrop-blur-xl after:opacity-95'>
                <p className='z-20 text-body !font-normal !text-[16px] !leading-[30px] !mb-[20px]'>Employers may use the site to verify licenses, recommend courses, and verification of education for employment. Use profile to maintain licensures and continuing education activity.</p>
                <div className='flex flex-row w-full justify-start items-center z-20'>
                  {/* launch modal onclick */}
                  <button className='flex flex-row flex-nowrap justify-center items-center'>
                    <h4 className='mr-[10px] font-normal text-[24px]'>Sign Up</h4>
                    <Arrow />
                  </button>
                </div>
              </div>
              {/* <div className='flex flex-row flex-nowrap justify-between items-start border border-eduBlack mt-[50px] rounded-[10px] py-[15px] px-[25px]'>
                <div className='w-1/2 ml-[20px]'>
                  <ul className='list-disc leading-[30px]'>
                    <li>Profile Notifications</li>
                    <li>Post Notifications</li>
                    <li>Search Your Network</li>
                    <li>Upcoming Courses</li>
                  </ul>
                </div>
                <div className='w-1/2 ml-[20px]'>
                  <ul className='list-disc leading-[30px]'>
                    <li>Event Calendar</li>
                    <li>Continuing Education and Course Progress</li>
                    <li>Chat Bot to Navcess</li>
                    <li>News / Resources</li>
                  </ul>
                </div>
              </div> */}

            </div>
            <div className='absolute w-[700px] h-auto left-[120%] top-[15%]'>
              <Image 
                src={CeElement}
                alt={'ce-screen'} 
                width={700}
                height={700}
              />
            </div>
           
          </div>
        </VerticalTimelineElement>

      {/* CE Tracking */}
      <VerticalTimelineElement
          className='!padding-0 '
          iconStyle={{display: 'none'}}
        >
          <div className='relative w-full flex flex-col justify-start items-start'>
            <div className='relative w-full flex flex-row flex-nowrap justify-end items-center'>
              <div className='border-dashed border-eduBlack border-2 w-[100px] absolute left-[-13%]'></div>
              <h2 className='font-headers !text-[40px]'>EduRx Library</h2>
            </div>
            <div className='relative flex flex-col'>
              <div className='relative w-full h-full flex flex-col justify-between rounded-[15px] py-[50px] px-[35px] after:content-[" "] after:absolute after:w-full after:h-full after:left-0 after:top-0 after:z-10 after: after:rounded-[15px] after:bg-gradient-to-br after:from-white after:to-eduDarkGray after:blur-sm after:inner-shadow after:backdrop-blur-xl after:opacity-95'>
                <p className='z-20 text-body !font-normal !text-[16px] !leading-[30px] !mb-[20px]'>Scientifically Based Healthcare Informatics:<br /> EduRx will provide medical professionals with access to up-to-date and evidence-based information related to their field, helping them make informed decisions in their practice.</p>
                <div className='flex flex-row w-full justify-start items-center z-20'>
                  {/* launch modal onclick */}
                  <button className='flex flex-row flex-nowrap justify-center items-center'>
                    <h4 className='mr-[10px] font-normal text-[24px]'>Sign Up</h4>
                    <Arrow />
                  </button>
                </div>
              </div>
              <div className='flex flex-row flex-nowrap justify-between items-start border border-eduBlack mt-[50px] rounded-[10px] py-[15px] px-[25px]'>
                <div className='w-1/2 ml-[20px]'>
                  <ul className='list-disc leading-[30px]'>
                    <li>Profile Notifications</li>
                    <li>Post Notifications</li>
                    <li>Search Your Network</li>
                    <li>Upcoming Courses</li>
                  </ul>
                </div>
                <div className='w-1/2 ml-[20px]'>
                  <ul className='list-disc leading-[30px]'>
                    <li>Event Calendar</li>
                    <li>Continuing Education and Course Progress</li>
                    <li>Chat Bot to Navcess</li>
                    <li>News / Resources</li>
                  </ul>
                </div>
              </div>

            </div>
            <div className='absolute w-[700px] h-auto top-[15%] right-[120%]'>
              <Image 
                src={ResearchElement}
                alt={'reaearch-screen'} 
                width={700}
                height={700}
              />
            </div>
           
          </div>

        </VerticalTimelineElement>

      </VerticalTimeline>
    </div>
  </div>
    
  );
};