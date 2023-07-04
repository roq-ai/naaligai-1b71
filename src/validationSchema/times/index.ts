import * as yup from 'yup';

export const timeValidationSchema = yup.object().shape({
  naaligai: yup.number().integer().required(),
  minutes: yup.number().integer().required(),
  sunrise_time: yup.date().required(),
  user_id: yup.string().nullable(),
});
