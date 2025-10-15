import React, { useState } from "react";
import { useLogin } from "../../hooks/auth/useLogin";
import { useVerifyTwoFA } from "../../hooks/auth/useVerifyTwoFA";
import { LoginForm } from "../../components/auth/LoginForm";
import { TwoFAForm } from "./../../components/auth/TwoFAForm";
import css from "./index.module.scss";

export const AuthPage: React.FC = () => {
  const [step, setStep] = useState<"login" | "2fa">("login");
  const [tempToken, setTempToken] = useState("");

  const loginMutation = useLogin();
  const verifyTwoFAMutation = useVerifyTwoFA();

  React.useEffect(() => {
    if (loginMutation.isSuccess && loginMutation.data?.requiresTwoFA) {
      setTempToken(loginMutation.data.tempToken || "");
      setStep("2fa");
    }
  }, [loginMutation.isSuccess, loginMutation.data]);

  const handleLoginSubmit = (values: {
    username: string;
    password: string;
  }) => {
    loginMutation.mutate(values);
  };

  const handleTwoFASubmit = (values: { code: string }) => {
    verifyTwoFAMutation.mutate({
      code: values.code,
      tempToken,
    });
  };

  const handleBackToLogin = () => {
    setStep("login");
    setTempToken("");
    loginMutation.reset();
    verifyTwoFAMutation.reset();
  };

  if (step === "2fa") {
    return (
      <div className={css.page}>
        <TwoFAForm
          onSubmit={handleTwoFASubmit}
          onBack={handleBackToLogin}
          isLoading={verifyTwoFAMutation.status === "pending"}
          error={verifyTwoFAMutation.error || null}
          tempToken={tempToken}
        />
      </div>
    );
  }

  return (
    <div className={css.page}>
      <LoginForm
        onSubmit={handleLoginSubmit}
        isLoading={loginMutation.status === "pending"}
        error={loginMutation.error || null}
      />
    </div>
  );
};
