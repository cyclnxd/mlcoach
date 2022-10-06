import {
	Box,
	Fade,
	Modal,
	Backdrop,
	Button,
	Grid,
	TextField,
	Typography,
	Alert,
} from '@mui/material'
import { memo, useEffect, useState } from 'react'
import { Formik } from 'formik'
import useAuthStore from 'lib/store/AuthStore.ts'

const LoginModal = ({ open, handleModal }) => {
	const [error, setError] = useState('')

	const login = useAuthStore(state => state.login)

	useEffect(() => {
		if (error) {
			setTimeout(() => {
				setError('')
			}, 3000)
		}
	}, [error])

	return (
		<Modal
			aria-labelledby='transition-modal-title'
			aria-describedby='transition-modal-description'
			open={open}
			onClose={() => handleModal(false)}
			closeAfterTransition
			BackdropComponent={Backdrop}
			BackdropProps={{
				timeout: 500,
			}}>
			<Fade in={open}>
				<Box
					sx={{
						position: 'absolute',
						top: '50%',
						left: '50%',
						transform: 'translate(-50%, -50%)',
						width: '40%',
						height: '70%',
						bgcolor: '#F5761A',
						color: 'primary.contrastText',
						px: 8,
						outline: 'none',
						borderRadius: '10px',
					}}>
					<Box
						sx={{
							height: '100%',
							marginTop: 2,
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center',
						}}>
						<Typography component='h1' variant='h5'>
							Sign in
						</Typography>
						<Formik
							initialValues={{ email: '', password: '' }}
							validate={values => {
								const errors = {}
								if (!values.email) {
									errors.email = 'Required'
								} else if (
									!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
								) {
									errors.email = 'Invalid email address'
								} else if (!values.password) {
									errors.password = 'Required'
								}

								return errors
							}}
							onSubmit={async (values, { setSubmitting }) => {
								try {
									await login(values.email, values.password)
									setError('')
									handleModal(false)
								} catch (error) {
									setError(error.message)
								} finally {
									setSubmitting(false)
								}
							}}>
							{({
								values,
								errors,
								touched,
								handleChange,
								handleBlur,
								handleSubmit,
								isSubmitting,
							}) => (
								<Box
									component='form'
									noValidate
									onSubmit={handleSubmit}
									sx={{ mt: 3 }}>
									<Grid container spacing={2}>
										<Grid item xs={12}>
											<TextField
												error={errors.email && touched.email}
												onChange={handleChange}
												onBlur={handleBlur}
												value={values.email}
												required
												fullWidth
												id='email'
												label='Email Address'
												name='email'
												autoComplete='email'
											/>
										</Grid>
										<Grid item xs={12}>
											<TextField
												error={errors.password && touched.password}
												required
												fullWidth
												onChange={handleChange}
												onBlur={handleBlur}
												value={values.password}
												name='password'
												label='Password'
												type='password'
												id='password'
												autoComplete='new-password'
											/>
										</Grid>

										<Grid item xs={12}>
											{error && <Alert severity='error'>{error}</Alert>}
										</Grid>
									</Grid>
									<Button
										type='submit'
										fullWidth
										disabled={isSubmitting}
										variant='contained'
										sx={{ mt: 3, mb: 2 }}>
										Sign In
									</Button>
								</Box>
							)}
						</Formik>
					</Box>
				</Box>
			</Fade>
		</Modal>
	)
}

export default memo(LoginModal)
