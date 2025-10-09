import { Formik, Field, Form } from "formik";
import css from "./index.module.scss";

const LoginForm = () => {
  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      onSubmit={async (values) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        console.log(values);
      }}
    >
      <Form className={css.container}>
        <p className={css.lable}>Company</p>
        <h1 className={css.descrition}>Sign in to your account to continue</h1>
        <div className={css.fields}>
          <Field name="email" type="text" className={css.field} />
          <Field name="password" type="text" className={css.field} />
        </div>
        <button type="submit" className={css.button}>Log in</button>
      </Form>
    </Formik>
  );
};

export default LoginForm;
