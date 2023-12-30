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
        <div className="flex flex-row flex-nowrap w-full p-4 rounded-[10px] bg-eduLightGray mt-4">
            <div className="flex flex-col flex-1 w-[80%] justify-start items-start">
                <div className="flex flex-row flex-nowrap">
                    <span className="text-eduDarkBlue text-[12px]">Published by {resource.publisher}</span>
                    <span className="mx-[10px] text-eduDarkBlue text-[12px]"> | </span> 
                    <span className="text-eduDarkBlue text-[12px]">
                        {
                            isResource ? 'Resource Article' : 'News'
                        }
                    </span>
                </div>
                <div className="mt-2">
                    <h2 className="text-[22px] font-headers">{resource.title}</h2>
                </div>
                <div className="flex flex-row flex-nowrap gap-2 mt-2">
                    {resource?.tags?.map((tag) => (
                        <div className="py-[8px] px-[15px] bg-transparent border text-eduDarkBlue border-eduDarkBlue rounded-[5px] flex justify-center items-center">
                            <span
                            key={tag._id}
                            className="text-[8px] leading-[8px]"
                            >
                                {tag.name}
                            </span>
                        </div>
                    ))
                    }
                </div>
            </div>
            <div className="flex flex-row flex-nowrap flex-1 w-[20%] justify-end items-center mr-5">
                <div>
                    <Button
                    className="w-[150px] rounded-md font-medium text-sm mr-4"
                    label={'Read Now'}
                    onClick={handleResourceClick}
                    />
                </div>
                <div className="cursor-pointer" onClick={saved ? handleUnsaveResource : handleSaveResource}>
                     <FontAwesomeIcon 
                        icon={faBookmark}
                        className={`text-[20px] ${saved ? 'text-eduYellow' : 'text-black'}`}
                     />
                </div>
            </div>
        </div>
    )
};