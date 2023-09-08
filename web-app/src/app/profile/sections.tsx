import { getFullName, getStaticImageUrl } from "@/util/helpers";
import {
  faComments,
  faEdit,
  faImage,
} from "@fortawesome/free-regular-svg-icons";
import {
  faChartColumn,
  faFileInvoice,
  faLocationDot,
  faStethoscope,
  faUser,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import instagram from "../../assets/icons/instagram.svg";
import linkedin from "../../assets/icons/linkedin.svg";
import twitter from "../../assets/icons/twitter.svg";
import facebook from "../../assets/icons/facebook.svg";
import eduIcon from "../../assets/icons/eduIcon.svg";
import { npiToDefinition } from "@/util/constant";
import moment from "moment";
import { TabMenu } from "@/components/tabMenu";
import { Button } from "@/components/button";
import { LoadMore } from "@/components/loadMore";

const socialMediaIcons: socials = {
  instagram,
  facebook,
  twitter,
  linkedin,
};

const profileSections: profileSections = {
  about: "About",
  education: "Education",
  certifications: "Certifications",
  licenses: "Licenses",
  profileImages: "Profile Images",
};

interface LastDocRefType {
  licenses: React.RefObject<HTMLDivElement> | null;
  certificates: React.RefObject<HTMLDivElement> | null;
}

const EditIcon = ({ onClick }: { onClick: () => void }) => (
  <FontAwesomeIcon
    icon={faEdit}
    className="text-white z-10 cursor-pointer absolute right-0 m-4"
    onClick={onClick}
  />
);

const BasicInfo = ({
  userData,
  openModal,
}: {
  userData: UserData;
  openModal?: () => void;
}): React.ReactElement => (
  <div className="bg-primary-dark overflow-hidden flex-auto relative rounded-lg">
    {openModal && <EditIcon onClick={openModal} />}
    <div className="w-full hover:blur-sm duration-500 h-40 overflow-hidden bg-gradient-to-b from-primary/20 items-center justify-center flex">
      {userData?.banner_img ? (
        <Image
          src={getStaticImageUrl(userData?.banner_img)}
          width={2000}
          height={2000}
          alt="banner image"
          className="h-40 w-full object-cover"
        />
      ) : (
        <FontAwesomeIcon icon={faImage} className="text-primary text-4xl" />
      )}
    </div>
    <div className="p-4 px-6 xl:px-16 lg:px-12 md:px-10 sm:px-8">
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
          <FontAwesomeIcon icon={faImage} className="text-primary text-4xl" />
        )}
      </div>
      <div className="flex gap-2 mt-4">
        <div className="flex-1">
          <div className="flex gap-2 flex-col">
            <span className="text-white capitalize">
              {getFullName(userData?.first_name, userData?.last_name)}
            </span>
            <span className="text-white/50 text-xs">
              {userData?.role === "student" ? (
                "Student "
              ) : (
                <>
                  <FontAwesomeIcon icon={faLocationDot} className="me-2" />
                  {userData?.city}, {userData?.state} •{" "}
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
            <span className="text-white/50 text-xs">
              <FontAwesomeIcon icon={faStethoscope} className="me-2" />
              Licensed in: IL, TX, CA, FL
            </span>
            <div className="flex text-white/50 text-xs gap-x-4">
              <span>
                <b className="text-white">{userData?.followingCount}</b>{" "}
                Following
              </span>
              <span>
                <b className="text-white">{userData?.followersCount}</b>{" "}
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
                      <a
                        className="bg-primary flex justify-center rounded-full h-7 w-7"
                        key={item}
                        href={`https://${item}.com/${
                          userData?.socials?.[item as keyof socials]
                        }`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={item}
                      >
                        <Image
                          src={
                            socialMediaIcons[item as keyof socials] as string
                          }
                          alt={item}
                        />
                      </a>
                    );
                  }
                })}
              </div>
            )}
          </div>
        </div>
        <div className="justify-self-end self-end">
          <button
            type="button"
            className="border rounded-md p-2 hover:bg-primary w-auto px-4 font-medium text-sm text-primary border-primary bg-primary/10 hover:text-white transition-all ease-in-out duration-300"
            onClick={openModal}
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  </div>
);

