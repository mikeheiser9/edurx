import {
  getFullName,
  getSemanticViewsCount,
  getStaticImageUrl,
} from "@/util/helpers";
import {
  faComments,
  faEdit,
  faImage,
} from "@fortawesome/free-regular-svg-icons";
import {
  faChartColumn,
  faLocationDot,
  faStethoscope,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import instagram from "../../assets/icons/instagram.svg";
import linkedin from "../../assets/icons/linkedin.svg";
import x from "../../assets/icons/twitter.svg";
import email from "../../assets/icons/email.svg";
import facebook from "../../assets/icons/facebook.svg";
import { npiToDefinition, profileSections } from "@/util/constant";
import moment from "moment";
import { TabMenu } from "@/components/tabMenu";
import { Button } from "@/components/button";
import { LoadMore } from "@/components/loadMore";
import replaceTaggedUsers from "../../components/replaceTags";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

const socialMediaIcons: socials = {
  instagram,
  facebook,
  x,
  linkedin,
  email,
};

interface LastDocRefType {
  licenses: React.RefObject<HTMLDivElement> | null;
  certificates: React.RefObject<HTMLDivElement> | null;
}

const EditIcon = ({ onClick }: { onClick: () => void }) => (
  <FontAwesomeIcon
    icon={faEdit}
    className="text-eduBlack z-10 cursor-pointer absolute right-0 m-4"
    onClick={onClick}
  />
);

const SocialIcon = ({ value, href }: { value: string; href: string }) => (
  <a
    className="bg-eduDarkBlue flex justify-center rounded-full h-7 w-7"
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    title={value}
  >
    <Image
      src={socialMediaIcons[value as keyof socials] as string}
      className="invert"
      alt={value}
    />
  </a>
);

const BasicInfo = ({
  userData,
  openModal,
  buttonJsx,
}: {
  userData: UserData;
  openModal?: () => void;
  buttonJsx?: React.ReactElement;
}): React.ReactElement => (
  <div className="bg-primary-dark overflow-hidden flex-auto relative rounded-lg">
    {openModal && <EditIcon onClick={openModal} />}
    <div className="w-full hover:blur-sm duration-500 h-40 overflow-hidden bg-eduDarkGray items-center justify-center flex">
      {userData?.banner_img ? (
        <Image
          src={getStaticImageUrl(userData?.banner_img)}
          width={2000}
          height={2000}
          alt="banner image"
          className="h-40 w-full object-cover"
        />
      ) : (
        <FontAwesomeIcon icon={faImage} className="text-eduDarkBlue text-4xl" />
      )}
    </div>
    <div className="p-6 px-6 xl:px-16 lg:px-12 md:px-10 sm:px-8 bg-eduLightGray">
      <div className="rounded-lg overflow-hidden flex items-center justify-center hover:blur-sm ease-in-out duration-500 bg-white -mt-[4rem] relative w-24 h-24">
        {userData?.profile_img ? (
          <Image
            src={getStaticImageUrl(userData?.profile_img)}
            width={1000}
            height={1000}
            alt="profile image"
            className="w-24 h-24 object-cover"
          />
        ) : (
          <FontAwesomeIcon
            icon={faImage}
            className="text-eduDarkBlue text-4xl"
          />
        )}
      </div>
      <div className="flex gap-2 mt-4">
        <div className="flex-1">
          <div className="flex gap-2 flex-col">
            <span className="text-eduBlack capitalize font-headers text-[24px]">
              {getFullName(userData?.first_name, userData?.last_name)}
            </span>
            <span className="text-eduBlack/60 text-[16px] font-body">
              {userData?.role === "student" ? (
                "Student "
              ) : (
                <>
                  <FontAwesomeIcon icon={faLocationDot} className="me-2" />
                  {/* {userData?.city}, {userData?.state && userData?.state}•{" "} */}
                  {userData?.state && userData?.state}•{" "}
                  {userData?.npi_designation
                    ?.map((item: string) => {
                      if (item)
                        return npiToDefinition[
                          item as keyof typeof npiToDefinition
                        ];
                    })
                    ?.toString()}{" "}
                </>
              )}
              {/* • Member Since{" "}
              {userData?.joined ? moment(userData?.joined).year() : "-"} */}
            </span>
            <span className="text-eduBlack/60 text-[16px] font-body">
              <FontAwesomeIcon icon={faStethoscope} className="me-2" />
              Licensed in: {userData?.state}
            </span>
            <div className="flex text-eduBlack text-xs gap-x-4 font-body justify-between">
              <div>
                <span className="font-body">
                  <b className="text-eduBlack text-[12px] font-body">
                    {userData?.followingCount}
                  </b>{" "}
                  Following
                </span>
                <span className="font-body">
                  <b className="text-eduBlack text-[12px] font-body">
                    &nbsp;&nbsp; {userData?.followersCount}
                  </b>{" "}
                  Followers
                </span>
              </div>
              {(userData.Collaboration ||
                userData.Mentorship ||
                userData.Research) && (
                <span className="relative right-[71px] text-eduBlack capitalize font-headers text-[18px] font-[600]">
                  Available For :{" "}
                </span>
              )}
            </div>
            <div className="flex">
              <div className="flex gap-2">
                {userData?.socials &&
                  Object.keys(userData?.socials)?.map((item: string) => {
                    if (
                      userData?.socials?.[item as keyof socials]?.length &&
                      socialMediaIcons?.[item as keyof socials]
                    ) {
                      return (
                        <SocialIcon
                          value={item as keyof socials}
                          href={userData?.socials?.[item as keyof socials] || ""}
                          key={item}
                        />
                      );
                    }
                  })}
                {userData?.contact_email && (
                  <SocialIcon
                    value="email"
                    href={`mailto:${userData?.contact_email}`}
                  />
                )}
              </div>
              {(userData.Collaboration ||
                userData.Mentorship ||
                userData.Research) && (
                <div className="relative left-[50%] flex gap-x-3 top-3">
                  {userData.Collaboration && (
                    <span className="bg-eduDarkGray text-eduLightBlue px-2 py-1 text-sm">
                      Collaboration
                    </span>
                  )}
                  {userData.Mentorship && (
                    <span className="bg-eduDarkGray text-eduLightBlue px-2 py-1 text-sm">
                      Mentorship
                    </span>
                  )}
                  {userData.Research && (
                    <span className="bg-eduDarkGray text-eduLightBlue px-2 py-1 text-sm">
                      Research
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        {buttonJsx
          ? buttonJsx
          : openModal && (
              <div className="justify-self-end self-start">
                <button
                  type="button"
                  className="border rounded-[10px] py-2 px-4 font-body text-[16px] w-[125px] text-eduBlack border-eduBlack hover:text-white hover:bg-eduBlack transition-colors ease-in-out duration-300"
                  onClick={openModal}
                >
                  Edit Profile
                </button>
              </div>
            )}
      </div>
    </div>
  </div>
);

const About = ({
  personal_bio,
  openModal,
  emptyBioMessage,
}: {
  personal_bio: string | undefined;
  openModal?: () => void;
  emptyBioMessage?: string;
}) => {
  const [showMore, setShowMore] = useState(false);
  return (
    <div className="p-4 px-6 xl:px-16 lg:px-12 md:px-10 sm:px-8 bg-eduLightGray">
      <div className="flex justify-between items-center">
        <span className="text-eduBlack text-[24px] font-semibold font-headers tracking-wide">
          About
        </span>
        {openModal && <EditIcon onClick={openModal} />}
      </div>
      <div
        className={` overflow-hidden flex-auto relative rounded-lg flex items-center ${
          !showMore ? "h-[150px]" : "h-[300px] overflow-y-auto"
        }`}
      >
        <div className="flex flex-col gap-2">
          <p className="text-eduBlack/60 text-[16px] font-body">
            {personal_bio && personal_bio.length > 0
              ? showMore
                ? personal_bio
                : personal_bio?.trim().substring(0, 470) + "..."
              : ""}
          </p>
        </div>
        {!personal_bio && (
          <p className="text-eduBlack/60 pl-[34%]">{emptyBioMessage}</p>
        )}
      </div>
      {personal_bio && personal_bio.length > 0 && (
        <span
          className="flex justify-center items-center font-[700] opacity-[50%] text-[0.8em] cursor-pointer"
          onClick={() => setShowMore(!showMore)}
        >
          {showMore ? "Read Less" : "Read More"}
        </span>
      )}
    </div>
  );
};

const PostList = ({
  posts,
  noDataMessage,
  profileModal,
  setSelectedPostId,
  showMore,
}: {
  posts: PostInterface[] | undefined;
  noDataMessage: string;
  profileModal?: UseModalType;
  setSelectedPostId: Dispatch<SetStateAction<string>>;
  showMore: boolean;
}): React.ReactElement => {
  let postToBeRendered: PostInterface[] | undefined = [];
  if (!showMore && posts && posts.length > 0) {
    postToBeRendered = posts.slice(0, 2);
  } else {
    postToBeRendered = posts;
  }
  return (
    <>
      {postToBeRendered?.length ? (
        <div className="grid grid-cols-[1fr,22%] gap-3 animate-fade-in-down cursor-pointer">
          {postToBeRendered.map((post) => (
            <>
              <div
                className="w-[100%] flex flex-col"
                key={post?._id}
                onClick={() => {
                  profileModal?.closeModal();
                  setSelectedPostId(post?._id);
                }}
              >
                <div className="flex flex-col gap-1">
                  <span className="text-eduBlack text-[16px] font-[500] font-headers capitalize">
                    {post?.title && post?.title.length < 73
                      ? post?.title
                      : post?.title?.substring(0, 73) + "..."}
                  </span>
                </div>
                <div className="text-[15px] text-eduBlack/60 font-body">
                  {post?.forumType} • Published on{" "}
                  {moment(post?.createdAt).format("DD/MM/YYYY")}
                </div>
              </div>
              <div className="flex text-[15px] text-eduBlack/60  font-body  justify-between">
                <div className="flex gap-4 text-eduLightBlue">
                  <FontAwesomeIcon icon={faComments} />
                  <span>
                    {getSemanticViewsCount(Number(post?.commentCount))}
                  </span>
                </div>
                <div className="flex gap-4 text-eduLightBlue">
                  <FontAwesomeIcon icon={faChartColumn} />
                  <span>{getSemanticViewsCount(Number(post?.views))}</span>
                </div>
              </div>
            </>
          ))}
        </div>
      ) : (
        <span className="text-eduBlack text-eduBlack/60 text-[16px] font-body flex justify-center items-center">
          {noDataMessage}
        </span>
      )}
    </>
  );
};

const CommentList = ({
  comments,
  profileImage,
  noDataMessage,
  setSelectedPostId,
  showMore,
  profileModal,
}: {
  comments: Comment[] | undefined;
  profileImage?: string | undefined;
  noDataMessage: string;
  setSelectedPostId: Dispatch<SetStateAction<string>>;
  showMore: boolean;
  profileModal: UseModalType | undefined;
}): React.ReactElement => {
  let commentsToBeRendered: Comment[] | undefined = [];
  if (!showMore && comments && comments.length > 0) {
    commentsToBeRendered = comments.slice(0, 2);
  } else {
    commentsToBeRendered = comments;
  }
  return (
    <>
      {commentsToBeRendered?.length ? (
        <div className="flex flex-auto flex-col gap-2 animate-fade-in-down cursor-pointer">
          {commentsToBeRendered.map((comment) => (
            <div
              className="flex flex-wrap flex-auto overflow-visible bg-eduDarkGray py-2 px-6 rounded-md gap-2 items-center"
              key={comment?._id}
              onClick={() => {
                profileModal?.closeModal();
                setSelectedPostId(comment?.postId as string);
              }}
            >
              <div className="text-eduBlack relative text-[14px]">
                {comment.content &&
                  replaceTaggedUsers({
                    content: comment.content,
                    taggedUsers: comment?.taggedUsers ?? [],
                    showCard: false,
                  })}
              </div>
              <span className="text-eduBlack text-[14px]">•</span>
              <span className="text-[12px] text-eduDarkBlue">
                {moment(comment?.createdAt).fromNow()}
              </span>
              {/* <div className="flex text-xs text-eduBlack/50 gap-2">
              <FontAwesomeIcon icon={faChartColumn} />
              <span>{comment?.views} views</span>
            </div> */}
            </div>
          ))}
        </div>
      ) : (
        <span className="text-eduBlack text-eduBlack/60 text-[16px] font-body flex justify-center items-center">
          {noDataMessage}
        </span>
      )}
    </>
  );
};

const Activity = ({
  posts,
  comments,
  profileImage,
  noPostMessage,
  noCommentMessage,
  profileModal,
  setSelectedPostId,
}: {
  posts: [] | undefined;
  comments: [] | undefined;
  profileImage?: string | undefined;
  noPostMessage: string;
  noCommentMessage: string;
  profileModal?: UseModalType;
  setSelectedPostId: React.Dispatch<React.SetStateAction<string>>;
}): React.ReactElement => {
  const [showMore, setShowMore] = useState(false);
  return (
    <>
      <div className="bg-eduLightGray py-2">
        <div
          className={`bg-eduLightGray flex-auto relative rounded-lg lg:min-h-[12rem] overflow-hidden ${
            !showMore ? "h-[150x]" : "h-[300px] overflow-y-auto"
          }`}
        >
          <div className="p-4 px-6 xl:px-16 lg:px-12 md:px-10 sm:px-8 flex flex-col gap-2">
            <span className="text-eduBlack text-[24px] font-semibold font-headers tracking-wide">
              Activity
            </span>
            <TabMenu
              options={[
                {
                  label: "Posts",
                  component: () => (
                    <PostList
                      posts={posts}
                      noDataMessage={noPostMessage}
                      profileModal={profileModal}
                      setSelectedPostId={setSelectedPostId}
                      showMore={showMore}
                    />
                  ),
                },
                {
                  label: "Comments",
                  component: () => (
                    <CommentList
                      comments={comments}
                      profileImage={profileImage}
                      noDataMessage={noCommentMessage}
                      setSelectedPostId={setSelectedPostId}
                      showMore={showMore}
                      profileModal={profileModal}
                    />
                  ),
                },
              ]}
              componentWrapperClass="py-2"
            />
          </div>
        </div>

        {((posts && posts?.length > 2) ||
          (comments && comments?.length > 2)) && (
          <span
            className=" flex justify-center items-center text-center font-[700] opacity-[50%] text-[0.8em] cursor-pointer"
            onClick={() => setShowMore(!showMore)}
          >
            {showMore ? "View Less" : "View More"}
          </span>
        )}
      </div>
    </>
  );
};

const Education = ({
  educations,
  onEditClick,
  noEducationMessage,
}: {
  educations: education[] | undefined;
  onEditClick?: () => void;
  noEducationMessage: string;
}): React.ReactElement => {
  const [showMore, setShowMore] = useState(false);
  let educationsToBeRendered: education[] | undefined = [];
  if (!showMore && educations && educations.length > 0) {
    educationsToBeRendered = educations.slice(0, 2);
  } else {
    educationsToBeRendered = educations;
  }
  return (
    <div className="bg-eduLightGray py-2">
      <div
        className={`overflow-hidden flex-auto relative rounded-lg lg:min-h-[12rem] text-eduBlack `}
      >
        <div className="p-4 px-6 xl:px-16 lg:px-12 md:px-10 sm:px-8 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-eduBlack text-[24px] font-headers font-semibold tracking-wide">
              Education
            </span>
            {onEditClick && <EditIcon onClick={onEditClick} />}
          </div>
          <div
            className={`flex-auto flex flex-col gap-2 pr-6 lg:min-h-[12rem] ${
              !showMore
                ? "h-auto justify-center"
                : "h-[300px] overflow-y-auto justify-start"
            }`}
          >
            {educationsToBeRendered &&
              educationsToBeRendered?.length > 0 &&
              educationsToBeRendered?.map((value: education) => (
                <div className="flex gap-4 " key={value?._id || Date.now()}>
                  <div className="flex flex-1 flex-col text-eduBlack gap-1">
                    <span className="capitalize text-eduBlack text-[16px] font-[500] font-headers">
                      {value?.school_name || "-"}
                    </span>
                    <span className="text-eduBlack/60 text-[15px] font-body">
                      {value?.field_of_study} - {value?.degree}
                    </span>
                    <div className="text-eduBlack/60 text-[15px] font-body">
                      {moment(value?.start_date).format("YYYY")}
                      {" - "}
                      <span>
                        {value?.is_in_progress
                          ? "Present"
                          : moment(value?.start_date).format("YYYY")}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            {educationsToBeRendered?.length == 0 && (
              <span className="text-eduBlack/60 text-[16px] font-body flex items-center justify-center ">
                {noEducationMessage}
              </span>
            )}
          </div>
        </div>
      </div>
      {educations && educations.length > 0 && (
        <span
          className="font-[700] opacity-[50%] text-[0.8em] cursor-pointer flex justify-center items-center"
          onClick={() => setShowMore(!showMore)}
        >
          {showMore ? "View Less" : "View More"}
        </span>
      )}
    </div>
  );
};

const CertificateAndLicense = ({
  type,
  userData,
  lastDocRef,
  noDataMessage,
  onEditClick,
  isLoading,
  onLoadMore,
}: {
  type: "licenses" | "certificates";
  userData: UserData;
  lastDocRef: LastDocRefType;
  noDataMessage: string;
  onEditClick: (() => void) | undefined;
  isLoading: boolean;
  onLoadMore: () => Promise<void>;
}) => {
  const [showMore, setShowMore] = useState(false);
  let documentToBeRendered: userDocs[] | undefined = [];
  if (!showMore && userData?.[type] && userData?.[type].length > 0) {
    documentToBeRendered = userData?.[type].slice(0, 2);
  } else {
    documentToBeRendered = userData?.[type];
  }
  const countCompare =
    type == "certificates"
      ? userData.certificatesCount
      : userData.licensesCount;
  return (
    <div className="bg-eduLightGray py-2">
      <div
        className={` overflow-hidden flex-auto relative rounded-lg text-eduBlack`}
      >
        <div className="p-4 pl-6 xl:pl-16 lg:pl-12 md:pl-10 sm:pl-8 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-eduBlack text-[24px] font-headers font-semibold tracking-wide capitalize">
              {type}
            </span>
            {onEditClick && <EditIcon onClick={onEditClick} />}
          </div>
          <div
            className={`flex-auto flex flex-col gap-2 pr-6 lg:min-h-[12rem] ${
              !showMore
                ? "h-auto justify-center"
                : "h-[300px] overflow-y-auto justify-start"
            }`}
          >
            {documentToBeRendered?.length > 0 &&
              documentToBeRendered?.map((value: userDocs) => (
                <div className="flex gap-4 " key={value?._id || Date.now()}>
                  <div className="flex flex-1 flex-col text-eduBlack gap-1">
                    <span className="capitalize text-eduBlack text-[16px] font-[500] font-headers">
                      {value?.doc_name || "-"}
                    </span>
                    <span className="text-eduBlack/60 text-[15px] font-body">
                      {value?.issuer_organization || "-"}
                    </span>
                    {value?.issue_date && (
                      <span className="text-eduBlack/60 text-[12px] capitalize font-body">
                        Issued{" "}
                        {moment(value?.issue_date).format("DD/MM/YYYY") || "-"}
                      </span>
                    )}
                    {(value?.doc_id?.length as number) > 0 && (
                      <span className="text-eduBlack/60 text-[12px] capitalize font-body">
                        Credential ID {value?.doc_id || "-"}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            {documentToBeRendered?.length == 0 && (
              <span className="text-eduBlack/60 text-[16px] font-body flex items-center justify-center ">
                {noDataMessage?.replaceAll("{type}", type)}
              </span>
            )}
          </div>
        </div>
      </div>
      {showMore && userData?.[type]?.length < countCompare && (
        <LoadMore isLoading={isLoading} onClick={onLoadMore} />
      )}
      {documentToBeRendered?.length > 0 && (
        <span
          className="font-[700] opacity-[50%] text-[0.8em] cursor-pointer flex justify-center items-center"
          onClick={() => {
            setShowMore(!showMore);
          }}
        >
          {showMore ? "View Less" : "View More"}
        </span>
      )}
    </div>
  );
};

const DocList = ({
  type,
  userData,
  lastDocRef,
  noDataMessage,
}: {
  type: "licenses" | "certificates";
  userData: UserData;
  lastDocRef: LastDocRefType;
  noDataMessage: string;
}) => (
  <div className="flex flex-col gap-2 mt-4  h-auto max-h-[40vh] overflow-y-auto">
    {userData?.[type]?.length ? (
      userData?.[type]?.map((value: userDocs) => (
        <div className="flex gap-x-6 gap-y-2" key={value?._id || Date.now()}>
          {/* <div className="flex">
            <FontAwesomeIcon
              icon={faFileInvoice}
              className="text-eduBlack w-10 h-10"
            />
          </div> */}
          <div className="flex flex-1 flex-col text-eduBlack gap-1">
            <span className="font-headers capitalize text-[14px]">
              {value?.doc_name || "-"}
            </span>
            <span className="text-eduBlack/60 text-[12px] capitalize font-body">
              {value?.issuer_organization || "-"}
            </span>
            {value?.issue_date && (
              <span className="text-eduBlack/60 text-[12px] capitalize font-body">
                Issued {moment(value?.issue_date).format("DD/MM/YYYY") || "-"}
              </span>
            )}
            {(value?.doc_id?.length as number) > 0 && (
              <span className="text-eduBlack/60 text-[12px] capitalize font-body">
                Credential ID {value?.doc_id || "-"}
              </span>
            )}
          </div>
        </div>
      ))
    ) : (
      <span className="text-eduBlack">
        {noDataMessage?.replaceAll("{type}", type)}
      </span>
    )}
    <div ref={lastDocRef[type]} />
  </div>
);

const Documents = ({
  userData,
  lastDocRef,
  onLoadMore,
  isLoading,
  onEditClick,
  noDataMessage,
}: {
  userData: UserData;
  lastDocRef: LastDocRefType;
  onLoadMore(doc_type: string): void;
  isLoading: boolean;
  onEditClick?: () => void;
  noDataMessage: string;
}) => (
  <div className="bg-primary-dark overflow-hidden flex-auto relative rounded-lg lg:min-h-[12rem]">
    {(userData?.licenses?.length > 0 || userData?.certificates?.length > 0) &&
      onEditClick && <EditIcon onClick={onEditClick} />}
    <div className="p-4 px-6 xl:px-16 lg:px-12 md:px-10 sm:px-8 flex flex-auto gap-2 flex-wrap bg-eduLightGray">
      <div className="flex-1">
        <span className="text-eduBlack text-[24px] font-semibold font-headers tracking-wide">
          Certifications
          {/* {userData?.certificates?.length > 0 && (
            <span className="text-primary text-xs font-sans opacity-80">
              (Showing {userData?.certificates?.length} /{" "}
              {userData?.certificatesCount})
            </span>
          )} */}
        </span>
        <DocList
          userData={userData}
          lastDocRef={lastDocRef}
          type="certificates"
          noDataMessage={noDataMessage}
        />
        {userData?.certificates?.length < userData?.certificatesCount && (
          <LoadMore
            isLoading={isLoading}
            onClick={() => onLoadMore("certificate")}
          />
        )}
      </div>
      <div className="flex-1">
        <span className="text-eduBlack text-[24px] font-semibold font-headers tracking-wide">
          Licenses
          {/* {userData?.licenses?.length > 0 && (
            <span className="text-primary text-xs font-sans opacity-80">
              (Showing {userData?.licenses?.length} / {userData?.licensesCount})
            </span>
          )} */}
        </span>
        <DocList
          userData={userData}
          lastDocRef={lastDocRef}
          type="licenses"
          noDataMessage={noDataMessage}
        />
        {userData?.licenses?.length < userData?.licensesCount && (
          <LoadMore
            isLoading={isLoading}
            onClick={() => onLoadMore("license")}
          />
        )}
      </div>
    </div>
  </div>
);

const ModalHeader = ({
  currentSection,
  closeModal,
  setCurrentSection,
  setIsListView,
}: {
  currentSection: keyof profileSections;
  closeModal: () => void;
  setCurrentSection(section: keyof profileSections): void;
  setIsListView: React.Dispatch<React.SetStateAction<boolean>>;
}) => (
  <>
    <div className="flex p-3 items-center bg-eduDarkGray">
      <span className="text-[22px] font-semibold justify-self-start font-headers text-eduBlack">
        {profileSections[currentSection] as string}
      </span>
      <FontAwesomeIcon
        icon={faX}
        onClick={closeModal}
        className="ml-auto font-bold self-center cursor-pointer text-eduBlack"
      />
    </div>
    <ul className="flex gap-2 justify-center px-8 py-4 font-body">
      {Object.keys(profileSections).map((section: string, index: number) => (
        <li
          className={`flex items-center font-body font-normal text-[14px] ${
            currentSection === section
              ? "text-primary"
              : "text-eduBlack cursor-pointer"
          }`}
          key={section}
          onClick={() => {
            setCurrentSection(section as keyof profileSections);
            setIsListView(true);
          }}
        >
          {profileSections[section as keyof profileSections]}
          {index !== Object.keys(profileSections).length - 1 && (
            <span className="w-2 h-2 rounded-full ml-4 bg-eduBlack inline-block" />
          )}
        </li>
      ))}
    </ul>
  </>
);

const ModalFooter = ({
  userData,
  currentSection,
  isLoading,
  onLoadMore,
  isListView,
  setSaveAndExitButtonPressed,
  setCurrentSection,
  closeModal,
}: {
  userData: UserData;
  currentSection: keyof profileSections;
  isLoading: boolean;
  isListView: boolean;
  onLoadMore(doc_type: "license" | "certificate"): void;
  setSaveAndExitButtonPressed: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentSection: React.Dispatch<
    React.SetStateAction<keyof profileSections>
  >;
  closeModal?: () => void;
}) => {
  const saveAndNextButtonRef: any = useRef(null);
  const nextButtonRef: any = useRef(null);

  const changeProfileSubTab = (type?: string) => {
    if (
      ["education", "certifications", "licenses"].includes(currentSection) &&
      isListView
    ) {
      if (type == "save_exit") {
        closeModal?.();
      } else {
        setCurrentSection((currentSection) => {
          if (currentSection == "about") {
            return "education";
          } else if (currentSection == "education") {
            return "certifications";
          } else if (currentSection == "certifications") {
            return "licenses";
          } else if (currentSection == "licenses") {
            return "profileImages";
          } else {
            return "about";
          }
        });
      }
    }
  };

  return (
    <>
      {currentSection === "licenses" &&
        isListView &&
        userData?.licenses?.length < userData?.licensesCount && (
          <LoadMore
            isLoading={isLoading}
            onClick={() => onLoadMore("license")}
          />
        )}
      {currentSection === "certifications" &&
        isListView &&
        userData?.certificates?.length < userData?.certificatesCount && (
          <LoadMore
            isLoading={isLoading}
            onClick={() => onLoadMore("certificate")}
          />
        )}
      <div className="m-3 text-center">
        <button
          type="submit"
          id="save_exit"
          form={userData?._id}
          className="hidden"
          ref={saveAndNextButtonRef}
        />
        <button
          type="submit"
          className="hidden"
          form={userData?._id}
          ref={nextButtonRef}
        ></button>
        <Button
          type="button"
          label="Save & Exit"
          className="!bg-eduDarkBlue text-white"
          onClick={() => {
            setSaveAndExitButtonPressed(true);
            saveAndNextButtonRef?.current.click();
            changeProfileSubTab("save_exit");
          }}
        />
        <Button
          type="button"
          label="Next"
          className="ml-[10px]"
          onClick={() => {
            setSaveAndExitButtonPressed(false);
            nextButtonRef?.current.click();
            changeProfileSubTab();
          }}
        />
      </div>
    </>
  );
};

export {
  BasicInfo,
  About,
  Activity,
  Documents,
  Education,
  ModalHeader,
  ModalFooter,
  CertificateAndLicense,
};
