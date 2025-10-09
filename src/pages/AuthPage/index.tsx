import LoginForm from "../../components/auth/LoginForm";
import css from "./index.module.scss";

const AuthPage = () => {
  return (
    <div className={css.wrapper}>
      <LoginForm />
    </div>
  );
};

export default AuthPage;
