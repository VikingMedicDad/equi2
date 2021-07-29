import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { LockOutlined, MailOutlined, IdcardOutlined, AppstoreAddOutlined} from '@ant-design/icons';
import { Button, Alert } from "antd";
import { showAuthMessage, showLoading, hideAuthMessage, authenticated } from 'redux/actions/Auth';
import { useHistory } from "react-router-dom";
import { motion } from "framer-motion"
import useSignup from "@hooks/useSignup";
import { Formik } from "formik";
import { Input, Form } from "formik-antd";
import * as Yup from 'yup';

type Values = {
	email: string;
	password: string;
	confirmPassword: string;
	firstName: string;
	lastName: string;
	workspaceName: string;
};

const INITIAL_VALUES: Values = {
	email: "",
	password: "",
	confirmPassword: "",
	firstName: "",
	lastName: "",
	workspaceName: "",
};
  
const rules = {
	email: [
		{ 
			required: true,
			message: 'Please input your email address'
		},
		{ 
			type: 'email',
			message: 'Please enter a validate email!'
		}
	],
	password: [
		{ 
			required: true,
			message: 'Please input your password'
		}
	],
	confirm: [
		{ 
			required: true,
			message: 'Please confirm your password!'
		},
		({ getFieldValue }: any) => ({
			validator(rule:string, value:string) {
				if (!value || getFieldValue('password') === value) {
					return Promise.resolve();
				}
				return Promise.reject('Passwords do not match!');
			},
		})
	],
	firstName: [],
	lastName: [],
	workspaceName: []
}

const SignupSchema = Yup.object().shape({
	email: Yup.string().email('Please enter a valid email!').required('Please input your email address'),
	password: Yup.string().required('Please input your password'),
	confirm: Yup.string()
	   .oneOf([Yup.ref('password'), null], 'Passwords do not match!'),
	firstName: Yup.string()
	  .min(2, 'Too Short!')
	  .max(50, 'Too Long!')
	  .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field ")
	  .required('Please input your first name'),
	lastName: Yup.string()
	  .min(2, 'Too Short!')
	  .max(50, 'Too Long!')
	  .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field ")
	  .required('Please input your last name'),
	workspaceName: Yup.string()
	  .min(2, 'Too Short!')
	  .max(50, 'Too Long!')
	  .matches(/^[A-Za-z_][A-Za-z\d_]*$/, "Special characters not allowed ")
	  .required('A name for default workspace is required')
});

export const RegisterForm = (props:any) => {

	const { token, redirect, hideAuthMessage, allowRedirect } = props
	let history = useHistory();

	const {
		loading,
		handleSubmit,
		error: showMessage,
		errorMessage: message
	  } = useSignup();

	
	const onSignUp = (values:any) => {
		console.log('values', values);
		handleSubmit(values);
	}

	useEffect(() => {
    	if (token !== null && allowRedirect) {
			history.push(redirect)
		}
		if(showMessage) {
				setTimeout(() => {
				hideAuthMessage();
			}, 3000);
		}
  	});
	
	return (
		<>
			<motion.div 
				initial={{ opacity: 0, marginBottom: 0 }} 
				animate={{ 
					opacity: showMessage ? 1 : 0,
					marginBottom: showMessage ? 20 : 0 
				}}> 
				<Alert type="error" showIcon message={message}></Alert>
			</motion.div>
			<Formik 
				initialValues={INITIAL_VALUES} 
				onSubmit={onSignUp} 
				validationSchema={SignupSchema}
				render={() => (
					<Form layout="vertical" name="register-form">
						<Form.Item 
							name="email" 
							label="Email" 
							// rules={rules.email}
							hasFeedback
						>
							<Input name="email" prefix={<MailOutlined className="text-primary" />}/>
						</Form.Item>
						<Form.Item 
							name="password" 
							label="Password" 
							rules={rules.password}
							hasFeedback
						>
							<Input.Password name="password" prefix={<LockOutlined className="text-primary" />}/>
						</Form.Item>
						<Form.Item 
							name="confirm" 
							label="ConfirmPassword" 
							//rules={rules.confirm}
							hasFeedback
						>
							<Input.Password name="confirm" prefix={<LockOutlined className="text-primary" />}/>
						</Form.Item>
						<Form.Item 
							name="firstName" 
							label="First Name" 
							rules={rules.firstName}
							hasFeedback
						>
							<Input name="firstName" prefix={<IdcardOutlined  className="text-primary" />}/>
						</Form.Item>
						<Form.Item 
							name="lastName" 
							label="Last Name" 
							rules={rules.lastName}
							hasFeedback
						>
							<Input name="lastName" prefix={<IdcardOutlined className="text-primary" />}/>
						</Form.Item>

						<Form.Item 
							name="workspaceName" 
							label="Workspace Name" 
							rules={rules.workspaceName}
							hasFeedback
						>
							<Input name="workspaceName" prefix={<AppstoreAddOutlined className="text-primary" />}/>
						</Form.Item>


						<Form.Item name="signup">
							<Button type="primary" htmlType="submit" block loading={loading}>
								Sign Up
							</Button>
						</Form.Item>
					</Form>
				)}
			/>
		</>
	)
}

const mapStateToProps = ({auth}: any) => {
	const { loading, message, showMessage, token, redirect } = auth;
  return { loading, message, showMessage, token, redirect }
}

const mapDispatchToProps = {
	showAuthMessage,
	hideAuthMessage,
	showLoading,
	authenticated
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterForm)
