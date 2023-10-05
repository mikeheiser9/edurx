import React from 'react';
import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import Arrow from '@/assets/svg-components/arrow';
import Image from 'next/image';
import HubElement from '@/assets/imgs/hub-elements.png';
import ResearchElement from '@/assets/imgs/researchElements.png';
import ForumElement from '@/assets/imgs/forumElement.png';
import ResearchElementMobile from '@/assets/imgs/researchElementMobile.png'

export default function CompTwo() {
  return (
    <div className='relative w-screen h-full flex flex-col justify-center items-center'>
    <div className='w-full text-center flex flex-col justify-center items-center'>
      <h2 className='text-[50px] font-headers small:text-[40px] xx-small:text-[34px]'>What We've Built</h2>
      <h4 className='font-body font-semibold mt-[10px] text-[24px] small:text-[20px]'>BETA LAUNCHING Q4 2023</h4>
      <p className='font-body font-light text-eduBlack/60 w-[60%] mt-[20px] max-w-[1000px] small:max-w-[95%] small:w-[90%]'>EduRx aims to be the leading platform for medical professionals to streamline their continued education and engage in curated professional discussions. With tailored medical research feeds and rigorous content moderation, we're redefining the way modern medical professionals learn and connect.</p>
    </div>
    <div className='w-full px-[50px] py-[80px] flex flex-col tl:px-0'>
      {/* EduRx Hub  */}
      <VerticalTimeline
        lineColor={'#13222a'}
        animate={true}
        className={'before:!w-[0px] before:!border-dashed before:!border-2 before:!bg-eduLightGray before:!border-eduBlack'}
      >
        <VerticalTimelineElement
          className={'!padding-0'}
          iconStyle={{display: 'none'}}
        >
          <div className={'relative w-full flex flex-col justify-start items-start tl:mt-[700px] ipad:mt-[550px] ipad-under:mt-[450px] small:mt-[350px] iphone:mt-[250px]'}>
            <div className='relative w-full flex flex-row flex-nowrap justify-start items-center tl:text-center tl:justify-center'>
              <h2 className='font-headers !text-[50px] small:!text-[40px] iphone:!text-[35px]'>EduRx Hub</h2>
              <div className='border-dashed border-eduBlack border-2 w-[200px] absolute right-[-13%] tl:right-0 tl:left-[-4%] tl:w-[300px] tablet-lg:w-[200px] ipad-under:w-[100px] ipad-under:left-[-6%] small:left-[-8%] iphone:w-[50px] iphone:left-[-11%]'></div>
            </div>
            <div className='relative flex flex-col'>
              <div className='relative w-full h-full flex flex-col justify-between rounded-[15px] py-[50px] px-[35px] after:content-[" "] after:absolute after:w-full after:h-full after:left-0 after:top-0 after:z-10 after: after:rounded-[15px] after:bg-gradient-to-br after:from-white after:to-eduDarkGray after:blur-sm after:inner-shadow after:backdrop-blur-xl after:opacity-95 iphone:px-[15px] iphone:py-[20px] iphone:mt-[25px]'>
                <p className='z-20 !text-body !font-normal !text-[16px] !leading-[30px] !mb-[20px] tl:!text-[20px] iphone:!text-[16px]'>A centralized platform that makes it easy to find, complete, track and verify CEs. This closed space encourages meaningful collaboration in a way that hasn&amp;t been done in the medical field. Rooted in data and scientific evidence, this interprofessional communication sparks scientific discussions, reviews on products and programs, and endless resources.</p>
                <div className='flex flex-row w-full justify-start items-center z-20'>
                  {/* launch modal onclick */}
                  <button className='flex flex-row flex-nowrap justify-center items-center'>
                    <h4 className='mr-[10px] font-normal text-[24px]'>Sign Up</h4>
                    <Arrow />
                  </button>
                </div>
              </div>
              <div className='flex flex-row flex-nowrap justify-between items-start border border-eduBlack mt-[50px] rounded-[10px] py-[15px] px-[25px] font-body'>
                <div className='w-1/2 ml-[20px]'>
                  <ul className='list-disc leading-[30px] small:leading-[20px] small:text-[12px]'>
                    <li>Profile Notifications</li>
                    <li>Post Notifications</li>
                    <li>Search Your Network</li>
                    <li>Upcoming Courses</li>
                  </ul>
                </div>
                <div className='w-1/2 ml-[20px]'>
                  <ul className='list-disc leading-[30px] small:leading-[20px] small:text-[12px]'>
                    <li>Event Calendar</li>
                    <li>Continuing Education and Course Progress</li>
                    <li>Chat Bot to Navcess</li>
                    <li>News / Resources</li>
                  </ul>
                </div>
              </div>

            </div>
            <div className='absolute w-[700px] h-auto left-[120%] top-[15%] tl:top-[-120%] tl:left-[27%] tl:w-[800px] tl:h-[610px] tablet-lg:left-[20%] ipad:w-[700px] ipad:h-[550px] ipad:left-[5%] ipad:top-[-90%] ipad-under:top-[-70%] ipad-under:w-[600px] ipad-under:h-[450px] ipad-under:left-[13%] small:w-[400px] small:h-[300px] small:top-[-52%] small:left-[16%] iphone:w-[340px] iphone:h-[260px] iphone:top-[-40%] iphone:left-[3%] iphone-sm:top-[-35%]'>
              <Image 
                src={HubElement}
                alt={'hub-screen'} 
                width={1000}
                height={1000}
              />
            </div>
           
          </div>

        </VerticalTimelineElement>

        {/* Research and News  */}
        <VerticalTimelineElement
          className='!padding-0 '
          iconStyle={{display: 'none'}}
        >
          <div className='relative w-full flex flex-col justify-start items-start tl:mt-[700px] ipad:mt-[550px] ipad-under:mt-[450px] small:mt-[350px] iphone:mt-[250px]'>
            <div className='relative w-full flex flex-row flex-nowrap justify-end items-center tl:text-center tl:justify-center'>
              <div className='border-dashed border-eduBlack border-2 w-[100px] absolute left-[-13%] tl:right-0 tl:left-[-4%] tl:w-[300px] ipad-under:w-[50px] ipad-under:left-[-6%] iphone:left-[-11%] tablet-lg:w-[130px] small:w-[30px] small:left-[-8%] x-large:w-[60px]'></div>
              <h2 className='font-headers !text-[40px] ipad-under:!text-[35px] small:!text-[30px] iphone:!text-[26px] large:!text-[35px] xx-small:!text-[24px]'>Research + News Feed</h2>
            </div>
            <div className='relative flex flex-col'>
              <div className='relative w-full h-full flex flex-col justify-between rounded-[15px] py-[50px] px-[35px] after:content-[" "] after:absolute after:w-full after:h-full after:left-0 after:top-0 after:z-10 after: after:rounded-[15px] after:bg-gradient-to-br after:from-white after:to-eduDarkGray after:blur-sm after:inner-shadow after:backdrop-blur-xl after:opacity-95 iphone:px-[15px] iphone:py-[20px] iphone:mt-[25px]'>
                <p className='z-20 text-body !font-normal !text-[16px] !leading-[30px] !mb-[20px] tl:!text-[20px] iphone:!text-[16px]'>Scientifically Based Healthcare Informatics:<br /> EduRx will provide medical professionals with access to up-to-date and evidence-based information related to their field, helping them make informed decisions in their practice.</p>
                <div className='flex flex-row w-full justify-start items-center z-20'>
                  {/* launch modal onclick */}
                  <button className='flex flex-row flex-nowrap justify-center items-center'>
                    <h4 className='mr-[10px] font-normal text-[24px]'>Sign Up</h4>
                    <Arrow />
                  </button>
                </div>
              </div>
              <div className='flex flex-row flex-nowrap justify-between items-start border border-eduBlack mt-[50px] rounded-[10px] py-[15px] px-[25px] font-body'>
                <div className='w-1/2 ml-[20px]'>
                  <ul className='list-disc leading-[30px] font-body small:leading-[20px] small:text-[12px]'>
                    <li>Profile Notifications</li>
                    <li>Post Notifications</li>
                    <li>Search Your Network</li>
                    <li>Upcoming Courses</li>
                  </ul>
                </div>
                <div className='w-1/2 ml-[20px]'>
                  <ul className='list-disc leading-[30px] font-body small:leading-[20px] small:text-[12px]'>
                    <li>Event Calendar</li>
                    <li>Continuing Education and Course Progress</li>
                    <li>Chat Bot to Navcess</li>
                    <li>News / Resources</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className='absolute w-[700px] h-auto top-[15%] right-[120%] tl:top-[-120%] tl:left-[27%] tl:w-[800px] tl:h-[610px] tablet-lg:left-[20%] ipad:w-[700px] ipad:h-[550px] ipad:left-[5%] ipad:top-[-90%] ipad-under:top-[-70%] ipad-under:w-[600px] ipad-under:h-[450px] ipad-under:left-[13%] small:w-[400px] small:h-[300px] small:top-[-53%] small:left-[16%] iphone:w-[340px] iphone:h-[260px] iphone:top-[-40%] iphone:left-[3%] iphone-sm:top-[-37%] xx-small:top-[-36%]'>
              <Image 
                src={ResearchElement}
                alt={'reaearch-screen'} 
                width={1000}
                height={1000}
                className='block tl:hidden'
              />
              <Image 
                src={ResearchElementMobile}
                alt={'reaearch-screen'} 
                width={1000}
                height={1000}
                className='hidden tl:block'
              />
            </div>
           
          </div>

        </VerticalTimelineElement>

        {/* forums */}
        <VerticalTimelineElement
          className='!padding-0 '
          iconStyle={{display: 'none'}}
        >
          <div className='relative w-full flex flex-col justify-start items-start tl:mt-[700px] ipad:mt-[550px] ipad-under:mt-[450px] small:mt-[350px] iphone:mt-[250px]'>
            <div className='relative w-full flex flex-row flex-nowrap justify-start items-center tl:text-center tl:justify-center'>
              <h2 className='font-headers !text-[50px] small:!text-[40px] iphone:!text-[35px]'>Forums</h2>
              <div className='border-dashed border-eduBlack border-2 w-[300px] absolute right-[-13%] medium:w-[200px] tl:right-0 tl:left-[-4%] tl:w-[300px] tablet-lg:w-[200px] ipad-under:w-[100px] ipad-under:left-[-6%] small:left-[-8%] iphone:w-[50px] iphone:left-[-11%]'></div>
            </div>
            <div className='relative flex flex-col'>
              <div className='relative w-full h-full flex flex-col justify-between rounded-[15px] py-[50px] px-[35px] after:content-[" "] after:absolute after:w-full after:h-full after:left-0 after:top-0 after:z-10 after: after:rounded-[15px] after:bg-gradient-to-br after:from-white after:to-eduDarkGray after:blur-sm after:inner-shadow after:backdrop-blur-xl after:opacity-95 iphone:px-[15px] iphone:py-[20px] iphone:mt-[25px]'>
                <p className='z-20 text-body !font-normal !text-[16px] !leading-[30px] !mb-[20px] tl:!text-[20px] iphone:!text-[16px]'>Join or start a forum! Knowledge sharing and networking among medical professionals from different regions and institutions to collaborate on research and science.</p>
                <div className='flex flex-row w-full justify-start items-center z-20'>
                  {/* launch modal onclick */}
                  <button className='flex flex-row flex-nowrap justify-center items-center'>
                    <h4 className='mr-[10px] font-normal text-[24px]'>Sign Up</h4>
                    <Arrow />
                  </button>
                </div>
              </div>
              <div className='flex flex-row flex-nowrap justify-between items-start border border-eduBlack mt-[50px] rounded-[10px] py-[15px] px-[25px] font-body'>
                <div className='w-1/2 ml-[20px]'>
                  <ul className='list-disc leading-[30px] small:leading-[20px] small:text-[12px]'>
                    <li>Public Forums</li>
                    <li>Private Forums</li>
                    <li>Join or Follow Forums</li>
                    <li>Create a Forum</li>
                  </ul>
                </div>
                <div className='w-1/2 ml-[20px]'>
                  <ul className='list-disc leading-[30px] small:leading-[20px] small:text-[12px]'>
                    <li>Create a Poll</li>
                    <li>See Trending Discussions</li>
                    <li>View Analytics</li>
                    <li>See a Thread of all Forums, Your Posts, or What You Are Follwing</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className='absolute w-[700px] h-auto left-[120%] top-[15%] tl:top-[-120%] tl:left-[27%] tl:w-[800px] tl:h-[610px] tablet-lg:left-[20%] ipad:w-[650px] ipad:h-[500px] ipad:left-[12%] ipad:top-[-90%] ipad-under:top-[-70%] ipad-under:w-[500px] ipad-under:h-[400px] ipad-under:left-[27%] small:w-[400px] small:h-[300px] small:top-[-53%] small:left-[16%] iphone:w-[305px] iphone:h-[230px] iphone:top-[-42%] iphone:left-[11%] iphone-sm:top-[-40%]'>
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