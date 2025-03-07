import GeneralSubmitButton from "@/components/general/SubmitButtons";
import React from "react";
import GitHub from "../icons/GitHub";
import Google from "../icons/Google";

interface LoginButtonsProps {
  onGithubLogin: () => void;
  onGoogleLogin: () => void;
}

const LoginButtons = ({ onGithubLogin, onGoogleLogin }: LoginButtonsProps) => {
  return (
    <div className="flex flex-col gap-4">
      <form action={onGithubLogin}>
        <GeneralSubmitButton
          variant="outline"
          text="Login with GitHub"
          className="w-full"
          icon={<GitHub className="size-4 text-gray-200" />}
        />
      </form>

      <form action={onGoogleLogin}>
        <GeneralSubmitButton
          variant="outline"
          text="Login with Google"
          className="w-full"
          icon={<Google className="size-4" />}
        />
      </form>
    </div>
  );
};

export default LoginButtons;
