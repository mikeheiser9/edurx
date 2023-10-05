import React from 'react';
import Image from 'next/image';
import LeftBarrier from '@/assets/svg-components/left-barrier';
import Nurse from '@/assets/imgs/nurse.png';
import DominoBody from '@/assets/svg-components/domino-body';
import Arrow from '@/assets/svg-components/arrow';

interface Props {
  signUpModal: UseModalType;
}

export default function CompOne({signUpModal}: Props) {
  return (
    <div className='relative w-screen h-[700px] flex flex-col justify-center items-center flex-1 max-w-[1600px] medium:min-h-[1300px] ipad:min-h-[1000px] iphone:min-h-[800px]'>
      <div className='relative flex flex-row flex-nowrap px-[5%] py-[80px] items-start justify-center flex-1 w-[90%] h-full medium:flex-col medium:items-center ipad:pt-0 ipad:px-0 ipad:pb-[80px]'>
        <div className='relative flex flex-col items-start justify-end flex-1 w-1/3 h-[700px] medium:order-2 medium:w-full medium:items-center medium:justify-center medium:mt-[60px]'>
          <div className='relative flex flex-row flex-nowrap w-[345px] h-[180px]'>
            <div className='absolute w-full z-0 left-0 bottom-[10px] h-[180px]'>
              <LeftBarrier />
            </div>
            <div className='relative ml-[30px] z-10'>
              <p className='leading-[50px] font-body text-[35px]'>Learn & connect with the best in your field</p>
              <button onClick={signUpModal.openModal} className='absolute w-[105px] h-[35px] text-[12px] flex justify-center items-center font-body font-light text-eduBlack bg-eduYellow rounded-[5px] right-[15px] bottom-[37px]'>start</button>
            </div>
          </div>
        </div>
        <div className='relative flex flex-col w-1/3 h-[700px] justify-center items-center flex-1 medium:w-full'>
          <div className='absolute w-[150%] h-auto z-10 right-[-40px] medium:order-1 medium:relative medium:w-full medium:flex medium:justify-center medium:items-center medium:mr-[20%] ipad:w-[60%] small:w-[80%] iphone:mr-[35%]'>
            <Image 
              src={Nurse}
              alt={'nurse'}
              width={600}
              height={600}
            />
            <div className='absolute hidden w-[300px] top-0 z-[-1] right-0 medium:flex tablet-lg:w-[250px] ipad:right-[-120px] small:w-[200px] small:right-[-70px] iphone:w-[150px]'>
              <DominoBody />
            </div>
          </div>
        </div>
        <div className='relative flex flex-col w-1/3 justify-start items-end flex-1 h-[700px] medium:order-3 medium:flex-row medium:flex-nowrap medium:w-full medium:justify-center medium:items-center medium:mt-[30px]'>
            <div className='absolute w-[300px] top-0 z-0 medium:hidden'>
              <DominoBody />
            </div>
            <div className="relative w-[320px] h-[320px] rounded-[15px] shadow-inner z-20 ipad-under:w-[180px] ipad-under:h-[130px] iphone:min-w-[180px]">
              <div className='relative w-full h-full flex flex-col justify-between rounded-[15px] py-[50px] px-[35px] after:content-[" "] after:absolute after:w-full after:h-full after:left-0 after:top-0 after:z-10 after: after:rounded-[15px] after:bg-gradient-to-br after:from-white after:to-eduDarkGray after:blur-sm after:inner-shadow after:backdrop-blur-xl after:opacity-95 ipad-under:px-[15px] ipad-under:py-[15px]'>
                <div className='flex flex-row w-full justify-between items-center z-20'>
                  <button onClick={signUpModal.openModal} className='w-[150px] h-[35px] text-[12px] flex justify-center items-center font-light font-body text-white bg-eduLightBlue rounded-[5px] right-[15px] bottom-[37px] z-20 border border-solid border-eduBlack ipad-under:w-[80px] ipad-under:h-[25px] ipad-under:text-[10px]'>join waitlist</button>
                  <Arrow onClick={signUpModal.openModal}/>
                </div>
                <div className='flex flex-col w-full'>
                  <div className="w-[55px] h-[0px] border border-eduBlack z-20"></div>
                  <p className='text-eduDarkBlue font-body text-[24px] z-20 mt-[15px] ipad-under:text-[12px] iphone:text-[13px] iphone:mt-[8px]'>Register for the EduRx beta.</p>
                </div>
              </div>
            </div>
            <div className="relative w-[320px] h-[320px] rounded-[15px] shadow-inner z-20 mt-[50px] medium:mt-0 medium:ml-[50px] ipad-under:w-[180px] ipad-under:h-[130px] iphone:ml-[10px] iphone:min-w-[180px]">
              <div className='relative w-full h-full flex flex-col justify-between rounded-[15px] py-[50px] px-[35px] after:content-[" "] after:absolute after:w-full after:h-full after:left-0 after:top-0 after:z-10 after: after:rounded-[15px] after:bg-gradient-to-br after:from-white after:to-eduDarkGray after:blur-sm after:inner-shadow after:backdrop-blur-xl after:opacity-95 ipad-under:px-[15px] ipad-under:py-[15px]'>
                <div className='flex flex-row w-full justify-between items-center z-20'>
                  <button  onClick={signUpModal?.openModal} className='w-[150px] h-[35px] text-[12px] flex justify-center items-center font-body font-light text-white bg-eduLightBlue rounded-[5px] right-[15px] bottom-[37px] z-20 border border-solid border-eduBlack ipad-under:w-[80px] ipad-under:h-[25px] ipad-under:text-[10px]'>learn more</button>
                  <Arrow />
                </div>
                <div className='flex flex-col w-full'>
                  <div className="w-[55px] h-[0px] border border-eduBlack z-20"></div>
                  <p className='text-eduDarkBlue font-body text-[24px] z-20 mt-[15px] ipad-under:text-[12px] iphone:text-[13px] iphone:mt-[8px]'>View our forum demo & sign up today</p>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};