const About = ({
  personal_bio,
  openModal,
}: {
  personal_bio: string | undefined;
  openModal?: () => void;
}) => (
  <div className="bg-primary-dark overflow-hidden flex-auto relative rounded-lg">
    {personal_bio && openModal && <EditIcon onClick={openModal} />}
    <div className="p-4 px-6 xl:px-16 lg:px-12 md:px-10 sm:px-8 flex flex-col gap-2">
      <span className="text-white text-xl font-bold font-serif tracking-wide">
        About
      </span>
      <p className="text-white/60 text-sm">
        {personal_bio || "You don't have about / bio yet."}
      </p>
    </div>
  </div>
);

const PostList = ({ posts }: { posts: [] | undefined }): React.ReactElement => (
  <>
    {posts?.length ? (
      <div className="grid grid-cols-2 gap-2 ease-in-out transform duration-1000">
        {posts.map((post: any) => (
          <div className="flex gap-2" key={post?._id}>
            <div className="w-14 h-14 bg-primary/80 rounded-md">
              <Image src="edurxLogo.svg" width={200} height={200} alt="" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-white text-sm">{post?.title}</span>
              <span className="text-xs text-white/50">
                {post?.forumType} • Published on{" "}
                {moment(post?.createdAt).format("DD/MM/YYYY")}
              </span>
              <div className="flex text-xs text-white/50 gap-2">
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
      <span className="text-white">You have no forum posts yet.</span>
    )}
  </>
);

const CommentList = ({
  comments,
  profileImage,
}: {
  comments: [] | undefined;
  profileImage?: string | undefined;
}): React.ReactElement => (
  <>
    {comments?.length ? (
      <div className="flex flex-auto flex-wrap gap-2 ease-in-out transform duration-1000">
        {comments.map((comment: any) => (
          <div className="flex gap-2 items-center" key={comment?._id}>
            <div className="w-8 overflow-hidden h-8 text-white justify-center items-center flex bg-primary/80 rounded-full">
              {profileImage ? (
                <Image
                  src={getStaticImageUrl(profileImage)}
                  width={200}
                  height={200}
                  alt="user_img"
                />
              ) : (
                <FontAwesomeIcon icon={faUser} />
              )}
            </div>
            <span className="text-white text-sm">{comment?.content}</span>
            <span className="text-xs text-white/50">
              {/* {post?.forumType} • Published on{" "} */}•{" "}
              {moment(comment?.createdAt).fromNow()} •
            </span>
            {/* <div className="flex text-xs text-white/50 gap-2">
              <FontAwesomeIcon icon={faChartColumn} />
              <span>{comment?.views} views</span>
            </div> */}
          </div>
        ))}
      </div>
    ) : (
      <span className="text-white">You have no forum comments yet.</span>
    )}
  </>
);

const Activity = ({
  posts,
  comments,
  profileImage,
}: {
  posts: [] | undefined;
  comments: [] | undefined;
  profileImage?: string | undefined;
}): React.ReactElement => (
  <div className="bg-primary-dark overflow-hidden flex-auto relative rounded-lg lg:min-h-[12rem]">
    <div className="p-4 px-6 xl:px-16 lg:px-12 md:px-10 sm:px-8 flex flex-col gap-2">
      <span className="text-white text-xl font-bold font-serif tracking-wide">
        Activity
      </span>
      <TabMenu
        options={[
          {
            label: "Posts",
            component: () => <PostList posts={posts} />,
          },
          {
            label: "Comments",
            component: () => (
              <CommentList comments={comments} profileImage={profileImage} />
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
}: {
  educations: education[] | undefined;
  onEditClick?: () => void;
}): React.ReactElement => (
  <div className="bg-primary-dark overflow-hidden flex-auto relative rounded-lg lg:min-h-[12rem]">
    {onEditClick && <EditIcon onClick={onEditClick} />}
    <div className="p-4 px-6 xl:px-16 lg:px-12 md:px-10 sm:px-8 flex flex-col gap-2">
      <span className="text-white text-xl font-bold font-serif tracking-wide">
        Education
      </span>
      {educations?.length ? (
        educations?.map((value: education) => (
          <div className="flex gap-4" key={value?._id || Date.now()}>
            <div className="flex">
              <Image src={eduIcon} alt={`${value?._id as string}alt`} />
            </div>
            <div className="flex flex-1 flex-col text-white gap-1">
              <span className="text-base capitalize font-mono">
                {value?.school_name || "-"}
              </span>
              <span className="text-white/50 text-xs">
                {value?.field_of_study} - {value?.degree}
              </span>
              <div className="text-white/50 text-xs">
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
        <span className="text-white">
          You have not shared any education hisory yet.
        </span>
      )}
    </div>
  </div>
);

const DocList = ({
  type,
  userData,
  lastDocRef,
}: {
  type: "licenses" | "certificates";
  userData: UserData;
  lastDocRef: LastDocRefType;
}) => (
  <div className="flex flex-col gap-2 mt-4  h-auto max-h-[40vh] overflow-y-auto">
    {userData?.[type]?.length ? (
      userData?.[type]?.map((value: userDocs) => (
        <div className="flex gap-x-6" key={value?._id || Date.now()}>
          <div className="flex">
            <FontAwesomeIcon
              icon={faFileInvoice}
              className="text-white w-10 h-10"
            />
          </div>
          <div className="flex flex-1 flex-col text-white gap-1">
            <span className="text-base font-mono capitalize">
              {value?.doc_name || "-"}
            </span>
            <span className="text-white/50 text-xs capitalize">
              {value?.issuer_organization || "-"}
            </span>
            {value?.issue_date && (
              <span className="text-white/50 text-xs">
                Issued {value?.issue_date || "-"}
              </span>
            )}
            {(value?.doc_id?.length as number) > 0 && (
              <span className="text-white/50 text-xs">
                Credential ID {value?.doc_id || "-"}
              </span>
            )}
          </div>
        </div>
      ))
    ) : (
      <span className="text-white">You have not shared any {type} yet</span>
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
}: {
  userData: UserData;
  lastDocRef: LastDocRefType;
  onLoadMore(doc_type: string): void;
  isLoading: boolean;
  onEditClick?: () => void;
}) => (
  <div className="bg-primary-dark overflow-hidden flex-auto relative rounded-lg lg:min-h-[12rem]">
    {(userData?.licenses?.length > 0 || userData?.certificates?.length > 0) &&
      onEditClick && <EditIcon onClick={onEditClick} />}
    <div className="p-4 px-6 xl:px-16 lg:px-12 md:px-10 sm:px-8 flex flex-auto gap-2 flex-wrap">
      <div className="flex-1">
        <span className="text-white text-xl font-bold font-serif tracking-wide">
          Certifications{" "}
          {userData?.certificates?.length > 0 && (
            <span className="text-primary text-xs font-sans opacity-80">
              (Showing {userData?.certificates?.length} /{" "}
              {userData?.certificatesCount})
            </span>
          )}
        </span>
        <DocList
          userData={userData}
          lastDocRef={lastDocRef}
          type="certificates"
        />
        {userData?.certificates?.length < userData?.certificatesCount && (
          <LoadMore
            isLoading={isLoading}
            onClick={() => onLoadMore("certificate")}
          />
        )}
      </div>
      <div className="flex-1">
        <span className="text-white text-xl font-bold font-serif">
          Licenses{" "}
          {userData?.licenses?.length > 0 && (
            <span className="text-primary text-xs font-sans opacity-80">
              (Showing {userData?.licenses?.length} / {userData?.licensesCount})
            </span>
          )}
        </span>
        <DocList userData={userData} lastDocRef={lastDocRef} type="licenses" />
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
    <div className="flex p-3 items-center bg-primary">
      <span className="text-xl font-medium justify-self-start">
        {profileSections[currentSection] as string}
      </span>
      <FontAwesomeIcon
        icon={faXmark}
        onClick={closeModal}
        className="cursor-pointer ml-auto"
      />
    </div>
    <ul className="flex gap-4 justify-center px-8 py-4">
      {Object.keys(profileSections).map((section: string, index: number) => (
        <li
          className={`flex items-center ${
            currentSection === section
              ? "text-primary"
              : "text-white cursor-pointer"
          }`}
          key={section}
          onClick={() => setCurrentSection(section as keyof profileSections)}
        >
          {profileSections[section as keyof profileSections]}
          {index !== Object.keys(profileSections).length - 1 && (
            <span className="w-2 h-2 rounded-full ml-4 bg-[#8F8F8E] inline-block" />
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
      userData?.licenses.length < userData?.licensesCount && (
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
