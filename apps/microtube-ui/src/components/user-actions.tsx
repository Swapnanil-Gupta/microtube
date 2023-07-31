import { getServerSession } from "next-auth/next";
import authOptions from "@/lib/authOptions";
import { Input } from "./ui/input";
import UserDropdown from "./user-dropdown";
import SignInButton from "./signin-button";
import UploadDialogTrigger from "./upload-dialog-trigger";
import VideoSearch from "./video-search";

export default async function UserActions() {
  const session = await getServerSession(authOptions);

  return (
    <div className="py-2">
      <div className="container flex flex-col sm:flex-row sm:justify-end gap-4">
        <div className="flex space-x-4 sm:order-2">
          {session ? (
            <>
              <UploadDialogTrigger />
              <UserDropdown />
            </>
          ) : (
            <SignInButton />
          )}
        </div>
        <div className="sm:order-1 grow sm:max-w-md">
          <VideoSearch />
        </div>
      </div>
    </div>
  );
}
