import { Camera } from '../../domain/model/localDevice/camera'

export interface ICameraSelector {
  updateLocalCameras: (cameras: Camera[]) => void
}
