import { usePathname, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { useState } from "react";


const AdminProfile = () => {
  const router = useRouter();
  const path = usePathname();
  const hideSidebar = path.includes("login");
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  return (
    !hideSidebar && (
      <div className="flex items-center justify-end p-4">
        <div className="group relative">
          <button
            type="button"
            className="group flex items-center gap-6 text-base"
          >
            <span className="font-bold text-white">Admin</span>
            <img
              src="https://picsum.photos/200"
              className="h-14 w-14 rounded-full"
              alt="Admin"
            />
          </button>
          <div
            className={`absolute hidden ${
              !modalOpen && "group-hover:block"
            } w-full right-0 top-full pt-2 z-[99]`}
          >
            <div className=" relative border border-black bg-white shadow-lg rounded-xl p-2 w-full">
              <button
                type="button"
                className="text-center w-full hover:text-red-500"
                onClick={() => setModalOpen(true)}
              >
                Logout
              </button>
            </div>
          </div>

          {/* <BasicModal visible={modalOpen} background="bg-[#d9d9d9]">
            <div className="--wrapper ">
              <div className="flex items-center w-[100%] justify-center ">
                <span className="text-base font-bold uppercase">
                  ARE YOU SURE WANT TO LOGOUT?
                </span>
              </div>
              <div className="flex justify-center">
                <img
                  src="/imgs/staking_closed.png"
                  height={250}
                  width={250}
                  alt="staking_closed"
                  className="m-2"
                />
              </div>
              <div className="flex  gap-4 items-center justify-center border-slate-200 rounded-[15px] w-full pt-[20px] text-white">
                <GemButton
                  type="primary"
                  isSubmit={true}
                  className="bg-red-500"
                  disabled={false}
                  isRed={true}
                  onClick={() => {
                    setModalOpen(false);
                    dispatch(removeToken());
                    router.push("/marketplace/admin/login");
                  }}
                >
                  Logout
                </GemButton>
                <GemButton
                  type="primary"
                  isSubmit={true}
                  className="bg-black"
                  disabled={false}
                  isRed={true}
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </GemButton>
              </div>
            </div>
          </BasicModal> */}
        </div>
      </div>
    )
  );
};

export default AdminProfile;
