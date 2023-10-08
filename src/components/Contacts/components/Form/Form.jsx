import { Formik, ErrorMessage } from 'formik';
import {
  StyledForm,
  Item,
  FormBox,
  CloseButton,
} from 'components/Contacts/components/Form/Form.styled';
import { StyledButton } from 'components/Contacts/components/Button/Button.Styled';
import { notify, isContactDubled, schema } from 'utils/utils';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useGetContactsQuery } from 'redux/contacts/createApi';

import { useDispatch } from 'react-redux';
import { selector } from 'redux/contacts/modalSlice';
import PropTypes from 'prop-types';

export const MyForm = ({
  mutator,
  initialFormValues,
  btn1,
  btn2,
  id,
  name,
}) => {
  const dispatch = useDispatch();

  const { data: contacts = [] } = useGetContactsQuery();

  const handleSubmit = async (values, { resetForm }) => {
    if (
      (isContactDubled(contacts, values, 'name') ||
        isContactDubled(contacts, values, 'number')) &&
      name === 'AddContact'
    ) {
      notify();
      return;
    }
    try {
      await mutator({ id, ...values });
      resetForm();
      dispatch(selector(false));
    } catch (error) {
      console.log(error);
      dispatch(selector(false));
    }
  };

  return (
    <FormBox>
      <ToastContainer />
      <Formik
        initialValues={initialFormValues}
        onSubmit={handleSubmit}
        validationSchema={schema}
      >
        {({ handleReset }) => (
          <StyledForm>
            <label htmlFor="">
              Name
              <Item type="text" name="name" />
              <ErrorMessage name="name" />
            </label>
            <label htmlFor="">
              Number
              <Item type="tel" name="number" />
              <ErrorMessage name="number" />
            </label>
            <StyledButton type="submit">{btn1}</StyledButton>
            <StyledButton type="button" onClick={() => handleReset()}>
              {btn2}
            </StyledButton>
          </StyledForm>
        )}
      </Formik>
      <CloseButton onClick={e => dispatch(selector(false))}>
        &times;
      </CloseButton>
    </FormBox>
  );
};

MyForm.propTypes = {
  values: PropTypes.object,
  contacts: PropTypes.array,
  mutator: PropTypes.func,
  initialFormValues: PropTypes.object,
  btn1: PropTypes.string,
  btn2: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
};
