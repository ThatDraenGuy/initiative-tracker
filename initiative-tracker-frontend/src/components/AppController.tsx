import { Form, theme } from 'antd';
import Title from 'antd/es/skeleton/Title';
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
} from 'react-hook-form';

export interface AppControllerProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> extends ControllerProps<TFieldValues, TName> {
  title?: string;
}

const AppController = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>(
  props: AppControllerProps<TFieldValues, TName>,
) => {
  const { token } = theme.useToken();

  return (
    <>
      {props.title && (
        <Title level={4} style={{ color: token.colorText }}>
          {props.title}
        </Title>
      )}

      <Controller
        {...props}
        render={renderProps => (
          <Form.Item
            validateStatus={
              renderProps.fieldState.error ? 'error' : 'validating'
            }
            help={
              renderProps.fieldState.error
                ? renderProps.fieldState.error.message
                : ''
            }
          >
            {props.render(renderProps)}
          </Form.Item>
        )}
      />
    </>
  );
};

export default AppController;
