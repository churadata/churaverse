/**
 * MicrophoneとCameraの権限を確認する
 */
type TargetDevice = 'camera' | 'microphone'
interface RequestMedia {
  [requestStream: string]: boolean
}
type PermissionRequests = {
  [device in TargetDevice]: RequestMedia
}

export async function peripheralPermissionCheck(targetName: TargetDevice): Promise<boolean> {
  let result: PermissionStatus
  try {
    result = await navigator.permissions.query({ name: targetName as PermissionName })
  } catch {
    // permissions api が使えない場合はgetUserMediaでpermissionを得る
    return await permissionCheckByGetUserMedia(targetName)
  }

  switch (result.state) {
    case 'granted':
      return true
    case 'denied':
      return false
    case 'prompt':
      return await permissionCheckByGetUserMedia(targetName)
  }
}

async function permissionCheckByGetUserMedia(targetName: TargetDevice): Promise<boolean> {
  const permissionRequests: PermissionRequests = {
    camera: { video: true },
    microphone: { audio: true },
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia(permissionRequests[targetName])
    stream.getTracks().forEach((track) => {
      track.stop()
    })
    return true
  } catch {
    return false
  }
}
