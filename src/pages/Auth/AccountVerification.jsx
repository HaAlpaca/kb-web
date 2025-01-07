import { useEffect, useState } from 'react'
import { Navigate, useSearchParams } from 'react-router-dom'
import { verifyUserAPI } from '~/apis'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
function AccountVerification() {
  let [searchParams] = useSearchParams()
  //   console.log(searchParams)
  const email = searchParams.get('email')
  const token = searchParams.get('token')
  // hoac
  // const {email,token} = Object.fromEntries([...searchParams])
  //   console.log(email, token)
  const [verified, setVerified] = useState(false)
  // goi api verify tai khoan
  useEffect(() => {
    if (email && token) {
      verifyUserAPI({ email, token }).then(() => setVerified(true))
    }
  }, [email, token])
  // url co van de
  if (!email || !token) {
    return <Navigate to="404" />
  }
  // chua verify thi loading
  if (!verified) {
    return <PageLoadingSpinner caption="Verify your account..." />
  }
  return <Navigate to={`/login?verifiedEmail=${email}`} />
}

export default AccountVerification
