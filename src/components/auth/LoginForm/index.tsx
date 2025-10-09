import { Formik, Field, Form } from "formik";
import css from "./index.module.scss";
import { useLogin } from "../../../hooks/auth/useLogin";

const LoginForm = () => {
  const loginMutation = useLogin();

  const isLoading = loginMutation.status === "pending";

  return (
    <Formik
      initialValues={{ username: "", password: "" }}
      onSubmit={(values: { username: string; password: string }) => {
        console.log("Form values:", values);
        loginMutation.mutate(values);
      }}
    >
      {({ values }) => (
        <Form className={css.container}>
          <div className={css.title}>
            <h2 className={css.lable}>Company</h2>
            <h1 className={css.description}>
              Sign in to your account to continue
            </h1>
          </div>
          <div className={css.fields}>
            <Field
              id="username"
              name="username"
              type="text"
              placeholder="Email"
              className={css.field}
            />
            <Field
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              className={css.field}
            />
          </div>
          <button
            type="submit"
            className={css.button}
            disabled={
              isLoading || !values.username.trim() || !values.password.trim()
            }
            style={{
              background:
                isLoading || !values.username.trim() || !values.password.trim()
                  ? "rgba(0, 0, 0, 0.04)"
                  : "#1677FF",
              color:
                isLoading || !values.username.trim() || !values.password.trim()
                  ? "#00000040"
                  : "#FFFFFF",
              border: "none",
            }}
          >
            {isLoading ? "Loading..." : "Log in"}
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;
