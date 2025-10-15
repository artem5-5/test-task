import React, { useRef, useState } from "react";
import { Formik, Form, type FormikErrors } from "formik";
import type { TwoFAFormErrors, AuthError } from "../../../types/auth";
import { useRequestNewCode } from "../../../hooks/auth/useRequestNewCode";
import css from "./index.module.scss";

interface TwoFAFormProps {
  onSubmit: (values: { code: string }) => void;
  onBack: () => void;
  isLoading: boolean;
  error: AuthError | null;
  tempToken: string;
}

export const TwoFAForm: React.FC<TwoFAFormProps> = ({
  onSubmit,
  onBack,
  isLoading,
  error,
  tempToken,
}) => {
  const requestNewCodeMutation = useRequestNewCode();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [codeValues, setCodeValues] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  const validateForm = (): FormikErrors<TwoFAFormErrors> => {
    const errors: TwoFAFormErrors = {};

    const fullCode = codeValues.join("");
    if (fullCode.length !== 6) {
      errors.code = "Введите все 6 цифр кода";
    } else if (!/^\d+$/.test(fullCode)) {
      errors.code = "Код должен содержать только цифры";
    }

    return errors;
  };

  const setInputRef = (index: number) => (el: HTMLInputElement | null) => {
    inputRefs.current[index] = el;
  };

  const handleInputChange = (index: number, value: string) => {
    const numericValue = value.replace(/\D/g, "");

    const newCodeValues = [...codeValues];
    newCodeValues[index] = numericValue.slice(0, 1);
    setCodeValues(newCodeValues);

    if (numericValue && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace") {
      if (!codeValues[index] && index > 0) {
        const newCodeValues = [...codeValues];
        newCodeValues[index - 1] = "";
        setCodeValues(newCodeValues);
        inputRefs.current[index - 1]?.focus();
      } else {
        const newCodeValues = [...codeValues];
        newCodeValues[index] = "";
        setCodeValues(newCodeValues);
      }
    }

    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const numbers = pastedData.replace(/\D/g, "").slice(0, 6);

    const newCodeValues = [...codeValues];
    numbers.split("").forEach((char, index) => {
      if (index < 6) {
        newCodeValues[index] = char;
      }
    });
    setCodeValues(newCodeValues);

    const lastFilledIndex = Math.min(numbers.length - 1, 5);
    if (lastFilledIndex < 5) {
      inputRefs.current[lastFilledIndex + 1]?.focus();
    } else {
      inputRefs.current[5]?.focus();
    }
  };

  const handleFormSubmit = () => {
    const fullCode = codeValues.join("");
    onSubmit({ code: fullCode });
  };

  const handleRequestNewCode = () => {
    requestNewCodeMutation.mutate(tempToken);
  };

  const isInvalidCodeError = error?.message === "Invalid code";
  const fullCode = codeValues.join("");
  const isFormValid = fullCode.length === 6 && /^\d+$/.test(fullCode);

  return (
    <div className={css.container}>
      <div className={css.title}>
        <div className={css.lable}>Two-Factor Authentication</div>
        <div className={css.description}>
          Enter the 6-digit code from the Google Authenticator app
        </div>
      </div>

      {requestNewCodeMutation.isSuccess && (
        <div className={css.successMessage}>
          {requestNewCodeMutation.data.message}
        </div>
      )}

      {requestNewCodeMutation.isError && (
        <div className={css.error}>
          {requestNewCodeMutation.error.message}
        </div>
      )}

      {error && !requestNewCodeMutation.isError && (
        <div
          className={`${css.error} ${
            isInvalidCodeError ? css.invalidCode : ""
          }`}
        >
          {isInvalidCodeError ? (
            <>
              Invalid code
              <div className={css.invalidCodeHint}>
                Check the code and try again, or request a new code
              </div>
            </>
          ) : (
            `${error.message}`
          )}
        </div>
      )}

      <Formik
        initialValues={{ code: "" }}
        validate={validateForm}
        onSubmit={handleFormSubmit}
      >
        {({ errors, touched }) => (
          <Form className={css.form}>
            <div className={css.codeInputs}>
              {codeValues.map((value, index) => (
                <div key={index} className={css.codeField}>
                  <input
                    ref={setInputRef(index)}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={value}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className={`${css.input} ${
                      errors.code && touched.code ? css.errorInput : ""
                    } ${isInvalidCodeError ? css.invalidCodeInput : ""}`}
                    disabled={isLoading}
                    autoFocus={index === 0}
                  />
                </div>
              ))}
            </div>

            {errors.code && touched.code && (
              <div className={css.errorMessage}>{errors.code}</div>
            )}

            <div className={css.buttonGroup}>
              <button
                type="submit"
                disabled={!isFormValid || isLoading}
                className={`${css.button} ${
                  !isFormValid || isLoading ? css.disabled : css.active
                }`}
              >
                {isLoading ? "Проверка..." : "Подтвердить"}
              </button>

              <button
                type="button"
                onClick={onBack}
                disabled={isLoading}
                className={css.backButton}
              >
                Назад
              </button>
            </div>

            <div className={css.newCodeSection}>
              <button
                type="button"
                onClick={handleRequestNewCode}
                disabled={requestNewCodeMutation.status === "pending"}
                className={css.newCodeButton}
              >
                {requestNewCodeMutation.status === "pending"
                  ? "Отправка..."
                  : "Получить новый код"}
              </button>
              <p className={css.newCodeHint}>Если код не пришел или устарел</p>
            </div>

            <div className={css.debugInfo}>
              <div>Введено цифр: {fullCode.length}/6</div>
              <div>Только цифры: {/^\d*$/.test(fullCode) ? "✅" : "❌"}</div>
              <div>
                Тестовый код: <strong>123456</strong>
              </div>
            </div>
          </Form>
        )}
      </Formik>

      <div className={css.testInfo}>
        <h4>Для тестирования:</h4>
        <p>
          Введите <strong>123456</strong> для успешной авторизации
        </p>
        <p>Любой другой код покажет ошибку "Неверный код"</p>
        <p>
          <em>Подсказка: Можно вставить код из буфера обмена</em>
        </p>
      </div>
    </div>
  );
};