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
import { createLocation } from 'apiSdk/locations';
import { Error } from 'components/error';
import { locationValidationSchema } from 'validationSchema/locations';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';
import { LocationInterface } from 'interfaces/location';

function LocationCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: LocationInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createLocation(values);
      resetForm();
      router.push('/locations');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<LocationInterface>({
    initialValues: {
      latitude: 0,
      longitude: 0,
      user_id: (router.query.user_id as string) ?? null,
    },
    validationSchema: locationValidationSchema,
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
            Create Location
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="latitude" mb="4" isInvalid={!!formik.errors?.latitude}>
            <FormLabel>Latitude</FormLabel>
            <NumberInput
              name="latitude"
              value={formik.values?.latitude}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('latitude', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors?.latitude && <FormErrorMessage>{formik.errors?.latitude}</FormErrorMessage>}
          </FormControl>
          <FormControl id="longitude" mb="4" isInvalid={!!formik.errors?.longitude}>
            <FormLabel>Longitude</FormLabel>
            <NumberInput
              name="longitude"
              value={formik.values?.longitude}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('longitude', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors?.longitude && <FormErrorMessage>{formik.errors?.longitude}</FormErrorMessage>}
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
    entity: 'location',
    operation: AccessOperationEnum.CREATE,
  }),
)(LocationCreatePage);
