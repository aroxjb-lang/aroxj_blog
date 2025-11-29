"use client";

import { AuthLoginInput, login } from "@/app/lib/actions/auth";
import { Link, useRouter } from "@/i18n/navigation";
import { Alert, Button, TextField } from "@mui/material";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import styles from "./styles.module.css";

export default function LogIn() {
  const t = useTranslations();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthLoginInput>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<AuthLoginInput> = async (data) => {
    setLoading(true);
    try {
      await login(data);
      router.push("/admin");
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  return (
    <div className={styles.page}>
      <div className={styles.logo}>
        <img src={"/logo.png"} alt="logo" />
        <p className={styles.title}>
          {t.rich("healthy blog", {
            br: () => <br />,
          })}
        </p>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={styles.form}
      >
        <Controller
          name="email"
          control={control}
          rules={{
            required: t("Email is required"),
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: t("invalid email"),
            },
          }}
          render={({ field: { value, onChange } }) => (
            <TextField
              value={value}
              onChange={onChange}
              label={t("Email") + "*"}
              placeholder="example@email.com"
            />
          )}
        />
        {errors.email && (
          <Alert severity="error" variant="filled">
            {errors.email.message}
          </Alert>
        )}
        <Controller
          name="password"
          control={control}
          rules={{
            required: t("Password is required"),
            minLength: {
              value: 6,
              message: t("Password must have at least 6 symbols"),
            },
          }}
          render={({ field: { value, onChange } }) => (
            <TextField
              value={value}
              onChange={onChange}
              type="password"
              label={t("Password") + "*"}
            />
          )}
        />
        {errors.password && (
          <Alert severity="error" variant="filled">
            {errors.password.message}
          </Alert>
        )}
        <Button
          type="submit"
          variant="contained"
          loading={loading}
          size="large"
        >
          {t("Sign in")}
        </Button>
       
      </form>
    </div>
  );
}
