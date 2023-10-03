import React from 'react';
import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import Arrow from '@/assets/svg-components/arrow';
import Image from 'next/image';
import HubElement from '@/assets/imgs/hub-elements.png';
import ResearchElement from '@/assets/imgs/researchElements.png';
import ForumElement from '@/assets/imgs/forumElement.png';

export default function CompTwo() {
  return (
    <div className='relative w-screen h-full flex flex-col justify-center items-center'>
    <div className='w-full text-center flex flex-col justify-center items-center'>
      <h2 className='text-[50px] font-headers'>What We've Built</h2>
      <h4 className='font-body font-semibold mt-[10px] text-[24px]'>BETA LAUNCHING Q4 2023</h4>
      <p className='font-body font-light text-eduBlack/60 w-[60%] mt-[20px] max-w-[1000px]'>EduRx aims to be the leading platform for medical professionals to streamline their continued education and engage in curated professional discussions. With tailored medical research feeds and rigorous content moderation, we're redefining the way modern medical professionals learn and connect.</p>
    </div>
    <div className='w-full px-[50px] py-[80px] flex flex-col'>
      {/* EduRx Hub  */}
      <VerticalTimeline
        lineColor='#13222a'
        animate='true'
        className='before:!w-[0px] before:!border-dashed before:!border-2 before:!bg-eduLightGray before:!border-eduBlack'

      >
        <VerticalTimelineElement
          className='!padding-0 '
          iconStyle={{display: 'none'}}
        >
          <div className='relative w-full flex flex-col justify-start items-start'>
            <div className='relative w-full flex flex-row flex-nowrap justify-start items-center'>
              <h2 className='font-headers !text-[50px]'>EduRx Hub</h2>
              <div className='border-dashed border-eduBlack border-2 w-[200px] absolute right-[-13%]'></div>
            </div>
            <div className='relative flex flex-col'>
              <div className='relative w-full h-full flex flex-col justify-between rounded-[15px] py-[50px] px-[35px] after:content-[" "] after:absolute after:w-full after:h-full after:left-0 after:top-0 after:z-10 after: after:rounded-[15px] after:bg-gradient-to-br after:from-white after:to-eduDarkGray after:blur-sm after:inner-shadow after:backdrop-blur-xl after:opacity-95'>
                <p className='z-20 text-body !font-normal !text-[16px] !leading-[30px] !mb-[20px]'>A centralized platform that makes it easy to find, complete, track and verify CEs. This closed space encourages meaningful collaboration in a way that hasn&amp;t been done in the medical field. Rooted in data and scientific evidence, this interprofessional communication sparks scientific discussions, reviews on products and programs, and endless resources.</p>
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
            <div className='absolute w-[700px] h-auto left-[120%] top-[15%]'>
              <Image 
                src={HubElement}
                alt={'hub-screen'} 
                width={700}
                height={700}
              />
            </div>
           
          </div>

        </VerticalTimelineElement>
      
        {/* Research and News  */}
        <VerticalTimelineElement
          className='!padding-0 '
          iconStyle={{display: 'none'}}
        >
          <div className='relative w-full flex flex-col justify-start items-start'>
            <div className='relative w-full flex flex-row flex-nowrap justify-end items-center'>
              <div className='border-dashed border-eduBlack border-2 w-[100px] absolute left-[-13%]'></div>
              <h2 className='font-headers !text-[40px]'>Research + News Feed</h2>
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

        {/* forums */}
        <VerticalTimelineElement
          className='!padding-0 '
          iconStyle={{display: 'none'}}
        >
          <div className='relative w-full flex flex-col justify-start items-start'>
            <div className='relative w-full flex flex-row flex-nowrap justify-start items-center'>
              <h2 className='font-headers !text-[50px]'>Forums</h2>
              <div className='border-dashed border-eduBlack border-2 w-[300px] absolute right-[-13%]'></div>
            </div>
            <div className='relative flex flex-col'>
              <div className='relative w-full h-full flex flex-col justify-between rounded-[15px] py-[50px] px-[35px] after:content-[" "] after:absolute after:w-full after:h-full after:left-0 after:top-0 after:z-10 after: after:rounded-[15px] after:bg-gradient-to-br after:from-white after:to-eduDarkGray after:blur-sm after:inner-shadow after:backdrop-blur-xl after:opacity-95'>
                <p className='z-20 text-body !font-normal !text-[16px] !leading-[30px] !mb-[20px]'>Join or start a forum! Knowledge sharing and networking among medical professionals from different regions and institutions to collaborate on research and science.</p>
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
                    <li>Public Forums</li>
                    <li>Private Forums</li>
                    <li>Join or Follow Forums</li>
                    <li>Create a Forum</li>
                  </ul>
                </div>
                <div className='w-1/2 ml-[20px]'>
                  <ul className='list-disc leading-[30px]'>
                    <li>Create a Poll</li>
                    <li>See Trending Discussions</li>
                    <li>View Analytics</li>
                    <li>See a Thread of all Forums, Your Posts, or What You Are Follwing</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className='absolute w-[700px] h-auto left-[120%] top-[15%]'>
              <Image 
                src={ForumElement}
                alt={'forum-screen'} 
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