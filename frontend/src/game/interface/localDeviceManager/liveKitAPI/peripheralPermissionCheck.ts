/**
 * MicrophoneとCameraの権限を確認する
 */
type TargetDevice = 'camera' | 'microphone'
type TargetStream = 'video' | 'audio'
type RequestMedia = {
  [requestStream in TargetStream]?: boolean
}
type PermissionRequests = {
  [device in TargetDevice]: RequestMedia
}
export async function peripheralPermissionCheck(targetName: TargetDevice): Promise<boolean> {
  let permissionStatus: boolean = false
  await navigator.permissions
    .query({ name: targetName as PermissionName })
    .then((result) => {
      if (result.state === 'granted') {
        permissionStatus = true
      }
    })
    .catch((error) => {
      if (error instanceof TypeError) {
        const permissions: PermissionRequests = {
          camera: { audio: true },
          microphone: { video: true },
        }

        const request: RequestMedia = permissions[targetName]

        void navigator.mediaDevices.getUserMedia(request).then((stream) => {
          stream.getTracks().forEach((track) => {
            track.stop()
          })
          permissionStatus = true
        })
      } else {
        console.error(error)
      }
    })
  return permissionStatus
}
