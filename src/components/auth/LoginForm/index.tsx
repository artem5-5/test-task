import React from "react";
import { Formik, Form, Field, type FormikErrors } from "formik";
import css from "./index.module.scss";
import { type LoginFormErrors, type AuthError } from "../../../types/auth";

interface LoginFormProps {
  onSubmit: (values: { username: string; password: string }) => void;
  isLoading: boolean;
  error: AuthError | null;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  isLoading,
  error,
}) => {
  const validateForm = (values: {
    username: string;
    password: string;
  }): FormikErrors<LoginFormErrors> => {
    const errors: LoginFormErrors = {};

    if (!values.username.trim()) {
      errors.username = "Enter the user's name";
    }

    if (!values.password.trim()) {
      errors.password = "Enter the password";
    }

    return errors;
  };

  return (
    <div className={css.container}>
      <div className={css.title}>
        <div className={css.lable}>Company</div>
        <div className={css.description}>
          Sign in to your account to continue
        </div>
      </div>

      {error && <div className={css.error}>{error.message}</div>}

      <Formik
        initialValues={{ username: "", password: "" }}
        validate={validateForm}
        onSubmit={onSubmit}
      >
        {({ isValid, dirty, errors, touched }) => {
          const isButtonDisabled = !isValid || !dirty || isLoading;

          return (
            <Form className={css.form}>
              <div className={css.fields}>
                <div className={css.field}>
                  <Field
                    name="username"
                    type="text"
                    className={`${css.input} ${
                      errors.username && touched.username ? css.errorInput : ""
                    }`}
                    placeholder="User name"
                    disabled={isLoading}
                  />
                  {errors.username && touched.username && (
                    <div className={css.errorMessage}>{errors.username}</div>
                  )}
                </div>

                <div className={css.field}>
                  <Field
                    name="password"
                    type="password"
                    className={`${css.input} ${
                      errors.password && touched.password ? css.errorInput : ""
                    }`}
                    placeholder="Password"
                    disabled={isLoading}
                  />
                  {errors.password && touched.password && (
                    <div className={css.errorMessage}>{errors.password}</div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isButtonDisabled}
                className={`${css.button} ${
                  isButtonDisabled ? css.disabled : css.active
                }`}
              >
                {isLoading ? "Loading..." : "Log in"}
              </button>
            </Form>
          );
        }}
      </Formik>

      <div className={css.testInfo}>
        <h4>Test data:</h4>
        <p>
          User name: <strong>admin</strong>
        </p>
        <p>
          Password: <strong>admin</strong>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
