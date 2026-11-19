import type React from 'react'
import { useEffect, useState } from 'react'
import style from './AlchemyItemBoxComponent.module.scss'

interface ItemBoxProps {
  item: string
}

export const AlchemyItemBoxComponent: React.FC<ItemBoxProps> = ({ item }) => {
  const [alchemyItem, setAlchemyItem] = useState<string>(item)

  useEffect(() => {
    setAlchemyItem(item)
  }, [item])

  return (
    <div className={style.container}>
      <div className={style.itemBoxContainer}>
        <div className={style.itemAndKeyContainer}>
          <div className={style.itemBox}>
            {alchemyItem !== '' ? (
              <img src={alchemyItem} className={style.itemImage} />
            ) : (
              <div className={style.noImage}></div>
            )}
          </div>
          <div className={style.keyIndicator}>Key: E</div>
        </div>
      </div>
    </div>
  )
}
