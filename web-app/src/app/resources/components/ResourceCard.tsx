import {
    resourceLabelType
} from "@/util/constant";
import React, { useState } from "react";
import { Button } from "@/components/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark } from "@fortawesome/free-regular-svg-icons";
import axios from 'axios';


interface Props {
    resource: ResourceInfo;
    userId: UserId;
    isSaved: boolean;
    isResource:boolean
}

export const ResourceCard = (props: Props) => {
    const {
        resource,
        userId,
        isSaved,
        isResource
    } = props;

const [saved, setSaved] = useState(isSaved);


    const handleResourceClick = () => {
        window.open(resource.link, '_blank');
    };

    // Function to handle saving a resource
    const handleSaveResource = async () => {
        try {
            await axios.put(`http://localhost:8001/user/${userId}/saveResource`, { resourceId: resource._id });
            setSaved(true);
        } catch (error) {
            console.error('Error saving resource:', error);
        }

    };

    // Function to handle unsaving a resource
    const handleUnsaveResource = async () => {
        try {
            await axios.delete(`http://localhost:8001/user/${userId}/unsaveResource`, { data: { resourceId: resource._id } });
            setSaved(false);
        } catch (error) {
            console.error('Error unsaving resource:', error);
        }
    };

    return (
        <div className="flex w-full p-4 rounded-[10px] bg-eduLightGray gap-2 tablet-lg:gap-2.5 !cursor-pointer postcard tablet-lg:flex-wrap tablet-lg:flex-col">
            <div className="flex-1 gap-4 tablet-lg:gap-2.5 flex-col flex">
                <div className="flex justify-between ipad-under:items-center gap-2">
                    <div className="flex flex-row flex-wrap">
                        <span className="text-eduDarkBlue text-[12px]">Published by {resource.publisher}</span>
                        <span className="mx-[10px] text-eduDarkBlue text-[12px]"> | </span> 
                        <span className="text-eduDarkBlue text-[12px]">
                            {
                                isResource ? 'Resource Article' : 'News'
                            }
                        </span>
                    </div>
                    <div className="hidden tablet-lg:block">
                    <Button
                    className="w-[150px] rounded-md font-medium text-sm tablet-lg:w-[100px] tablet-lg:text-[11px] !my-0"
                    label={'Read Now'}
                    onClick={handleResourceClick}
                    />
                </div>
                </div>
                <div className="">
                    <h2 className="text-[22px] ipad-under:text-[15px] tablet-lg:text-[20px] ipad-under:leading-normal ipad-under:font-medium text-eduBlack  flex gap-2 items-center">{resource.title}</h2>
                </div>
                <div className="flex flex-row flex-nowrap gap-2">
                    {resource?.tags?.map((tag) => (
                        <div className="">
                            <span
                            key={tag._id}
                            className="text-[8px] py-1.5 px-4 leading-normal ipad-under:py-1 ipad-under:px-2 ipad-under:rounded-sm ipad-under:leading-normal bg-white text-eduDarkBlue rounded-[5px] border border-eduDarkBlue"
                            >
                                {tag.name}
                            </span>
                        </div>
                    ))
                    }
                </div>
            </div>
            <div className="flex flex-row flex-nowrap flex-1 max-w-[210px] tablet-lg:max-w-full justify-end tablet-lg:justify-start items-center gap-4">
                <div className="tablet-lg:hidden">
                    <Button
                    className="w-[150px] rounded-md font-medium text-sm"
                    label={'Read Now'}
                    onClick={handleResourceClick}
                    />
                </div>
                <div className="cursor-pointer px-2 tablet-lg:px-0 tablet-lg:mt-1" onClick={saved ? handleUnsaveResource : handleSaveResource}>
                     <FontAwesomeIcon 
                        icon={faBookmark}
                        className={`text-[20px] tablet-lg:text-[18px] ${saved ? 'text-eduYellow' : 'text-black'}`}
                     />
                </div>
            </div>
        </div>
    )
};