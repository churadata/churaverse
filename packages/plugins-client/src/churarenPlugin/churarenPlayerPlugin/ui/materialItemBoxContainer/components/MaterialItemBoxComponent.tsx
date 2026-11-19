import { useEffect, useState } from 'react'
import style from './MaterialItemBoxComponent.module.scss'

interface MaterialItemBoxProps {
  itemImagePaths: string[]
}

export const MaterialItemBoxComponent: React.FC<MaterialItemBoxProps> = ({ itemImagePaths }) => {
  const [itemImageList, setItemImageList] = useState<string[]>([])

  useEffect(() => {
    setItemImageList(itemImagePaths)
  }, [itemImagePaths])
  return (
    <div className={style.container}>
      <div className={style.itemBoxContainer}>
        {Array.from({ length: 3 }).map((_, index) => {
          return (
            // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length array with no unique id
            <div key={index} className={style.itemAndKeyContainer}>
              <div className={style.itemBox}>
                {itemImageList[index] != null ? (
                  <img src={itemImageList[index]} alt={`Item ${index + 1}`} className={style.itemImage} />
                ) : (
                  <div className={style.noImage}></div>
                )}
              </div>
              <div className={style.keyIndicator}>Key: {index + 1}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
