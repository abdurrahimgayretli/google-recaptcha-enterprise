import { useFormik } from "formik";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import validationSchema from "./validations";

import Reaptcha from "reaptcha";

import { useRef, useState } from "react";
import axios from "axios";

export default function Form() {
  const [captchaToken, setCaptchaToken] = useState(null);
  const captchaRef = useRef<Reaptcha>(null);

  const [control, setControl] = useState("");

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      rememberMe: false,
    },
    validationSchema,
    onSubmit: async (values, bag) => {
      const token = await captchaRef.current._executeRecaptcha();
      captchaRef.current.reset();
      console.log(token, "token");

      await axios
        .post(process.env.REACT_APP_BASE_ENDPOINT, { token })
        .then((res) => setControl(res.data))
        .catch((error) => {
          console.log(error);
        });
      bag.resetForm();
    },
  });
  const verify = () => {
    captchaRef.current.getResponse().then((res) => {
      setCaptchaToken(res);
    });
  };
  return (
    <Flex bg="gray.100" align="center" justify="center" h="100vh">
      <Box bg="white" p={6} rounded="md">
        <form onSubmit={formik.handleSubmit}>
          <VStack spacing={4} align="flex-start">
            <FormControl>
              <FormLabel htmlFor="username">Username</FormLabel>
              <Input
                id="username"
                name="username"
                type="username"
                variant="filled"
                onChange={formik.handleChange}
                value={formik.values.username}
                isInvalid={
                  formik.touched.username && Boolean(formik.errors.username)
                }
              />
              {formik.errors.username && formik.touched.username && (
                <Alert status="error">{formik.errors.username}</Alert>
              )}
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <Input
                id="password"
                name="password"
                type="password"
                variant="filled"
                onChange={formik.handleChange}
                value={formik.values.password}
                isInvalid={
                  formik.touched.password && Boolean(formik.errors.password)
                }
              />
              {formik.errors.password && formik.touched.password && (
                <Alert status="error">{formik.errors.password}</Alert>
              )}
            </FormControl>
            <Checkbox
              id="rememberMe"
              name="rememberMe"
              onChange={formik.handleChange}
              isChecked={formik.values.rememberMe}
              colorScheme="purple"
            >
              Remember me?
            </Checkbox>
            <Reaptcha
              sitekey={process.env.REACT_APP_CAPTCHA_SITE_KEY}
              ref={captchaRef}
              size="invisible"
              onVerify={verify}
            />
            <Button type="submit" colorScheme="purple" width="full">
              Login
            </Button>
            <FormControl>
              <FormLabel>{control}</FormLabel>
            </FormControl>
          </VStack>
        </form>
      </Box>
    </Flex>
  );
}
