import { useNavigate } from 'react-router-dom'

export const InputForm = (): JSX.Element => {

  const navigate = useNavigate()
  const onClick = (): void => navigate('/', { replace: true })
  console.log(navigate)

  return (
    <div>
      <h1>Mypage</h1>
      <div>
        <button onClick={onClick}>MyPageDetailへ</button>
      </div>
    </div>
  )
}
