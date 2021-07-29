import React from 'react'
import RegisterForm from '../../components/RegisterForm'
import { Row, Col, Typography } from "antd";
import { useSelector } from 'react-redux';

const backgroundURL = '/img/others/img-17.jpg'
const backgroundStyle = {
	backgroundImage: `url(${backgroundURL})`,
	backgroundRepeat: 'no-repeat',
	backgroundSize: 'cover'
}

const {Title,Paragraph} = Typography;

const RegisterTwo = props => {
	const theme = useSelector(state => state.theme.currentTheme)

	return (
		<div className={`h-100 ${theme === 'light' ? 'bg-white' : ''}`}>
			<Row justify="center" className="align-items-stretch h-100">
				<Col xs={20} sm={20} md={24} lg={16}>
					<div className="container d-flex flex-column justify-content-center h-100">
						<Row justify="center">
							<Col xs={24} sm={24} md={20} lg={12} xl={8}>
								<h1>Sign Up</h1>
								<p>Already have an account? <a href="/auth/login">Sign In</a></p>
								<div className="mt-4">
									<RegisterForm {...props} />
								</div>
							</Col>
						</Row>
					</div>
				</Col>
				<Col xs={0} sm={0} md={0} lg={8}>
					<div className="d-flex flex-column justify-content-between h-100 px-4" style={backgroundStyle}>
						<div className="text-right">
							<img src="/img/logo-white.png" alt="logo"/>
						</div>
						<Row justify="center">
							<Col xs={0} sm={0} md={0} lg={20}>
								<img className="img-fluid mb-5" src="/img/others/img-19.png" alt=""/>
								<Title className="text-white">Welcome to Equilibrium</Title>
								<Paragraph className="text-white">Equilibrium is currently in Beta however your generated apps are production-ready. Every app generated using Equilibrium platform contains popular, documented, secured, and supported production-ready open-source components & packages. Read more about our stack here.</Paragraph>
							</Col>
						</Row>
						<div className="d-flex justify-content-end pb-4">
							<div>
								<a className="text-white" href="/#" onClick={e => e.preventDefault()}>Term & Conditions</a>
								<span className="mx-2 text-white"> | </span>
								<a className="text-white" href="/#" onClick={e => e.preventDefault()}>Privacy & Policy</a>
							</div>
						</div>
					</div>
				</Col>
			</Row>
		</div>
	)
}

export default RegisterTwo
