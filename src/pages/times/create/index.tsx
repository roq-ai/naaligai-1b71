import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createTime } from 'apiSdk/times';
import { Error } from 'components/error';
import { timeValidationSchema } from 'validationSchema/times';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';
import { TimeInterface } from 'interfaces/time';

function TimeCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: TimeInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createTime(values);
      resetForm();
      router.push('/times');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<TimeInterface>({
    initialValues: {
      naaligai: 0,
      minutes: 0,
      sunrise_time: new Date(new Date().toDateString()),
      user_id: (router.query.user_id as string) ?? null,
    },
    validationSchema: timeValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Time
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="naaligai" mb="4" isInvalid={!!formik.errors?.naaligai}>
            <FormLabel>Naaligai</FormLabel>
            <NumberInput
              name="naaligai"
              value={formik.values?.naaligai}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('naaligai', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors.naaligai && <FormErrorMessage>{formik.errors?.naaligai}</FormErrorMessage>}
          </FormControl>
          <FormControl id="minutes" mb="4" isInvalid={!!formik.errors?.minutes}>
            <FormLabel>Minutes</FormLabel>
            <NumberInput
              name="minutes"
              value={formik.values?.minutes}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('minutes', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors.minutes && <FormErrorMessage>{formik.errors?.minutes}</FormErrorMessage>}
          </FormControl>
          <FormControl id="sunrise_time" mb="4">
            <FormLabel>Sunrise Time</FormLabel>
            <Box display="flex" maxWidth="100px" alignItems="center">
              <DatePicker
                dateFormat={'dd/MM/yyyy'}
                selected={formik.values?.sunrise_time ? new Date(formik.values?.sunrise_time) : null}
                onChange={(value: Date) => formik.setFieldValue('sunrise_time', value)}
              />
              <Box zIndex={2}>
                <FiEdit3 />
              </Box>
            </Box>
          </FormControl>
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'user_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.email}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'time',
    operation: AccessOperationEnum.CREATE,
  }),
)(TimeCreatePage);
