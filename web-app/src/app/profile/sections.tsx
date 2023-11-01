import { getFullName, getStaticImageUrl } from "@/util/helpers";
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
import twitter from "../../assets/icons/twitter.svg";
import email from "../../assets/icons/email.svg";
import facebook from "../../assets/icons/facebook.svg";
import eduIcon from "../../assets/icons/eduIcon.svg";
import { npiToDefinition, profileSections, statesNames } from "@/util/constant";
import moment from "moment";
import { TabMenu } from "@/components/tabMenu";
import { Button } from "@/components/button";
import { LoadMore } from "@/components/loadMore";
import replaceTaggedUsers from "../../components/replaceTags";

const socialMediaIcons: socials = {
  instagram,
  facebook,
  twitter,
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
    <div className="p-4 px-6 xl:px-16 lg:px-12 md:px-10 sm:px-8 bg-eduLightGray">
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
                  {userData?.city},{" "}
                  {userData?.state &&
                    statesNames[userData?.state as keyof typeof statesNames]}
                  •{" "}
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
              • Member Since{" "}
              {userData?.joined ? moment(userData?.joined).year() : "-"}
            </span>
            <span className="text-eduBlack/60 text-[16px] font-body">
              <FontAwesomeIcon icon={faStethoscope} className="me-2" />
              Licensed in:{" "}
              {statesNames[userData?.state as keyof typeof statesNames]}
            </span>
            <div className="flex text-eduBlack text-xs gap-x-4 font-body">
              <span className="font-body">
                <b className="text-eduBlack text-[12px] font-body">
                  {userData?.followingCount}
                </b>{" "}
                Following
              </span>
              <span className="font-body">
                <b className="text-eduBlack text-[12px] font-body">
                  {userData?.followersCount}
                </b>{" "}
                Followers
              </span>
            </div>
            {userData?.socials && Object.keys(userData?.socials).length > 0 && (
              <div className="flex gap-2">
                {Object.keys(userData?.socials)?.map((item: string) => {
                  if (
                    userData?.socials?.[item as keyof socials]?.length &&
                    socialMediaIcons?.[item as keyof socials]
                  ) {
                    return (
                      <SocialIcon
                        value={item as keyof socials}
                        href={`https://${item}.com/${
                          userData?.socials?.[item as keyof socials]
                        }`}
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
            )}
          </div>
        </div>
        {buttonJsx
          ? buttonJsx
          : openModal && (
              <div className="justify-self-end self-end">
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
}) => (
  <div className="bg-eduLightGray overflow-hidden flex-auto relative rounded-lg">
    {personal_bio && openModal && <EditIcon onClick={openModal} />}
    <div className="p-4 px-6 xl:px-16 lg:px-12 md:px-10 sm:px-8 flex flex-col gap-2">
      <span className="text-eduBlack text-[24px] font-semibold font-headers tracking-wide">
        About
      </span>
      <p className="text-eduBlack/60 text-[16px] font-body">
        {personal_bio || (emptyBioMessage ?? "No personal bio available")}
      </p>
    </div>
  </div>
);

const PostList = ({
  posts,
  noDataMessage,
}: {
  posts: PostInterface[] | undefined;
  noDataMessage: string;
}): React.ReactElement => (
  <>
    {posts?.length ? (
      <div className="grid grid-cols-2 gap-2 animate-fade-in-down">
        {posts.map((post) => (
          <div className="flex gap-2" key={post?._id}>
            <div className="flex flex-col gap-1">
              <span className="text-eduBlack text-[14px] font-headers capitalize">
                {post?.title}
              </span>
              <span className="text-[12px] text-eduBlack/60 font-body">
                {post?.forumType} • Published on{" "}
                {moment(post?.createdAt).format("DD/MM/YYYY")}
              </span>
              <div className="flex text-[12px] text-eduBlack/60 font-body gap-2">
                <FontAwesomeIcon icon={faComments} />
                <span>{post?.commentCount} Comments</span>
                <FontAwesomeIcon icon={faChartColumn} />
                <span>{post?.views} views</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <span className="text-eduBlack">{noDataMessage}</span>
    )}
  </>
);

const CommentList = ({
  comments,
  profileImage,
  noDataMessage,
}: {
  comments: Comment[] | undefined;
  profileImage?: string | undefined;
  noDataMessage: string;
}): React.ReactElement => (
  <>
    {comments?.length ? (
      <div className="flex flex-auto flex-col gap-2 animate-fade-in-down">
        {comments.map((comment) => (
          <div
            className="flex flex-wrap flex-auto overflow-visible bg-eduDarkGray py-2 px-6 rounded-md gap-2 items-center"
            key={comment?._id}
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
      <span className="text-eduBlack">{noDataMessage}</span>
    )}
  </>
);

const Activity = ({
  posts,
  comments,
  profileImage,
  noPostMessage,
  noCommentMessage,
}: {
  posts: [] | undefined;
  comments: [] | undefined;
  profileImage?: string | undefined;
  noPostMessage: string;
  noCommentMessage: string;
}): React.ReactElement => (
  <div className="bg-eduLightGray overflow-visible flex-auto relative rounded-lg lg:min-h-[12rem]">
    <div className="p-4 px-6 xl:px-16 lg:px-12 md:px-10 sm:px-8 flex flex-col gap-2">
      <span className="text-eduBlack text-[24px] font-semibold font-headers tracking-wide">
        Activity
      </span>
      <TabMenu
        options={[
          {
            label: "Posts",
            component: () => (
              <PostList posts={posts} noDataMessage={noPostMessage} />
            ),
          },
          {
            label: "Comments",
            component: () => (
              <CommentList
                comments={comments}
                profileImage={profileImage}
                noDataMessage={noCommentMessage}
              />
            ),
          },
        ]}
        componentWrapperClass="py-2"
      />
    </div>
  </div>
);

const Education = ({
  educations,
  onEditClick,
  noEducationMessage,
}: {
  educations: education[] | undefined;
  onEditClick?: () => void;
  noEducationMessage: string;
}): React.ReactElement => (
  <div className="overflow-hidden flex-auto relative rounded-lg lg:min-h-[12rem] text-eduBlack bg-eduLightGray">
    {onEditClick && <EditIcon onClick={onEditClick} />}
    <div className="p-4 px-6 xl:px-16 lg:px-12 md:px-10 sm:px-8 flex flex-col gap-2">
      <span className="text-eduBlack text-[24px] font-headers font-semibold tracking-wide">
        Education
      </span>
      {educations?.length ? (
        educations?.map((value: education) => (
          <div className="flex gap-4" key={value?._id || Date.now()}>
            <div className="flex">
              <Image src={eduIcon} alt={`${value?._id as string}alt`} />
            </div>
            <div className="flex flex-1 flex-col text-eduBlack gap-1">
              <span className="capitalize font-headers font-medium text-[14px]">
                {value?.school_name || "-"}
              </span>
              <span className="text-eduBlack/60 text-[12px] font-body">
                {value?.field_of_study} - {value?.degree}
              </span>
              <div className="text-eduBlack/60 text-[12px] font-body">
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
        ))
      ) : (
        <span className="text-eduBlack">{noEducationMessage}</span>
      )}
    </div>
  </div>
);

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
                Issued {value?.issue_date || "-"}
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
}: {
  currentSection: keyof profileSections;
  closeModal: () => void;
  setCurrentSection(section: keyof profileSections): void;
}) => (
  <>
    <div className="flex p-3 items-center bg-eduDarkGray">
      <span className="text-[22px] font-semibold justify-self-start font-headers text-eduBlack">
        {profileSections[currentSection] as string}
      </span>
      <FontAwesomeIcon
        icon={faX}
        onClick={closeModal}
        className="cursor-pointer ml-auto text-eduBlack"
      />
    </div>
    <ul className="flex gap-4 justify-center px-8 py-4 font-body">
      {Object.keys(profileSections).map((section: string, index: number) => (
        <li
          className={`flex items-center font-body font-normal ${
            currentSection === section
              ? "text-primary"
              : "text-eduBlack cursor-pointer"
          }`}
          key={section}
          onClick={() => setCurrentSection(section as keyof profileSections)}
        >
          {profileSections[section as keyof profileSections]}
          {index !== Object.keys(profileSections).length - 1 && (
            <span className="w-2 h-2 rounded-full ml-4 bg-eduBlack/60 inline-block" />
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
}: {
  userData: UserData;
  currentSection: keyof profileSections;
  isLoading: boolean;
  isListView: boolean;
  onLoadMore(doc_type: "license" | "certificate"): void;
}) => (
  <>
    {currentSection === "licenses" &&
      isListView &&
      userData?.licenses?.length < userData?.licensesCount && (
        <LoadMore isLoading={isLoading} onClick={() => onLoadMore("license")} />
      )}
    {currentSection === "certifications" &&
      isListView &&
      userData?.certificates?.length < userData?.certificatesCount && (
        <LoadMore
          isLoading={isLoading}
          onClick={() => onLoadMore("certificate")}
        />
      )}
    <div className="m-3 flex justify-center">
      <Button
        // disabled={
        // (currentSection as keyof profileSections) === "profileImages"
        // &&
        // !values?.banner_img &&
        // !values?.profile_img
        // }
        type="submit"
        label="Save"
        className="w-1/5"
        form={userData?._id}
      />
    </div>
  </>
);

export {
  BasicInfo,
  About,
  Activity,
  Documents,
  Education,
  ModalHeader,
  ModalFooter,
};
