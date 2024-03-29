import React, { useRef, useEffect } from 'react';
import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import Arrow from '@/assets/svg-components/arrow';
import Image from 'next/image';
import ForumElement from '@/assets/imgs/forumElement.png';
import CeElement from '@/assets/imgs/ceElement.png';
import libraryElement from '@/assets/imgs/libraryElement.png';
import libraryElementMobile from '@/assets/imgs/libraryElementMobile.png';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface Props {
  onSignUp: ()=> void;
}

export default function CompThree({onSignUp}:Props) {

  gsap.registerPlugin(ScrollTrigger);

  const tlTrigCs = useRef(null);
  const introTitleCs = useRef(null);
  const introSubTitleCs = useRef(null);
  const introTextCs = useRef(null);
  const introBtnCs = useRef(null);
  const ilTrigOneCs = useRef(null);
  const ilTrigTwoCs = useRef(null);
  const imgOneCs = useRef(null);
  const imgTwoCs = useRef(null);

  useEffect(() => {
    const jtcs = gsap.timeline({
      scrollTrigger: {
        trigger: tlTrigCs.current,
        start: 'top +=100px',
        end: '+=400px',
        scrub: true,
        // markers: true
      }
    });
    jtcs.to(introTitleCs.current, {y: '-=50px', duration: 0.5, ease: 'power1.inOut'}, 0)
      .to(introTitleCs.current, {opacity: 0, duration: 0.5, ease: 'power1.inOut'}, 0)
      .to(introSubTitleCs.current, {y: '-=50px', duration: 0.5, ease: 'power1.inOut'}, 0)
      .to(introSubTitleCs.current, {opacity: 0, duration: 0.5, ease: 'power1.inOut'}, 0)
      .to(introTextCs.current, {y: '-=50px', duration: 0.5, ease: 'power1.inOut'}, 0)
      .to(introTextCs.current, {opacity: 0, duration: 0.5, ease: 'power1.inOut'}, 0)
      .to(introBtnCs.current, {y: '-=50px', duration: 0.5, ease: 'power1.inOut'}, 0)
      .to(introBtnCs.current, {opacity: 0, duration: 0.5, ease: 'power1.inOut'}, 0)
  }, [])

  useEffect(() => {
    const ilcs = gsap.timeline({
      scrollTrigger: {
        trigger: ilTrigOneCs.current,
        start: 'center center',
        end: '+=300px',
        scrub: true,
        // markers: true
      }
    });
    console.log(ilTrigOneCs)
    ilcs.to(imgOneCs.current, {y: '-=50px', duration: 0.5, ease: 'power1.inOut'}, 0)
      .to(imgOneCs.current, {opacity: 0, duration: 0.5, ease: 'power1.inOut'}, 0)
  }, [])

  useEffect(() => {
    const mlcs = gsap.timeline({
      scrollTrigger: {
        trigger: ilTrigTwoCs.current,
        start: 'center center',
        end: '+=250px',
        scrub: true,
        // markers: true
      }
    });
    mlcs.to(imgTwoCs.current, {y: '-=50px', duration: 0.5, ease: 'power1.inOut'}, 0)
      .to(imgTwoCs.current, {opacity: 0, duration: 2, ease: 'power1.inOut'}, 0)
  }, [])

  return (
    <div className='relative w-screen h-full flex flex-col justify-center items-center' ref={tlTrigCs}>
    <div className='w-full text-center flex flex-col justify-center items-center'>
      <div ref={introTitleCs}>
        <h2 className='text-[50px] font-headers small:text-[40px] xx-small:text-[34px]'>Coming Soon</h2>
      </div>
      <div ref={introSubTitleCs}>
        <h4 className='font-body font-semibold mt-[10px] text-[24px] small:text-[20px]'>Q1 2024</h4>
      </div>
      <div className='relative w-[60%] mt-[20px] max-w-[1000px] small:max-w-[95%] small:w-[90%] after:content-[" "] after:absolute after:w-full after:h-full after:left-0 after:top-0 after:z-10 after: after:rounded-[15px] after:bg-eduLightGray after:blur-sm after:inner-shadow after:backdrop-blur-xl after:opacity-95'>
        <div className='relative z-30' ref={introTextCs}>
          <p className='relative z-30 font-body font-light text-eduBlack/60 p-[10px]'>EduRx is relentlessly innovating to further streamline your experience as a medical professional. Explore below as we unveil our upcoming features designed for your continued growth and convenience.</p>
        </div>
      </div>
    </div>
    <div className='w-full px-[50px] py-[80px] flex flex-col tl:px-0'>
      
    <VerticalTimeline
        lineColor={'#13222a'}
        animate={false}
        className={'before:!w-[0px] before:!border-dashed before:!border-2 before:!bg-eduLightGray before:!border-eduBlack'}>

      <VerticalTimelineElement
          className={'!padding-0'}
          iconStyle={{display: 'none'}}
        >
          <div className={'relative w-full flex flex-col justify-start items-start tl:mt-[700px] ipad:mt-[550px] ipad-under:mt-[450px] small:mt-[350px] iphone:mt-[250px]'}>
            <div className='relative w-full flex flex-row flex-nowrap justify-start items-center tl:text-center tl:justify-center'>
              <h2 className='font-headers !text-[50px] small:!text-[40px] iphone:!text-[35px]'>CE Tracking</h2>
              <div className='border-dashed border-eduBlack border-2 w-[200px] absolute right-[-13%] tl:right-0 tl:left-[-4%] tl:w-[300px] tablet-lg:w-[150px] ipad-under:w-[100px] ipad-under:left-[-6%] small:left-[-8%] iphone:w-[50px] iphone:left-[-11%]'></div>
            </div>
            <div className='relative flex flex-col'>
              <div className='relative w-full h-full flex flex-col justify-between rounded-[15px] py-[50px] px-[35px] after:content-[" "] after:absolute after:w-full after:h-full after:left-0 after:top-0 after:z-10 after: after:rounded-[15px] after:bg-gradient-to-br after:from-white after:to-eduDarkGray after:blur-sm after:inner-shadow after:backdrop-blur-xl after:opacity-95 iphone:px-[15px] iphone:py-[20px] iphone:mt-[25px]'>
                <p className='z-20 !font-body !font-normal !text-[16px] !leading-[30px] !mb-[20px] tl:!text-[20px] iphone:!text-[16px]'>Elevate your professional journey with CE Tracking. Now, effortlessly track and manage your yearly CE requirements and progress, ensuring you're always on track with your educational commitments.</p>
                <div className='flex flex-row w-full justify-start items-center z-20'>
                  {/* launch modal onclick */}
                  <button onClick={onSignUp} className='flex flex-row flex-nowrap justify-center items-center'>
                    <h4 className='mr-[10px] font-headers font-normal text-[24px]'>Sign Up</h4>
                    <Arrow />
                  </button>
                </div>
              </div>
              <div className='flex flex-row flex-nowrap justify-between items-start border border-eduBlack mt-[50px] rounded-[10px] py-[15px] px-[25px] font-body'>
                <div className='w-1/2 ml-[20px]'>
                  <ul className='list-disc leading-[30px] small:leading-[20px] small:text-[12px]'>
                    <li className='font-body'>Track CE requirements in real-time</li>
                    <li className='font-body'>Visual progress indicators</li>
                    <li className='font-body'>Set reminders and milestones</li>
                    <li className='font-body'>CE requirement database</li>
                  </ul>
                </div>
                <div className='w-1/2 ml-[20px]'>
                  <ul className='list-disc leading-[30px] small:leading-[20px] small:text-[12px]'>
                    <li className='font-body'>Yearly progress summaries</li>
                    <li className='font-body'>Continuing Education and Course Progress</li>
                    <li className='font-body'>Seamless integration with EduRx</li>
                    <li className='font-body'>Detailed CE analytics</li>
                  </ul>
                </div>
              </div>

            </div>
            <div className='absolute z-30 w-[700px] h-auto left-[120%] top-[15%] tl:top-[-120%] tl:left-[27%] tl:w-[800px] tl:h-[610px] tablet-lg:left-[20%] ipad:w-[700px] ipad:h-[550px] ipad:left-[5%] ipad:top-[-100%] ipad-under:top-[-85%] ipad-under:w-[600px] ipad-under:h-[450px] ipad-under:left-[13%] small:w-[400px] small:h-[300px] small:top-[-52%] small:left-[16%] iphone:w-[340px] iphone:h-[260px] iphone:top-[-44%] iphone:left-[3%] iphone-sm:top-[-43%] over-small:top-[-75%]' ref={ilTrigOneCs}>
              <div ref={imgOneCs}>
                <Image
                  src={CeElement}
                  alt={'ce-screen'}
                  width={1000}
                  height={1000}
                  className='z-30 opacity-95'
                />
              </div>
            </div>
          </div>

        </VerticalTimelineElement>

        {/* Research and News  */}
        <VerticalTimelineElement
          className='!padding-0 '
          iconStyle={{display: 'none'}}
        >
          <div id='endTrigger' className='absolute w-full'></div>
          <div className='relative w-full flex flex-col justify-start items-start tl:mt-[700px] ipad:mt-[550px] ipad-under:mt-[450px] small:mt-[350px] iphone:mt-[250px]'>
            <div className='relative w-full flex flex-row flex-nowrap justify-end items-center tl:text-center tl:justify-center'>
              <div className='border-dashed border-eduBlack border-2 w-[100px] absolute left-[-13%] tl:right-0 tl:left-[-4%] tl:w-[300px] ipad-under:w-[50px] ipad-under:left-[-6%] iphone:left-[-11%] tablet-lg:w-[130px] small:w-[30px] small:left-[-8%] x-large:w-[60px]'></div>
              <h2 className='font-headers !text-[40px] ipad-under:!text-[35px] small:!text-[30px] iphone:!text-[26px] large:!text-[35px] xx-small:!text-[24px]'>EduRx Library</h2>
            </div>
            <div className='relative flex flex-col'>
              <div className='relative w-full h-full flex flex-col justify-between rounded-[15px] py-[50px] px-[35px] after:content-[" "] after:absolute after:w-full after:h-full after:left-0 after:top-0 after:z-10 after: after:rounded-[15px] after:bg-gradient-to-br after:from-white after:to-eduDarkGray after:blur-sm after:inner-shadow after:backdrop-blur-xl after:opacity-95 iphone:px-[15px] iphone:py-[20px] iphone:mt-[25px]'>
                <p className='z-20 font-body !font-normal !text-[16px] !leading-[30px] !mb-[20px] tl:!text-[20px] iphone:!text-[16px]'>The CE Library brings a personalized touch to your educational journey. Experience an automated feed tailored to your licenses, providing you with eligible courses to effortlessly meet all your CE requirements.</p>
                <div className='flex flex-row w-full justify-start items-center z-20'>
                  {/* launch modal onclick */}
                  <button onClick={onSignUp} className='flex flex-row flex-nowrap justify-center items-center'>
                    <h4 className='mr-[10px] font-headers font-normal text-[24px]'>Join Beta</h4>
                    <Arrow />
                  </button>
                </div>
              </div>
              <div className='flex flex-row flex-nowrap justify-between items-start border border-eduBlack mt-[50px] rounded-[10px] py-[15px] px-[25px] font-body'>
                <div className='w-1/2 ml-[20px]'>
                  <ul className='list-disc leading-[30px] font-body small:leading-[20px] small:text-[12px]'>
                    <li className='font-body'>Personalized course feed</li>
                    <li className='font-body'>Comprehensive course database</li>
                    <li className='font-body'>Eligibility-based course recommendations</li>
                    <li className='font-body'>One-click enrollment</li>
                  </ul>
                </div>
                <div className='w-1/2 ml-[20px]'>
                  <ul className='list-disc leading-[30px] font-body small:leading-[20px] small:text-[12px]'>
                    <li className='font-body'>CE requirement matching</li>
                    <li className='font-body'>Integrated purchase options</li>
                    <li className='font-body'>Course progress tracking</li>
                    <li className='font-body'>Quick-view course summaries</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className='absolute w-[700px] h-auto top-[15%] right-[120%] tl:top-[-120%] tl:left-[27%] tl:w-[800px] tl:h-[610px] tablet-lg:left-[20%] ipad:w-[700px] ipad:h-[550px] ipad:left-[5%] ipad:top-[-90%] ipad-under:top-[-73%] ipad-under:w-[600px] ipad-under:h-[450px] ipad-under:left-[13%] small:w-[400px] small:h-[300px] small:top-[-53%] small:left-[16%] iphone:w-[340px] iphone:h-[260px] iphone:top-[-38%] iphone:left-[3%] iphone-sm:top-[-34%] xx-small:top-[-36%] over-small:top-[-68%]' ref={ilTrigTwoCs}>
              <div ref={imgTwoCs}>
                <Image 
                  src={libraryElement}
                  alt={'library-screen'} 
                  width={700}
                  height={700}
                  className='block tl:hidden z-30 opacity-95'
                />
                <Image 
                  src={libraryElementMobile}
                  alt={'reaearch-screen'} 
                  width={1000}
                  height={1000}
                  className='hidden tl:block'
                />
              </div>
            </div>
           
          </div>

        </VerticalTimelineElement>

      </VerticalTimeline>
    </div>
  </div>
    
  );
};