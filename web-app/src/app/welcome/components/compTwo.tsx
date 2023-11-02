import React, { useRef, useEffect } from 'react';
import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import Arrow from '@/assets/svg-components/arrow';
import Image from 'next/image';
import HubElement from '@/assets/imgs/hub-elements.png';
import ResearchElement from '@/assets/imgs/researchElements.png';
import ForumElement from '@/assets/imgs/forumElement.png';
import ResearchElementMobile from '@/assets/imgs/researchElementMobile.png';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface Props {
  signUpModal: UseModalType
}

export default function CompTwo({signUpModal}:Props) {

  gsap.registerPlugin(ScrollTrigger);

  const tlTrig = useRef(null);
  const introTitle = useRef(null);
  const introSubTitle = useRef(null);
  const introText = useRef(null);
  const introBtn = useRef(null);
  const ilTrigOne = useRef(null);
  const ilTrigTwo = useRef(null);
  const ilTrigThree = useRef(null);
  const imgOne = useRef(null);
  const imgTwo = useRef(null);
  const imgThree = useRef(null);
  // const imgFour = useRef(null);
  // const imgFive = useRef(null);


  useEffect(() => {
    const jt = gsap.timeline({
      scrollTrigger: {
        trigger: tlTrig.current,
        start: 'top +=100px',
        end: '+=400px',
        scrub: true,
        // markers: true
      }
    });
    jt.to(introTitle.current, {y: '-=50px', duration: 0.5, ease: 'power1.inOut'}, 0)
      .to(introTitle.current, {opacity: 0, duration: 0.5, ease: 'power1.inOut'}, 0)
      .to(introSubTitle.current, {y: '-=50px', duration: 0.5, ease: 'power1.inOut'}, 0)
      .to(introSubTitle.current, {opacity: 0, duration: 0.5, ease: 'power1.inOut'}, 0)
      .to(introText.current, {y: '-=50px', duration: 0.5, ease: 'power1.inOut'}, 0)
      .to(introText.current, {opacity: 0, duration: 0.5, ease: 'power1.inOut'}, 0)
      .to(introBtn.current, {y: '-=50px', duration: 0.5, ease: 'power1.inOut'}, 0)
      .to(introBtn.current, {opacity: 0, duration: 0.5, ease: 'power1.inOut'}, 0)
  }, [])

  useEffect(() => {
    const ttl = gsap.timeline({
      scrollTrigger: {
        trigger: tlTrig.current,
        start: 'top +=100px',
        end: '+=400px',
        scrub: true,
        // markers: true
      }
    });
    ttl.to(introTitle.current, {y: '-=50px', duration: 0.5, ease: 'power1.inOut'}, 0)
      .to(introTitle.current, {opacity: 0, duration: 0.5, ease: 'power1.inOut'}, 0)
      .to(introSubTitle.current, {y: '-=50px', duration: 0.5, ease: 'power1.inOut'}, 0)
      .to(introSubTitle.current, {opacity: 0, duration: 0.5, ease: 'power1.inOut'}, 0)
      .to(introText.current, {y: '-=50px', duration: 0.5, ease: 'power1.inOut'}, 0)
      .to(introText.current, {opacity: 0, duration: 0.5, ease: 'power1.inOut'}, 0)
      .to(introBtn.current, {y: '-=50px', duration: 0.5, ease: 'power1.inOut'}, 0)
      .to(introBtn.current, {opacity: 0, duration: 0.5, ease: 'power1.inOut'}, 0)
  }, [])

  useEffect(() => {
    const il = gsap.timeline({
      scrollTrigger: {
        trigger: ilTrigOne.current,
        start: 'center center',
        end: '+=300px',
        scrub: true,
        // markers: true
      }
    });
    il.to(imgOne.current, {y: '-=50px', duration: 0.5, ease: 'power1.inOut'}, 0)
      .to(imgOne.current, {opacity: 0, duration: 0.5, ease: 'power1.inOut'}, 0)
  }, [])

  useEffect(() => {
    const ml = gsap.timeline({
      scrollTrigger: {
        trigger: ilTrigTwo.current,
        start: 'center center',
        end: '+=300px',
        scrub: true,
        // markers: true
      }
    });
    ml.to(imgTwo.current, {y: '-=50px', duration: 0.5, ease: 'power1.inOut'}, 0)
      .to(imgTwo.current, {opacity: 0, duration: 0.5, ease: 'power1.inOut'}, 0)
  }, [])

  useEffect(() => {
    const nl = gsap.timeline({
      scrollTrigger: {
        trigger: ilTrigThree.current,
        start: 'center center',
        end: '+=300px',
        scrub: true,
        // markers: true
      }
    });
    nl.to(imgThree.current, {y: '-=50px', duration: 0.5, ease: 'power1.inOut'}, 0)
      .to(imgThree.current, {opacity: 0, duration: 0.5, ease: 'power1.inOut'}, 0)
  }, [])


  return (
    <div className='relative w-screen h-full flex flex-col justify-center items-center' ref={tlTrig}>
    <div className='w-full text-center flex flex-col justify-center items-center'>
      <div ref={introTitle}>
        <h2 className='text-[50px] font-headers small:text-[40px] xx-small:text-[34px]'>What We've Built</h2>
      </div>
      <div ref={introSubTitle}>
        <h4 className='font-body font-semibold mt-[10px] text-[24px] small:text-[20px]'>BETA LAUNCHING Q4 2023</h4>
      </div>
      <div className='relative w-full flex justify-center items-center'>
        <div className='relative w-[60%] mt-[20px] max-w-[1000px] small:max-w-[95%] small:w-[90%] after:content-[" "] after:absolute after:w-full after:h-full after:left-0 after:top-0 after:z-10 after: after:rounded-[15px] after:bg-eduLightGray after:blur-sm after:inner-shadow after:backdrop-blur-xl after:opacity-95'>
          <div ref={introText} className='relative z-30'>
            <p className='relative z-30 font-body font-light text-eduBlack/60 p-[10px]'>EduRx aims to be the leading platform for medical professionals to streamline their continued education and engage in curated professional discussions. With tailored medical research feeds and rigorous content moderation, we're redefining the way modern medical professionals learn and connect.</p>
          </div>

        </div>
      </div>
      <div className='relative z-30 flex flex-row w-full justify-center items-center mt-[50px]' ref={introBtn}>
          <button  onClick={signUpModal?.openModal} className='relative z-30 w-[150px] text-[20px] py-[10px] flex justify-center items-center font-body font-light text-white bg-eduLightBlue rounded-[5px] ipad:text-[16px] iphone:text-[14px]'>join beta</button>
      </div>
    </div>
    <div className='w-full px-[50px] py-[80px] flex flex-col tl:px-0'>
      {/* EduRx Hub  */}
      <VerticalTimeline
        lineColor={'#13222a'}
        animate={false}
        className={'before:!w-[0px] before:!border-dashed before:!border-2 before:!bg-eduLightGray before:!border-eduBlack'}
      >
        <VerticalTimelineElement
          className={'!padding-0'}
          iconStyle={{display: 'none'}}
        >
          <div className={'relative w-full flex flex-col justify-start items-start tl:mt-[700px] ipad:mt-[550px] ipad-under:mt-[450px] small:mt-[350px] iphone:mt-[250px]'}>
            <div className='relative w-full flex flex-row flex-nowrap justify-start items-center tl:text-center tl:justify-center'>
              <div className='relative after:content-[" "] after:absolute after:w-full after:h-full after:left-0 after:top-0 after:z-10 after: after:rounded-[15px] after:bg-eduLightGray after:blur-sm after:inner-shadow after:backdrop-blur-xl after:opacity-95'>
                <h2 className='relative z-30 font-headers !text-[50px] small:!text-[40px] iphone:!text-[35px] p-[10px]'>EduRx Hub</h2>
              </div>
              <div className='border-dashed border-eduBlack border-2 w-[200px] absolute right-[-13%] tl:right-0 tl:left-[-4%] tl:w-[300px] tablet-lg:w-[200px] ipad-under:w-[100px] ipad-under:left-[-6%] small:left-[-8%] iphone:w-[50px] iphone:left-[-11%]'></div>
            </div>
            <div className='relative flex flex-col'>
              <div className='relative w-full h-full flex flex-col justify-between rounded-[15px] py-[50px] px-[35px] after:content-[" "] after:absolute after:w-full after:h-full after:left-0 after:top-0 after:z-10 after: after:rounded-[15px] after:bg-gradient-to-br after:from-white after:to-eduDarkGray after:blur-sm after:inner-shadow after:backdrop-blur-xl after:opacity-95 iphone:px-[15px] iphone:py-[20px] iphone:mt-[25px]'>
                <p className='z-20 !font-body !font-normal !text-[16px] !leading-[30px] !mb-[20px] tl:!text-[20px] iphone:!text-[16px]'>A centralized platform that makes it easy to find, complete, track and verify CEs. This closed space encourages meaningful collaboration in a way that hasn&apos;t been done in the medical field. Rooted in data and scientific evidence, this interprofessional communication sparks scientific discussions, reviews on products and programs, and endless resources.</p>
                <div className='flex flex-row w-full justify-start items-center z-20'>
                  {/* launch modal onclick */}
                  <button onClick={signUpModal?.openModal} className='flex flex-row flex-nowrap justify-center items-center'>
                    <h4 className='mr-[10px] font-normal font-headers text-[24px]'>Sign Up</h4>
                    <Arrow />
                  </button>
                </div>
              </div>
              <div className='relative flex flex-row flex-nowrap justify-between items-start border border-eduBlack mt-[50px] rounded-[10px] py-[15px] px-[25px] font-body z-30 after:content-[" "] after:absolute after:w-full after:h-full after:left-0 after:top-0 after:z-10 after: after:rounded-[15px] after:bg-eduLightGray after:blur-sm after:inner-shadow after:backdrop-blur-xl after:opacity-95'>
                <div className='relative z-30 w-1/2 ml-[20px]'>
                  <ul className='relative z-30 list-disc font-body leading-[30px] small:leading-[20px] small:text-[12px]'>
                    <li className='font-body'>Profile Notifications</li>
                    <li className='font-body'>Post Notifications</li>
                    <li className='font-body'>Search Your Network</li>
                    <li className='font-body'>Upcoming Courses</li>
                  </ul>
                </div>
                <div className='relative z-30 w-1/2 ml-[20px]'>
                  <ul className='relative z-30 list-disc leading-[30px] small:leading-[20px] small:text-[12px]'>
                    <li className='font-body'>Event Calendar</li>
                    <li className='font-body'>Continuing Education and Course Progress</li>
                    <li className='font-body'>Chat Bot to Navcess</li>
                    <li className='font-body'>News / Resources</li>
                  </ul>
                </div>
              </div>

            </div>
            <div className='absolute w-[700px] h-auto left-[120%] top-[15%] tl:top-[-120%] tl:left-[27%] tl:w-[800px] tl:h-[610px] tablet-lg:left-[20%] ipad:w-[700px] ipad:h-[550px] ipad:left-[5%] ipad:top-[-90%] ipad-under:top-[-70%] ipad-under:w-[600px] ipad-under:h-[450px] ipad-under:left-[13%] small:w-[400px] small:h-[300px] small:top-[-52%] small:left-[16%] iphone:w-[340px] iphone:h-[260px] iphone:top-[-40%] iphone:left-[3%] iphone-sm:top-[-35%]' ref={ilTrigOne}>
              <div ref={imgOne}>
                <Image 
                  src={HubElement}
                  alt={'hub-screen'} 
                  width={1000}
                  height={1000}
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
          <div className='relative w-full flex flex-col justify-start items-start tl:mt-[700px] ipad:mt-[550px] ipad-under:mt-[450px] small:mt-[350px] iphone:mt-[250px]'>
            <div className='relative w-full flex flex-row flex-nowrap justify-end items-center tl:text-center tl:justify-center'>
              <div className='border-dashed border-eduBlack border-2 w-[100px] absolute left-[-13%] tl:right-0 tl:left-[-4%] tl:w-[300px] ipad-under:w-[50px] ipad-under:left-[-6%] iphone:left-[-11%] tablet-lg:w-[130px] small:w-[30px] small:left-[-8%] x-large:w-[60px]'></div>
              <h2 className='font-headers !text-[40px] ipad-under:!text-[35px] small:!text-[30px] iphone:!text-[26px] large:!text-[35px] xx-small:!text-[24px]'>Research + News Feed</h2>
            </div>
            <div className='relative flex flex-col'>
              <div className='relative w-full h-full flex flex-col justify-between rounded-[15px] py-[50px] px-[35px] after:content-[" "] after:absolute after:w-full after:h-full after:left-0 after:top-0 after:z-10 after: after:rounded-[15px] after:bg-gradient-to-br after:from-white after:to-eduDarkGray after:blur-sm after:inner-shadow after:backdrop-blur-xl after:opacity-95 iphone:px-[15px] iphone:py-[20px] iphone:mt-[25px]'>
                <p className='z-20 font-body !font-normal !text-[16px] !leading-[30px] !mb-[20px] tl:!text-[20px] iphone:!text-[16px]'>Scientifically Based Healthcare Informatics:<br /> EduRx will provide medical professionals with access to up-to-date and evidence-based information related to their field, helping them make informed decisions in their practice.</p>
                <div className='flex flex-row w-full justify-start items-center z-20'>
                  {/* launch modal onclick */}
                  <button  onClick={signUpModal?.openModal} className='flex flex-row flex-nowrap justify-center items-center'>
                    <h4 className='mr-[10px] font-normal font-headers text-[24px]'>Join Beta</h4>
                    <Arrow />
                  </button>
                </div>
              </div>
              <div className='relative flex flex-row flex-nowrap justify-between items-start border border-eduBlack mt-[50px] rounded-[10px] py-[15px] px-[25px] font-body z-30 after:content-[" "] after:absolute after:w-full after:h-full after:left-0 after:top-0 after:z-10 after: after:rounded-[15px] after:bg-eduLightGray after:blur-sm after:inner-shadow after:backdrop-blur-xl after:opacity-95'>
                <div className='relative z-30 w-1/2 ml-[20px]'>
                  <ul className='relative z-30 list-disc font-body leading-[30px] small:leading-[20px] small:text-[12px]'>
                    <li className='font-body'>Profile Notifications</li>
                    <li className='font-body'>Post Notifications</li>
                    <li className='font-body'>Search Your Network</li>
                    <li className='font-body'>Upcoming Courses</li>
                  </ul>
                </div>
                <div className='relative z-30 w-1/2 ml-[20px]'>
                  <ul className='relative z-30 list-disc leading-[30px] small:leading-[20px] small:text-[12px]'>
                    <li className='font-body'>Event Calendar</li>
                    <li className='font-body'>Continuing Education and Course Progress</li>
                    <li className='font-body'>Chat Bot to Navcess</li>
                    <li className='font-body'>News / Resources</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className='absolute w-[700px] h-auto top-[15%] right-[120%] z-30 tl:top-[-120%] tl:left-[27%] tl:w-[800px] tl:h-[610px] tablet-lg:left-[20%] ipad:w-[700px] ipad:h-[550px] ipad:left-[5%] ipad:top-[-90%] ipad-under:top-[-70%] ipad-under:w-[600px] ipad-under:h-[450px] ipad-under:left-[13%] small:w-[400px] small:h-[300px] small:top-[-53%] small:left-[16%] iphone:w-[340px] iphone:h-[260px] iphone:top-[-40%] iphone:left-[3%] iphone-sm:top-[-37%] xx-small:top-[-36%]' ref={ilTrigTwo}>
              <div ref={imgTwo}>
              <Image 
                src={ResearchElement}
                alt={'reaearch-screen'} 
                width={1000}
                height={1000}
                className='block tl:hidden opacity-95'
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
                <p className='z-20 font-body !font-normal !text-[16px] !leading-[30px] !mb-[20px] tl:!text-[20px] iphone:!text-[16px]'>Join or start a forum! Knowledge sharing and networking among medical professionals from different regions and institutions to collaborate on research and science.</p>
                <div className='flex flex-row w-full justify-start items-center z-20'>
                  {/* launch modal onclick */}
                  <button  onClick={signUpModal?.openModal} className='flex flex-row flex-nowrap justify-center items-center'>
                    <h4 className='mr-[10px] font-headers font-normal text-[24px]'>Learn More</h4>
                    <Arrow />
                  </button>
                </div>
              </div>
              <div className='flex flex-row flex-nowrap justify-between items-start border border-eduBlack mt-[50px] rounded-[10px] py-[15px] px-[25px] font-body'>
                <div className='w-1/2 ml-[20px]'>
                  <ul className='list-disc leading-[30px] small:leading-[20px] small:text-[12px]'>
                    <li className='font-body'>Public Forums</li>
                    <li className='font-body'>Private Forums</li>
                    <li className='font-body'>Join or Follow Forums</li>
                    <li className='font-body'>Create a Forum</li>
                  </ul>
                </div>
                <div className='w-1/2 ml-[20px]'>
                  <ul className='list-disc leading-[30px] small:leading-[20px] small:text-[12px]'>
                    <li className='font-body'>Create a Poll</li>
                    <li className='font-body'>See Trending Discussions</li>
                    <li className='font-body'>View Analytics</li>
                    <li className='font-body'>See a Thread of all Forums, Your Posts, or What You Are Follwing</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className='absolute z-30 w-[700px] h-auto left-[120%] top-[15%] tl:top-[-120%] tl:left-[27%] tl:w-[800px] tl:h-[610px] tablet-lg:left-[20%] ipad:w-[650px] ipad:h-[500px] ipad:left-[12%] ipad:top-[-90%] ipad-under:top-[-70%] ipad-under:w-[500px] ipad-under:h-[400px] ipad-under:left-[27%] small:w-[400px] small:h-[300px] small:top-[-53%] small:left-[16%] iphone:w-[305px] iphone:h-[230px] iphone:top-[-42%] iphone:left-[11%] iphone-sm:top-[-40%]' ref={ilTrigThree}>
              <div ref={imgThree}>
              <Image 
                src={ForumElement}
                alt={'forum-screen'} 
                width={700}
                height={700}
                className='opacity-95 z-30'
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