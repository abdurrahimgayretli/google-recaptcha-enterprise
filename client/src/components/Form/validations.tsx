import * as yup from "yup";

const validations = yup.object().shape({
  username: yup.string().required(),
  password: yup.string().required(),
});

export default validations;
