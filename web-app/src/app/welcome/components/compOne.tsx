import React from 'react';
import Image from 'next/image';
import LeftBarrier from '@/assets/svg-components/left-barrier';
import Nurse from '@/assets/imgs/nurse.png';
import DominoBody from '@/assets/svg-components/domino-body';
import Arrow from '@/assets/svg-components/arrow';


export default function CompOne() {
  return (
    <div className='relative w-screen h-[700px] flex flex-col justify-center items-center flex-1 max-w-[1600px]'>
      <div className='relative flex flex-row flex-nowrap px-[5%] py-[80px] items-start justify-center flex-1 w-[90%] h-full'>
        <div className='relative flex flex-col items-start justify-end flex-1 w-1/3 h-[700px]'>
          <div className='relative flex flex-row flex-nowrap w-[345px] h-[180px]'>
            <div className='absolute w-full z-0 left-0 bottom-[10px] h-[180px]'>
              <LeftBarrier />
            </div>
            <div className='relative ml-[30px] z-10'>
              <p className='leading-[50px] font-body text-[35px]'>Learn & connect with the best in your field</p>
              <button className='absolute w-[105px] h-[35px] text-[12px] flex justify-center items-center font-light text-eduBlack bg-eduYellow rounded-[5px] right-[15px] bottom-[37px]'>start</button>
            </div>
          </div>
        </div>
        <div className='relative flex flex-col w-1/3 h-[700px] justify-center items-center flex-1'>
          <div className='absolute w-[150%] h-auto z-10 right-[-40px]'>
            <Image 
              src={Nurse}
              alt={'nurse'} 
              width={600}
              height={600}
            />
          </div>
        </div>
        <div className='relative flex flex-col w-1/3 justify-start items-end flex-1 h-[700px]'>
            <div className='absolute w-[300px] top-0 z-0'>
              <DominoBody />
            </div>
            <div className="relative w-[320px] h-[320px] rounded-[15px] shadow-inner z-20">
              <div className='relative w-full h-full flex flex-col justify-between rounded-[15px] py-[50px] px-[35px] after:content-[" "] after:absolute after:w-full after:h-full after:left-0 after:top-0 after:z-10 after: after:rounded-[15px] after:bg-gradient-to-br after:from-white after:to-eduDarkGray after:blur-sm after:inner-shadow after:backdrop-blur-xl after:opacity-95'>
                <div className='flex flex-row w-full justify-between items-center z-20'>
                  <button className='w-[150px] h-[35px] text-[12px] flex justify-center items-center font-light text-eduBlack bg-transparent rounded-[5px] right-[15px] bottom-[37px] z-20 border border-solid border-eduBlack'>join waitlist</button>
                  <Arrow />
                </div>
                <div className='flex flex-col w-full'>
                  <div className="w-[55px] h-[0px] border border-eduBlack z-20"></div>
                  <p className='text-eduDarkBlue text-[24px] z-20 mt-[15px]'>Register for the EduRX beta.</p>
                </div>
              </div>
            </div>
            <div className="relative w-[320px] h-[320px] rounded-[15px] shadow-inner z-20 mt-[50px]">
              <div className='relative w-full h-full flex flex-col justify-between rounded-[15px] py-[50px] px-[35px] after:content-[" "] after:absolute after:w-full after:h-full after:left-0 after:top-0 after:z-10 after: after:rounded-[15px] after:bg-gradient-to-br after:from-white after:to-eduDarkGray after:blur-sm after:inner-shadow after:backdrop-blur-xl after:opacity-95'>
                <div className='flex flex-row w-full justify-between items-center z-20'>
                  <button className='w-[150px] h-[35px] text-[12px] flex justify-center items-center font-light text-eduBlack bg-transparent rounded-[5px] right-[15px] bottom-[37px] z-20 border border-solid border-eduBlack'>learn more</button>
                  <Arrow />
                </div>
                <div className='flex flex-col w-full'>
                  <div className="w-[55px] h-[0px] border border-eduBlack z-20"></div>
                  <p className='text-eduDarkBlue text-[24px] z-20 mt-[15px]'>Learn & connect with the best in your field</p>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};