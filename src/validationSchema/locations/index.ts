import * as yup from 'yup';

export const locationValidationSchema = yup.object().shape({
  latitude: yup.number().required(),
  longitude: yup.number().required(),
  user_id: yup.string().nullable(),
});
